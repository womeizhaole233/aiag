// 加载环境变量
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// 全局中间件
app.use(cors());
app.use(express.json());

// ===================== 全局加载配置（启动仅读取一次） =====================
const forbiddenRule = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_forbidden.json'), 'utf8'));
const npcConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_config.json'), 'utf8'));
const knowledgeBase = JSON.parse(fs.readFileSync(path.join(__dirname, 'npc_knowledge.json'), 'utf8'));
const allClues = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_clues.json'), 'utf8')).clues;

// ===================== 工具函数 =====================
/** 全局通用违禁词拦截（固定红线，仅拦截灵异/机关/索要答案/技术问题等） */
function checkForbidden(question) {
  const q = question.trim();
  for (const rule of forbiddenRule.forbiddenRuleList) {
    let kws = rule.matchKeywords;
    if (typeof kws === 'string') kws = kws.split(',');
    for (const kw of kws) {
      const word = kw.trim();
      if (word && q.includes(word)) {
        return rule.defaultReply;
      }
    }
  }
  return null;
}

/** 本地知识库匹配（优先本地固定答案） */
function matchLocalKnowledge(question, chapter) {
  const q = question.trim().toLowerCase();
  // 章节专属问答
  if (knowledgeBase[chapter] && Array.isArray(knowledgeBase[chapter])) {
    for (const item of knowledgeBase[chapter]) {
      for (const qText of item.questions) {
        if (q.includes(qText.toLowerCase())) {
          return {
            answer: item.answer,
            tip: item.tip || ''
          };
        }
      }
    }
  }
  // 通用操作&术语
  if (knowledgeBase['通用操作&术语'] && Array.isArray(knowledgeBase['通用操作&术语'])) {
    for (const item of knowledgeBase['通用操作&术语']) {
      for (const qText of item.questions) {
        if (q.includes(qText.toLowerCase())) {
          return {
            answer: item.answer,
            tip: item.tip || ''
          };
        }
      }
    }
  }
  return null;
}

// ===================== AI 调用函数 =====================
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const QWEN_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
const MODEL_NAME = "qwen-plus";

async function callQwen(question, currentChapter) {
  // 整理当前章节所有线索名称，提供给AI做参考范围
  const chapterClueNames = [];
  for (const key in allClues) {
    const clue = allClues[key];
    if (clue.chapter === currentChapter) {
      chapterClueNames.push(clue.name);
    }
  }

  // 完整强约束Prompt：防剧透 + 口头禅自主使用 + 人设 + 规则
  const persona = `
【人物基础信息】
姓名：${npcConfig.name}，年龄：${npcConfig.age}，身份：${npcConfig.identity}
个人背景：${npcConfig.birthBackground}
从业经历：${npcConfig.experience}

【人物性格&说话风格】
性格：${npcConfig.character}
语言风格：${npcConfig.languageStyle}，全程使用短句，语气平淡克制，情绪平稳。

【常用语库&使用规则（重点）】
你的常用台词分为多类，仅在**匹配当前对话语境**时酌情选用：
${JSON.stringify(npcConfig.commonPhrases)}
使用要求：
1. 不要每句话都添加口头禅，仅在合适场景自然使用；
2. 是非类短句（对、不对）谨慎使用，避免和回答内容冲突；
3. 结合问题场景选择对应台词，禁止生硬堆砌。

【当前工作场景】
当前所处考古章节：${currentChapter}
本章节可解答的线索范围：${chapterClueNames.join('、') || '本章暂无线索'}

【绝对强制规则（必须100%遵守）】
1. 章节边界规则：你**只能回答当前【${currentChapter}】章节相关问题**。
   但凡涉及其他章节、未开放区域、终章、墓外内容，一律拒绝回答，固定回复："该区域暂未开放，请先专注于当前章节的观察。"
2. 内容规则：仅依据上面给出的本章线索作答，严禁编造考古内容、机关、密室、灵异故事。
3. 答疑规则：只做轻提示，不直接给出推理结论、墓主、年代、通关答案。
4. 篇幅规则：回答字数控制在30~120字，优先短句，不写长篇大论。

玩家提问：${question}
  `.trim();

  try {
    const resp = await axios.post(QWEN_API_URL, {
      model: MODEL_NAME,
      input: { messages: [{ role: "user", content: persona }] },
      parameters: { result_format: "message" }
    }, {
      headers: {
        "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 8000
    });

    let aiReply = resp.data.output.choices[0].message.content.trim();
    // 超长内容截断兜底
    if (aiReply.length > 120) aiReply = aiReply.slice(0, 120);
    return aiReply;
  } catch (err) {
    console.error("AI 调用异常：", err.message);
    return "先别急，再仔细观察现场，把记录整理清楚再说。";
  }
}

// ===================== 核心接口（保持原有入参、前端无需改动） =====================
app.post('/api/ask', async (req, res) => {
  try {
    const { currentChapter, question } = req.body;
    const userQ = question.trim();

    // 空问题拦截
    if (!userQ) {
      return res.json({ reply: "把问题说清楚，再开始询问。" });
    }

    // 第一层：全局通用违禁词拦截（灵异/机关/索要答案/技术问题等）
    const forbidRes = checkForbidden(userQ);
    if (forbidRes) {
      return res.json({ reply: forbidRes });
    }

    // 第二层：优先匹配本地知识库（固定问答，不走AI）
    const localRes = matchLocalKnowledge(userQ, currentChapter);
    if (localRes) {
      const fullText = localRes.tip ? `${localRes.answer} ${localRes.tip}` : localRes.answer;
      return res.json({ reply: fullText });
    }

    // 第三层：调用AI（章节判断、口头禅、全部由AI自主控制）
    const aiReply = await callQwen(userQ, currentChapter);
    return res.json({ reply: aiReply });

  } catch (err) {
    console.error("服务异常：", err);
    return res.json({ reply: "现场记录暂时中断，请稍后再询问。" });
  }
});

// 服务启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ AI NPC 服务已启动：http://localhost:3000");
});