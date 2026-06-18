# AI概念星系

一个纯前端的 3D AI 概念星系，用 Three.js 渲染概念、公司、人物和 AI 编年史。

页面对外展示名已经设置为 `AI概念星系`，企业微信、微信、飞书等客户端抓取链接时会优先读取这个中文标题。

## 打开方式

直接双击 `index.html` 即可查看。页面会优先读取 `data/concepts.json`，如果浏览器限制本地 JSON 读取，会自动使用 `index.html` 内嵌的同一份数据。

也可以用本地静态服务查看：

```bash
cd ai-concept-universe
python3 -m http.server 8080
```

然后打开：

```text
http://localhost:8080
```

或者使用内置启动脚本，启动时会先刷新当天数据：

```bash
npm run serve
```

## 公开访问

这是一个静态网站，不需要后端、不需要构建工具、不需要模型 token。要让所有人像打开普通网页一样访问，需要把整个 `ai-concept-universe/` 文件夹部署到公网静态托管服务：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 公司官网的静态目录

入口文件就是 `index.html`。

### 推荐稳定方案：GitHub Pages

项目已内置 `.github/workflows/pages.yml`：

- 推送到 `main` 分支后自动发布网页。
- 每天北京时间 08:15 自动执行 `scripts/update.js`，生成最新 `data/concepts.json` 后发布。
- 使用 GitHub Actions 自带权限，不需要额外 API key、模型 token 或后端服务。

首次上线步骤：

```bash
git init
git add .
git commit -m "publish ai concept universe"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/ai-concept-universe.git
git push -u origin main
```

然后在 GitHub 仓库中打开 `Settings -> Pages`，选择 `GitHub Actions` 作为发布来源。发布成功后会得到类似这样的稳定网址：

```text
https://YOUR_NAME.github.io/ai-concept-universe/
```

拿到正式网址后，执行一次：

```bash
npm run set-url -- https://YOUR_NAME.github.io/ai-concept-universe/
```

这个命令会把 `canonical`、`og:url`、分享封面绝对地址写进 `index.html`，让企业微信抓取链接时更稳定显示中文标题和预览图。

### 如果坚持依赖自己的电脑更新

可以运行：

```bash
npm run serve
```

这个命令会先更新数据，再在本机启动网页服务。但如果要让外部所有人访问，还必须额外配置一个公网入口，比如固定域名、反向代理或 Cloudflare Tunnel。只用 `file://` 或 `localhost`，别人无法打开。

## 企业微信个人签名

企业微信签名建议写成：

```text
AI概念星系：https://YOUR_PUBLIC_URL/
```

网页标题、站点名、分享标题和预览标题都已设置为 `AI概念星系`。如果企业微信客户端支持链接预览，会显示中文标题；如果客户端只把签名当纯文本 URL 展示，网页无法强制把裸链接替换成中文文字。

## 文件结构

```text
ai-concept-universe/
├── index.html
├── css/style.css
├── js/main.js
├── data/
│   ├── concepts.json
│   └── versions/
│       └── YYYY-MM-DD.json
├── scripts/update.js
├── scripts/start-local-site.js
├── scripts/set-public-url.js
├── .github/workflows/pages.yml
└── README.md
```

## 每日更新

初始化/刷新概念星系：

```bash
node scripts/update.js --seed --date=2026-06-18
```

执行一次日更新：

```bash
node scripts/update.js
```

脚本会完成：

- 读取当前 `data/concepts.json`
- 通过 ArXiv 与科技媒体两个模拟数据源生成当日热点信号
- 自动分类、计算坐标、补充关系
- 写入 `data/versions/YYYY-MM-DD.json`
- 更新 `data/concepts.json`
- 刷新 `index.html` 内嵌数据，保证双击打开仍然可用

macOS 定时任务示例：

```cron
15 8 * * * cd /absolute/path/to/ai-concept-universe && /usr/local/bin/node scripts/update.js
```

## 数据结构

当前数据包含：

- `concepts`：AI 概念，如 Skills、Loop、ReAct、MCP、Transformer、RAG
- `companies`：顶尖 AI 公司，如 OpenAI、Anthropic、xAI、MiniMax、Moonshot AI/Kimi
- `people`：关键人物，如 Alan Turing、Ashish Vaswani、Shunyu Yao、Sam Altman
- `chronology`：1950-2026 的 AI 编年史事件

关系类型：

- `contains`：包含从属
- `derives`：技术衍生
- `applies`：场景应用
- `optimizes`：优化改进

## 对接真实数据源

`scripts/update.js` 中预留了两个接口：

- `fetchArxivDailyConcepts(dateId)`
- `fetchMediaDailySignals(dateId)`

当前返回模拟热点数据。后续可以在这两个函数里接入真实 API，再保留 `mergeSignal()` 的分类、坐标、关系写入流程。
