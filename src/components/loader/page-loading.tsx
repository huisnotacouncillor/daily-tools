// 加载中组件 - 用于内容区域
export const PageLoading = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-muted-foreground">加载中...</span>
    </div>
  </div>
);
