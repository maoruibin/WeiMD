# 预览渲染与主题实现技术说明

本文档详细说明了 WeiMD 编辑器中「实时预览」功能的渲染流程、技术选型以及主题系统的实现机制。

## 1. 核心架构

预览功能的实现涉及以下几个核心模块：

- **UI 层 (`apps/web`)**: `MarkdownPreview.tsx` 组件负责协调渲染流程、状态管理和副作用处理（如滚动同步、公式渲染）。
- **逻辑层 (`packages/core`)**:
  - `MarkdownParser.ts`: 配置 `markdown-it` 及其插件生态，将 Markdown 转换为 HTML。
  - `ThemeProcessor.ts`: 处理 HTML 结构，负责样式注入和 WeChat 兼容性处理。
- **状态层 (`apps/web/src/store`)**: `themeStore` 管理当前选中的主题 CSS。

## 2. 渲染流程详解

代码位置：`apps/web/src/components/Preview/MarkdownPreview.tsx`

预览渲染是一个响应式流水线，主要包含以下步骤：

### 2.1 初始化 Parser
使用 `useMemo` 缓存 parser 实例，避免每次 React 渲染时重复创建昂贵的 `markdown-it` 对象。

```typescript
// apps/web/src/components/Preview/MarkdownPreview.tsx
const parser = useMemo(() => createMarkdownParser(), []);
```

`createMarkdownParser` (在 core 包中) 加载了丰富的插件支持，包括：
- `markdown-it-math`: 数学公式
- `markdown-it-table-of-contents`: 目录生成
- `markdown-it-implicit-figures`: 图片容器
- ...其他自定义插件

### 2.2 智能预处理 (Smart Pre-processing)

为了适应公众号写作习惯（"一次回车即分段"），我们在渲染前增加了一个预处理步骤：

```typescript
// apps/web/src/components/Preview/MarkdownPreview.tsx
const processedMarkdown = isAutoParagraph ? preprocessMarkdown(markdown) : markdown;
const rawHtml = parser.render(processedMarkdown);
```

**`preprocessMarkdown` 逻辑 (`packages/core/src/MarkdownParser.ts`)：**
1.  **保护代码块**：先将 ``` ``` 和 ` ` 代码块内容抽离，防止代码内的换行被破坏。
2.  **标准化换行**：将 `\r\n` 和 `\r` 统一转换为 `\n`。
3.  **智能分段**：利用正则 `/\n+/g` 扫描文本。
    - 如果遇到**单个换行符**，将其替换为 `\n\n`（两个换行符），从而在 Markdown 渲染时生成两个 `<p>` 标签，产生段落间距。
    - 如果遇到**两个及以上换行符**，保持原样。
4.  **还原代码块**：将保护的内容还原。

这一机制确保了用户只需按一次回车，就能获得视觉上舒适的段落间距，而无需改变标准 Markdown 的习惯（按两次回车）。

### 2.3 样式处理 (关键优化)

这是预览模式与导出模式最大的区别：

```typescript
// 1. 获取当前主题 CSS（支持自动深色模式转换）
const css = getThemeCSS(theme, isDarkMode);

// 2. 处理 HTML 结构，但【不内联】样式
// 参数 false 表示跳过 juice 的 inlineContent 处理
const styledHtml = processHtml(rawHtml, css, false);
```

**为什么这样做？**
- **性能优化**: `juice` 库将 CSS 内联到每个 HTML 标签的 `style` 属性中是一个非常耗时的 CPU 密集型操作。在实时预览（用户打字时）中启用它会导致严重的卡顿。
- **解决方案**: 在预览模式下，我们仅将 HTML 包裹在 `<section id="wemd">` 容器中，然后通过 React 在页面头部注入一个全局 `<style>` 标签来应用 CSS。

```tsx
// 注入 CSS
<style dangerouslySetInnerHTML={{ __html: getThemeCSS(theme, uiTheme === 'dark') }} />
// 渲染 HTML
<div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
```

### 2.4 后处理 (Effect)

HTML 渲染到 DOM 后，还需要进行副作用处理：

- **数学公式 (KaTeX)**:
  检测到公式后，使用 `renderMathInElement` 对 DOM 节点进行二次渲染。为了性能，使用了防抖 (debounce) 策略，延迟 100ms 执行。
  
- **滚动同步**:
  监听预览容器的 `scroll` 事件，计算滚动比例，并通过 `window.dispatchEvent` 发送自定义事件 `wemd-sync-scroll` 通知编辑器侧进行同步滚动。

## 3. ThemeProcessor 技术细节

代码位置：`packages/core/src/ThemeProcessor.ts`

`processHtml` 函数是连接内容与样式的桥梁：

1.  **数据标记**: 遍历所有块级元素（p, h1, div 等），自动添加 `data-tool="WeMD编辑器"` 属性（微信后台识别标识）。
2.  **容器包裹**: 将所有内容包裹在 `<section id="wemd">` 中。这是样式隔离的关键，所有主题 CSS 选择器都以 `#wemd` 开头。
3.  **样式内联 (仅导出时)**:
    - 如果 `inlineStyles=true` (复制/导出时)，调用 `juice.inlineContent` 将 CSS 规则合并到 HTML 标签的 `style` 属性中。这是为了兼容微信公众号编辑器（它不支持外部样式表或 `<style>` 块）。
    - 如果 `inlineStyles=false` (预览时)，直接返回包裹后的 HTML，依赖外部 CSS 渲染。

## 4. 总结

| 特性 | 预览模式 (Preview) | 导出模式 (Copy) |
| :--- | :--- | :--- |
| **样式应用方式** | `<style>` 标签注入 (CSS Class) | Inline Style (内联样式) |
| **核心工具** | 浏览器原生渲染 | `juice` 库处理 |
| **性能** | 高 (毫秒级响应) | 较低 (需数百毫秒处理) |
| **数学公式** | KaTeX (快速) | MathJax (SVG, 兼容性好) |
| **段落处理** | 智能分段 (Smart Paragraph) | 智能分段 (Smart Paragraph) |
| **主要目的** | 实时反馈，编辑体验 | 微信编辑器兼容性 |

这种分离的设计确保了用户在编辑时拥有流畅的 60fps 体验，同时在最终导出时能生成完美适配微信后台的富文本代码。
