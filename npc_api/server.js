// 加载.env文件中的环境变量
require('dotenv').config();

// 读取API密钥
const API_KEY = process.env.DASHSCOPE_API_KEY;
console.log("当前API密钥状态：", API_KEY ? "已读取" : "读取失败"); // 用于调试

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 加载配置
const config    = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_config.json'), 'utf8'));
const forbidden = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_forbidden.json'), 'utf8'));
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_knowledge.json'), 'utf8'));
const clues     = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_clues.json'), 'utf8')).clues;

// 违禁词检查
function checkForbidden(question) {
  for (let rule of forbidden.forbiddenRuleList) {
    let kws = rule.matchKeywords;
    if (typeof kws === 'string') kws = kws.split(',');
    for (let kw of kws) {
      if (question.includes(kw.trim())) {
        return rule.defaultReply;
      }
    }
  }
  return null;
}

// ======================================
// 通义千问 API（你已经填好 Key 了）
// ======================================
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const QWEN_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const MODEL_NAME = "qwen-plus";

async function callQwen(question, chapter) {
  try {
    const prompt = `
你是白沙宋墓考古领队，专业、严谨、温和、有耐心。
当前场景：${chapter}
回答规则：
1. 不剧透未发现的线索
2. 不编造机关、盗墓、灵异内容
3. 用考古学者语气，简短自然
4. 引导玩家观察现场
玩家问题：${question}
    `.trim();

    const resp = await axios.post(QWEN_API_URL, {
      model: MODEL_NAME,
      input: { messages: [{ role: "user", content: prompt }] },
      parameters: { result_format: "message" }
    }, {
      headers: {
        "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return resp.data.output.choices[0].message.content.trim();
  } catch (e) {
    console.error("AI 错误:", e);
    return "我需要先看看现场情况，你再仔细观察一下周围。";
  }
}

// ==========================
// 最终接口：全量走 AI
// ==========================
app.post('/api/ask', async (req, res) => {
  const { currentChapter, question } = req.body;

  // 1. 违禁直接拦截（重要！保证游戏不乱套）
  const forbid = checkForbidden(question);
  if (forbid) return res.json({ reply: forbid });

  // 2. 所有问题 → 直接发给 AI！
  const aiAnswer = await callQwen(question, currentChapter);
  res.json({ reply: aiAnswer });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ AI NPC 服务已启动：http://localhost:3000");
});