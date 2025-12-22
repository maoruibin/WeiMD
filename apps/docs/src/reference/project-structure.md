# 项目结构

WeMD 采用 Monorepo 架构，使用 pnpm workspace + TurboRepo 管理。

---

## 目录总览

```
WeMD/
├── apps/                 # 应用程序
│   ├── web/              # Web 版编辑器
│   ├── eletron/          # 桌面版外壳
│   └── server/           # Logo 图片上传服务 (NestJS)
├── packages/             # 共享代码
│   └── core/             # 核心库（Markdown 解析、主题、深色模式）
├── templates/            # 主题 CSS 模板
├── scripts/              # 构建脚本
└── turbo.json            # TurboRepo 配置
```

---

## 各目录详解

### apps/web/（Web 版主程序）

这是核心代码所在。

```
apps/web/src/
├── components/       # React 组件
│   ├── Editor/       # Markdown 编辑器
│   ├── Preview/      # 预览区
│   ├── Header/       # 顶部导航
│   ├── Sidebar/      # 文件侧边栏
│   ├── Theme/        # 主题管理面板
│   ├── History/      # 历史记录与版本
│   ├── Settings/     # 设置面板 (图床等)
│   └── Welcome/      # 首次使用欢迎页
├── store/            # Zustand 状态管理
│   ├── editorStore.ts    # 编辑器状态（内容）
│   ├── themeStore.ts     # 主题状态（样式、切换）
│   ├── themes/           # 内置主题定义
│   ├── fileStore.ts      # 文件列表状态
│   └── historyStore.ts   # 历史记录状态
├── storage/          # 存储适配器
│   └── adapters/
│       ├── IndexedDBAdapter.ts   # 浏览器存储
│       └── FileSystemAdapter.ts  # 本地文件夹
├── hooks/            # 自定义 Hooks
├── services/         # 业务服务（图床上传）
└── styles/           # 全局样式
```

**想改 XX，去哪找？**

| 想改的功能 | 文件位置 |
| :--- | :--- |
| 编辑器行为 | components/Editor/MarkdownEditor.tsx |
| 搜索面板 | components/Editor/SearchPanel.tsx |
| 预览区渲染 | components/Preview/MarkdownPreview.tsx |
| 主题管理 | components/Theme/ThemePanel.tsx |
| 内置主题列表 | store/themes/builtInThemes.ts |
| 图床上传 | services/image/ |
| 图床设置 | components/Settings/ImageHostSettings.tsx |
| 历史记录管理 | components/History/HistoryManager.tsx |

---

### apps/electron/（桌面版）

Electron 外壳，包装 Web 版为桌面应用。

```
apps/electron/
├── main.js           # 主进程（窗口管理、菜单、IPC）
├── preload.js        # 预加载脚本（暴露 API 给渲染进程）
└── package.json      # Electron 依赖配置
```

---

### apps/server/（后端服务）

基于 NestJS 的简单的服务端，主要用于处理特殊的图片上传需求。

```
apps/server/src/
├── upload/           # 上传模块
└── main.ts           # 入口文件
```

---

### packages/core/（核心库）

与 UI 无关的核心逻辑。

```
packages/core/src/
├── MarkdownParser.ts     # Markdown 转 HTML
├── ThemeProcessor.ts     # 主题处理
├── wechatDarkMode.ts     # 微信深色模式模拟算法
├── plugins/              # Markdown 解析插件
└── themes/               # 内置主题 CSS
    ├── basic.ts          # 基础样式
    ├── academic-paper.ts # 学术论文
    ├── cyberpunk-neon.ts # 赛博朋克
    └── ...
```

---

### templates/（主题模板）

供用户参考的 CSS 文件，带详细注释。

```
templates/
├── Template.css          # 📝 带注释的模板
├── Academic-Paper.css
├── Cyberpunk-Neon.css
└── ...
```

---

## TurboRepo 任务

`turbo.json` 定义了任务依赖关系：

| 命令 | 说明 |
| :--- | :--- |
| pnpm build | 按依赖顺序构建所有包 |
| pnpm dev | 并行启动所有开发服务器 |
| pnpm lint | 检查所有包的代码 |