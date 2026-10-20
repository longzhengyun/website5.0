# 佳瑞网 5.0

个人技术站的重设计与重构。当前为 M2 骨架：Astro 静态内容站，无登录、无数据库、无服务端 API；页面视觉将在设计验收后继续接入。

## 技术栈

- Astro 7 + TypeScript，静态输出
- MDX 内容集合驱动文章、项目与个人资料
- Tailwind CSS 4 + 本地设计 token / 组件样式
- Pagefind 1.5 构建期中文索引
- 本地字体（Instrument Serif / JetBrains Mono）

## 本地开发

要求 Node `24.19.0`（见 `.nvmrc`）。

```bash
npm install
npm run dev
```

开发服务器不包含 Pagefind 索引，搜索面板会提示索引不可用；需要完整搜索时先构建再预览：

```bash
npm run build
npm run preview
```

其他命令：

```bash
npm run check        # Astro 内容 schema 与 TypeScript 检查
npm run build:astro  # 只生成静态页面，不跑 Pagefind
npm run search:index # 对已有 dist 重新生成搜索索引
```

## 内容

内容都在 `src/content/`，新增内容不需要改页面代码。

- `articles/*.mdx`：文章。`slug` 必须与文件名一致，使用小写 ASCII kebab-case；`summary` 为 50–80 字；`draft: true` 的条目不会进入页面、搜索、RSS 或 sitemap。
- `projects/*.mdx`：项目。`period`、`role`、`stack`、`links` 为必填；封面与截图为可选图片字段。
- `profile/profile.mdx`：站主资料。`city`、`email`、`siteDomain`、`icp` 均为可选；未确认的信息不要填写。

分类固定为 `HTML/CSS`、`JavaScript`、`框架`、`工程化`、`杂谈`，对应 slug 见 `src/config/site.ts`。每页 10 篇文章。

## 路由

- `/`、`/about/`、`/projects/`、`/projects/{slug}/`
- `/articles/`、`/articles/{slug}/`
- `/articles/page/{n}/`（从第 2 页开始）
- `/articles/category/{slug}/`
- `/articles/category/{slug}/page/{n}/`（从第 2 页开始）

第 1 页不生成独立页面：`/articles/page/1/` 与分类第 1 页在宿主层 301 到无页码路径。旧 `?category=` / `?page=` 查询参数由 `/articles/` 内联脚本 `location.replace` 兜底到静态路由。

## 搜索

构建时由 Pagefind 生成 `dist/pagefind/`，语言固定为 `zh-cn`。搜索面板只在首次搜索时加载索引；文章与项目详情通过 `data-pagefind-body` 进入索引，列表页不进入。

## 部署

- 静态托管，构建命令 `npm run build`，产物目录 `dist/`。
- 站点域名通过环境变量 `SITE_URL` 覆盖（默认 `https://jary8.com`），用于 canonical、RSS、sitemap 与 robots。
- Cloudflare Pages 使用 `public/_redirects` 处理路径重定向。
- Vercel 使用根目录 `vercel.json`；两处都保留 301 规则。
- 查询参数重定向无法由 Cloudflare `_redirects` 表达，由 `/articles/` 内联脚本兜底。
