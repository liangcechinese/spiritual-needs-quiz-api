# 精神需求测试 - 后端 API 服务

为精神需求测试网站提供 AI 深度分析功能的后端服务。

## 功能特性

- 🔐 安全的 API 调用（API Key 存储在后端）
- 🤖 集成硅基流动 AI 模型
- 📊 根据测试结果生成深度心理分析
- 🌐 CORS 支持，允许前端跨域调用

## 技术栈

- Node.js
- Express.js
- Axios (HTTP 客户端)
- CORS (跨域支持)

## 快速开始

### 1. 安装依赖

```bash
cd spiritual-needs-quiz-api
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
SILICONFLOW_API_KEY=your_actual_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:8000
```

**重要**：请将 `your_actual_api_key_here` 替换为你的实际硅基流动 API Key。

### 3. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务将在 `http://localhost:3000` 启动。

## API 端点

### POST /api/analyze

根据测试结果生成 AI 深度分析。

**请求示例：**

```json
{
  "percentages": [100, 86, 83, 60, 80, 100, 83, 86, 75, 83],
  "answers": [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, ...]
}
```

**响应示例：**

```json
{
  "success": true,
  "analysis": "核心驱动力分析：你的核心精神需求是..."
}
```

### GET /health

健康检查端点。

**响应示例：**

```json
{
  "status": "ok",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

## 硅基流动 API 配置

### API 端点

当前配置使用的是通用端点，请根据硅基流动的实际 API 文档调整 `server.js` 中的以下配置：

```javascript
const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions'; // 确认正确的端点
model: 'deepseek-chat', // 或其他支持的模型
```

### 重要配置项

1. **API Key**: 必须配置在 `.env` 文件中
2. **模型名称**: 根据硅基流动支持的模型选择
3. **API 端点**: 根据官方文档确认
4. **请求参数**: 可能需要调整 `temperature`、`max_tokens` 等参数

## 部署

### 方式一：本地运行

```bash
npm start
```

### 方式二：部署到云服务

推荐平台：

1. **Vercel**
   - 创建 `vercel.json` 配置文件
   - 连接 Git 仓库
   - 自动部署

2. **Railway**
   - 上传代码
   - 配置环境变量
   - 一键部署

3. **其他 Node.js 托管平台**
   - Heroku
   - Render
   - Fly.io

### 环境变量配置

部署时，确保在平台中配置以下环境变量：
- `SILICONFLOW_API_KEY`
- `PORT` (平台会自动设置)
- `NODE_ENV=production`
- `FRONTEND_URL` (你的前端部署地址)

## 前端集成

前端需要修改调用地址：

```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';

async function getAIAnalysis(percentages, answers) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ percentages, answers })
    });

    return await response.json();
}
```

## 故障排查

### API 调用失败

1. 检查 `.env` 文件是否存在
2. 检查 `SILICONFLOW_API_KEY` 是否正确
3. 检查网络连接
4. 查看服务器日志

### CORS 错误

1. 检查 `FRONTEND_URL` 配置是否正确
2. 确保前端地址与配置一致

### 超时错误

1. 检查硅基流动 API 是否正常运行
2. 增加 `timeout` 配置（默认 30 秒）

## 安全注意事项

⚠️ **重要提醒**：

1. **永远不要**将 `.env` 文件提交到 Git 仓库
2. **永远不要**在前端代码中硬编码 API Key
3. 定期更换 API Key
4. 使用 HTTPS 部署生产环境
5. 考虑添加请求频率限制

## 许可证

ISC License

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。
