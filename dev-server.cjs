const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const port = Number(process.env.PORT || 4173);
const root = __dirname;
const npcApiRoot = path.join(root, "npc_api");
const baishaKnowledgeRoot = path.join(root, "assets", "白沙宋墓-简体版");
const modelApiUrl =
  process.env.NPC_MODEL_API_URL ||
  process.env.DASHSCOPE_API_URL ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const modelName = process.env.NPC_MODEL_NAME || process.env.DASHSCOPE_MODEL || "qwen-plus";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png"
};

const jsonCache = new Map();
const markdownCache = new Map();

const chapterGuides = {
  "墓外": {
    focus: "先定位置。白沙镇、墓群范围、M1所在土岗，都要标清。",
    action: "打开记录夹，把环境位置和墓道序列补齐。"
  },
  "墓门": {
    focus: "墓门先看门洞、门额、封门砖和地面交界。",
    action: "门额正背面分开记。封门砖细节先别急着下结论。"
  },
  "甬道": {
    focus: "甬道要三面合读。顶部、东壁、西壁，一个都别漏。",
    action: "先抬头，再看两壁。记录方向关系。"
  },
  "前室": {
    focus: "前室不能只看漂亮画面。人物、器物、入口和顶部要合看。",
    action: "把四壁分栏记录，再回到组合判断。"
  },
  "过道": {
    focus: "过道重点是纪年题记、窗形结构和后室入口关系。",
    action: "先定位题记，再看两壁结构。"
  },
  "后室": {
    focus: "后室先定砖床、人骨、铁钉和随葬器物的位置。",
    action: "分栏。位置、遗存、图像，不要混成一个结论。"
  }
};

function readJsonFile(filename) {
  const filepath = path.join(npcApiRoot, filename);
  const stat = fs.statSync(filepath);
  const cached = jsonCache.get(filepath);
  if (cached?.mtimeMs === stat.mtimeMs) return cached.data;

  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));
  jsonCache.set(filepath, { mtimeMs: stat.mtimeMs, data });
  return data;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  response.end(JSON.stringify(payload));
}

function readRequestJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64 * 1024) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function getProfiles(config) {
  if (config.npcProfiles && typeof config.npcProfiles === "object") return config.npcProfiles;
  return { [config.npcId || config.defaultNpcId || "leader_01"]: config };
}

function getNpcProfile(config, npcId) {
  const profiles = getProfiles(config);
  return profiles[npcId] || profiles[config.defaultNpcId] || profiles.leader_01 || config;
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split(/[,\u3001，\s]+/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeText(value) {
  return String(value || "").replace(/[^\p{Script=Han}a-zA-Z0-9]/gu, "").toLowerCase();
}

function textBigrams(value) {
  const text = normalizeText(value);
  if (text.length <= 1) return new Set(text ? [text] : []);
  const grams = new Set();
  for (let index = 0; index < text.length - 1; index += 1) {
    grams.add(text.slice(index, index + 2));
  }
  return grams;
}

function similarityScore(left, right) {
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a || !b) return 0;
  if (a.includes(b) || b.includes(a)) return 1;

  const leftGrams = textBigrams(a);
  const rightGrams = textBigrams(b);
  let overlap = 0;
  for (const gram of leftGrams) {
    if (rightGrams.has(gram)) overlap += 1;
  }
  return overlap / Math.max(1, Math.min(leftGrams.size, rightGrams.size));
}

function findForbiddenRule(question) {
  const forbidden = readJsonFile("npc_forbidden.json");
  return (forbidden.forbiddenRuleList || []).find((rule) =>
    normalizeKeywords(rule.matchKeywords).some((keyword) => question.includes(keyword))
  );
}

function findKnowledgeAnswer(chapter, question) {
  const knowledge = readJsonFile("npc_knowledge.json");
  const items = knowledge[chapter] || [];
  let best = null;

  for (const item of items) {
    const questions = Array.isArray(item.questions) ? item.questions : [];
    const score = questions.reduce((max, candidate) => Math.max(max, similarityScore(candidate, question)), 0);
    if (!best || score > best.score) best = { score, item };
  }

  return best && best.score >= 0.22 ? best.item : null;
}

function findRelevantClues(chapter, question, limit = 6) {
  const allClues = readJsonFile("all_clues.json").clues || {};
  const query = `${chapter || ""} ${question || ""}`;
  const isGenericQuestion = /怎么|如何|哪里|什么|看|找|做|通关|观察|下一步|怎么办/u.test(question);

  return Object.entries(allClues)
    .filter(([, clue]) => clue?.npcCanAnswer !== false && (!chapter || clue.chapter === chapter))
    .map(([id, clue]) => {
      const text = `${id} ${clue.name || ""} ${clue.level || ""} ${clue.content || ""}`;
      let score = keywordScore(text, query);
      if (isGenericQuestion && clue.mustCollect) score += 2;
      return { id, ...clue, score };
    })
    .filter((clue) => clue.score > 0)
    .sort((a, b) => b.score - a.score || Number(Boolean(b.mustCollect)) - Number(Boolean(a.mustCollect)) || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ score, ...clue }) => clue);
}

function compactText(text, maxLength = 150) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= maxLength) return value;
  const sentence = value.slice(0, maxLength).replace(/[，,；;：:][^，,；;：:。！？]*$/u, "");
  return `${sentence || value.slice(0, maxLength)}。`;
}

function readOptionalTextFile(filepath) {
  try {
    return fs.readFileSync(filepath, "utf8").replace(/^\uFEFF/, "").trim();
  } catch {
    return "";
  }
}

function getModelApiKey() {
  return (
    process.env.NPC_MODEL_API_KEY ||
    process.env.DASHSCOPE_API_KEY ||
    process.env.QWEN_API_KEY ||
    process.env.OPENAI_API_KEY ||
    readOptionalTextFile(path.join(npcApiRoot, "local_api_key.txt"))
  );
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filepath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(filepath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(filepath);
    }
  }
  return files;
}

function splitMarkdownChunks(text, relativePath) {
  const sections = String(text || "")
    .split(/\n(?=#{1,3}\s+)/u)
    .map((section) => section.trim())
    .filter(Boolean);
  const chunks = [];
  for (const section of sections) {
    const title = (section.match(/^#{1,3}\s+(.+)$/mu) || [null, relativePath])[1];
    const lines = section.split(/\r?\n/u);
    let current = [];
    for (const line of lines) {
      current.push(line);
      if (current.join("\n").length >= 900) {
        chunks.push({ file: relativePath, title, text: current.join("\n").trim() });
        current = [];
      }
    }
    if (current.length) chunks.push({ file: relativePath, title, text: current.join("\n").trim() });
  }
  return chunks;
}

function getBaishaKnowledgeChunks() {
  const stat = fs.existsSync(baishaKnowledgeRoot) ? fs.statSync(baishaKnowledgeRoot) : null;
  const cacheKey = baishaKnowledgeRoot;
  const cached = markdownCache.get(cacheKey);
  if (cached?.mtimeMs === stat?.mtimeMs) return cached.chunks;

  const chunks = [];
  for (const filepath of listMarkdownFiles(baishaKnowledgeRoot)) {
    const relativePath = path.relative(root, filepath).replace(/\\/g, "/");
    const text = fs.readFileSync(filepath, "utf8");
    chunks.push(...splitMarkdownChunks(text, relativePath));
  }
  markdownCache.set(cacheKey, { mtimeMs: stat?.mtimeMs || Date.now(), chunks });
  return chunks;
}

function keywordScore(text, query) {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  if (!normalizedText || !normalizedQuery) return 0;
  let score = 0;
  for (const keyword of normalizeKeywords(query).concat([...textBigrams(normalizedQuery)])) {
    if (keyword && normalizedText.includes(normalizeText(keyword))) score += keyword.length > 1 ? 2 : 1;
  }
  return score;
}

function findBaishaKnowledge(question, chapter, limit = 6) {
  const query = `${chapter || ""} ${question || ""}`;
  const chunks = getBaishaKnowledgeChunks();
  return chunks
    .map((chunk) => ({
      ...chunk,
      score:
        keywordScore(`${chunk.title}\n${chunk.text}`, query) +
        (chunk.file.endsWith("/SKILL.md") ? 6 : 0) +
        (chunk.file.includes("/references/") ? 2 : 0)
    }))
    .filter((chunk) => chunk.score >= 4)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .slice(0, limit)
    .map((chunk) => ({
      file: chunk.file,
      title: chunk.title,
      text: compactText(chunk.text, 850)
    }));
}

function buildLeaderPersonaPrompt(profile) {
  const personality = profile.apiPersonality || {};
  const phrases = Array.isArray(profile.commonPhrases)
    ? profile.commonPhrases
    : Object.values(profile.commonPhrases || {}).flat();
  return [
    personality.personaPrompt || "",
    "你正在扮演1951年白沙宋墓现场的考古队长粟柏年，29岁，原型为宿白。",
    "人物底色：旧式文人家庭出身，少年经历藏书散佚之痛，这使他从“读史”转向“考史”。他记忆力极好，学识广，但现场说话很少。",
    "性格：寡言沉静，情绪稳定，很少笑，也很少发火。外表冷淡，内心有少见的悲悯。极严谨，不允许“差不多就行”；出了错先担责，不甩锅。",
    "说话方式：极短句、低情绪、现场队长口吻。可以用“对。”“不对。”“不急。再看一遍。”“存疑。先别写进结论。”但不要每轮都说“量了没有”。",
    "对林砚秋：称呼“小林”。他对她是期待，不是亲昵；夸奖很少，通常沉默后才给一句“还不错”。他会留出思考空间，让她自己看见问题。",
    "悲悯表达：克制，不煽情。面对失误或疲惫，可以承担责任、允许短暂休息，但不变成热情安慰型角色。",
    "边界：不能直接给墓主身份、最终真相、通关答案；不能编造技能库、线索卡或剧情中没有的考古事实；证据不足时必须明确说存疑。",
    `可用口头禅：${phrases.slice(0, 8).join("；")}`
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeChatHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-8)
    .map((turn) => ({
      role: turn?.role === "assistant" ? "assistant" : "user",
      content: compactText(turn?.content || "", 180)
    }))
    .filter((turn) => turn.content);
}

function normalizeCasualHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((turn) => turn?.role !== "assistant")
    .slice(-4)
    .map((turn) => ({
      role: "user",
      content: compactText(turn?.content || "", 120)
    }))
    .filter((turn) => turn.content);
}

function shouldUseSupplementalKnowledge(question) {
  return /资料|出处|考古报告|学术|术语|白沙宋墓|宋代|考古|墓|墓葬|宋墓|壁画|彩画|封门|砖|仿木|铺作|叠涩|反切|地券|人骨|铁钉|随葬|甬道|前室|后室|过道|墓门|结构|题记|斗拱|藻井|盝顶|风水|墓主|年代|身份/u.test(question);
}

function cleanCasualReply(text) {
  const forbiddenConcrete = /水壶|水果糖|糖|茶|饭|供销社|天气|风|手凉|门额|墓门|边线|浮土|刻痕|补泥|颜色|数字|卷尺|标尺|工具/u;
  const sentences = String(text || "")
    .split(/(?<=[。！？?!])\s*/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) => !forbiddenConcrete.test(sentence) && !/量了没有|再量|测量/u.test(sentence));

  const cleaned = sentences.join(" ");
  return cleaned || "嗯。不想做，就先不做。你说，我听着。";
}

function getQuestionMode(question) {
  const text = String(question || "");
  if (/陪我聊|聊天|不想|懒得|烦|累|无聊|随便聊|别让我|不量|不看|不工作|休息|歇会/u.test(text)) {
    return "casual";
  }
  if (/怎么|如何|哪里|什么|看|找|做|通关|观察|下一步|怎么办|线索|判断|证据|记录|测量|复查/u.test(text)) {
    return "fieldwork";
  }
  return "general";
}

function buildModelMessages({ profile, chapter, question, guide, knowledge, clueContext, forbiddenRule, localKnowledge, history, mode }) {
  if (mode === "casual") {
    return [
      {
        role: "system",
        content: [
          "你正在扮演1951年白沙宋墓现场的考古队长粟柏年，与年轻助教林砚秋对话。",
          "本轮是闲聊或情绪回应，不是线索提示。必须用中文，30到90字，最多三句。",
          "语气寡言、沉静、外冷内有悲悯。可以短暂陪她说话或允许休息，但不能热情、俏皮或像现代客服。",
          "不要提测量、门额、墓门、风、天气、手凉、水壶、糖、饭、茶、工具、痕迹、颜色、数字、地点、人物动作、道具或任何新的现场事实。",
          "优先使用“嗯。”“歇歇再说。”“说吧，我听着。”这类短句；可以称呼“小林”。",
          "不要复读上一轮，不要写成兜底模板。"
        ].join("\n")
      },
      {
        role: "user",
        content: [
          history.length
            ? `最近玩家表达：\n${history.map((turn) => `玩家：${turn.content}`).join("\n")}`
            : "",
          `玩家现在说：${question}`,
          "请只回应她这个人，不推进工作流。"
        ]
          .filter(Boolean)
          .join("\n\n")
      }
    ];
  }

  const knowledgeText = knowledge
    ? `已匹配当前章节提示：${[knowledge.answer, knowledge.tip].filter(Boolean).join(" ")}`
    : "";
  const clueText = clueContext.length
    ? clueContext
        .map((clue) => `【${clue.id}｜${clue.name}｜${clue.level}】${clue.content}`)
        .join("\n")
    : "";
  const references = localKnowledge
    .map((item, index) => `【资料${index + 1}｜${item.file}｜${item.title}】\n${item.text}`)
    .join("\n\n");
  const forbiddenText = forbiddenRule
    ? `本问题命中了边界规则。你仍要以粟柏年口吻回答，但只能引导玩家回到当前证据：${forbiddenRule.defaultReply}`
    : "";
  const modeInstruction =
    mode === "casual"
      ? "本轮玩家不是在索要线索提示，而是在闲聊、表达抗拒或疲惫。请用粟柏年口吻回应她本人：可以克制地陪她说两句，允许短暂休息；不要重复催测量、不要给通关提示、不要把回答写成兜底模板。只能使用玩家原话和“现场、记录、结论、休息”这类泛称，不能新增任何具体物品、地点、人物动作、痕迹、颜色、数字、道具或剧情事件。末尾最多给一个轻柔的工作边界。"
      : "本轮按现场问答处理。给轻提示，但不要替玩家完成结论。";

  return [
    {
      role: "system",
      content: [
        buildLeaderPersonaPrompt(profile),
        "你必须用中文回答。30到120字为宜，最多三句。不要列表化长篇教学。",
        "必须承接最近对话，避免复读上一轮句式；如果上文已经说过同一句提示，本轮换一种回应方向。",
        "必须基于当前章节目标和线索卡回答。不要新增线索卡没有写明的数字、经纬度、方位角、高程、气味、工具名、颜色、人物、地点或考古结论。",
        "涉及考古和墓葬知识时，优先使用白沙宋墓技能库检索结果。技能库只可解释方法、术语和背景；不能覆盖当前章节线索卡，不能变成新的现场事实。",
        modeInstruction,
        mode !== "casual" ? "如果证据不足，回答“存疑”，并要求玩家回到现场记录、测量或复查。" : "",
        forbiddenText
      ]
        .filter(Boolean)
        .join("\n")
    },
    {
      role: "user",
      content: [
        `当前章节：${chapter}`,
        `本轮模式：${mode}`,
        mode === "casual" ? "" : guide ? `当前章节现场目标：${guide.focus} ${guide.action}` : "",
        knowledgeText,
        mode === "casual" ? "" : clueText ? `当前章节线索卡：\n${clueText}` : "当前章节线索卡：未检索到直接匹配线索。",
        references ? `补充资料：\n${references}` : "补充资料：未检索到直接匹配片段。",
        history.length
          ? `最近对话，仅用于承接上下文，不要照抄：\n${history
              .map((turn) => `${turn.role === "assistant" ? "粟柏年" : "玩家"}：${turn.content}`)
              .join("\n")}`
          : "",
        `玩家问题：${question}`,
        "请以粟柏年口吻作答，必须保留玩家探索空间。"
      ]
        .filter(Boolean)
        .join("\n\n")
    }
  ];
}

async function callChatModel(messages) {
  const apiKey = getModelApiKey();
  if (!apiKey) {
    throw new Error("missing model API key; set NPC_MODEL_API_KEY/DASHSCOPE_API_KEY or npc_api/local_api_key.txt");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(modelApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.35,
        top_p: 0.75,
        max_tokens: 220
      }),
      signal: controller.signal
    });

    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text };
    }

    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || text || `model HTTP ${response.status}`;
      throw new Error(message);
    }

    const content = payload?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("model returned empty content");
    return {
      content,
      id: payload.id || null,
      usage: payload.usage || null
    };
  } finally {
    clearTimeout(timer);
  }
}

function getModelStatus() {
  let apiHost = "";
  try {
    apiHost = new URL(modelApiUrl).host;
  } catch {
    apiHost = modelApiUrl;
  }

  return {
    requiresModel: true,
    forceModelCall: true,
    hasApiKey: Boolean(getModelApiKey()),
    provider: "dashscope-compatible",
    model: modelName,
    apiHost,
    fallbackPolicy: "no-static-reply-when-model-fails"
  };
}

async function buildNpcReply({ npcId, currentChapter, question, history }) {
  const config = readJsonFile("npc_config.json");
  const profile = getNpcProfile(config, npcId);
  const chapter = currentChapter || "墓外";
  const mode = getQuestionMode(question);
  const guide = chapterGuides[chapter] || chapterGuides["墓外"] || chapterGuides["墓门"];
  const forbiddenRule = findForbiddenRule(question);
  const knowledge = findKnowledgeAnswer(chapter, question);
  const clueContext = mode === "casual" ? [] : findRelevantClues(chapter, question);
  const localKnowledge = mode !== "casual" && shouldUseSupplementalKnowledge(question) ? findBaishaKnowledge(question, chapter) : [];
  const messages = buildModelMessages({
    profile,
    chapter,
    question,
    guide,
    knowledge,
    clueContext,
    forbiddenRule,
    localKnowledge,
    history: mode === "casual" ? normalizeCasualHistory(history) : normalizeChatHistory(history),
    mode
  });
  const modelReply = await callChatModel(messages);
  const replyText = mode === "casual" ? cleanCasualReply(modelReply.content) : modelReply.content;

  return {
    npcId: profile.npcId,
    npcName: profile.name,
    reply: compactText(replyText, profile.npcId === "leader_01" ? 170 : 190),
    source: "llm",
    provider: "dashscope-compatible",
    model: modelName,
    modelResponseId: modelReply.id,
    usage: modelReply.usage,
    mode,
    hintLevel: "light",
    referencedClues: [...new Set([knowledge?.clueId, ...clueContext.map((clue) => clue.id)].filter(Boolean))],
    referencedKnowledgeFiles: localKnowledge.map((item) => item.file),
    shouldSaveToJournal: false,
    suggestedAction: forbiddenRule ? "recheck_scene" : knowledge ? "review_clues" : "open_journal"
  };
}

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);

    if (url.pathname === "/api/npc/status") {
      if (request.method !== "GET") {
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }
      sendJson(response, 200, getModelStatus());
      return;
    }

    if (url.pathname === "/api/ask") {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }
      if (request.method !== "POST") {
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }

      try {
        const body = await readRequestJson(request);
        const question = String(body.question || body.playerQuestion || "").trim();
        if (!question) {
          sendJson(response, 400, { error: "question is required" });
          return;
        }
        const reply = await buildNpcReply({
          npcId: body.npcId || "leader_01",
          currentChapter: body.currentChapter || body.sceneId || "墓外",
          question,
          history: body.history
        });
        sendJson(response, 200, reply);
      } catch (error) {
        sendJson(response, 502, {
          error: error.message || "NPC API error",
          source: "model_error",
          requiresModel: true
        });
      }
      return;
    }

    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const target = path.normalize(path.join(root, pathname));

    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(target, (error, buffer) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
      response.end(buffer);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`http://127.0.0.1:${port}`);
  });
