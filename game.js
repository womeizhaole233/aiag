const { SAVE_KEY, START_SCENE_ID, SCENES, POSITION_MAP } = window.M1_GAME_DATA;

const state = {
  currentSceneId: START_SCENE_ID,
  currentViewIds: {},
  visitedSceneIds: [],
  visitedViewIds: {},
  completedSceneIds: [],
  completedPuzzleIds: [],
  records: [],
  journalOpen: false,
  pendingNavigation: null
};

const sceneRoot = document.querySelector(".scene");
const sceneImage = document.querySelector(".scene-image");
const hotspotLayer = document.querySelector("#hotspotLayer");
const journalToggle = document.querySelector("#journalToggle");
const journalClose = document.querySelector("#journalClose");
const journalPanel = document.querySelector("#journalPanel");
const journalList = document.querySelector("#journalList");
const messageLayer = document.querySelector("#messageLayer");
const messageKicker = document.querySelector("#messageKicker");
const messageTitle = document.querySelector("#messageTitle");
const messageBody = document.querySelector("#messageBody");
const messageClose = document.querySelector("#messageClose");
const runePuzzleLayer = document.querySelector("#runePuzzleLayer");
const runePuzzleClose = document.querySelector("#runePuzzleClose");
const runePuzzleFeedback = document.querySelector("#runePuzzleFeedback");
const runeSequenceSlots = [...document.querySelectorAll("#runeSequence span")];
const runeOptions = [...document.querySelectorAll(".rune-option")];
const patternPuzzleLayer = document.querySelector("#patternPuzzleLayer");
const patternPuzzleClose = document.querySelector("#patternPuzzleClose");
const patternPuzzleFeedback = document.querySelector("#patternPuzzleFeedback");
const patternTiles = [...document.querySelectorAll(".pattern-tile")];
const inscriptionPuzzleLayer = document.querySelector("#inscriptionPuzzleLayer");
const inscriptionPuzzleClose = document.querySelector("#inscriptionPuzzleClose");
const inscriptionPuzzleFeedback = document.querySelector("#inscriptionPuzzleFeedback");
const inscriptionImageFrame = document.querySelector(".inscription-image-frame");
const inscriptionGlyphs = [...document.querySelectorAll(".inscription-glyph")];
const inscriptionFragmentCards = [...document.querySelectorAll(".inscription-fragment")];
const inscriptionSequenceSlots = [...document.querySelectorAll("#inscriptionSequence span")];
const inscriptionOptions = [...document.querySelectorAll(".inscription-option")];
const inscriptionClear = document.querySelector("#inscriptionClear");
const inscriptionSubmit = document.querySelector("#inscriptionSubmit");
const inscriptionNameHunt = document.querySelector("#inscriptionNameHunt");
const inscriptionNameGlyphs = [...document.querySelectorAll(".inscription-name-glyph")];
const inscriptionNameSlots = [...document.querySelectorAll("#inscriptionNameSlots span")];
const inscriptionReportReview = document.querySelector("#inscriptionReportReview");
const inscriptionErrorLines = [...document.querySelectorAll(".inscription-error-line")];
const inscriptionCorrectionSlots = [...document.querySelectorAll("#inscriptionCorrections span")];
const relicPuzzleLayer = document.querySelector("#relicPuzzleLayer");
const relicPuzzleClose = document.querySelector("#relicPuzzleClose");
const relicPuzzleFeedback = document.querySelector("#relicPuzzleFeedback");
const relicMap = document.querySelector("#relicMap");
const relicMapImage = document.querySelector("#relicMapImage");
const relicOverview = document.querySelector("#relicOverview");
const relicLens = document.querySelector("#relicLens");
const relicMarkerLayer = document.querySelector("#relicMarkerLayer");
const relicCollection = document.querySelector("#relicCollection");
const relicPageTabsRoot = document.querySelector("#relicPageTabs");
const relicHotspotLayer = document.querySelector("#relicHotspotLayer");
const pipePuzzleLayer = document.querySelector("#pipePuzzleLayer");
const pipePuzzleClose = document.querySelector("#pipePuzzleClose");
const pipePuzzleFeedback = document.querySelector("#pipePuzzleFeedback");
const pipeBoard = document.querySelector("#pipeBoard");
const pipeSuccessLayer = document.querySelector("#pipeSuccessLayer");
const pipeSuccessTitle = document.querySelector("#pipeSuccessTitle");
const pipeSuccessText = document.querySelector("#pipeSuccessText");
const pipeClueImage = document.querySelector("#pipeClueImage");
const pipeReplayButton = document.querySelector("#pipeReplayButton");
let positionMapLayer = null;
let runeSequence = [];
let patternStates = [];
let inscriptionSequence = [];
let inscriptionMarks = [];
let inscriptionRevealedChars = [];
let inscriptionNameHuntActive = false;
let inscriptionFoundNameChars = [];
let inscriptionReportReviewActive = false;
let inscriptionMarkedErrors = [];
let currentRelicTarget = null;
let currentRelicPage = "atlas";
let completedRelicTargets = [];
let relicLensPosition = { x: 0.5, y: 0.5, active: false };
let pipeTiles = [];
let currentPipeLevelId = "tombGateTrace";
let pipeSolved = false;

const RUNE_PUZZLE_ID = "tomb_gate_rune_verify";
const RUNE_ANSWER = ["额", "砂", "雾", "门"];
const PATTERN_PUZZLE_ID = "corridor_pattern_align";
const PATTERN_STATES = ["left", "center", "right"];
const PATTERN_LABELS = {
  left: "偏左",
  center: "居中",
  right: "偏右"
};
const INSCRIPTION_PUZZLE_ID = "mg_inscription_reading";
const INSCRIPTION_ANSWER = ["元", "符", "二", "年"];
const INSCRIPTION_FRAGMENT_HINTS = {
  A: "上部横画较清楚，下方两笔向外分开，像年号开头字。",
  B: "上缘残留两组短竖，像竹字头；下部只剩斜笔和点画。",
  C: "只见两道平行短横，周围没有竖画或撇捺。",
  D: "上部有短撇和横画，下方竖画贯穿，末端被色层遮住。"
};
const INSCRIPTION_NAME_CHARS = ["赵", "大", "翁"];
const INSCRIPTION_REPORT_ERRORS = ["owner", "whole"];
const INSCRIPTION_REWARD = {
  id: "passage:inscription_reading_record",
  sceneId: "passage",
  title: "题记辨读记录",
  text: "过道东壁下部题记可辨“元符二年赵大翁布”。它提供 1099 年时间锚点和“赵大翁”称谓，但身份判断仍需后续材料复查。",
  clueIds: ["PASS-P0-01", "PASS-F-01", "PASS-H-02"]
};
const RELIC_PUZZLE_ID = "mg_rear_relic_position";
const RELIC_PAGES = {
  atlas: {
    label: "展开地图",
    type: "overview",
    image: "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
    alt: "第一号墓展开索引图"
  },
  frontEast: {
    label: "前室东壁",
    image: "assets/M1/04_前室_东壁/第一号墓前室东壁壁画(原色版，彭华士摄).png",
    alt: "第一号墓前室东壁壁画"
  },
  frontWest: {
    label: "前室西壁",
    image: "assets/M1/05_前室_西壁/. 第一号墓前室西壁壁画(原色版，彭华士摄).png",
    alt: "第一号墓前室西壁壁画"
  },
  passageEast: {
    label: "过道东壁",
    image: "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
    alt: "第一号墓过道东壁下部壁画和纪年题记"
  },
  rearNorth: {
    label: "后室北壁",
    image: "assets/M1/10_后室_北壁/第一号墓后室北壁(原色版，彭华士摄).png",
    alt: "第一号墓后室北壁"
  },
  rearNorthEast: {
    label: "后室东北壁",
    image: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室东北壁壁画中的灯菜.png",
    alt: "第一号墓后室东北壁壁画中的灯菜"
  },
  rearObjects: {
    label: "后室出土物",
    image: "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
    alt: "第一号墓出土物分布图"
  },
  landDeed: {
    label: "地券近景",
    image: "assets/M1/16_出土器物与人骨/地券.png",
    alt: "第一号墓地券"
  },
  bonesNails: {
    label: "人骨铁钉",
    image: "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
    alt: "第一号墓人骨和部分铁钉"
  }
};
const RELIC_REGIONS = [
  { page: "frontEast", label: "前室东壁", x: 0.18, y: 0.36, w: 0.22, h: 0.22, note: "假门、彩画、门扇" },
  { page: "frontWest", label: "前室西壁", x: 0.18, y: 0.63, w: 0.22, h: 0.22, note: "桌、瓶、注子" },
  { page: "passageEast", label: "过道东壁", x: 0.44, y: 0.5, w: 0.2, h: 0.24, note: "题记、流苏、窗格" },
  { page: "rearNorth", label: "后室北壁", x: 0.72, y: 0.3, w: 0.22, h: 0.2, note: "假门、雕像" },
  { page: "rearNorthEast", label: "后室东北壁", x: 0.74, y: 0.54, w: 0.22, h: 0.18, note: "灯菜细节" },
  { page: "rearObjects", label: "后室出土物", x: 0.7, y: 0.75, w: 0.24, h: 0.17, note: "地券、人骨、铁钉" }
];
const RELIC_ITEMS = [
  { id: "paintedDoor", label: "彩绘假门", page: "frontEast", x: 0.5, y: 0.48, tolerance: 0.16, kind: "door", hint: "前室东壁中部，找对称门扇和门额线条", clueIds: ["FRONT-P0-01"], core: false },
  { id: "brickTable", label: "砖砌桌", page: "frontWest", x: 0.56, y: 0.68, tolerance: 0.11, kind: "table", hint: "前室西壁，留意器物下方偏右的横向桌面", clueIds: ["FRONT-P0-02", "FRONT-P1-02"], core: false },
  { id: "tallBottle", label: "高瓶瓶座", page: "frontWest", x: 0.3, y: 0.39, tolerance: 0.11, kind: "bottle", hint: "前室西壁左上侧，寻找细颈高瓶和下方瓶座", clueIds: ["FRONT-P0-02", "FRONT-H-02"], core: false },
  { id: "inscription", label: "纪年题记", page: "passageEast", x: 0.56, y: 0.74, tolerance: 0.15, kind: "text", hint: "过道东壁下部，找成行墨书文字", clueIds: ["PASS-P0-01", "PASS-P1-01"], core: false },
  { id: "tassel", label: "壁画流苏", page: "passageEast", x: 0.73, y: 0.42, tolerance: 0.15, kind: "tassel", hint: "过道东壁，找悬垂的装饰线穗", clueIds: ["PASS-H-01", "PASS-P1-02"], core: false },
  { id: "womanStatue", label: "妇人启门", page: "rearNorth", x: 0.62, y: 0.5, tolerance: 0.15, kind: "statue", hint: "后室北壁假门外侧，找侧身扶门的人物。它是图像空间悬念，不是可进入的实体入口", clueIds: ["HS-P0-05", "HS-H-03"], core: true },
  { id: "lampDish", label: "灯菜", page: "rearNorthEast", x: 0.5, y: 0.5, tolerance: 0.18, kind: "dish", hint: "后室东北壁，找器皿状的小型灯菜", clueIds: ["HS-P1-03"], core: false },
  { id: "landDeed", label: "地券与券盖", page: "landDeed", x: 0.51, y: 0.55, tolerance: 0.18, kind: "deed", hint: "地券近景，留意朱书券文、券盖和砖质文书边缘", clueIds: ["HS-P0-04"], core: true },
  { id: "bones", label: "二具人骨", page: "bonesNails", x: 0.33, y: 0.46, tolerance: 0.18, kind: "bones", hint: "人骨铁钉图，找砖床偏北的二具人骨位置", clueIds: ["HS-P0-02"], core: true },
  { id: "nails", label: "十九枚铁钉", page: "bonesNails", x: 0.68, y: 0.46, tolerance: 0.16, kind: "nails", hint: "人骨铁钉图，找骨骼周围成组铁钉和葬具范围", clueIds: ["HS-P0-03", "HS-H-02"], core: true }
];
const RELIC_CORE_CLUE_IDS = ["HS-E-01", "HS-E-02", "HS-P0-01", "HS-P0-02", "HS-P0-03", "HS-P0-04", "HS-P0-05", "HS-P1-05", "HS-H-01", "HS-H-02", "HS-H-03"];
const RELIC_ORDER = RELIC_ITEMS.map((item) => item.id);
const RELIC_LABELS = Object.fromEntries(RELIC_ITEMS.map((item) => [item.id, item.label]));
const RELIC_POINTS = Object.fromEntries(RELIC_ITEMS.map((item) => [item.id, item]));
const RELIC_PAGE_ORDER = ["atlas", "frontEast", "frontWest", "passageEast", "rearNorth", "rearNorthEast", "rearObjects", "landDeed", "bonesNails"];
const RELIC_PAGE_TO_REGION = {
  landDeed: "rearObjects",
  bonesNails: "rearObjects"
};
const RELIC_REWARD = {
  id: "rear_chamber:relic_position_record",
  sceneId: "rear_chamber",
  title: "M1遗物定位记录",
  text: "已在展开图册中定位后室位置、多壁面、砖床、人骨、铁钉、地券与假门图像。后室记录进入“遗存、文书、图像、误读降级”复查。",
  clueIds: RELIC_CORE_CLUE_IDS
};
const PIPE_PUZZLE_ID = "tomb_gate_pipe_trace";
const PIPE_DEMO_MODE = false;
const PIPE_DIRECTIONS = ["top", "right", "bottom", "left"];
const PIPE_OPPOSITE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
const PIPE_BASE_CONNECTIONS = {
  empty: [],
  start: ["right"],
  end: ["bottom"],
  straight: ["top", "bottom"],
  corner: ["top", "right"],
  tee: ["top", "right", "bottom"],
  cross: ["top", "right", "bottom", "left"]
};
const PIPE_LEVELS = {
  tombGateTrace: {
    id: "tombGateTrace",
    puzzleId: PIPE_PUZZLE_ID,
    title: "连通墓门暗线",
    instruction: "点击砖缝方块旋转，让左侧的水汽痕迹沿暗线通向右上的残片位置。",
    size: 5,
    start: [0, 2],
    end: [4, 2],
    reward: {
      id: "tomb_gate:pipe_trace_reward",
      sceneId: "tomb_gate",
      title: "地券线索",
      text: "临时线索：砖缝暗线被导通后，一张地券影像被照亮。正式线索图片可在后续替换。",
      image: "assets/M1/16_出土器物与人骨/地券.png",
      successText: "暗线连通后，地券影像被照亮。正式奖励线索可以在这里替换。"
    },
    tiles: [
      [
        { type: "corner", rotation: 90 },
        { type: "straight", rotation: 0 },
        { type: "corner", rotation: 180 },
        { type: "tee", rotation: 270 },
        { type: "corner", rotation: 0 }
      ],
      [
        { type: "tee", rotation: 0 },
        { type: "corner", rotation: 270 },
        { type: "straight", rotation: 0 },
        { type: "corner", rotation: 90 },
        { type: "straight", rotation: 90 }
      ],
      [
        { type: "start", rotation: 0, locked: true },
        { type: "straight", rotation: 0 },
        { type: "corner", rotation: 90 },
        { type: "tee", rotation: 180 },
        { type: "end", rotation: 0, locked: true }
      ],
      [
        { type: "corner", rotation: 180 },
        { type: "tee", rotation: 90 },
        { type: "corner", rotation: 270 },
        { type: "straight", rotation: 0 },
        { type: "corner", rotation: 90 }
      ],
      [
        { type: "straight", rotation: 90 },
        { type: "corner", rotation: 0 },
        { type: "tee", rotation: 270 },
        { type: "corner", rotation: 0 },
        { type: "straight", rotation: 0 }
      ]
    ]
  },
  frontChamberTrace: {
    id: "frontChamberTrace",
    puzzleId: "front_chamber_pipe_trace",
    title: "连通前室暗线",
    instruction: "点击砖缝方块旋转，让线索通向壁画残片。",
    size: 5,
    start: [0, 1],
    end: [4, 3],
    reward: {
      id: "front_chamber:pipe_trace_reward",
      sceneId: "front_chamber",
      title: "壁画残片",
      text: "通关后收录的线索文案。",
      image: "assets/front-west.png",
      successText: "暗线连通后，壁画残片被短暂照亮。"
    },
    tiles: [
      [
        { type: "corner", rotation: 90 },
        { type: "tee", rotation: 180 },
        { type: "straight", rotation: 90 },
        { type: "corner", rotation: 180 },
        { type: "straight", rotation: 0 }
      ],
      [
        { type: "start", rotation: 0, locked: true },
        { type: "corner", rotation: 90 },
        { type: "tee", rotation: 90 },
        { type: "corner", rotation: 270 },
        { type: "corner", rotation: 90 }
      ],
      [
        { type: "straight", rotation: 0 },
        { type: "straight", rotation: 0 },
        { type: "corner", rotation: 0 },
        { type: "straight", rotation: 0 },
        { type: "tee", rotation: 270 }
      ],
      [
        { type: "corner", rotation: 270 },
        { type: "corner", rotation: 0 },
        { type: "corner", rotation: 180 },
        { type: "straight", rotation: 90 },
        { type: "end", rotation: 90, locked: true }
      ],
      [
        { type: "straight", rotation: 90 },
        { type: "corner", rotation: 0 },
        { type: "tee", rotation: 180 },
        { type: "straight", rotation: 90 },
        { type: "corner", rotation: 270 }
      ]
    ]
  }
};

function getCurrentScene() {
  return SCENES[state.currentSceneId] || SCENES[START_SCENE_ID];
}

function getDefaultViewId(scene) {
  if (!scene.views) return null;
  return scene.startViewId || Object.keys(scene.views)[0] || null;
}

function getCurrentView() {
  const scene = getCurrentScene();
  if (!scene.views) {
    return {
      id: scene.id,
      title: scene.title,
      image: scene.image,
      hotspots: scene.hotspots || []
    };
  }

  const viewId = state.currentViewIds[scene.id] || getDefaultViewId(scene);
  return scene.views[viewId] || scene.views[getDefaultViewId(scene)];
}

function getView(sceneId, viewId) {
  const scene = SCENES[sceneId];
  if (!scene?.views) return null;
  return scene.views[viewId] || null;
}

function hasRecord(recordId) {
  return state.records.some((record) => record.id === recordId);
}

function hasCompletedScene(sceneId) {
  return state.completedSceneIds.includes(sceneId);
}

function hasCompletedPuzzle(puzzleId) {
  return state.completedPuzzleIds.includes(puzzleId);
}

function completeScene(sceneId) {
  if (!sceneId || hasCompletedScene(sceneId)) return;
  state.completedSceneIds.push(sceneId);
}

function completePuzzle(puzzleId) {
  if (!puzzleId || hasCompletedPuzzle(puzzleId)) return;
  state.completedPuzzleIds.push(puzzleId);
}

function markVisited(sceneId = state.currentSceneId, viewId = getCurrentView().id) {
  if (sceneId && !state.visitedSceneIds.includes(sceneId)) {
    state.visitedSceneIds.push(sceneId);
  }

  if (sceneId && viewId) {
    const visitedViews = state.visitedViewIds[sceneId] || [];
    if (!visitedViews.includes(viewId)) {
      state.visitedViewIds[sceneId] = [...visitedViews, viewId];
    }
  }
}

function getSceneRecordCount(sceneId) {
  return state.records.filter((record) => record.sceneId === sceneId).length;
}

function getSceneHotspots(scene) {
  if (!scene) return [];
  if (scene.views) return Object.values(scene.views).flatMap((view) => view.hotspots || []);
  return scene.hotspots || [];
}

function canEnterCorridor() {
  return hasCompletedScene("tomb_gate") || (getSceneRecordCount("tomb_gate") >= 3 && hasRecord("tomb_gate:lintel_back"));
}

function canEnterFrontChamber() {
  return (
    hasCompletedScene("corridor") ||
    (hasCompletedPuzzle(PATTERN_PUZZLE_ID) &&
      hasRecord("corridor:corridor_mid") &&
      hasRecord("corridor:corridor_roof") &&
      hasRecord("corridor:overlapping_pattern"))
  );
}

function canUseTransition(transition) {
  if (!transition) return false;
  if (transition.completeOnly) return getMissingRequirements(transition).length === 0;
  if (transition.unlocked) return Boolean(SCENES[transition.targetSceneId]);
  if (transition.targetSceneId === "corridor") return canEnterCorridor();
  if (transition.targetSceneId === "front_chamber") return canEnterFrontChamber();
  if (getMissingRequirements(transition).length) return false;
  return Boolean(SCENES[transition.targetSceneId]);
}

function getMissingRequirements(transition) {
  if (!transition?.missingRecords) return [];
  if (transition.completesSceneId && hasCompletedScene(transition.completesSceneId)) return [];

  return transition.missingRecords.filter((requirement) => {
    if (requirement.anyOf) return !requirement.anyOf.some((recordId) => hasRecord(recordId));
    if (requirement.id) return !hasRecord(requirement.id);
    if (requirement.sceneId && requirement.minCount) {
      return getSceneRecordCount(requirement.sceneId) < requirement.minCount;
    }
    return false;
  });
}

function getLockedBody(hotspot, transition) {
  if (!transition) return null;

  const missing = getMissingRequirements(transition);
  if (!missing.length) return transition.lockedBody || null;

  const intro = transition.lockedBody || "这里暂时还不能继续。";
  const list = missing.map((item) => `还缺：${item.label}`).join("\n");
  return `${intro}\n${list}`;
}

function canUseViewTransition(viewTransition) {
  if (!viewTransition) return false;
  const scene = getCurrentScene();
  return Boolean(scene.views?.[viewTransition.targetViewId]);
}

function canUseCloseupTransition(closeupTransition) {
  if (!closeupTransition) return false;
  const targetSceneId = closeupTransition.targetSceneId || state.currentSceneId;
  return Boolean(getView(targetSceneId, closeupTransition.targetViewId));
}

function getHotspotByRecord(record) {
  const scene = SCENES[record.sceneId];
  const hotspotId = record.id?.split(":").pop();
  if (!scene || !hotspotId) return null;

  const views = scene.views ? Object.values(scene.views) : [{ hotspots: scene.hotspots || [] }];
  for (const view of views) {
    const hotspot = (view.hotspots || []).find((item) => item.id === hotspotId);
    if (hotspot) return hotspot;
  }
  return null;
}

function isNavigationRecord(record) {
  const hotspot = getHotspotByRecord(record);
  if (hotspot) return hotspot.sourceClueId === "NAV" || hotspot.sourceFile === "game-navigation";
  return record.title?.startsWith("返回") || record.title?.startsWith("转向") || record.title?.startsWith("切换");
}

function normalizeRecord(record) {
  if (record.sceneId) return record;
  return {
    ...record,
    id: `${START_SCENE_ID}:${record.id}`,
    sceneId: START_SCENE_ID
  };
}

function load() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("reset") === "1") {
    localStorage.removeItem(SAVE_KEY);
    params.delete("reset");
    const nextSearch = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
  }

  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.currentSceneId = SCENES[data.currentSceneId] ? data.currentSceneId : START_SCENE_ID;
    state.currentViewIds = data.currentViewIds && typeof data.currentViewIds === "object" ? data.currentViewIds : {};
    state.visitedSceneIds = Array.isArray(data.visitedSceneIds) ? data.visitedSceneIds.filter((sceneId) => SCENES[sceneId]) : [];
    state.visitedViewIds =
      data.visitedViewIds && typeof data.visitedViewIds === "object" && !Array.isArray(data.visitedViewIds)
        ? data.visitedViewIds
        : {};
    state.completedSceneIds = Array.isArray(data.completedSceneIds) ? data.completedSceneIds : [];
    state.completedPuzzleIds = Array.isArray(data.completedPuzzleIds) ? data.completedPuzzleIds : [];
    state.records = Array.isArray(data.records)
      ? data.records.map(normalizeRecord).filter((record) => !isNavigationRecord(record))
      : [];
    state.journalOpen = Boolean(data.journalOpen);
    save();
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function addRecord(hotspot) {
  if (hotspot.sourceClueId === "NAV" || hotspot.sourceFile === "game-navigation" || !hotspot.record) return false;
  const scene = getCurrentScene();
  const recordId = `${scene.id}:${hotspot.id}`;
  if (state.records.some((record) => record.id === recordId)) return false;
  state.records.push({
    id: recordId,
    sceneId: scene.id,
    title: hotspot.title,
    text: hotspot.record,
    clueIds: normalizeClueIds(hotspot.clueIds || hotspot.sourceClueId)
  });
  return true;
}

function getCompletionHint(hotspot, addedRecord) {
  if (!addedRecord) return "";
  const scene = getCurrentScene();
  const completionHint = scene.completionHint;
  if (!completionHint || hasCompletedScene(scene.id)) return "";

  const sourceHotspot = getSceneHotspots(scene).find((item) => item.id === completionHint.sourceHotspotId);
  const requirements = completionHint.recordIds || sourceHotspot?.transition?.missingRecords || [];
  const requiredRecordIds = requirements.flatMap((requirement) => {
    if (requirement.id) return [requirement.id];
    if (requirement.anyOf) return requirement.anyOf;
    return [];
  });
  const currentRecordId = `${scene.id}:${hotspot.id}`;

  if (!requiredRecordIds.includes(currentRecordId)) return "";
  if (!requiredRecordIds.every((recordId) => hasRecord(recordId))) return "";
  return `\n\n${completionHint.text}`;
}

function openMessage(hotspot) {
  if (hotspot.mapAction === "open") {
    openPositionMap();
    return;
  }

  const addedRecord = addRecord(hotspot);
  const transition = canUseTransition(hotspot.transition) ? hotspot.transition : null;
  const viewTransition = !transition && canUseViewTransition(hotspot.viewTransition) ? hotspot.viewTransition : null;
  const closeupTransition =
    !transition && !viewTransition && canUseCloseupTransition(hotspot.closeupTransition) ? hotspot.closeupTransition : null;
  const lockedBody = hotspot.transition && !transition ? getLockedBody(hotspot, hotspot.transition) : null;
  const navigation = transition
    ? transition.completeOnly
      ? { completeSceneId: transition.completesSceneId || state.currentSceneId }
      : {
          sceneId: transition.targetSceneId,
          viewId: transition.targetViewId,
          completeSceneId: transition.unlocked ? null : transition.completesSceneId || state.currentSceneId
        }
    : viewTransition
      ? { sceneId: state.currentSceneId, viewId: viewTransition.targetViewId }
      : closeupTransition
        ? {
            sceneId: closeupTransition.targetSceneId || state.currentSceneId,
            viewId: closeupTransition.targetViewId
          }
        : null;
  const activeTransition = transition || viewTransition || closeupTransition;

  if (shouldOpenPipePuzzle(hotspot, transition, navigation)) {
    save();
    renderJournal();
    openPipePuzzle();
    return;
  }

  if (shouldOpenPatternPuzzle(hotspot)) {
    save();
    renderJournal();
    openPatternPuzzle();
    return;
  }

  if (shouldOpenInscriptionPuzzle(hotspot)) {
    save();
    renderJournal();
    openInscriptionPuzzle();
    return;
  }

  if (shouldOpenRelicPuzzle(hotspot)) {
    save();
    renderJournal();
    openRelicPuzzle();
    return;
  }

  save();
  renderJournal();
  messageKicker.textContent = "现场观察";
  messageTitle.textContent = activeTransition ? activeTransition.title : hotspot.title;
  messageBody.textContent = `${activeTransition ? activeTransition.body : lockedBody || hotspot.body}${getCompletionHint(hotspot, addedRecord)}`;
  messageClose.textContent = activeTransition?.closeLabel || "收录";
  state.pendingNavigation = navigation;
  messageLayer.classList.remove("hidden");
}

function shouldOpenPipePuzzle(hotspot, transition, navigation) {
  if (PIPE_DEMO_MODE) return false;
  return (
    hotspot.id === "door_opening" &&
    transition?.targetSceneId === "corridor" &&
    navigation?.completeSceneId === "tomb_gate" &&
    !hasCompletedPuzzle(PIPE_PUZZLE_ID)
  );
}

function shouldOpenPatternPuzzle(hotspot) {
  if (state.currentSceneId !== "corridor" || hasCompletedPuzzle(PATTERN_PUZZLE_ID)) return false;
  if (!hasRecord("corridor:corridor_roof") || !hasRecord("corridor:overlapping_pattern")) return false;
  return hotspot.id === "overlapping_pattern" || hotspot.id === "front_chamber_entry";
}

function shouldOpenInscriptionPuzzle(hotspot) {
  if (state.currentSceneId !== "passage" || hasCompletedPuzzle(INSCRIPTION_PUZZLE_ID)) return false;
  return hotspot.id === "inscription_text";
}

function shouldOpenRelicPuzzle(hotspot) {
  if (state.currentSceneId !== "rear_chamber" || hasCompletedPuzzle(RELIC_PUZZLE_ID)) return false;
  return hotspot.id === "distribution_map";
}

function openRunePuzzle() {
  runeSequence = [];
  renderRunePuzzle();
  runePuzzleFeedback.textContent = "提示：从门额、封门砖缝、墓道环境到门洞深处。";
  runePuzzleFeedback.className = "puzzle-feedback";
  runePuzzleLayer.classList.remove("hidden");
}

function closeRunePuzzle() {
  runePuzzleLayer.classList.add("hidden");
}

function renderRunePuzzle() {
  runeSequenceSlots.forEach((slot, index) => {
    slot.textContent = runeSequence[index] || "";
  });
  runeOptions.forEach((button) => {
    button.classList.toggle("active", runeSequence.includes(button.dataset.rune));
    button.classList.remove("error");
  });
}

function handleRuneChoice(button) {
  const rune = button.dataset.rune;
  const index = runeSequence.length;
  runeSequence.push(rune);
  renderRunePuzzle();

  if (rune !== RUNE_ANSWER[index]) {
    button.classList.add("error");
    runePuzzleFeedback.textContent = "符记熄灭了。顺序应按现场记录从外到内整理。";
    runePuzzleFeedback.className = "puzzle-feedback error";
    setTimeout(() => {
      runeSequence = [];
      renderRunePuzzle();
    }, 650);
    return;
  }

  if (runeSequence.length < RUNE_ANSWER.length) {
    runePuzzleFeedback.textContent = "符记亮起。继续选择下一处记录对应的符记。";
    runePuzzleFeedback.className = "puzzle-feedback";
    return;
  }

  completePuzzle(RUNE_PUZZLE_ID);
  completeScene("tomb_gate");
  save();
  runePuzzleFeedback.textContent = "墓门验证完成。封门意象被整理为可通行的路径，甬道已经解锁。";
  runePuzzleFeedback.className = "puzzle-feedback success";
  setTimeout(() => {
    closeRunePuzzle();
    navigateTo({ sceneId: "corridor" });
    save();
    renderScene();
    renderJournal();
  }, 850);
}

function openPatternPuzzle() {
  patternStates = ["left", "right", "left"];
  renderPatternPuzzle();
  patternPuzzleFeedback.textContent = "提示：让菱形尖角回到中线，刮痕才会显露出重绘痕迹。";
  patternPuzzleFeedback.className = "puzzle-feedback";
  patternPuzzleLayer.classList.remove("hidden");
}

function closePatternPuzzle() {
  patternPuzzleLayer.classList.add("hidden");
}

function renderPatternPuzzle() {
  patternTiles.forEach((tile, index) => {
    const stateName = patternStates[index] || "left";
    tile.classList.remove("shift-left", "shift-center", "shift-right", "solved", "error");
    tile.classList.add(`shift-${stateName}`);
    tile.querySelector("em").textContent = PATTERN_LABELS[stateName];
  });
}

function handlePatternChoice(tile) {
  const index = Number(tile.dataset.index);
  const current = patternStates[index] || "left";
  const next = PATTERN_STATES[(PATTERN_STATES.indexOf(current) + 1) % PATTERN_STATES.length];
  patternStates[index] = next;
  renderPatternPuzzle();

  if (!patternStates.every((stateName) => stateName === "center")) {
    patternPuzzleFeedback.textContent = "纹样仍有错位。继续把每个菱形尖角校准到中线。";
    patternPuzzleFeedback.className = "puzzle-feedback";
    return;
  }

  patternTiles.forEach((item) => item.classList.add("solved"));
  completePuzzle(PATTERN_PUZZLE_ID);
  completeScene("corridor");
  save();
  patternPuzzleFeedback.textContent = "叠胜纹校准完成。偏移不是施工误差，而是刮除后重绘留下的二次修改痕迹。前室路径已经解锁。";
  patternPuzzleFeedback.className = "puzzle-feedback success";
}

function openInscriptionPuzzle() {
  inscriptionSequence = [];
  inscriptionMarks = [];
  inscriptionRevealedChars = [];
  inscriptionNameHuntActive = false;
  inscriptionFoundNameChars = [];
  inscriptionReportReviewActive = false;
  inscriptionMarkedErrors = [];
  renderInscriptionPuzzle();
  inscriptionPuzzleFeedback.textContent = "提示：图中发光处是残字拓片，不一定能直接读出完整字。先辨笔画，再排读序。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback";
  inscriptionPuzzleLayer.classList.remove("hidden");
}

function closeInscriptionPuzzle() {
  inscriptionPuzzleLayer.classList.add("hidden");
}

function renderInscriptionPuzzle() {
  inscriptionPuzzleLayer.classList.toggle("inscription-name-active", inscriptionNameHuntActive);
  inscriptionPuzzleLayer.classList.toggle("inscription-report-active", inscriptionReportReviewActive);
  inscriptionSequenceSlots.forEach((slot, index) => {
    slot.textContent = inscriptionSequence[index] || "";
    slot.classList.remove("correct", "misplaced", "wrong");
    if (inscriptionMarks[index]) slot.classList.add(inscriptionMarks[index]);
  });
  inscriptionOptions.forEach((button) => {
    const selectedCount = inscriptionSequence.filter((item) => item === button.dataset.char).length;
    button.classList.toggle("active", selectedCount > 0);
    button.classList.remove("revealed");
    button.classList.remove("error");
    button.disabled = inscriptionNameHuntActive || inscriptionReportReviewActive || selectedCount > 0 || inscriptionSequence.length >= INSCRIPTION_ANSWER.length;
  });
  inscriptionGlyphs.forEach((button) => {
    button.classList.toggle("revealed", inscriptionRevealedChars.includes(button.dataset.char));
    button.disabled = inscriptionNameHuntActive || inscriptionReportReviewActive;
  });
  inscriptionFragmentCards.forEach((card) => {
    const revealed = inscriptionRevealedChars.includes(card.dataset.fragment);
    card.classList.toggle("revealed", revealed);
    card.querySelector("span").textContent = revealed ? INSCRIPTION_FRAGMENT_HINTS[card.dataset.fragment] : "未显影";
  });
  inscriptionClear.disabled = inscriptionNameHuntActive || inscriptionReportReviewActive;
  inscriptionSubmit.disabled = inscriptionNameHuntActive || inscriptionReportReviewActive || inscriptionSequence.length < INSCRIPTION_ANSWER.length;
  inscriptionSubmit.textContent = "确认辨读";
  if (inscriptionNameHunt) inscriptionNameHunt.classList.toggle("hidden", !inscriptionNameHuntActive);
  if (inscriptionReportReview) inscriptionReportReview.classList.toggle("hidden", !inscriptionReportReviewActive);
  inscriptionNameGlyphs.forEach((button) => {
    const char = button.dataset.nameChar;
    const found = inscriptionFoundNameChars.includes(char);
    button.classList.toggle("found", found);
    button.disabled = !inscriptionNameHuntActive || found;
  });
  inscriptionNameSlots.forEach((slot) => {
    const char = slot.dataset.nameSlot;
    slot.classList.toggle("found", inscriptionFoundNameChars.includes(char));
  });
  inscriptionErrorLines.forEach((button) => {
    const error = button.dataset.error;
    button.classList.toggle("marked", inscriptionMarkedErrors.includes(error));
    button.disabled = !inscriptionReportReviewActive || inscriptionMarkedErrors.includes(error);
  });
  inscriptionCorrectionSlots.forEach((slot) => {
    const error = slot.dataset.errorSlot;
    slot.classList.toggle("marked", inscriptionMarkedErrors.includes(error));
  });
}

function handleInscriptionChoice(button) {
  if (inscriptionRevealedChars.length < INSCRIPTION_ANSWER.length) {
    inscriptionPuzzleFeedback.textContent = "题记还没有拓全。先在图中找到 4 处残字拓片，再开始辨字。";
    inscriptionPuzzleFeedback.className = "puzzle-feedback error";
    return;
  }

  const char = button.dataset.char;
  const index = inscriptionSequence.length;
  if (index >= INSCRIPTION_ANSWER.length) return;
  inscriptionSequence.push(char);
  inscriptionMarks = [];
  renderInscriptionPuzzle();

  if (inscriptionSequence.length < INSCRIPTION_ANSWER.length) {
    inscriptionPuzzleFeedback.textContent = "候选字已放入辨读栏。继续补全四字后确认。";
    inscriptionPuzzleFeedback.className = "puzzle-feedback";
    return;
  }

  evaluateInscriptionSequence();
}

function revealInscriptionGlyph(button) {
  const fragment = button.dataset.fragment;
  if (!inscriptionRevealedChars.includes(fragment)) inscriptionRevealedChars.push(fragment);
  inscriptionPuzzleFeedback.textContent = `发现拓片 ${fragment}：${INSCRIPTION_FRAGMENT_HINTS[fragment]}`;
  inscriptionPuzzleFeedback.className = "puzzle-feedback";
  renderInscriptionPuzzle();
}

function clearInscriptionPuzzle() {
  inscriptionSequence = [];
  inscriptionMarks = [];
  inscriptionPuzzleFeedback.textContent = "已清空辨读栏。重新按题记结构排列。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback";
  renderInscriptionPuzzle();
}

function removeInscriptionSlot(slot) {
  if (inscriptionNameHuntActive || inscriptionReportReviewActive) return;
  const index = Number(slot.dataset.slot);
  if (!inscriptionSequence[index]) return;
  inscriptionSequence.splice(index, 1);
  inscriptionMarks = [];
  inscriptionPuzzleFeedback.textContent = "已移除一个候选字，可以继续调整顺序。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback";
  renderInscriptionPuzzle();
}

function evaluateInscriptionSequence() {
  if (inscriptionSequence.length < INSCRIPTION_ANSWER.length) {
    inscriptionPuzzleFeedback.textContent = "还缺少残字。先把四格补满再确认。";
    inscriptionPuzzleFeedback.className = "puzzle-feedback error";
    return;
  }

  inscriptionMarks = inscriptionSequence.map((char, index) => {
    if (char === INSCRIPTION_ANSWER[index]) return "correct";
    if (INSCRIPTION_ANSWER.includes(char)) return "misplaced";
    return "wrong";
  });
  renderInscriptionPuzzle();

  if (!inscriptionSequence.every((char, index) => char === INSCRIPTION_ANSWER[index])) {
    inscriptionPuzzleFeedback.textContent = "颜色反馈：绿色为字和位置都对，黄色为字对但位置错，红色不是本题记字。";
    inscriptionPuzzleFeedback.className = "puzzle-feedback error";
    return;
  }

  inscriptionNameHuntActive = true;
  inscriptionFoundNameChars = [];
  inscriptionPuzzleFeedback.textContent = "纪年辨读正确。继续在题记图中找出“赵、大、翁”三个称谓字。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback success";
  renderInscriptionPuzzle();
  requestAnimationFrame(() => {
    inscriptionNameHunt?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function revealInscriptionNameGlyph(button) {
  if (!inscriptionNameHuntActive) return;
  const char = button.dataset.nameChar;
  if (inscriptionFoundNameChars.includes(char)) return;
  inscriptionFoundNameChars.push(char);
  inscriptionPuzzleFeedback.textContent = `找到称谓字“${char}”。继续找齐“赵大翁”。`;
  inscriptionPuzzleFeedback.className = "puzzle-feedback";
  renderInscriptionPuzzle();
  if (INSCRIPTION_NAME_CHARS.every((item) => inscriptionFoundNameChars.includes(item))) openInscriptionReportReview();
}

function openInscriptionReportReview() {
  inscriptionNameHuntActive = false;
  inscriptionReportReviewActive = true;
  inscriptionMarkedErrors = [];
  inscriptionPuzzleFeedback.textContent = "已找到“赵大翁”。现在帮实习生改报告：点出初稿里过度推断的句子。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback success";
  renderInscriptionPuzzle();
  requestAnimationFrame(() => {
    inscriptionReportReview?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function markInscriptionReportError(button) {
  if (!inscriptionReportReviewActive) return;
  const error = button.dataset.error;
  if (inscriptionMarkedErrors.includes(error)) return;
  inscriptionMarkedErrors.push(error);
  inscriptionPuzzleFeedback.textContent = "改得对：这句话超出了题记本身能证明的范围。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback success";
  renderInscriptionPuzzle();
  if (INSCRIPTION_REPORT_ERRORS.every((item) => inscriptionMarkedErrors.includes(item))) completeInscriptionPuzzle();
}

function completeInscriptionPuzzle() {
  completePuzzle(INSCRIPTION_PUZZLE_ID);
  addRewardRecord(INSCRIPTION_REWARD);
  save();
  renderJournal();
  inscriptionPuzzleFeedback.textContent = "题记辨读完成：已读出“元符二年”，找到“赵大翁”称谓，并改正了过度推断的报告句子。";
  inscriptionPuzzleFeedback.className = "puzzle-feedback success";
  renderInscriptionPuzzle();
  setTimeout(closeInscriptionPuzzle, 1050);
}

function openRelicPuzzle() {
  renderRelicStaticControls();
  currentRelicTarget = null;
  currentRelicPage = "atlas";
  completedRelicTargets = [];
  relicMarkerLayer.innerHTML = "";
  resetRelicLens();
  renderRelicPage();
  renderRelicPuzzle();
  relicPuzzleFeedback.textContent = "先在展开地图选择位置，也可以点底部任意宝物查看线索。找到哪个就先收录哪个。";
  relicPuzzleFeedback.className = "puzzle-feedback";
  relicPuzzleLayer.classList.remove("hidden");
}

function closeRelicPuzzle() {
  relicPuzzleLayer.classList.add("hidden");
}

function renderRelicPuzzle() {
  const relicChoices = [...relicCollection.querySelectorAll(".relic-choice")];
  const relicPageTabs = [...relicPageTabsRoot.querySelectorAll(".relic-page-tab")];
  const relicHotspots = getRelicHotspots();

  relicChoices.forEach((button) => {
    const relic = button.dataset.relic;
    button.classList.toggle("active", relic === currentRelicTarget);
    button.classList.toggle("solved", completedRelicTargets.includes(relic));
    const status = button.querySelector("em");
    if (status) status.textContent = completedRelicTargets.includes(relic) ? "已收录" : "未收录";
  });
  relicPageTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === currentRelicPage);
  });
  relicMap.dataset.currentRelic = currentRelicTarget;
  relicMap.dataset.currentPage = currentRelicPage;
  relicMap.classList.remove("error");
  relicHotspots.forEach((button) => {
    const relic = button.dataset.relic;
    const point = RELIC_POINTS[relic];
    const visible = point.page === currentRelicPage;
    button.hidden = !visible;
    button.style.left = `${point.x * 100}%`;
    button.style.top = `${point.y * 100}%`;
    button.classList.toggle("active", relic === currentRelicTarget);
    button.classList.toggle("solved", completedRelicTargets.includes(relic));
    button.classList.remove("error");
  });
  updateRelicReveals();
}

function setRelicTarget(relic) {
  if (!RELIC_ORDER.includes(relic) || completedRelicTargets.includes(relic)) return;
  currentRelicTarget = relic;
  const page = RELIC_POINTS[relic].page;
  switchRelicPage(page);
  relicPuzzleFeedback.textContent = `线索：${RELIC_LABELS[relic]}可能在“${RELIC_PAGES[page].label}”中。${RELIC_POINTS[relic].hint}。`;
  relicPuzzleFeedback.className = "puzzle-feedback";
  renderRelicPuzzle();
}

function switchRelicPage(page) {
  if (!RELIC_PAGES[page]) return;
  currentRelicPage = page;
  resetRelicLens();
  renderRelicPage();
  renderRelicPuzzle();
}

function renderRelicPage() {
  const page = RELIC_PAGES[currentRelicPage] || RELIC_PAGES.atlas;
  relicMapImage.src = page.image;
  relicMapImage.alt = page.alt;
  relicMap.classList.toggle("overview-mode", page.type === "overview");
  relicMarkerLayer.innerHTML = "";
  renderRelicOverview();
  completedRelicTargets.forEach((relic) => {
    if (RELIC_POINTS[relic].page === currentRelicPage) {
      addRelicMarker(relic, RELIC_POINTS[relic]);
    }
  });
}

function getNextRelicTarget() {
  return RELIC_ORDER.find((relic) => !completedRelicTargets.includes(relic)) || null;
}

function handleRelicMapClick(event) {
  if (event.target.closest(".relic-hotspot")) return;
  if (event.target.closest(".relic-region")) return;
  if (currentRelicPage === "atlas") {
    relicPuzzleFeedback.textContent = "点击展开地图上的位置卡片，进入对应图纸后再用放大镜寻找宝物。";
    relicPuzzleFeedback.className = "puzzle-feedback";
    return;
  }
  updateRelicLensFromEvent(event);
  const rect = relicMap.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const foundRelic = getRelicAtPosition(x, y);

  if (!foundRelic) {
    relicMap.classList.add("error");
    relicPuzzleFeedback.textContent = "这里还没有可收录的宝物痕迹。继续移动放大镜，或者换一张图纸看看。";
    relicPuzzleFeedback.className = "puzzle-feedback error";
    setTimeout(renderRelicPuzzle, 500);
    return;
  }

  completeRelicTarget(foundRelic);
}

function handleRelicHotspotClick(event, button) {
  event.stopPropagation();
  updateRelicLensFromEvent(event);
  const relic = button.dataset.relic;
  if (completedRelicTargets.includes(relic)) return;
  completeRelicTarget(relic);
}

function completeRelicTarget(relic) {
  const point = RELIC_POINTS[relic];
  currentRelicTarget = relic;

  if (!completedRelicTargets.includes(relic)) {
    completedRelicTargets.push(relic);
    addRewardRecord(makeRelicItemRecord(point));
    if (point.page === currentRelicPage) addRelicMarker(relic, point);
  }

  if (completedRelicTargets.length < RELIC_ORDER.length) {
    relicPuzzleFeedback.textContent = `${RELIC_LABELS[relic]}已收进箱子。现在可以继续在当前图纸找，也可以从展开地图换位置。`;
    relicPuzzleFeedback.className = "puzzle-feedback";
    renderRelicPuzzle();
    return;
  }

  completePuzzle(RELIC_PUZZLE_ID);
  addRewardRecord(RELIC_REWARD);
  save();
  renderJournal();
  relicPuzzleFeedback.textContent = "M1展开图册寻宝完成。遗物定位记录已收录。";
  relicPuzzleFeedback.className = "puzzle-feedback success";
  renderRelicPuzzle();
  setTimeout(closeRelicPuzzle, 900);
}

function getRelicAtPosition(x, y) {
  return RELIC_ITEMS.find((item) => {
    if (item.page !== currentRelicPage || completedRelicTargets.includes(item.id)) return false;
    return Math.hypot(x - item.x, y - item.y) <= item.tolerance;
  })?.id || null;
}

function addRelicMarker(relic, point) {
  const marker = document.createElement("span");
  marker.className = "relic-marker";
  marker.style.left = `${point.x * 100}%`;
  marker.style.top = `${point.y * 100}%`;
  marker.textContent = RELIC_LABELS[relic];
  relicMarkerLayer.appendChild(marker);
}

function renderRelicStaticControls() {
  relicPageTabsRoot.innerHTML = RELIC_PAGE_ORDER.map((pageId) => {
    const page = RELIC_PAGES[pageId];
    return `<button class="relic-page-tab" data-page="${pageId}" type="button">${page.label}</button>`;
  }).join("");

  relicCollection.innerHTML = RELIC_ITEMS.map((item) => `
    <button class="relic-choice" data-relic="${item.id}" type="button">
      <span class="collection-icon collection-icon-${item.kind}" aria-hidden="true"></span>
      <strong>${item.label}</strong>
      <em>未收录</em>
    </button>
  `).join("");

  relicHotspotLayer.innerHTML = RELIC_ITEMS.map((item) => `
    <button class="relic-hotspot relic-hotspot-${item.kind}" data-relic="${item.id}" type="button" aria-label="${item.label}痕迹">
      <span class="relic-trace relic-trace-${item.kind}">${getRelicTraceMarkup(item.kind)}</span>
      <span class="relic-trace-label">${item.label}</span>
    </button>
  `).join("");
}

function getRelicTraceMarkup(kind) {
  if (kind === "bones") return "<i></i><i></i><i></i>";
  if (kind === "nails") return "<i></i><i></i><i></i><i></i>";
  if (kind === "text") return "<b></b><b></b><b></b>";
  if (kind === "tassel") return "<i></i><i></i><i></i>";
  return "";
}

function renderRelicOverview() {
  const page = RELIC_PAGES[currentRelicPage] || RELIC_PAGES.atlas;
  if (page.type !== "overview") {
    relicOverview.innerHTML = "";
    return;
  }

  relicOverview.innerHTML = RELIC_REGIONS.map((region) => {
    const itemCount = RELIC_ITEMS.filter((item) => item.page === region.page || RELIC_PAGE_TO_REGION[item.page] === region.page).length;
    const solvedCount = RELIC_ITEMS.filter((item) =>
      completedRelicTargets.includes(item.id) &&
      (item.page === region.page || RELIC_PAGE_TO_REGION[item.page] === region.page)
    ).length;
    return `
      <button class="relic-region" data-page="${region.page}" type="button" style="left:${region.x * 100}%;top:${region.y * 100}%;width:${region.w * 100}%;height:${region.h * 100}%">
        <strong>${region.label}</strong>
        <span>${region.note}</span>
        <em>${solvedCount}/${itemCount}</em>
      </button>
    `;
  }).join("");
}

function getRelicHotspots() {
  return [...relicHotspotLayer.querySelectorAll(".relic-hotspot")];
}

function updateRelicLensFromEvent(event) {
  const rect = relicMap.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  relicLensPosition = { x, y, active: true };
  relicMap.style.setProperty("--lens-x", `${x * 100}%`);
  relicMap.style.setProperty("--lens-y", `${y * 100}%`);
  relicMap.classList.add("lens-active");
  updateRelicReveals();
}

function resetRelicLens() {
  relicLensPosition = { x: 0.5, y: 0.5, active: false };
  relicMap.style.setProperty("--lens-x", "50%");
  relicMap.style.setProperty("--lens-y", "50%");
  relicMap.classList.remove("lens-active");
  updateRelicReveals();
}

function updateRelicReveals() {
  const revealRadius = 0.15;
  const relicHotspots = getRelicHotspots();
  relicHotspots.forEach((button) => {
    const relic = button.dataset.relic;
    const point = RELIC_POINTS[relic];
    const isCurrentPage = point.page === currentRelicPage;
    const isSolved = completedRelicTargets.includes(relic);
    const isNearLens =
      relicLensPosition.active &&
      isCurrentPage &&
      Math.hypot(relicLensPosition.x - point.x, relicLensPosition.y - point.y) <= revealRadius;
    button.classList.toggle("revealed", isSolved || isNearLens);
  });
}

function clonePipeTiles() {
  return getCurrentPipeLevel().tiles.map((row, y) =>
    row.map((tile, x) => ({
      ...tile,
      x,
      y,
      connected: false
    }))
  );
}

function getCurrentPipeLevel() {
  return PIPE_LEVELS[currentPipeLevelId] || PIPE_LEVELS.tombGateTrace;
}

function openPipePuzzle(levelId = currentPipeLevelId) {
  currentPipeLevelId = PIPE_LEVELS[levelId] ? levelId : "tombGateTrace";
  pipeSolved = false;
  pipeTiles = clonePipeTiles();
  pipeSuccessLayer.classList.add("hidden");
  renderPipePuzzle();
  updatePipeConnections();
  const level = getCurrentPipeLevel();
  document.querySelector("#pipePuzzleTitle").textContent = level.title;
  document.querySelector(".pipe-puzzle-box .puzzle-copy").textContent = level.instruction;
  pipePuzzleFeedback.textContent = "提示：亮起的砖缝表示已经从起点连通。";
  pipePuzzleFeedback.className = "puzzle-feedback";
  pipePuzzleLayer.classList.remove("hidden");
}

function closePipePuzzle() {
  pipePuzzleLayer.classList.add("hidden");
}

function renderPipePuzzle() {
  pipeBoard.innerHTML = "";
  pipeTiles.flat().forEach((tile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pipe-tile";
    button.dataset.x = tile.x;
    button.dataset.y = tile.y;
    button.setAttribute("aria-label", getPipeTileLabel(tile));
    button.disabled = Boolean(tile.locked);
    button.innerHTML = `<span class="pipe-art" style="--pipe-rotation: ${tile.rotation}deg">${getPipeSvg(tile.type)}</span>`;
    button.addEventListener("click", () => rotatePipeTile(tile.x, tile.y));
    pipeBoard.appendChild(button);
  });
}

function getPipeTileLabel(tile) {
  if (tile.type === "start") return "水汽起点";
  if (tile.type === "end") return "残片终点";
  return "可旋转砖缝";
}

function getPipeSvg(type) {
  const shapes = {
    empty: "",
    start: '<path d="M8 50 H50" /><circle cx="18" cy="50" r="9" /><path class="thin-line" d="M12 38 C24 32 34 36 44 30" />',
    end: '<path d="M50 92 V50" /><circle cx="50" cy="50" r="10" /><path class="thin-line" d="M35 42 C48 31 62 32 74 42" />',
    straight: '<path d="M50 8 V92" /><path class="thin-line" d="M40 16 V84" />',
    corner: '<path d="M50 8 V50 H92" /><path class="thin-line" d="M40 18 C42 42 56 56 82 60" />',
    tee: '<path d="M50 8 V92 M50 50 H92" /><path class="thin-line" d="M39 18 V82 M58 60 H84" />',
    cross: '<path d="M50 8 V92 M8 50 H92" /><path class="thin-line" d="M39 18 V82 M18 61 H82" />'
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${shapes[type] || ""}</svg>`;
}

function rotatePipeTile(x, y) {
  if (pipeSolved) return;
  const tile = pipeTiles[y]?.[x];
  if (!tile || tile.locked) return;
  tile.rotation = (tile.rotation + 90) % 360;
  renderPipePuzzle();
  updatePipeConnections();
}

function getRotatedConnections(tile) {
  const turns = (((tile.rotation || 0) / 90) % 4 + 4) % 4;
  return (PIPE_BASE_CONNECTIONS[tile.type] || []).map((direction) => {
    const index = PIPE_DIRECTIONS.indexOf(direction);
    return PIPE_DIRECTIONS[(index + turns) % PIPE_DIRECTIONS.length];
  });
}

function getPipeNeighbor(x, y, direction) {
  if (direction === "top") return { x, y: y - 1 };
  if (direction === "right") return { x: x + 1, y };
  if (direction === "bottom") return { x, y: y + 1 };
  return { x: x - 1, y };
}

function updatePipeConnections() {
  const connected = tracePipeConnections();
  const isSolved = connected.has(getCurrentPipeLevel().end.join(","));

  pipeTiles.flat().forEach((tile) => {
    tile.connected = connected.has(`${tile.x},${tile.y}`);
  });

  [...pipeBoard.querySelectorAll(".pipe-tile")].forEach((button) => {
    const key = `${button.dataset.x},${button.dataset.y}`;
    button.classList.toggle("connected", connected.has(key));
    button.classList.toggle("solved", isSolved && connected.has(key));
  });

  if (isSolved && !pipeSolved) finishPipePuzzle();
}

function tracePipeConnections() {
  const [startX, startY] = getCurrentPipeLevel().start;
  const queue = [[startX, startY]];
  const visited = new Set();

  while (queue.length) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    const tile = pipeTiles[y]?.[x];
    if (!tile) continue;
    visited.add(key);

    getRotatedConnections(tile).forEach((direction) => {
      const next = getPipeNeighbor(x, y, direction);
      const nextTile = pipeTiles[next.y]?.[next.x];
      if (!nextTile) return;
      const nextConnections = getRotatedConnections(nextTile);
      if (nextConnections.includes(PIPE_OPPOSITE[direction])) {
        queue.push([next.x, next.y]);
      }
    });
  }

  return visited;
}

function addRewardRecord(reward) {
  if (!reward || state.records.some((record) => record.id === reward.id)) return;
  state.records.push({
    ...reward,
    clueIds: normalizeClueIds(reward.clueIds)
  });
}

function makeRelicItemRecord(item) {
  const scope = item.core ? "正式线索" : "扩展收集";
  return {
    id: `relic:${item.id}`,
    sceneId: item.page.startsWith("rear") || item.page === "landDeed" || item.page === "bonesNails" ? "rear_chamber" : item.page,
    title: `${item.label}定位`,
    text: `${item.label}已在“${RELIC_PAGES[item.page].label}”中定位并收录。类型：${scope}。`,
    clueIds: item.clueIds
  };
}

function normalizeClueIds(clueIds) {
  if (!clueIds) return [];
  const list = Array.isArray(clueIds) ? clueIds : [clueIds];
  return [...new Set(list.filter((id) => typeof id === "string" && id && id !== "NAV"))];
}

function finishPipePuzzle() {
  const level = getCurrentPipeLevel();
  const puzzleId = level.puzzleId || PIPE_PUZZLE_ID;
  if (hasCompletedPuzzle(puzzleId) && !PIPE_DEMO_MODE) return;
  pipeSolved = true;
  completePuzzle(puzzleId);
  completePuzzle(RUNE_PUZZLE_ID);
  completeScene("tomb_gate");
  addRewardRecord(level.reward);
  save();
  renderJournal();
  pipePuzzleFeedback.textContent = PIPE_DEMO_MODE
    ? "暗线已经连通。残片被收录，小游戏玩法展示完成。"
    : "暗线已经连通。残片被收录，甬道入口可以继续前进。";
  pipePuzzleFeedback.className = "puzzle-feedback success";
  showPipeSuccess(level);
  if (PIPE_DEMO_MODE) return;
  setTimeout(() => {
    closePipePuzzle();
    navigateTo({ sceneId: "corridor" });
    save();
    renderScene();
    renderJournal();
  }, 850);
}

function showPipeSuccess(level) {
  const reward = level.reward || {};
  pipeSuccessTitle.textContent = reward.title || "线索已显现";
  pipeSuccessText.textContent = reward.successText || reward.text || "暗线连通后，一件线索被照亮。";
  pipeClueImage.src = reward.image || "assets/M1/16_出土器物与人骨/地券.png";
  pipeClueImage.alt = reward.title || "通关获得的线索图片";
  pipeSuccessLayer.classList.remove("hidden");
}

function closeMessage() {
  messageLayer.classList.add("hidden");
  messageClose.textContent = "收录";
  if (!state.pendingNavigation) return;
  navigateTo(state.pendingNavigation);
  state.pendingNavigation = null;
  save();
  renderScene();
  renderJournal();
}

function ensurePositionMapLayer() {
  if (positionMapLayer || !POSITION_MAP) return positionMapLayer;

  positionMapLayer = document.createElement("div");
  positionMapLayer.setAttribute("role", "dialog");
  positionMapLayer.setAttribute("aria-modal", "true");
  positionMapLayer.setAttribute("aria-label", "墓室定位图");
  Object.assign(positionMapLayer.style, {
    position: "fixed",
    inset: "0",
    zIndex: "6",
    display: "none",
    placeItems: "center",
    padding: "18px",
    background: "rgba(0, 0, 0, 0.62)"
  });

  const panel = document.createElement("article");
  Object.assign(panel.style, {
    width: "min(980px, 100%)",
    maxHeight: "calc(100vh - 36px)",
    padding: "14px",
    border: "1px solid rgba(201, 157, 87, 0.52)",
    borderRadius: "8px",
    background: "rgba(13, 12, 11, 0.94)",
    boxShadow: "0 22px 70px rgba(0, 0, 0, 0.46)",
    backdropFilter: "blur(10px)"
  });

  const header = document.createElement("header");
  Object.assign(header.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px"
  });

  const title = document.createElement("p");
  title.textContent = "墓室定位图";
  Object.assign(title.style, {
    margin: "0",
    color: "#c99d57",
    fontSize: "13px"
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "关闭";
  Object.assign(closeButton.style, {
    minHeight: "32px",
    border: "0",
    color: "#c6b9a4",
    background: "transparent",
    cursor: "pointer"
  });
  closeButton.addEventListener("click", closePositionMap);

  header.append(title, closeButton);

  const summary = document.createElement("p");
  summary.dataset.positionMapSummary = "true";
  Object.assign(summary.style, {
    margin: "0 0 10px",
    color: "#e8dcc7",
    fontSize: "14px",
    lineHeight: "1.65"
  });

  const mapFrame = document.createElement("div");
  Object.assign(mapFrame.style, {
    position: "relative",
    overflow: "hidden",
    borderRadius: "7px",
    background: "#050505"
  });

  const image = document.createElement("img");
  image.src = POSITION_MAP.image.src;
  image.alt = POSITION_MAP.image.alt;
  Object.assign(image.style, {
    display: "block",
    width: "100%",
    maxHeight: "calc(100vh - 130px)",
    objectFit: "contain"
  });

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1 1");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.dataset.positionMapOverlay = "true";
  Object.assign(svg.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  });

  mapFrame.append(image, svg);
  panel.append(header, summary, mapFrame, makePositionMapLegend());
  positionMapLayer.append(panel);
  positionMapLayer.addEventListener("click", (event) => {
    if (event.target === positionMapLayer) closePositionMap();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && positionMapLayer.style.display !== "none") closePositionMap();
  });
  document.body.appendChild(positionMapLayer);
  return positionMapLayer;
}

function openPositionMap() {
  const layer = ensurePositionMapLayer();
  renderPositionMapSummary();
  renderPositionMapMarkers();
  layer.style.display = "grid";
}

function closePositionMap() {
  if (!positionMapLayer) return;
  positionMapLayer.style.display = "none";
}

function hasVisitedScene(sceneId) {
  return (
    state.currentSceneId === sceneId ||
    hasCompletedScene(sceneId) ||
    state.visitedSceneIds.includes(sceneId) ||
    state.records.some((record) => record.sceneId === sceneId)
  );
}

function getCurrentPositionLabel() {
  const scene = getCurrentScene();
  const view = getCurrentView();
  return POSITION_MAP?.viewLabels?.[view.id] || POSITION_MAP?.viewLabels?.[scene.id] || view.title || scene.title;
}

function renderPositionMapSummary() {
  const layer = ensurePositionMapLayer();
  const summary = layer.querySelector("[data-position-map-summary]");
  if (!summary) return;
  summary.textContent = `当前位置：${getCurrentPositionLabel()}`;
}

function makePositionMapLegend() {
  const legend = document.createElement("div");
  Object.assign(legend.style, {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "10px",
    color: "#c6b9a4",
    fontSize: "12px"
  });

  [
    ["#f4ead6", "当前位置"],
    ["#8fc7aa", "已完成"],
    ["#c99d57", "已探索"]
  ].forEach(([color, text]) => {
    const item = document.createElement("span");
    item.textContent = text;
    Object.assign(item.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px"
    });

    const dot = document.createElement("span");
    Object.assign(dot.style, {
      width: "9px",
      height: "9px",
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 0 3px ${color}33`
    });
    item.prepend(dot);
    legend.appendChild(item);
  });

  return legend;
}

function renderPositionMapMarkers() {
  const layer = ensurePositionMapLayer();
  const overlay = layer.querySelector("[data-position-map-overlay]");
  overlay.innerHTML = "";

  Object.entries(POSITION_MAP.markers || {}).forEach(([sceneId, marker]) => {
    const isCurrent = state.currentSceneId === sceneId;
    const isComplete = hasCompletedScene(sceneId);
    const isVisited = hasVisitedScene(sceneId);
    overlay.appendChild(makePositionMarker(marker, { isCurrent, isComplete, isVisited }));
  });
}

function makePositionMarker(marker, status) {
  const ns = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(ns, "g");
  const halo = document.createElementNS(ns, "circle");
  const dot = document.createElementNS(ns, "circle");
  const label = document.createElementNS(ns, "text");

  halo.setAttribute("cx", marker.x);
  halo.setAttribute("cy", marker.y);
  halo.setAttribute("r", status.isCurrent ? "0.035" : "0.026");
  halo.setAttribute("fill", status.isCurrent ? "rgba(201,157,87,0.34)" : status.isComplete ? "rgba(108,169,143,0.26)" : "rgba(244,234,214,0.12)");
  halo.setAttribute("stroke", status.isCurrent ? "#f4ead6" : status.isComplete ? "#8fc7aa" : "rgba(244,234,214,0.4)");
  halo.setAttribute("stroke-width", status.isCurrent ? "0.006" : "0.003");

  dot.setAttribute("cx", marker.x);
  dot.setAttribute("cy", marker.y);
  dot.setAttribute("r", status.isCurrent ? "0.011" : "0.008");
  dot.setAttribute("fill", status.isCurrent ? "#f4ead6" : status.isVisited ? "#c99d57" : "rgba(244,234,214,0.45)");

  label.textContent = marker.label;
  label.setAttribute("x", marker.x);
  label.setAttribute("y", marker.y - 0.045);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", status.isCurrent ? "#f4ead6" : "#d5c5a8");
  label.setAttribute("stroke", "rgba(0,0,0,0.75)");
  label.setAttribute("stroke-width", "0.012");
  label.setAttribute("paint-order", "stroke");
  label.setAttribute("font-size", status.isCurrent ? "0.026" : "0.021");
  label.setAttribute("font-family", "Microsoft YaHei, Noto Sans SC, sans-serif");

  group.append(halo, dot, label);
  return group;
}

function setJournal(open) {
  state.journalOpen = open;
  save();
  renderJournal();
}

function renderScene() {
  const scene = getCurrentScene();
  const view = getCurrentView();
  const { image } = view;
  markVisited(scene.id, view.id);
  save();

  sceneRoot.setAttribute("aria-label", view.title || scene.title);
  sceneImage.src = image.src;
  sceneImage.alt = image.alt;
  hotspotLayer.setAttribute("viewBox", `0 0 ${image.width} ${image.height}`);
  hotspotLayer.setAttribute("aria-label", `${view.title || scene.title}可点击线索区域`);
  renderHotspots(view);
}

function makeHotspot(hotspot) {
  const ns = "http://www.w3.org/2000/svg";
  let element;
  const group = document.createElementNS(ns, "g");
  const { image } = getCurrentView();

  if (hotspot.shape === "rect") {
    const [x1, y1, x2, y2] = hotspot.rect;
    element = document.createElementNS(ns, "rect");
    element.setAttribute("x", x1 * image.width);
    element.setAttribute("y", y1 * image.height);
    element.setAttribute("width", (x2 - x1) * image.width);
    element.setAttribute("height", (y2 - y1) * image.height);
  } else {
    const [cx, cy] = hotspot.center;
    element = document.createElementNS(ns, "circle");
    element.setAttribute("cx", cx * image.width);
    element.setAttribute("cy", cy * image.height);
    element.setAttribute("r", hotspot.radius * Math.min(image.width, image.height));
  }

  element.classList.add("hotspot");
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-label", hotspot.label);
  element.addEventListener("click", () => openMessage(hotspot));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMessage(hotspot);
    }
  });
  group.appendChild(element);
  if (hotspot.navLabel) {
    const label = makeNavLabel(hotspot, image);
    group.appendChild(label);
    element.addEventListener("mouseenter", () => showNavLabel(label));
    element.addEventListener("mouseleave", () => hideNavLabel(label));
    element.addEventListener("focus", () => showNavLabel(label));
    element.addEventListener("blur", () => hideNavLabel(label));
  }
  return group;
}

function renderHotspots(view = getCurrentView()) {
  hotspotLayer.innerHTML = "";
  (view.hotspots || []).forEach((hotspot) => hotspotLayer.appendChild(makeHotspot(hotspot)));
  if (POSITION_MAP?.hotspot) {
    hotspotLayer.appendChild(makeHotspot(POSITION_MAP.hotspot));
  }
}

function makeNavLabel(hotspot, image) {
  const ns = "http://www.w3.org/2000/svg";
  const label = document.createElementNS(ns, "text");
  const { x, y } = getHotspotCenter(hotspot, image);

  label.textContent = hotspot.navLabel;
  label.setAttribute("x", x);
  label.setAttribute("y", y);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("dominant-baseline", "middle");
  label.setAttribute("fill", "#f4ead6");
  label.setAttribute("stroke", "#000");
  label.setAttribute("stroke-opacity", "0.72");
  label.setAttribute("stroke-width", "7");
  label.setAttribute("paint-order", "stroke");
  label.setAttribute("opacity", "0");
  label.setAttribute("font-size", Math.max(34, Math.min(86, image.width * 0.025)));
  label.setAttribute("font-family", "Microsoft YaHei, Noto Sans SC, sans-serif");
  label.setAttribute("pointer-events", "none");
  return label;
}

function showNavLabel(label) {
  label.setAttribute("opacity", "0.68");
}

function hideNavLabel(label) {
  label.setAttribute("opacity", "0");
}

function getHotspotCenter(hotspot, image) {
  if (hotspot.shape === "rect") {
    const [x1, y1, x2, y2] = hotspot.rect;
    return {
      x: ((x1 + x2) / 2) * image.width,
      y: ((y1 + y2) / 2) * image.height
    };
  }

  const [cx, cy] = hotspot.center;
  return {
    x: cx * image.width,
    y: cy * image.height
  };
}

function navigateTo({ sceneId, viewId, completeSceneId }) {
  completeScene(completeSceneId);

  if (sceneId && SCENES[sceneId]) {
    state.currentSceneId = sceneId;
  }

  const scene = getCurrentScene();
  const nextViewId = viewId || state.currentViewIds[scene.id] || getDefaultViewId(scene);
  if (nextViewId && scene.views?.[nextViewId]) {
    state.currentViewIds[scene.id] = nextViewId;
  }
}

function renderJournal() {
  journalPanel.classList.toggle("hidden", !state.journalOpen);
  journalToggle.setAttribute("aria-expanded", String(state.journalOpen));
  journalToggle.textContent = state.records.length ? `记录 ${state.records.length}` : "记录";
  journalList.innerHTML = "";

  if (!state.records.length) {
    journalList.innerHTML = '<p class="empty-note">已发现的信息会自动收在这里。</p>';
    return;
  }

  state.records.slice().reverse().forEach((record) => {
    const item = document.createElement("article");
    item.className = "journal-card";
    const clueBadges = normalizeClueIds(record.clueIds)
      .map((clueId) => `<span>${clueId}</span>`)
      .join("");
    item.innerHTML = `<h2>${record.title}</h2><p>${record.text}</p>${clueBadges ? `<div class="journal-clues">${clueBadges}</div>` : ""}`;
    journalList.appendChild(item);
  });
}

journalToggle.addEventListener("click", () => setJournal(!state.journalOpen));
journalClose.addEventListener("click", () => setJournal(false));
messageClose.addEventListener("click", closeMessage);
messageLayer.addEventListener("click", (event) => {
  if (event.target === messageLayer) closeMessage();
});
runePuzzleClose.addEventListener("click", closeRunePuzzle);
runePuzzleLayer.addEventListener("click", (event) => {
  if (event.target === runePuzzleLayer) closeRunePuzzle();
});
runeOptions.forEach((button) => {
  button.addEventListener("click", () => handleRuneChoice(button));
});
patternPuzzleClose.addEventListener("click", closePatternPuzzle);
patternPuzzleLayer.addEventListener("click", (event) => {
  if (event.target === patternPuzzleLayer) closePatternPuzzle();
});
patternTiles.forEach((tile) => {
  tile.addEventListener("click", () => handlePatternChoice(tile));
});
inscriptionPuzzleClose.addEventListener("click", closeInscriptionPuzzle);
inscriptionPuzzleLayer.addEventListener("click", (event) => {
  if (event.target === inscriptionPuzzleLayer) closeInscriptionPuzzle();
});
inscriptionImageFrame.addEventListener("pointerenter", () => {
  inscriptionImageFrame.classList.add("lens-active");
});
inscriptionImageFrame.addEventListener("pointermove", (event) => {
  const rect = inscriptionImageFrame.getBoundingClientRect();
  inscriptionImageFrame.style.setProperty("--lens-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  inscriptionImageFrame.style.setProperty("--lens-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
});
inscriptionImageFrame.addEventListener("pointerleave", () => {
  inscriptionImageFrame.classList.remove("lens-active");
});
inscriptionGlyphs.forEach((button) => {
  button.addEventListener("click", () => revealInscriptionGlyph(button));
});
inscriptionSequenceSlots.forEach((slot) => {
  slot.addEventListener("click", () => removeInscriptionSlot(slot));
});
inscriptionOptions.forEach((button) => {
  button.addEventListener("click", () => handleInscriptionChoice(button));
});
inscriptionClear.addEventListener("click", clearInscriptionPuzzle);
inscriptionSubmit.addEventListener("click", evaluateInscriptionSequence);
inscriptionNameGlyphs.forEach((button) => {
  button.addEventListener("click", () => revealInscriptionNameGlyph(button));
});
inscriptionErrorLines.forEach((button) => {
  button.addEventListener("click", () => markInscriptionReportError(button));
});
relicPuzzleClose.addEventListener("click", closeRelicPuzzle);
relicPuzzleLayer.addEventListener("click", (event) => {
  if (event.target === relicPuzzleLayer) closeRelicPuzzle();
});
relicCollection.addEventListener("click", (event) => {
  const button = event.target.closest(".relic-choice");
  if (!button) return;
  setRelicTarget(button.dataset.relic);
});
relicPageTabsRoot.addEventListener("click", (event) => {
  const button = event.target.closest(".relic-page-tab");
  if (!button) return;
  switchRelicPage(button.dataset.page);
  const targetPoint = RELIC_POINTS[currentRelicTarget];
  relicPuzzleFeedback.textContent =
    targetPoint && targetPoint.page === currentRelicPage
      ? `正在寻找${RELIC_LABELS[currentRelicTarget]}：${targetPoint.hint}。`
      : currentRelicPage === "atlas"
        ? "在展开地图中选择墓室图纸，或点击底部任意宝物获取推荐图纸。"
        : "移动放大镜自由搜查；点到底部宝物轮廓可以获得对应线索。";
  relicPuzzleFeedback.className = "puzzle-feedback";
});
relicOverview.addEventListener("click", (event) => {
  const button = event.target.closest(".relic-region");
  if (!button) return;
  event.stopPropagation();
  switchRelicPage(button.dataset.page);
  relicPuzzleFeedback.textContent = `已进入“${RELIC_PAGES[currentRelicPage].label}”。移动放大镜寻找对应宝物痕迹。`;
  relicPuzzleFeedback.className = "puzzle-feedback";
});
relicMap.addEventListener("click", handleRelicMapClick);
relicMap.addEventListener("pointerenter", updateRelicLensFromEvent);
relicMap.addEventListener("pointermove", updateRelicLensFromEvent);
relicMap.addEventListener("pointerdown", updateRelicLensFromEvent);
relicMap.addEventListener("pointerleave", resetRelicLens);
relicHotspotLayer.addEventListener("click", (event) => {
  const button = event.target.closest(".relic-hotspot");
  if (!button) return;
  handleRelicHotspotClick(event, button);
});
pipePuzzleClose.addEventListener("click", closePipePuzzle);
pipePuzzleLayer.addEventListener("click", (event) => {
  if (event.target === pipePuzzleLayer) closePipePuzzle();
});
pipeReplayButton.addEventListener("click", () => openPipePuzzle(currentPipeLevelId));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMessage();
    closeRunePuzzle();
    closePatternPuzzle();
    closeInscriptionPuzzle();
    closeRelicPuzzle();
    closePipePuzzle();
    setJournal(false);
  }
});

load();
navigateTo({ sceneId: state.currentSceneId });
renderScene();
renderJournal();
const startupMiniGame = new URLSearchParams(window.location.search).get("miniGame");
if (startupMiniGame === INSCRIPTION_PUZZLE_ID) {
  openInscriptionPuzzle();
} else if (startupMiniGame === RELIC_PUZZLE_ID) {
  openRelicPuzzle();
} else if (startupMiniGame && PIPE_LEVELS[startupMiniGame]) {
  openPipePuzzle(startupMiniGame);
} else if (PIPE_DEMO_MODE) {
  openPipePuzzle();
}

window.M1_PIPE_LEVELS = PIPE_LEVELS;
window.openPipePuzzle = openPipePuzzle;
