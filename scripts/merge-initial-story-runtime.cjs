const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BRANCH = "origin/初始版本";
const STORY_FILE = path.join("data", "story-vn.js");

const STATIC_IMAGE_MAP = new Map([
  ["楔子", "prologue"],
  ["第一章  墓外", "chapter-1"],
  ["第二章  墓门", "tomb-gate"],
  ["第三章  甬道", "corridor"],
  ["第四章 前室", "front-chamber"],
]);

const PORTRAIT_FALLBACK = new Map([
  ["粟柏年.png", "粟柏年2.png"],
]);

const FRONT_BG = {
  top: "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
  east: "assets/M1/04_前室_东壁/第一号墓前室东壁壁画(原色版，彭华士摄).png",
  west: "assets/M1/05_前室_西壁/. 第一号墓前室西壁壁画(原色版，彭华士摄).png",
  south: "assets/M1/06_前室_南壁/第一号墓前室南壁壁画.png",
  north: "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
};

const PASSAGE_BG = {
  main: "assets/M1/09_过道/第一号墓过道东壁.png",
  inscription: "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
  window: "assets/M1/09_过道/插图九 第一号墓过道两壁的破子棂窗.png",
  roof: "assets/M1/09_过道/第一号墓前室、过道顶一一丁字盗顶式宝盖(原色版，彭华士摄).png",
  entry: "assets/M1/09_过道/第一号墓过道北壁下部一一后室入口.png",
};

const REAR_BG = {
  overview: "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
  north: "assets/M1/10_后室_北壁/第一号墓后室北壁(原色版，彭华士摄).png",
  falseDoor: "assets/M1/10_后室_北壁/第一号墓后室北壁假门外的妇女雕像.png",
  south: "assets/M1/11_后室_南壁/第一号墓后室南壁一一后室入口背面.png",
  bones: "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
  bonePosition: "assets/M1/16_出土器物与人骨/第一号墓人骨在葬具中的位置.png",
  east: "assets/M1/12_后室_东壁与东南壁/第一号墓后室东南壁壁画.png",
  southwest: "assets/M1/13_后室_西壁与西南壁/后室西南壁陈设组合图.png",
  northeast: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室东北壁.png",
  northwest: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁.png",
  top: "assets/M1/15_后室_顶部隅角及其他/第一号墓后室顶.png",
  relic: "assets/M1/16_出土器物与人骨/地券.png",
};

function gitShow(repoPath, encoding = "utf8") {
  const data = gitBlob(repoPath);
  if (!data) throw new Error(`Missing blob: ${repoPath}`);
  return encoding ? data.toString(encoding) : data;
}

function gitShowMaybe(repoPath) {
  return gitBlob(repoPath);
}

function gitRev() {
  return execFileSync("git", ["rev-parse", BRANCH], { encoding: "utf8" }).trim();
}

let blobIndex = null;

function getBlobIndex() {
  if (blobIndex) return blobIndex;
  const raw = execFileSync("git", ["ls-tree", "-r", "-z", BRANCH], { encoding: "utf8" });
  blobIndex = new Map();
  for (const entry of raw.split("\0")) {
    if (!entry) continue;
    const tab = entry.indexOf("\t");
    if (tab < 0) continue;
    const meta = entry.slice(0, tab).split(" ");
    const repoPath = entry.slice(tab + 1);
    const objectId = meta[2];
    blobIndex.set(repoPath, objectId);
  }
  return blobIndex;
}

function gitBlob(repoPath) {
  const objectId = getBlobIndex().get(repoPath);
  if (!objectId) return null;
  return execFileSync("git", ["cat-file", "-p", objectId], { maxBuffer: 128 * 1024 * 1024 });
}

function extractAssignedObject(source, variableName) {
  const marker = source.indexOf(`${variableName} =`);
  if (marker < 0) throw new Error(`${variableName} assignment not found`);
  const start = source.indexOf("{", marker);
  if (start < 0) throw new Error(`${variableName} object start not found`);

  let depth = 0;
  let quote = null;
  let triple = false;
  let escaped = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next3 = source.slice(i, i + 3);

    if (quote) {
      if (triple) {
        if (next3 === quote.repeat(3)) {
          i += 2;
          quote = null;
          triple = false;
        }
        continue;
      }
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (next3 === '"""' || next3 === "'''") {
      quote = ch;
      triple = true;
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`${variableName} object end not found`);
}

function pythonLiteralToJs(literal) {
  let output = literal.replace(/"""([\s\S]*?)"""/g, (_, body) => JSON.stringify(body));
  output = output.replace(/'''([\s\S]*?)'''/g, (_, body) => JSON.stringify(body));
  output = output.replace(/^\s*#.*$/gm, "");
  output = output.replace(/\bNone\b/g, "null");
  output = output.replace(/\bTrue\b/g, "true");
  output = output.replace(/\bFalse\b/g, "false");
  return output;
}

function loadInitialDialogues() {
  const source = gitShow("baisha_chenyan/generated_dialogues_v2.py");
  const literal = extractAssignedObject(source, "DIALOGUES");
  return Function(`"use strict"; return (${pythonLiteralToJs(literal)});`)();
}

function loadInitialOverrides() {
  return JSON.parse(gitShow("baisha_chenyan/content_overrides.json"));
}

function loadCurrentPayload() {
  const text = fs.readFileSync(STORY_FILE, "utf8");
  const match = text.match(/window\.M1_STORY_DATA\s*=\s*(\{[\s\S]*\})\s*;\s*\}\)\(\);/);
  if (!match) throw new Error("Unable to extract M1_STORY_DATA payload");
  return JSON.parse(match[1]);
}

function writePayload(payload) {
  const text = `(() => {\n  window.M1_STORY_DATA = ${JSON.stringify(payload, null, 2)};\n})();\n`;
  fs.writeFileSync(STORY_FILE, text, "utf8");
}

function initialEffective(dialogues, overrides, nodeId) {
  const node = { ...dialogues[nodeId] };
  const override = overrides[nodeId];
  if (!override || typeof override !== "object") return node;
  const fieldMap = {
    speaker: "speaker",
    text: "text",
    bg: "background_image",
    background_position: "background_position",
    portrait: "portrait",
    portrait_position: "portrait_position",
    next: "next",
    choices: "choices",
  };
  for (const [sourceKey, targetKey] of Object.entries(fieldMap)) {
    if (Object.prototype.hasOwnProperty.call(override, sourceKey) && override[sourceKey] != null) {
      node[targetKey] = override[sourceKey];
    }
  }
  return node;
}

function buildCurrentMapping(payload) {
  const mapping = new Map();
  for (let index = 1; index <= 59; index += 1) {
    mapping.set(`n${String(index).padStart(5, "0")}`, `op_${String(index - 1).padStart(3, "0")}`);
  }
  for (const item of payload.initialVersionMerge?.mapping || []) {
    if (!item.includes("->")) continue;
    const [source, dest] = item.split("->", 2);
    mapping.set(source, dest);
  }
  return mapping;
}

function mapNodeId(nodeId, mapping) {
  if (!nodeId) return null;
  return mapping.get(nodeId) || nodeId;
}

function copyStaticAsset(staticPath, destPath) {
  const data = gitShowMaybe(`baisha_chenyan/${staticPath}`);
  if (!data) return false;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  if (!fs.existsSync(destPath) || !fs.readFileSync(destPath).equals(data)) {
    fs.writeFileSync(destPath, data);
    return true;
  }
  return false;
}

function normalizeRuntimeAsset(runtimePath, copied, missing) {
  if (!runtimePath) return null;
  const normalized = runtimePath.replace(/\\/g, "/").replace(/^\/+/, "");

  if (normalized.startsWith("static/images/portraits/")) {
    const rawName = normalized.split("/").pop();
    const name = PORTRAIT_FALLBACK.get(rawName) || rawName;
    const dest = `assets/story/portraits/initial/${name}`;
    if (!fs.existsSync(dest)) {
      if (copyStaticAsset(`static/images/portraits/${name}`, dest)) copied.add(dest);
    }
    if (!fs.existsSync(dest)) missing.push(`${normalized} -> ${dest}`);
    return dest;
  }

  if (normalized.startsWith("static/images/")) {
    const rest = normalized.slice("static/images/".length);
    const slash = rest.indexOf("/");
    if (slash > 0) {
      const folder = rest.slice(0, slash);
      const fileName = rest.slice(slash + 1);
      if (STATIC_IMAGE_MAP.has(folder)) {
        const dest = `assets/story/backgrounds/${STATIC_IMAGE_MAP.get(folder)}/${fileName}`;
        if (copyStaticAsset(normalized, dest)) copied.add(dest);
        if (!fs.existsSync(dest)) {
          missing.push(`${normalized} -> ${dest}`);
          return null;
        }
        return dest;
      }
    }
  }

  return normalized;
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function chooseFrontBackground(body) {
  if (hasAny(body, ["藻井", "藻顶", "穹窿顶", "顶部", "铺作", "起翘", "补间"])) return FRONT_BG.top;
  if (hasAny(body, ["东壁", "女乐", "乐伎", "排箫", "琵琶", "舞"])) return FRONT_BG.east;
  if (hasAny(body, ["西壁", "砖砌", "高瓶", "注子", "瓶座", "夫妇对坐", "西室入口"])) return FRONT_BG.west;
  if (hasAny(body, ["南壁", "壁函", "骨朵"])) return FRONT_BG.south;
  if (hasAny(body, ["北壁", "屏风", "永安", "夫妇"])) return FRONT_BG.north;
  return FRONT_BG.east;
}

function choosePassageBackground(body) {
  if (hasAny(body, ["题记", "赵大翁", "元符", "纪年"])) return PASSAGE_BG.inscription;
  if (hasAny(body, ["破子棂", "棂窗", "窗"])) return PASSAGE_BG.window;
  if (hasAny(body, ["丁字", "宝盖", "顶部"])) return PASSAGE_BG.roof;
  if (body.includes("后室入口")) return PASSAGE_BG.entry;
  return PASSAGE_BG.main;
}

function chooseRearBackground(body) {
  if (hasAny(body, ["假门", "启门", "门微启", "妇女", "女子"])) return REAR_BG.falseDoor;
  if (hasAny(body, ["人骨", "头骨", "骨骼", "骨片", "铁钉", "棺", "迁葬"])) {
    return hasAny(body, ["位置", "并列", "混堆", "葬具"]) ? REAR_BG.bonePosition : REAR_BG.bones;
  }
  if (hasAny(body, ["地券", "朱书", "水渍", "府库", "铜筒", "素帛", "绢帛"])) return REAR_BG.relic;
  if (hasAny(body, ["南壁", "后室入口", "高几"])) return REAR_BG.south;
  if (hasAny(body, ["东北", "灯菜"])) return REAR_BG.northeast;
  if (hasAny(body, ["西北", "剪刀", "熨斗"])) return REAR_BG.northwest;
  if (hasAny(body, ["东南壁", "东壁"])) return REAR_BG.east;
  if (hasAny(body, ["西南", "镜台", "曲足", "杌"])) return REAR_BG.southwest;
  if (hasAny(body, ["顶部", "室顶", "铺作"])) return REAR_BG.top;
  if (body.includes("北壁")) return REAR_BG.north;
  return REAR_BG.overview;
}

function correctedBackground(sourceNodeId, body, currentBg) {
  const number = Number(sourceNodeId.slice(1));
  if (number >= 181 && number <= 202) return chooseFrontBackground(body);
  if (number >= 203 && number <= 219) return choosePassageBackground(body);
  if (number >= 220 && number <= 261) return chooseRearBackground(body);
  return currentBg;
}

function main() {
  const dialogues = loadInitialDialogues();
  const overrides = loadInitialOverrides();
  const payload = loadCurrentPayload();
  const mapping = buildCurrentMapping(payload);
  const copied = new Set();
  const missing = [];
  let refreshed = 0;
  let corrected = 0;

  for (const [sourceNodeId, destNodeId] of mapping.entries()) {
    if (!dialogues[sourceNodeId] || !payload.nodes[destNodeId]) continue;
    const source = initialEffective(dialogues, overrides, sourceNodeId);
    const node = payload.nodes[destNodeId];

    node.speaker = source.speaker === "系统" ? "旁白" : source.speaker || "";
    node.body = source.text || "";
    node.choices = (source.choices || []).map((choice) => ({
      text: choice.text || "",
      next: mapNodeId(choice.next, mapping),
    }));
    node.next = mapNodeId(source.next, mapping);
    node.puzzle = source.puzzle || null;

    const normalizedBg = normalizeRuntimeAsset(source.background_image, copied, missing);
    const fixedBg = correctedBackground(sourceNodeId, node.body, normalizedBg || node.backgroundImage || null);
    if (fixedBg !== normalizedBg) corrected += 1;
    node.backgroundImage = fixedBg;

    const portrait = normalizeRuntimeAsset(source.portrait, copied, missing);
    if (portrait) {
      node.portrait = portrait;
    } else if (payload.speakerPortraits?.[node.speaker]) {
      node.portrait = payload.speakerPortraits[node.speaker];
    } else {
      node.portrait = null;
    }

    node.portraitPosition = "left";
    if (source.background_position) {
      node.backgroundPosition = source.background_position;
    } else {
      delete node.backgroundPosition;
    }
    refreshed += 1;
  }

  payload.initialVersionMerge = payload.initialVersionMerge || {};
  payload.initialVersionMerge.sourceCommit = gitRev();
  payload.initialVersionMerge.visualOverridesAppliedOn = "2026-06-25";
  payload.initialVersionMerge.repairNote = [
    "Re-applied initial branch runtime text and content_overrides.json visual bindings.",
    "Copied referenced static VN images into assets/story.",
    "Corrected chapter 4-6 placeholder/fallback backgrounds to matching M1 assets where the initial branch lacks generated per-node images.",
    "Forced all story portrait positions to the left-side composition slot.",
  ].join(" ");

  writePayload(payload);
  process.stdout.write(`${JSON.stringify({
    refreshedNodes: refreshed,
    copiedAssets: copied.size,
    correctedFallbackBackgrounds: corrected,
    missingAssets: missing,
  }, null, 2)}\n`);
}

main();
