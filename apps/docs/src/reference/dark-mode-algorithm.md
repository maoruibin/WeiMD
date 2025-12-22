# 微信深色模式预览算法

WeMD 内置了一套**色彩语义保全算法**，可在编辑器中预览微信公众号深色模式下的实际效果，还原度达 **98% 以上**。

NOTE

该算法深度参考了微信官方公开的 [wechatjs/mp-darkmode](https://github.com/wechatjs/mp-darkmode) 核心逻辑，通过将其核心数学模型迁移至 CSS 静态转换引擎，实现了零延迟、零闪烁的高还原度预览。

这（可能）是目前市面上唯一除官方外针对微信公众号深色模式预览的开源解决方案。

---

## TL;DR

**挑战**：微信深色模式的转换逻辑虽然已有开源实现（[mp-darkmode](https://github.com/wechatjs/mp-darkmode)），但官方方案依赖运行时 JS，在公众号预览场景下存在延迟与兼容性门槛。

**解决方案**：WeMD 深度对齐官方核心算法，在编辑器中 1:1 还原其渲染行为（还原度 > 98%）。

**核心思路**：将官方运行时逻辑转化为高性能的静态 CSS 转换引擎，支持背景图自动补色与属性优先级排序，实现零延迟、零闪烁的实机级预览。

---

## 与官方 mp-darkmode 的区别

虽然 WeMD 的核心数学模型参考了官方算法，但在实现架构上有着本质的不同：

| 特性 | 官方[mp-darkmode](https://github.com/wechatjs/mp-darkmode) | **WeMD 内置算法** |
| :--- | :--- | :--- |
| **实现逻辑** | **DOM 驱动 (运行时)** | **CSS 驱动 (编译/预览时)** |
| **准确度** | **极高**(原生渲染环境) | **极高**(已完美复刻官方核心转换数学模型) |
| **性能体验** | 可能存在加载闪变 (FOUC) | **零延迟、无感切换 (内置静态生成)** |
| **运行要求** | 必须真实浏览器环境 | **无环境依赖**(Node.js/Electron 通用) |

### 核心权衡

**为什么WeMD不直接用官方 JS 库？**

1. **高性能交付**：WeMD 输出的是一份“成品”样式表。读者打开文章时，浏览器不需要额外运行一段沉重的 JS 来动态改颜色，这能显著提升加载速度。
2. **预览一致性**：在 WeMD 编辑器中能看到的，就是最终吐出来的 CSS 效果，没有运行时变量干扰。

**官方算法在哪方面更强？**

* **层级上下文敏感度**：如果一个元素的背景色是由 5 层父元素外的 CSS 定义的，官方运行时算法能轻松拿到最终计算值，而 WeMD 的静态扫描很难百分百还原这种深层嵌套。
* **动态内容适配**：如果你的页面是通过 JS 动态生成的，官方库能实时监听，WeMD 无法做到。

---

## 核心原理

### HSL 色彩空间转换

算法使用 HSL（色相-饱和度-亮度）色彩空间进行计算：

```
function rgbToHsl(r, g, b): [h, s, l]
function hslToRgb(h, s, l): [r, g, b]
```

**为什么选择 HSL？**

* 色相（H）保持不变：红色还是红色
* 饱和度（S）可独立调整：控制颜色鲜艳程度
* 亮度（L）精确映射：这是深色模式的核心

### 元素类型识别

算法通过 CSS 选择器识别 14 种元素类型：

```
type ElementType = 
  | 'heading'           // 标题
  | 'body'              // 正文
  | 'background'        // 背景
  | 'table'             // 表格背景
  | 'table-text'        // 表格文字
  | 'blockquote'        // 引用块背景
  | 'blockquote-text'   // 引用块文字
  | 'code'              // 代码块背景
  | 'code-text'         // 代码块文字
  | 'selection'         // 选中区域背景
  | 'selection-text'    // 选中区域文字
  | 'decorative-dark'   // 深色装饰（阴影/边框）
  | 'vibrant-protected' // 鲜艳色保护
  | 'other'             // 其他
```

识别规则基于选择器关键词匹配：

```
function getElementType(selector: string): ElementType {
    if (/blockquote|callout|multiquote/.test(selector)) return 'blockquote';
    if (/pre|code|hljs|language-/.test(selector)) return 'code';
    if (/table|tr|th|td/.test(selector)) return 'table';
    if (/h[1-6]/.test(selector)) return 'heading';
    // ...
}
```

### 亮度区间映射

不同元素类型映射到不同的深色亮度区间：

| 元素类型 | 亮度区间 (L%) | 饱和度系数 |
| :--- | :--- | :--- |
| body | 10% | 0 |
| background | 12% - 18% | 0.5 |
| table | 10% - 24% | 0.6 |
| blockquote | 14% - 22% | 0.7 |
| code | 10% - 20% | 0.5 |
| selection | 45% - 65% | 0.6 |
| decorative-dark | 10% - 15% | 0 |
| vibrant-protected | 35% - 55% | 1.0 |

映射公式（背景色）：

```
newL = maxL - (originalL / 100) * (maxL - minL)
```

### 对比度保全

文字颜色需要与背景保持足够对比度：

```
function adjustTextBrightness(textRgb, textHsl, bgRgb) {
    const bgL = getColorPerceivedBrightness(bgRgb);
    const minL = bgL + 65;   // 最小亮度差
    const maxL = bgL + 180;  // 最大亮度差
    // 将文字亮度调整到 [minL, maxL] 区间
}
```

### 背景图层完美对齐 (Background Layering)

针对带有 `background-image` 的元素，WeMD 会自动在图片底层追加一层转换后的深色背景，并同步复制定位与尺寸属性：

```
/* 输入 */
.card { 
    background-image: url(logo.png); 
    background-color: #fff;
    background-size: cover;
    background-position: center;
}
/* 输出 */
.card { 
    background-color: #191919; 
    background-image: url(logo.png), linear-gradient(#191919, #191919); 
    background-size: cover, 100%;
    background-position: center, top left;
}
```

**目的**：确保在图片加载前、透明背景或具有特殊定位/拉伸的图片场景下，底部的补色层始终能与图片区域完美对齐映射。

### 属性精度对齐与排序 (Property Sorting)

为了确保复杂选择器下的渲染顺序与微信官方 SDK 一致，算法实现了全量属性矩阵支持与严格排序：

* **全属性支持**：除基础色值外，还支持 `box-shadow`、`outline`、`column-rule` (分栏线)、`-webkit-text-stroke` 等 20+ 种属性的精准转换。
* **严格排序**：

* `-webkit-text-*` 相关属性最优先执行，确保文本特殊样式不被覆盖。
* `background-image` 紧随 `background-color` 之后，保证叠加层级正确。
* `color` 属性由于优先级最高，被置于声明块最后输出。

---

## 处理流程

```
CSS 输入
    ↓
解析选择器 → 识别元素类型 (getElementType)
    ↓
解析属性值 → 提取颜色值 (HEX/RGB/HSL)
    ↓
属性类型判断 → 背景色/文字色/阴影边框
    ↓
颜色转换 → processColorRgb()
    ├── 背景类 → adjustBackgroundBrightness()
    ├── 文字类 → adjustTextBrightness() / adjustCodeTextBrightness()
    ├── 深色装饰 → adjustDecorativeDarkBrightness()
    └── 鲜艳保护 → adjustBackgroundBrightness() (保持高亮度)
    ↓
CSS 输出
```

---

## 配置参数

算法提供可配置的阈值参数：

```
interface DarkModeConfig {
    vibrantSaturationThreshold: number;  // 鲜艳色保护阈值，默认 15
    vibrantLightnessRange: [number, number];  // 鲜艳色亮度区间，默认 [35, 55]
    decorativeDarkLuminanceThreshold: number;  // 深色锚定阈值，默认 20
}
```

---

## 设计建议

### 颜色格式

✅ **推荐**：HEX (`#333`) 或 RGB (`rgb(51,51,51)`)

❌ **避免**：颜色名称 (`black`, `white`)

### 背景色

✅ **推荐**：`transparent` 或浅灰色

❌ **避免**：纯白 `#ffffff` 作为容器背景

### 品牌色

✅ **放心使用**：饱和度 > 15% 的色彩会被自动保护

### 阴影

✅ **放心使用**：亮度 < 20 的深色阴影会保持深色

---

## 局限性

| 场景 | 说明 |
| :--- | :--- |
| CSS 变量 | var(--xxx)不会被处理 |
| 颜色名称 | black、white不会被转换 |
| 渐变 | linear-gradient等渐变不会被处理（微信不支持） |
| 图片 | 图片本身不会被处理（与微信一致） |

---

## 常见问题

### Q: 为什么某个颜色转换后看起来不对？

可能的原因：

1. 使用了颜色名称（如 `black`）而非 HEX 格式
2. 使用了 CSS 变量 `var(--xxx)`
3. 原色的饱和度/亮度恰好处于阈值边界

**解决方法**：将颜色改为 HEX 格式，如 `#000000`。

### Q: 预览效果和微信实际效果有差异怎么办？

算法还原度达 98% 以上，以下场景可能有差异：

* 半透明颜色的叠加效果
* 极端亮度值（接近纯黑或纯白）

NOTE

渐变（`gradient`）会被直接跳过不做转换，因为微信公众号不支持 CSS 渐变。

如果发现明显差异，欢迎提交 Issue，我会持续优化算法。

### Q: 自定义主题需要做什么适配吗？

不需要。只要颜色使用 HEX/RGB 格式，算法会自动处理。参见上方"设计建议"部分。

---

## 源码位置

核心实现：`packages/core/src/wechatDarkMode.ts`

| 函数 | 作用 |
| :--- | :--- |
| convertCssToWeChatDarkMode() | 主入口，CSS 整体转换 |
| getElementType() | 选择器 → 元素类型 |
| processColorRgb() | 颜色转换调度器 |
| adjustBackgroundBrightness() | 背景色亮度调整 |
| adjustTextBrightness() | 文字对比度调整 |

欢迎查阅源码或提交改进建议。