# 开发者快速上手

本文档帮助你在本地搭建 WeMD 开发环境。

---

## 环境要求

| 工具 | 最低版本 | 检查命令 |
| :--- | :--- | :--- |
| Node.js | 18.0.0 | node -v |
| pnpm | 9.0.0 | pnpm -v |
| Git | - | git --version |

> 💡 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本，使用 `npm install -g pnpm` 安装 pnpm。

---

## 步骤 1：获取代码

```
git clone https://github.com/tenngoxars/WeMD.git
cd WeMD
```

---

## 步骤 2：安装依赖

```
pnpm install
```

WeMD 是 Monorepo 结构，pnpm 会自动处理 workspace 链接。

⚠️ 常见错误：node-gyp 编译失败

如果遇到 `node-gyp` 相关错误，可能缺少编译工具：

**macOS**:

```
xcode-select --install
```

**Windows**:

```
npm install -g windows-build-tools
```

---

## 步骤 3：启动开发服务器

### Web 版（推荐）

```
pnpm dev:web
```

终端显示 `Local: http://localhost:5173/` 后，在浏览器打开。

### Desktop 桌面版

需要两个终端窗口：

**终端 1**（先启动 Web 服务）:

```
pnpm dev:web
```

**终端 2**（等 Web 启动后）:

```
pnpm dev:electron
```

或使用一键脚本：

```
pnpm dev:desktop
```

---

## 步骤 4：验证热更新

1. 打开 `apps/web/src/App.tsx`
2. 修改任意文字，保存
3. 浏览器应自动刷新显示修改

---

## 项目常用命令

| 命令 | 说明 |
| :--- | :--- |
| pnpm dev:web | 启动 Web 开发服务器 |
| pnpm dev:desktop | 启动 Desktop 开发环境 |
| pnpm build | 构建所有项目 |
| pnpm lint | 代码检查 |
| pnpm format | 格式化代码 |

---

## 下一步

* 查看 [项目结构](https://wemd.app/docs/reference/project-structure.html) 了解代码组织
* 查看 [创建自定义主题](https://wemd.app/docs/guides/create-theme.html) 了解主题开发