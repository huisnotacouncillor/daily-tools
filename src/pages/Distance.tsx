import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RouteInfo {
  distance: number; // 总距离(公里)
  tollDistance: number; // 高速距离(公里)
  tollFee: number; // 高速费(元)
  duration: number; // 预计时间(分钟)
  steps: Array<{
    instruction: string;
    distance: number;
    toll: boolean;
  }>;
}

interface BatchRouteItem {
  id: string;
  origin: string;
  destination: string;
  distance?: number;
  tollDistance?: number;
  tollFee?: number;
  duration?: number;
  status: 'pending' | 'calculating' | 'completed' | 'error';
  error?: string;
}

export function DistanceCalculator() {
  const [origin, setOrigin] = useState('北京市朝阳区望京街');
  const [destination, setDestination] = useState('北京市海淀区中关村大街');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationType, setCalculationType] = useState<'basic' | 'advanced'>(
    'basic'
  );

  // 批量处理相关状态
  const [batchRoutes, setBatchRoutes] = useState<BatchRouteItem[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 高德地图API Key - 从环境变量获取
  const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;

  // 高速费计算规则（简化版，实际费率可能因地区而异）
  const calculateTollFee = (tollDistance: number): number => {
    // 基础费率：0.5元/公里（简化计算）
    const baseRate = 0.5;
    // 距离折扣：超过100公里后费率降低
    if (tollDistance <= 100) {
      return Math.round(tollDistance * baseRate * 100) / 100;
    } else {
      return (
        Math.round(
          (100 * baseRate + (tollDistance - 100) * baseRate * 0.8) * 100
        ) / 100
      );
    }
  };

  const geocodeAddress = async (address: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${AMAP_KEY}`
      );
      const data = await response.json();

      if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
        return data.geocodes[0].location; // 返回经纬度字符串 "经度,纬度"
      } else {
        throw new Error(`无法获取地址"${address}"的经纬度信息`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Excel导入处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 检查表头
        if (jsonData.length < 2) {
          setError('Excel文件格式错误，至少需要包含起点和终点列');
          return;
        }

        const headers = jsonData[0] as string[];
        const originIndex = headers.findIndex(
          h =>
            h.includes('起点') ||
            h.includes('起点地址') ||
            h.includes('起点地址') ||
            h.toLowerCase().includes('origin')
        );
        const destIndex = headers.findIndex(
          h =>
            h.includes('终点') ||
            h.includes('终点地址') ||
            h.includes('终点地址') ||
            h.toLowerCase().includes('destination')
        );

        if (originIndex === -1 || destIndex === -1) {
          setError('Excel文件必须包含"起点地址"和"终点地址"列');
          return;
        }

        // 解析数据行
        const routes: BatchRouteItem[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row[originIndex] && row[destIndex]) {
            routes.push({
              id: `route_${i}`,
              origin: String(row[originIndex]).trim(),
              destination: String(row[destIndex]).trim(),
              status: 'pending',
            });
          }
        }

        if (routes.length === 0) {
          setError('未找到有效的起点和终点数据');
          return;
        }

        setBatchRoutes(routes);
        setShowBatchMode(true);
        setError(null);
      } catch (err) {
        setError('Excel文件解析失败，请检查文件格式');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);

    // 清空input值，允许重复选择同一文件
    if (event.target) {
      event.target.value = '';
    }
  };

  // 批量计算距离
  const calculateBatchRoutes = async () => {
    if (batchRoutes.length === 0) return;

    setBatchLoading(true);
    setBatchProgress(0);

    const totalRoutes = batchRoutes.length;
    let completedCount = 0;

    for (let i = 0; i < batchRoutes.length; i++) {
      const route = batchRoutes[i];

      // 更新状态为计算中
      setBatchRoutes(prev =>
        prev.map(r => (r.id === route.id ? { ...r, status: 'calculating' } : r))
      );

      try {
        // 获取地址的经纬度
        const [originLocation, destLocation] = await Promise.all([
          geocodeAddress(route.origin),
          geocodeAddress(route.destination),
        ]);

        // 使用高德地图驾车路径规划API
        const response = await fetch(
          `https://restapi.amap.com/v3/direction/driving?origin=${originLocation}&destination=${destLocation}&key=${AMAP_KEY}&strategy=1`
        );

        const data = await response.json();

        if (
          data.status === '1' &&
          data.route &&
          data.route.paths &&
          data.route.paths.length > 0
        ) {
          const path = data.route.paths[0];
          const totalDistance = Math.round((path.distance / 1000) * 100) / 100;
          const duration = Math.round(path.duration / 60);

          // 解析路径步骤
          const steps = path.steps.map(
            (step: {
              instruction: string;
              distance: number;
              tolls?: any[];
            }) => ({
              instruction: step.instruction,
              distance: Math.round((step.distance / 1000) * 100) / 100,
              toll: step.tolls && step.tolls.length > 0,
            })
          );

          // 估算高速距离
          const tollDistance = steps
            .filter(
              (step: {
                instruction: string;
                distance: number;
                toll: boolean;
              }) => step.toll
            )
            .reduce(
              (
                sum: number,
                step: { instruction: string; distance: number; toll: boolean }
              ) => sum + step.distance,
              0
            );
          const tollFee = calculateTollFee(tollDistance);

          // 更新路由信息
          setBatchRoutes(prev =>
            prev.map(r =>
              r.id === route.id
                ? {
                    ...r,
                    distance: totalDistance,
                    tollDistance: Math.round(tollDistance * 100) / 100,
                    tollFee,
                    duration,
                    status: 'completed',
                  }
                : r
            )
          );
        } else {
          throw new Error(data.info || '计算失败');
        }
      } catch (err) {
        setBatchRoutes(prev =>
          prev.map(r =>
            r.id === route.id
              ? {
                  ...r,
                  status: 'error',
                  error: err instanceof Error ? err.message : '未知错误',
                }
              : r
          )
        );
      }

      completedCount++;
      setBatchProgress((completedCount / totalRoutes) * 100);

      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setBatchLoading(false);
  };

  // 导出Excel
  const exportToExcel = async () => {
    console.log('开始导出，当前状态:', {
      exportLoading,
      batchRoutes: batchRoutes.length,
    });
    setExportLoading(true);

    try {
      const completedRoutes = batchRoutes.filter(r => r.status === 'completed');
      console.log('完成的路由数量:', completedRoutes.length);
      if (completedRoutes.length === 0) {
        setError('没有可导出的数据');
        setExportLoading(false);
        return;
      }

      // 准备导出数据
      const exportData = [
        [
          '起点地址',
          '终点地址',
          '总距离(公里)',
          '高速距离(公里)',
          '高速费(元)',
          '预计时间(分钟)',
          '状态',
        ],
      ];

      batchRoutes.forEach(route => {
        exportData.push([
          route.origin,
          route.destination,
          route.distance?.toString() || '',
          route.tollDistance?.toString() || '',
          route.tollFee?.toString() || '',
          route.duration?.toString() || '',
          route.status === 'completed'
            ? '成功'
            : route.status === 'error'
              ? '失败'
              : route.status === 'calculating'
                ? '计算中'
                : '待处理',
        ]);
      });

      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '距离计算结果');

      // 设置列宽
      const colWidths = [
        { wch: 20 }, // 起点地址
        { wch: 20 }, // 终点地址
        { wch: 12 }, // 总距离
        { wch: 12 }, // 高速距离
        { wch: 10 }, // 高速费
        { wch: 12 }, // 预计时间
        { wch: 10 }, // 状态
      ];
      worksheet['!cols'] = colWidths;

      // 导出文件
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // 使用await确保文件下载完成后再重置loading状态
      await new Promise<void>(resolve => {
        saveAs(
          blob,
          `距离计算结果_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
        // 给文件下载一些时间
        setTimeout(() => resolve(), 100);
      });
    } catch (error) {
      console.error('导出失败:', error);
      setError('导出失败，请重试');
    } finally {
      console.log('导出完成，重置loading状态');
      setExportLoading(false);
    }
  };

  // 清空批量数据
  const clearBatchData = () => {
    setBatchRoutes([]);
    setShowBatchMode(false);
    setBatchProgress(0);
    setError(null);
  };

  // 下载Excel模板
  const downloadTemplate = async () => {
    setTemplateLoading(true);

    try {
      const templateData = [
        ['起点地址', '终点地址'],
        ['北京市朝阳区望京街', '北京市海淀区中关村大街'],
        ['上海市浦东新区陆家嘴', '上海市黄浦区外滩'],
        ['广州市天河区珠江新城', '广州市越秀区北京路'],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '距离计算模板');

      // 设置列宽
      worksheet['!cols'] = [{ wch: 25 }, { wch: 25 }];

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // 使用await确保文件下载完成后再重置loading状态
      await new Promise<void>(resolve => {
        saveAs(blob, '距离计算模板.xlsx');
        // 给文件下载一些时间
        setTimeout(() => resolve(), 100);
      });
    } catch (error) {
      console.error('下载模板失败:', error);
      setError('下载模板失败，请重试');
    } finally {
      setTemplateLoading(false);
    }
  };

  const calculateBasicRoute = async () => {
    if (!origin || !destination) {
      setError('请输入起点和终点地址');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteInfo(null);
    setCalculationType('basic');

    try {
      // 先获取地址的经纬度
      const [originLocation, destLocation] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination),
      ]);

      // 使用高德地图驾车路径规划API
      const response = await fetch(
        `https://restapi.amap.com/v3/direction/driving?origin=${originLocation}&destination=${destLocation}&key=${AMAP_KEY}&strategy=1`
      );

      const data = await response.json();

      if (
        data.status === '1' &&
        data.route &&
        data.route.paths &&
        data.route.paths.length > 0
      ) {
        const path = data.route.paths[0];
        const totalDistance = Math.round((path.distance / 1000) * 100) / 100;
        const duration = Math.round(path.duration / 60); // 转换为分钟

        // 解析路径步骤
        const steps = path.steps.map((step: any) => ({
          instruction: step.instruction,
          distance: Math.round((step.distance / 1000) * 100) / 100,
          toll: step.tolls && step.tolls.length > 0,
        }));

        // 估算高速距离（基于路径步骤中的收费站信息）
        const tollDistance = steps
          .filter(
            (step: { instruction: string; distance: number; toll: boolean }) =>
              step.toll
          )
          .reduce(
            (
              sum: number,
              step: { instruction: string; distance: number; toll: boolean }
            ) => sum + step.distance,
            0
          );
        const tollFee = calculateTollFee(tollDistance);

        setRouteInfo({
          distance: totalDistance,
          tollDistance: Math.round(tollDistance * 100) / 100,
          tollFee,
          duration,
          steps,
        });
      } else {
        setError(data.info || '计算失败，请检查输入的位置信息');
      }
    } catch (err) {
      setError('请求失败，请检查网络连接或地址信息');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAdvancedRoute = async () => {
    if (!origin || !destination) {
      setError('请输入起点和终点');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteInfo(null);
    setCalculationType('advanced');

    try {
      // 先获取地址的经纬度
      const [originLocation, destLocation] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination),
      ]);

      // 使用高德地图货车路径规划API（需要物流服务API权限）
      const response = await fetch(
        `https://restapi.amap.com/v4/direction/truck?origin=${originLocation}&destination=${destLocation}&key=${AMAP_KEY}&size=2&strategy=1`
      );

      const data = await response.json();

      if (
        data.data &&
        data.data.route &&
        data.data.route.paths &&
        data.data.route.paths.length > 0
      ) {
        const path = data.data.route.paths[0];
        const totalDistance = Math.round((path.distance / 1000) * 100) / 100;
        const tollDistance =
          Math.round((path.toll_distance / 1000) * 100) / 100;
        const duration = Math.round(path.duration / 60); // 转换为分钟
        const tollFee = calculateTollFee(tollDistance);

        // 解析路径步骤
        const steps = path.steps
          ? path.steps.map(
              (step: {
                instruction: string;
                distance: number;
                tolls?: any[];
              }) => ({
                instruction: step.instruction,
                distance: Math.round((step.distance / 1000) * 100) / 100,
                toll: step.tolls && step.tolls.length > 0,
              })
            )
          : [];

        setRouteInfo({
          distance: totalDistance,
          tollDistance,
          tollFee,
          duration,
          steps,
        });
      } else {
        // 如果高级API失败，回退到基础API
        console.warn('高级API调用失败，回退到基础API');
        await calculateBasicRoute();
      }
    } catch (err) {
      console.warn('高级API调用失败，回退到基础API:', err);
      // 回退到基础API
      await calculateBasicRoute();
    }
  };

  const clearResults = () => {
    setRouteInfo(null);
    setError(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🗺️ 高德地图距离计算器
          </CardTitle>
          <CardDescription>
            计算两个地址之间的公路里程数、高速里程数和高速费用
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 输入区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">起点地址</Label>
                <Input
                  id="origin"
                  placeholder="例如：北京市朝阳区望京街"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && calculateBasicRoute()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">终点地址</Label>
                <Input
                  id="destination"
                  placeholder="例如：北京市海淀区中关村大街"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && calculateBasicRoute()}
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={calculateBasicRoute}
                disabled={loading || !origin || !destination}
                className="flex-1"
                size="lg"
              >
                {loading && calculationType === 'basic' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    计算中...
                  </div>
                ) : (
                  '🚗 基础计算'
                )}
              </Button>

              <Button
                onClick={calculateAdvancedRoute}
                disabled={loading || !origin || !destination}
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                {loading && calculationType === 'advanced' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    计算中...
                  </div>
                ) : (
                  '🚛 高级计算'
                )}
              </Button>

              {routeInfo && (
                <Button onClick={clearResults} variant="outline" size="lg">
                  🗑️ 清除结果
                </Button>
              )}
            </div>

            {/* Excel批量处理入口 */}
            <div className="border-t pt-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">📊 Excel批量处理</h3>
                <p className="text-sm text-gray-600 mb-4">
                  支持Excel文件导入多个起点和终点地址，批量计算距离并导出结果
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  size="lg"
                  disabled={templateLoading}
                >
                  {templateLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      下载中...
                    </div>
                  ) : (
                    '📥 下载Excel模板'
                  )}
                </Button>

                <Button asChild variant="outline" size="lg">
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    📄 选择Excel文件
                    <input
                      type="file"
                      id="excel-upload"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>

              {/* 下载状态提示 */}
              {templateLoading && (
                <div className="text-center text-sm text-blue-600">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    正在下载Excel模板...
                  </div>
                </div>
              )}
            </div>

            {/* 计算结果 */}
            {routeInfo && (
              <div className="mt-6 space-y-4">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    📊 计算结果
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {routeInfo.distance}
                      </div>
                      <div className="text-sm text-gray-600">总里程 (公里)</div>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {routeInfo.tollDistance}
                      </div>
                      <div className="text-sm text-gray-600">
                        高速里程 (公里)
                      </div>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-orange-600">
                        ¥{routeInfo.tollFee}
                      </div>
                      <div className="text-sm text-gray-600">预计高速费</div>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">
                        {routeInfo.duration}
                      </div>
                      <div className="text-sm text-gray-600">
                        预计时间 (分钟)
                      </div>
                    </div>
                  </div>

                  {/* 计算类型标识 */}
                  <div className="mt-4 text-center">
                    <Badge
                      variant={
                        calculationType === 'advanced' ? 'default' : 'secondary'
                      }
                    >
                      {calculationType === 'advanced' ? '高级计算' : '基础计算'}
                    </Badge>
                  </div>
                </div>

                {/* 路径详情 */}
                {routeInfo.steps.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">🗺️ 路径详情</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {routeInfo.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span>{step.instruction}</span>
                              {step.toll && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  收费
                                </Badge>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {step.distance} 公里
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 批量处理区域 */}
            {showBatchMode && (
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  🔄 批量处理
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1" size="lg">
                    <label
                      htmlFor="batch-file-upload"
                      className="cursor-pointer"
                    >
                      📄 导入Excel文件
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="batch-file-upload"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </Button>

                  <Button
                    onClick={calculateBatchRoutes}
                    disabled={batchLoading || batchRoutes.length === 0}
                    className="flex-1"
                    size="lg"
                  >
                    {batchLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        批量计算中...
                      </div>
                    ) : (
                      '🔄 批量计算'
                    )}
                  </Button>

                  <Button
                    onClick={exportToExcel}
                    disabled={
                      batchRoutes.filter(r => r.status === 'completed')
                        .length === 0 || exportLoading
                    }
                    variant="outline"
                    size="lg"
                    title={
                      batchRoutes.filter(r => r.status === 'completed')
                        .length === 0
                        ? '请先进行批量计算，生成可导出的数据'
                        : exportLoading
                          ? '正在导出中...'
                          : '点击导出计算结果'
                    }
                  >
                    {exportLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        导出中...
                      </div>
                    ) : (
                      '📤 导出结果'
                    )}
                  </Button>

                  <Button onClick={clearBatchData} variant="outline" size="lg">
                    🗑️ 清除批量数据
                  </Button>
                </div>

                {/* 导出状态提示 */}
                {exportLoading && (
                  <div className="text-center text-sm text-green-600 mt-3">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      正在导出Excel文件...
                    </div>
                  </div>
                )}

                {batchRoutes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">👇 待处理列表</h4>
                      {batchLoading && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            处理进度:
                          </span>
                          <Progress value={batchProgress} className="w-32" />
                          <span className="text-sm text-gray-600">
                            {Math.round(batchProgress)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>起点地址</TableHead>
                          <TableHead>终点地址</TableHead>
                          <TableHead>总距离(km)</TableHead>
                          <TableHead>高速距离(km)</TableHead>
                          <TableHead>高速费(元)</TableHead>
                          <TableHead>预计时间(分钟)</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>错误信息</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchRoutes.map(route => (
                          <TableRow key={route.id}>
                            <TableCell className="font-mono text-xs">
                              {route.id}
                            </TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={route.origin}
                            >
                              {route.origin}
                            </TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={route.destination}
                            >
                              {route.destination}
                            </TableCell>
                            <TableCell className="text-center">
                              {route.distance ? `${route.distance}` : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {route.tollDistance
                                ? `${route.tollDistance}`
                                : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {route.tollFee ? `¥${route.tollFee}` : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              {route.duration ? `${route.duration}` : '-'}
                            </TableCell>
                            <TableCell>
                              {route.status === 'pending' && (
                                <Badge variant="secondary">待处理</Badge>
                              )}
                              {route.status === 'calculating' && (
                                <Badge variant="default">计算中</Badge>
                              )}
                              {route.status === 'completed' && (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800"
                                >
                                  完成
                                </Badge>
                              )}
                              {route.status === 'error' && (
                                <Badge variant="destructive">失败</Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[150px]">
                              {route.status === 'error' && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {route.error}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* 说明信息 */}
            <Separator />
            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium text-gray-800">📋 使用说明：</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>请输入具体的地址信息，支持中文地址</li>
                <li>
                  <strong>基础计算：</strong>
                  使用驾车路径规划API，可获取总里程和估算高速费
                </li>
                <li>
                  <strong>高级计算：</strong>
                  使用货车路径规划API，可获取更准确的高速里程信息
                </li>
                <li>高速费为估算值，实际费用可能因地区、车型等因素而异</li>
                <li>支持回车键快速计算</li>
                <li>
                  <strong>Excel批量处理：</strong>
                  支持导入Excel文件批量计算多个地址对的距离，并可导出结果
                </li>
                <li>
                  Excel文件需要包含"起点地址"和"终点地址"两列，支持.xlsx和.xls格式
                </li>
              </ul>

              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-xs">
                  ⚠️ 注意：使用前请确保已配置有效的高德地图API
                  Key，并在高德开放平台申请相应服务权限
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
