# 商品管理后台（Next.js 示例）

基于 Next.js 16（App Router + Server Actions + Tailwind CSS 4）的简单示例：首页登录 + 商品增删改查。

## 环境要求

- Node.js **>= 20.9**（Next.js 16 的最低要求）
- npm（随 Node.js 一起安装）

## 安装

```bash
git clone <仓库地址>
cd nextjs-website

# 国内网络建议使用 npmmirror 镜像
npm install --registry=https://registry.npmmirror.com
```

## 配置环境变量

`.env.local` 不会提交到仓库，需在项目根目录自行创建：

```bash
# .env.local
# 登录账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456
# 用于签名会话 Cookie 的密钥，生产环境请替换为随机长字符串
SESSION_SECRET=请替换为随机长字符串
```

不创建时使用默认值：账号 `admin` / `123456`，密钥 `dev-secret-change-me`（仅限本地开发）。

生成随机密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 运行

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（热更新），访问 http://localhost:3001 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器（需先 `npm run build`） |
| `npm run lint` | 运行 ESLint 检查 |

开发：

```bash
npm run dev
```

生产部署：

```bash
npm run build
npm run start            # 默认端口 3001
npx next start -p 8080   # 临时使用其他端口
```

> 生产环境下会话 Cookie 带 `Secure` 标记，需通过 HTTPS 访问（或在 localhost 下访问）才能正常登录。

## 功能

- 首页登录：账号密码校验，签名 Cookie 保存会话（7 天），支持退出登录
- 路由保护：`src/proxy.ts` 未登录访问 `/dashboard` 跳回首页；页面和 Server Action 内再次校验
- 商品 CRUD：列表 + 搜索、新增、编辑、删除（带表单校验）
- 数据存储：`data/products.json`（首次写入时自动创建；演示用，生产环境请换成数据库）

## 目录结构

```
data/products.json            商品数据（JSON 文件）
src/
  proxy.ts                    路由保护（Next 16 中 middleware 已更名为 proxy）
  lib/token.ts                会话 token 签名 / 校验
  lib/session.ts              读写会话 Cookie、requireSession
  lib/db.ts                   基于 JSON 文件的商品数据读写
  app/page.tsx                首页登录
  app/login-form.tsx          登录表单（客户端组件）
  app/actions/auth.ts         登录 / 退出
  app/actions/products.ts     新增 / 编辑 / 删除
  app/dashboard/              后台：列表、新增、编辑页面
next.config.ts                Next.js 配置（cacheComponents、Turbopack + Tailwind）
```

## 不纳入版本控制的文件

见 `.gitignore`：`node_modules`、`.next`、所有 `*.yaml` / `*.yml` 文件，以及所有以 `.` 开头的文件和目录（如 `.env.local`，`.gitignore` 本身除外）。
