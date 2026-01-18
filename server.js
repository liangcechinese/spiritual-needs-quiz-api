const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// 硅基流动 API 端点
app.post('/api/analyze', async (req, res) => {
    try {
        const { percentages, answers } = req.body;

        // 验证输入
        if (!percentages || !Array.isArray(percentages) || percentages.length !== 10) {
            return res.status(400).json({
                error: 'Invalid input: percentages must be an array of 10 numbers'
            });
        }

        // 维度名称
        const dimensionNames = ['意义', '爱', '连接', '成长', '创造', '权力', '乐趣', '安全感', '自由', '贡献'];

        // 构建 AI 分析的提示词
        const prompt = buildAnalysisPrompt(percentages, dimensionNames);

        // 调用硅基流动 API
        const analysis = await callSiliconFlowAPI(prompt);

        res.json({
            success: true,
            analysis: analysis
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
});

// 构建 AI 分析提示词
function buildAnalysisPrompt(percentages, dimensionNames) {
    const results = dimensionNames.map((name, index) => {
        return `${name}: ${percentages[index]}%`;
    }).join('\n');

    return `你是一位专业的心理咨询师和人格分析专家。请根据以下精神需求测试结果，为用户提供深入、温暖且富有洞察力的分析。

【测试结果】
${results}

【分析要求】
1. 识别用户的核心精神需求（得分最高的 2-3 个维度）
2. 分析这些核心需求如何影响用户的日常生活和决策
3. 提供具体的、可操作的建议，帮助用户更好地满足这些精神需求
4. 指出可能被忽视但重要的精神需求（得分较低的维度）
5. 提供平衡发展的建议

【输出格式】
请用中文输出，分为以下几个部分：
1. 核心驱动力分析（100-150字）
2. 生活影响洞察（100-150字）
3. 成长建议（3-5条，每条50-80字）
4. 平衡发展提示（3-5条，每条50-80字）

【语气要求】
- 专业但温暖
- 充满同理心
- 避免过于学术化的语言
- 鼓励性和启发性`;
}

// 调用硅基流动 API
async function callSiliconFlowAPI(prompt) {
    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
        throw new Error('SILICONFLOW_API_KEY is not configured');
    }

    // TODO: 根据硅基流动的具体 API 文档调整以下配置
    // 这里使用通用的 LLM API 格式，请根据实际 API 文档修改
    const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions'; // 请确认正确的 API 端点

    try {
        const response = await axios.post(apiUrl, {
            model: 'Qwen/Qwen2.5-7B-Instruct', // 使用硅基流动支持的模型
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30秒超时
        });

        // 根据实际 API 响应结构调整
        return response.data.choices[0].message.content;

    } catch (error) {
        console.error('SiliconFlow API Error:', error.response?.data || error.message);

        if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error('API request failed: No response from server');
        } else {
            throw new Error(`Request setup error: ${error.message}`);
        }
    }
}

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'All origins allowed'}`);
});
