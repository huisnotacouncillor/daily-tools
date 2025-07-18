帮我实现一个工具站点，参考：https://g.co/gemini/share/02091b5cb203

# 要求简约大方

- 使用当前项目的技术栈，可以安装 shadcn 的其他组件，要求简约大方
- 对于写的TS 方法，要使用vitest 进行单元测试覆盖，以保证质量

# 站点要有以下功能：

- 正则表达式验证
  - 分为两列，左侧上下布局，依次显示正则表达式，待匹配字符串，可视化的正则表达式规则；右侧依次显示匹配结果，左侧正则表达式所用到的正则表达式教程
- json解析
  - 左右两栏，左侧填文本串，右侧显示解析结果
- 不同类型的颜色值转换
  - hex 转 rgb
  - hex 转 rgba
  - 其他格式的颜色转换
- jwt 数据接卸
  - 分为左右两栏, 左侧填jwt token,右侧显示解析结果

Please help me implement a developer tools website using the current project's tech stack (Vite + React + TypeScript + shadcn/ui). You can install additional shadcn components as needed. The design should be clean, minimalist, and professional.

**Quality Requirements:**

- All TypeScript utility functions must have comprehensive unit test coverage using Vitest
- Code should follow best practices and be well-documented
- UI should be responsive and accessible

**Required Features:**

1. **Regular Expression Validator**
   - Two-column layout:
     - Left column (vertical stack): regex input field, test string input field, visual regex explanation/breakdown
     - Right column: match results display, regex tutorial/reference relevant to the current pattern

2. **JSON Parser/Formatter**
   - Two-column layout:
     - Left column: raw text/JSON input textarea
     - Right column: formatted/parsed JSON output with syntax highlighting and error handling

3. **Color Format Converter**
   - Support multiple color format conversions:
     - HEX to RGB
     - HEX to RGBA
     - RGB to HEX
     - HSL conversions
     - Include color preview swatches for visual feedback

4. **JWT Token Decoder**
   - Two-column layout:
     - Left column: JWT token input textarea
     - Right column: decoded header, payload, and signature information with proper formatting

**Implementation Steps:**

1. Set up the main navigation/routing structure
2. Implement each tool as a separate component/page
3. Create utility functions for each conversion/parsing operation
4. Write comprehensive unit tests for all utility functions using Vitest
5. Test the application thoroughly and fix any issues found
6. Ensure responsive design works across different screen sizes

**Deliverables:**

- Working application with all four tools
- Complete unit test suite with good coverage
- Clean, maintainable code structure
- Responsive UI that works on desktop and mobile

After implementation, please run the test suite and the development server to verify everything works correctly, and fix any issues that arise.
