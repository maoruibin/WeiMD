# WeMD

> 一站式的微信公众号 Markdown 编辑器，专注于保真排版、富文本主题和一键分发工作流。

[![pnpm](https://img.shields.io/badge/pnpm-9+-F69220.svg?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e.svg?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-000000.svg?logo=vercel&logoColor=white)](https://turbo.build/repo)

## 目录

- [为什么选择 WeMD](#为什么选择-wemd)
- [核心特性](#核心特性)
- [架构与仓库布局](#架构与仓库布局)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [配置](#配置)
- [使用指南](#使用指南)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)
- [常见问题](#常见问题)
- [浏览器兼容性](#浏览器兼容性)
- [许可证](#许可证)
- [致谢与联系方式](#致谢与联系方式)

## 为什么选择 WeMD

- **公众号排版保真**：输出的 HTML/CSS 以微信公众号为第一目标，复制即可粘贴，无需再调样式。
- **实时感知的写作体验**：CodeMirror 6 驱动的编辑器配合 Markdown-it 渲染器，左写右看，延迟几乎为零。
- **可拓展的工作流**：主题、插件、模板均托管在独立包中，方便复用和团队协作。
- **面向私有部署**：pnpm + Turborepo 的 Monorepo，前后端同仓，易于部署和自动化。

## 核心特性

### 编辑体验

- **实时预览**：双栏布局，所见即所得。
- **完整语法**：支持 GFM、表格、脚注、Emoji、任务清单、TOC。
- **数学 / 代码**：MathJax 3 渲染 LaTeX、highlight.js 覆盖常用语言高亮。
- **字数与统计**：实时显示字数、段落与阅读时间，便于估算篇幅。

### 微信排版

- **一键复制**：复制到微信直接获得与预览一致的样式。
- **丰富主题**：内置 12+ 主题并支持自定义 CSS，满足不同品牌调性。
- **模板系统**：`templates/` 提供常见栏目模板，可作为初稿快速套用。

### 生产力工具

- **历史记录**：基于 IndexedDB 自动保存草稿，支持多文档切换、重命名与恢复。
- **粘贴上传**：支持粘贴图片即传，即插即用（支持本地存储与 GitHub/COS 图床）。
- **快捷键**：针对常用操作（保存、复制、全屏等）提供键盘快捷键，写作不中断。

## 架构与仓库布局

WeMD 采用 Turborepo 管理的 pnpm Monorepo，所有应用和包共享同一份锁文件和代码规范。

| 路径 | 说明 |
| --- | --- |
| `apps/web` | React + Vite 前端，提供 Markdown 编辑、主题与发布能力 |
| `apps/server` | NestJS 上传服务，封装本地/腾讯云 COS 图床与静态资源 |
| `packages/core` | Markdown 解析、主题、插件等核心逻辑，可独立复用 |
| `packages/ui` | 预留的 UI 组件库（WIP），用于沉淀通用 UI 组件 |
| `packages/config` | 共享的配置/类型定义（WIP） |
| `templates` | 公众号常用内容模块示例 |

> 更多任务并行和缓存策略见 `turbo.json`。

## 技术栈

- **前端**：React 18、TypeScript、Vite 6、Zustand、CodeMirror 6、Lucide、react-hot-toast
- **Markdown & 渲染**：markdown-it 系列插件、MathJax 3、highlight.js、juice（样式内联）
- **后端**：NestJS 11、Express、Tencent COS SDK、本地文件系统
- **工程化**：pnpm 9、Turborepo 2、ESLint 9、Prettier 3、TypeScript 5

## 快速开始

### 前置条件

- Node.js ≥ 18
- pnpm ≥ 9（`corepack enable pnpm` 推荐）

### 安装

```bash
git clone https://github.com/your-username/wemd.git
cd wemd
pnpm install
```

### 本地开发

- 同时启动所有应用（依赖 Turbo 并行）：

```bash
pnpm dev
```

- 单独启动前端：

```bash
pnpm dev --filter @wemd/web
```

访问 `http://localhost:5173`。

- 启动上传服务（用于本地图床）：

```bash
pnpm dev --filter @wemd/server
```

服务默认监听 `http://localhost:4000`。

### 生产构建

```bash
# 构建所有包
pnpm run build

# 只构建前端
pnpm run build --filter @wemd/web

# 预览打包后的前端
pnpm --filter @wemd/web run preview
```

### 常用脚本

| 命令 | 描述 |
| --- | --- |
| `pnpm dev` | 启动所有 `dev` 任务（Turbo 并行） |
| `pnpm dev --filter @wemd/web` | 仅运行前端开发服务器 |
| `pnpm dev --filter @wemd/server` | 仅运行 NestJS 上传服务 |
| `pnpm lint` | 运行所有包的 ESLint |
| `pnpm format` | 使用 Prettier 格式化 `ts/tsx/md` |
| `pnpm --filter @wemd/core run build` | 构建 Markdown 核心包 |
| `pnpm --filter @wemd/server run test` | 运行服务器单测 |

## 配置

### Web 端设置

前端的图床与主题配置持久化在浏览器中。也可以预设默认值，参见 `apps/web/src/store/settingsStore.ts`：

```ts
{
  imageHostingType: 'local', // local | github
  githubConfig: {
    token: '',
    repo: '',
    branch: 'main',
    useJsDelivr: true,
  },
  localConfig: {
    serverUrl: 'http://localhost:4000',
  },
}
```

在 UI 中打开“设置 > 图床配置”即可完成切换。

### 上传服务 / 图床

`apps/server` 默认提供两种模式：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `4000` | 服务监听端口 |
| `STORAGE_MODE` | `local` | `local` 保存到 `apps/server/uploads`，`cos` 上传到腾讯云 COS |
| `COS_SECRET_ID` / `COS_SECRET_KEY` | - | 腾讯云访问密钥 |
| `COS_BUCKET` | - | 目标存储桶 |
| `COS_REGION` | `ap-guangzhou` | 区域 |

在 `apps/server/.env` 中配置后运行 `pnpm dev --filter @wemd/server`。腾讯云 COS 的详细流程见 `apps/server/COS_SETUP.md`。

## 使用指南

### 基础编辑

- 左侧编辑 Markdown，右侧实时渲染。
- 支持标题、列表、引用、代码、链接、图片、表格、脚注与任务列表。
- 使用 `$...$` / `$$...$$` 编写数学公式，` ```lang ` 创建代码块。

### 主题管理

1. 点击顶部 **主题管理**；
2. 在内置主题之间切换或复制为自定义主题；
3. 直接编辑 CSS，右侧即时预览；
4. 保存后即可应用到当前文档。

### 复制到微信

1. 完成排版后点击 **复制到微信**；
2. 打开公众号后台编辑器并使用 `Cmd/Ctrl + V` 粘贴；
3. 预览与微信保持一致，不会丢失颜色、间距和代码高亮。

### 历史与多文档

- 自动保存到浏览器 IndexedDB；
- 历史面板支持搜索、重命名与删除；
- 单击任意记录即可恢复对应稿件。

## 项目结构

```
wemd/
├── apps/
│   ├── web/                  # React + Vite 前端
│   │   ├── src/
│   │   │   ├── components/   # UI 组件
│   │   │   ├── services/     # 业务逻辑
│   │   │   ├── store/        # Zustand 状态
│   │   │   ├── styles/       # 全局样式
│   │   │   ├── themes/       # 主题入口
│   │   │   └── utils/        # 工具函数
│   └── server/               # NestJS 上传服务
│       ├── src/upload/       # 上传模块与 DTO
│       ├── src/services/     # 业务服务
│       └── uploads/          # 本地文件存储
├── packages/
│   ├── core/                 # Markdown 渲染、主题、插件
│   ├── ui/                   # 通用组件（预留）
│   └── config/               # 共享配置（预留）
├── templates/                # 公众号内容模板
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 开发指南

### 添加新主题

1. 在 `packages/core/src/themes/` 创建主题文件；
2. 导出模板字符串并在 `packages/core/src/themes/index.ts` 中注册；
3. 在 `apps/web/src/store/editorStore.ts` 注册主题元数据（名称、预览图等）；
4. 通过应用内主题管理器或默认配置启用。

```ts
// packages/core/src/themes/my-theme.ts
export const myTheme = `
  #nice {
    font-family: 'PingFang SC', sans-serif;
  }
  #nice h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
  }
`;
```

### 添加 Markdown 插件

1. 在 `packages/core/src/plugins/` 编写插件；
2. 在 `packages/core/src/index.ts` 中将插件挂载到 markdown-it；
3. 根据需要在前端的渲染设置中启用。

## 贡献指南

欢迎通过 Issue 或 PR 参与共建：

1. Fork 仓库并创建特性分支：`git checkout -b feat/amazing-feature`
2. 提交更改：`git commit -m "feat: add amazing feature"`
3. 推送分支并发起 Pull Request

提交 Issue 时，请附上问题描述、复现步骤、期望行为与运行环境。

编码规范：

- 遵循 TypeScript + ESLint 规则；
- 复杂逻辑添加注释；
- 优先复用共享包中的能力，保持 Monorepo 的一致性。

## 常见问题

**复制到微信样式丢失？**  
请确保使用 `Cmd/Ctrl + V`，不要使用“粘贴为纯文本”。如仍有问题，可尝试刷新后再次复制。

**数学公式不显示？**  
MathJax 通过 CDN 加载，首次打开可能较慢。确认网络可访问 `https://cdn.jsdelivr.net`。

**如何配置图床？**  
在前端设置中选择 GitHub 或本地服务，并在服务器 `.env` 中设置 `STORAGE_MODE`。腾讯云 COS 参考 `apps/server/COS_SETUP.md`。

**历史记录存在哪？**  
全部存储在浏览器 IndexedDB，不会上传到服务器；清空浏览器缓存会同时清除。

**如何批量更新主题？**  
在 `packages/core/src/themes` 修改后，通过 `pnpm --filter @wemd/core run build` 重新构建，前端会自动获取最新样式。

## 浏览器兼容性

- Chrome / Edge ≥ 90
- Firefox ≥ 88
- Safari ≥ 14

## 许可证

项目计划以 GPL-3.0 开源，请在使用前确认 `LICENSE` 文件中的最终条款（尚未提交时可在 PR 中补充）。

## 致谢与联系方式

感谢以下优秀项目与生态：

- [markdown-it](https://github.com/markdown-it/markdown-it)
- [CodeMirror](https://codemirror.net/)
- [MathJax](https://www.mathjax.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide](https://lucide.dev/)

沟通与反馈：

- Issue: [GitHub Issues](https://github.com/your-username/wemd/issues)
- 讨论： [GitHub Discussions](https://github.com/your-username/wemd/discussions)

---

如果这个项目对你有帮助，欢迎点个 ⭐️。
