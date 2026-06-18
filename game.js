const { SAVE_KEY, START_SCENE_ID, SCENES, POSITION_MAP, CONCLUSION_DATA, NPC_DATA, ANALYSIS_DATA } = window.M1_GAME_DATA;
const LEGACY_STORAGE_KEYS = ["m1-gate-immersive-state-v2-source-text"];

const state = {
  currentSceneId: START_SCENE_ID,
  currentViewIds: {},
  visitedSceneIds: [],
  visitedViewIds: {},
  completedSceneIds: [],
  completedPuzzleIds: [],
  records: [],
  journalOpen: false,
  conclusionOpen: false,
  workbenchOpen: false,
  workbench: {
    ui: {
      tab: "clues",
      chapterSceneId: START_SCENE_ID,
      panelPosition: null
    },
    graph: {
      hypotheses: [],
      userLinks: [],
      workspaces: {}
    }
  },
  selectedConclusionId: null,
  shownDialogueKeys: [],
  pendingNavigation: null,
  pendingMiniGame: null
};

const MAX_SCENE_IMAGE_SCALE = 3;
const MIN_SCENE_FRAME_WIDTH = 220;
const MIN_SCENE_FRAME_HEIGHT = 180;
const MIN_HOTSPOT_TOUCH_SIZE = 44;
const HOTSPOT_TOUCH_PADDING = 6;

const sceneRoot = document.querySelector(".scene");
const sceneStage = document.querySelector(".scene-stage");
const sceneToolbar = document.querySelector(".scene-toolbar");
const sceneHeading = document.querySelector("#sceneHeading");
const sceneSubheading = document.querySelector("#sceneSubheading");
const sceneImage = document.querySelector(".scene-image");
const hotspotLayer = document.querySelector("#hotspotLayer");
const journalToggle = document.querySelector("#journalToggle");
const journalClose = document.querySelector("#journalClose");
const journalPanel = document.querySelector("#journalPanel");
const journalList = document.querySelector("#journalList");
const conclusionToggle = document.querySelector("#conclusionToggle");
const conclusionClose = document.querySelector("#conclusionClose");
const conclusionPanel = document.querySelector("#conclusionPanel");
const conclusionList = document.querySelector("#conclusionList");
const conclusionDetail = document.querySelector("#conclusionDetail");
const messageLayer = document.querySelector("#messageLayer");
const messageKicker = document.querySelector("#messageKicker");
const messageTitle = document.querySelector("#messageTitle");
const messageBody = document.querySelector("#messageBody");
const messageClose = document.querySelector("#messageClose");
const dialogueLayer = document.querySelector("#dialogueLayer");
const dialogueKicker = document.querySelector("#dialogueKicker");
const dialogueSpeaker = document.querySelector("#dialogueSpeaker");
const dialogueTitle = document.querySelector("#dialogueTitle");
const dialogueBody = document.querySelector("#dialogueBody");
const dialogueClose = document.querySelector("#dialogueClose");
const workbenchToggle = document.querySelector("#workbenchToggle");
const workbenchLayer = document.querySelector("#workbenchLayer");
const workbenchBox = document.querySelector(".workbench-box");
const workbenchHeader = document.querySelector(".workbench-header");
const workbenchClose = document.querySelector("#workbenchClose");
const workbenchTabs = document.querySelector("#workbenchTabs");
const workbenchContent = document.querySelector("#workbenchContent");
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
let dialogueQueue = [];
let activeDialogue = null;
let workbenchPanelDrag = null;
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
  { page: "passageEast", label: "过道东壁", x: 0.44, y: 0.5, w: 0.2, h: 0.24, note: "题记、窗格" },
  { page: "rearNorth", label: "后室北壁", x: 0.72, y: 0.3, w: 0.22, h: 0.2, note: "假门、雕像" },
  { page: "rearNorthEast", label: "后室东北壁", x: 0.74, y: 0.54, w: 0.22, h: 0.18, note: "灯菜细节" },
  { page: "rearObjects", label: "后室出土物", x: 0.7, y: 0.75, w: 0.24, h: 0.17, note: "地券、人骨、铁钉" }
];
const RELIC_ITEMS = [
  { id: "paintedDoor", label: "彩绘假门", page: "frontEast", x: 0.5, y: 0.48, tolerance: 0.16, kind: "door", hint: "前室东壁中部，找对称门扇和门额线条", clueIds: ["FRONT-P0-01"], core: false },
  { id: "brickTable", label: "砖砌桌", page: "frontWest", x: 0.56, y: 0.68, tolerance: 0.11, kind: "table", hint: "前室西壁，留意器物下方偏右的横向桌面", clueIds: ["FRONT-P0-02", "FRONT-P1-02"], core: false },
  { id: "tallBottle", label: "高瓶瓶座", page: "frontWest", x: 0.3, y: 0.39, tolerance: 0.11, kind: "bottle", hint: "前室西壁左上侧，寻找细颈高瓶和下方瓶座", clueIds: ["FRONT-P0-02", "FRONT-H-02"], core: false },
  { id: "inscription", label: "纪年题记", page: "passageEast", x: 0.56, y: 0.74, tolerance: 0.15, kind: "text", hint: "过道东壁下部，找成行墨书文字", clueIds: ["PASS-P0-01", "PASS-P1-01"], core: false },
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

function completePuzzle(puzzleId) {
  if (!puzzleId || hasCompletedPuzzle(puzzleId)) return;
  state.completedPuzzleIds.push(puzzleId);
}

function completeScene(sceneId) {
  if (!sceneId || hasCompletedScene(sceneId)) return;
  const workflow = getAnalysisWorkflow(sceneId);
  if (workflow?.combination?.resultRecord?.id && !hasRecord(workflow.combination.resultRecord.id)) {
    queueDialogue(
      {
        kicker: "章节未收束",
        speaker: "记录夹",
        title: `${workflow.chapter}还未形成组合判断`,
        body: `当前只完成了现场观察。请先在记录夹里完成工具复查，并把单点异常降级或排除后，再提交${workflow.chapter}的组合判断。`
      },
      `analysis_block:${sceneId}`
    );
    return;
  }
  state.completedSceneIds.push(sceneId);
  if (getConclusionCard(sceneId)) {
    showConclusionCard(sceneId);
  }
  queueDialogue(buildSceneCompletionDialogue(sceneId), `scene_update:${sceneId}`);
  queueFinalReportSequence();
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
  return state.records.filter((record) => record.sceneId === sceneId && record.recordType === "observation").length;
}

function getSceneHotspots(scene) {
  if (!scene) return [];
  if (scene.views) return Object.values(scene.views).flatMap((view) => view.hotspots || []);
  return scene.hotspots || [];
}

function getConclusionCards() {
  return CONCLUSION_DATA?.cards || [];
}

function getConclusionRelations() {
  return CONCLUSION_DATA?.relations || [];
}

function getFinalSynthesis() {
  return CONCLUSION_DATA?.finalSynthesis || { lanes: [], chapterOrder: [], chapterContributions: {} };
}

function getNpcData() {
  return NPC_DATA || {};
}

function getAnalysisData() {
  return ANALYSIS_DATA || {};
}

function getAnalysisTracks() {
  return (
    getAnalysisData().journalTracks || [
      { id: "observation", label: "观察记录", emptyText: "已发现的信息会自动收在这里。" },
      { id: "review", label: "工具复查", emptyText: "满足条件的复查记录会出现在这里。" },
      { id: "pending", label: "待验证", emptyText: "目前没有待验证线索。" },
      { id: "excluded", label: "已排除", emptyText: "被排除的线索会显示在这里。" }
    ]
  );
}

function getAnalysisWorkflow(sceneId) {
  return getAnalysisData().sceneWorkflows?.[sceneId] || null;
}

function getRecord(recordId) {
  return state.records.find((record) => record.id === recordId) || null;
}

function getRecordLabel(recordId) {
  const record = getRecord(recordId);
  if (record) return record.title;

  const [sceneId] = String(recordId).split(":");
  const hotspot = getHotspotByRecord({ id: recordId, sceneId });
  return hotspot?.title || recordId;
}

function isRedHerringHotspot(hotspot) {
  const clueId = String(hotspot?.sourceClueId || "").trim().toUpperCase();
  return clueId === "H" || /^H\d/.test(clueId) || /(^|-)H(-|$|\d)/.test(clueId);
}

function getDefaultRecordTrack(hotspot, sceneId) {
  if (!hotspot) return "observation";
  if (getAnalysisWorkflow(sceneId) && isRedHerringHotspot(hotspot)) return "pending";
  return "observation";
}

function getSceneLabel(sceneId) {
  return getAnalysisWorkflow(sceneId)?.chapter || SCENES[sceneId]?.title || sceneId;
}

function getAllAnalysisWorkflows() {
  return Object.entries(getAnalysisData().sceneWorkflows || {}).map(([sceneId, workflow]) => ({ sceneId, workflow }));
}

function findReviewStep(stepId) {
  for (const { sceneId, workflow } of getAllAnalysisWorkflows()) {
    const step = workflow.reviewSteps?.find((item) => item.id === stepId);
    if (step) return { sceneId, workflow, step };
  }
  return null;
}

function findPendingResolution(recordId) {
  for (const { sceneId, workflow } of getAllAnalysisWorkflows()) {
    const resolution = workflow.pendingResolutions?.find((item) => item.recordId === recordId);
    if (resolution) return { sceneId, workflow, resolution };
  }
  return null;
}

function isRecordExcluded(recordId) {
  return getRecord(recordId)?.track === "excluded";
}

function getReviewStepState(step) {
  const created = hasRecord(step.resultRecord.id);
  const sourceRecordIds = step.sourceRecordIds || [];
  const collectedSourceIds = sourceRecordIds.filter((recordId) => hasRecord(recordId));
  const missingSourceIds = sourceRecordIds.filter((recordId) => !hasRecord(recordId));
  return {
    created,
    available: !created && !missingSourceIds.length,
    collectedSourceIds,
    missingSourceIds
  };
}

function getPendingResolutionState(resolution) {
  const record = getRecord(resolution.recordId);
  const missingReviewIds = (resolution.requiresReviewRecordIds || []).filter((recordId) => !hasRecord(recordId));
  return {
    record,
    available: Boolean(record) && record.track === "pending" && !missingReviewIds.length,
    missingReviewIds
  };
}

function getCombinationState(sceneId) {
  const workflow = getAnalysisWorkflow(sceneId);
  const combination = workflow?.combination;
  if (!combination) {
    return {
      combination: null,
      created: false,
      available: false,
      missingReviewIds: [],
      missingExcludedIds: []
    };
  }

  const created = hasRecord(combination.resultRecord.id);
  const missingReviewIds = (combination.requiresReviewRecordIds || []).filter((recordId) => !hasRecord(recordId));
  const missingExcludedIds = (combination.requiresExcludedRecordIds || []).filter((recordId) => !isRecordExcluded(recordId));
  return {
    combination,
    created,
    available: !created && !missingReviewIds.length && !missingExcludedIds.length,
    missingReviewIds,
    missingExcludedIds
  };
}

function buildObservationRecord(scene, hotspot) {
  return {
    id: `${scene.id}:${hotspot.id}`,
    sceneId: scene.id,
    title: hotspot.title,
    text: hotspot.record,
    clueId: hotspot.sourceClueId || "",
    sourceFile: hotspot.sourceFile || "",
    track: getDefaultRecordTrack(hotspot, scene.id),
    recordType: "observation",
    resolutionText: ""
  };
}

function enrichRecord(record) {
  const sceneId = record.sceneId || START_SCENE_ID;
  const normalizedId = record.sceneId ? record.id : `${START_SCENE_ID}:${record.id}`;
  const candidate = { ...record, id: normalizedId, sceneId };
  const hotspot = getHotspotByRecord(candidate);
  const recordType = candidate.recordType || (hotspot ? "observation" : "manual");
  const shouldPromoteToPending =
    recordType === "observation" &&
    candidate.track === "observation" &&
    hotspot &&
    getAnalysisWorkflow(sceneId) &&
    isRedHerringHotspot(hotspot);
  const shouldDemoteFromPending =
    recordType === "observation" &&
    candidate.track === "pending" &&
    hotspot &&
    !isRedHerringHotspot(hotspot);
  const track = shouldPromoteToPending
    ? "pending"
    : shouldDemoteFromPending
      ? "observation"
      : candidate.track || getDefaultRecordTrack(hotspot, sceneId);

  return {
    ...candidate,
    title: candidate.title || hotspot?.title || "",
    text: candidate.text || candidate.record || hotspot?.record || "",
    clueId: candidate.clueId || hotspot?.sourceClueId || "",
    sourceFile: candidate.sourceFile || hotspot?.sourceFile || "",
    track,
    recordType,
    resolutionText: candidate.resolutionText || ""
  };
}

function runReviewStep(stepId) {
  const match = findReviewStep(stepId);
  if (!match) return;
  const stateInfo = getReviewStepState(match.step);
  if (!stateInfo.available) return;

  addManualRecord(match.step.resultRecord);
  queueDialogue(
    {
      kicker: "工具复查",
      speaker: "记录夹",
      title: match.step.resultRecord.title,
      body: match.step.resultRecord.text
    },
    `analysis_review:${match.step.resultRecord.id}`
  );
  save();
  renderJournal();
  renderConclusions();
  flushDialogueQueue();

}

function resolvePendingRecord(recordId) {
  const match = findPendingResolution(recordId);
  if (!match) return;
  const stateInfo = getPendingResolutionState(match.resolution);
  if (!stateInfo.available || !stateInfo.record) return;

  stateInfo.record.track = "excluded";
  stateInfo.record.resolutionText = match.resolution.resolutionText;
  queueDialogue(
    {
      kicker: "误导排除",
      speaker: "记录夹",
      title: `${stateInfo.record.title}已降级`,
      body: match.resolution.resolutionText
    },
    `analysis_exclude:${recordId}`
  );
  save();
  renderJournal();
  renderConclusions();
  flushDialogueQueue();
}

function createSceneCombination(sceneId) {
  const stateInfo = getCombinationState(sceneId);
  if (!stateInfo.available || !stateInfo.combination) return;

  addManualRecord(stateInfo.combination.resultRecord);
  completeScene(sceneId);
  save();
  renderJournal();
  renderConclusions();
  flushDialogueQueue();
}

function buildSceneCompletionDialogue(sceneId) {
  const card = getConclusionCard(sceneId);
  const npcDialogue = getNpcData().sceneCompletions?.[sceneId] || {};
  const summary = card?.completionSummary || {};
  const bodyParts = [];

  if (npcDialogue.body) {
    bodyParts.push(npcDialogue.body);
  } else if (summary.body) {
    bodyParts.push(summary.body);
  }

  if (card) {
    const followUp =
      sceneId === "final_report"
        ? "终章结论卡已更新，可在线索墙继续查看主线证据如何在终章收束。"
        : `${card.chapter}结论卡已更新，可在线索墙继续查看这一章的阶段判断。`;
    bodyParts.push(followUp);
  }

  return {
    kicker: npcDialogue.kicker || (sceneId === "final_report" ? "终章更新" : "章节更新"),
    speaker: npcDialogue.speaker || "记录夹",
    title: npcDialogue.title || summary.title || card?.generationPrompt?.title || `${card?.chapter || "当前"}更新`,
    body: bodyParts.join(" ")
  };
}

function getConclusionCard(cardId) {
  return getConclusionCards().find((card) => card.id === cardId) || null;
}

function getConclusionRelation(relationId) {
  return getConclusionRelations().find((relation) => relation.id === relationId) || null;
}

function canEnterCorridor() {
  return hasCompletedScene("tomb_gate") || (getSceneRecordCount("tomb_gate") >= 3 && hasRecord("tomb_gate:lintel_back"));
}

function canEnterFrontChamber() {
  return (
    hasCompletedScene("corridor") ||
    (hasRecord("corridor:corridor_mid") &&
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
    if (requirement.excludedId) return !isRecordExcluded(requirement.excludedId);
    if (requirement.sceneId && requirement.completed) {
      return !hasCompletedScene(requirement.sceneId);
    }
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
  const list = missing
    .map((item) => `还缺：${item.label}${item.missingText ? `。${item.missingText}` : ""}`)
    .join("\n");
  return `${intro}\n${list}`;
}

function hasShownDialogue(key) {
  return state.shownDialogueKeys.includes(key);
}

function markDialogueShown(key) {
  if (!key || hasShownDialogue(key)) return;
  state.shownDialogueKeys.push(key);
}

function queueDialogue(dialogue, key) {
  if (!dialogue) return false;
  if (key && hasShownDialogue(key)) return false;
  if (key) markDialogueShown(key);
  dialogueQueue.push({ ...dialogue, key });
  save();
  return true;
}

function renderActiveDialogue() {
  if (!activeDialogue) {
    dialogueLayer.classList.add("hidden");
    return;
  }

  dialogueKicker.textContent = activeDialogue.kicker || "章节提示";
  dialogueSpeaker.textContent = activeDialogue.speaker || "";
  dialogueSpeaker.style.display = activeDialogue.speaker ? "block" : "none";
  dialogueTitle.textContent = activeDialogue.title || "";
  dialogueBody.textContent = activeDialogue.body || "";
  dialogueClose.textContent = activeDialogue.closeLabel || "继续";
  dialogueLayer.classList.remove("hidden");
}

function flushDialogueQueue() {
  if (!messageLayer.classList.contains("hidden")) return;
  if (!dialogueLayer.classList.contains("hidden")) return;
  if (!dialogueQueue.length) return;
  activeDialogue = dialogueQueue.shift();
  renderActiveDialogue();
}

function closeDialogue() {
  dialogueLayer.classList.add("hidden");
  activeDialogue = null;
  flushDialogueQueue();
}

function queueOpeningDialogues() {
  if (state.records.length || state.completedSceneIds.length || state.currentSceneId !== START_SCENE_ID) return;
  (getNpcData().opening || []).forEach((dialogue, index) => {
    queueDialogue(dialogue, `opening:${dialogue.id || index}`);
  });
}

function queueSceneEntryDialogue(sceneId) {
  const dialogue = getNpcData().sceneEntries?.[sceneId];
  queueDialogue(dialogue, `scene_entry:${sceneId}`);
}

function queueCardPrompt(cardId) {
  const card = getConclusionCard(cardId);
  if (!card?.generationPrompt) return;
  state.selectedConclusionId = cardId;
  state.conclusionOpen = true;
  queueDialogue(
    {
      kicker: "新结论卡",
      speaker: "线索墙",
      ...card.generationPrompt
    },
    `card_prompt:${cardId}`
  );
}

function queueCompletionSummary(sceneId) {
  const card = getConclusionCard(sceneId);
  if (!card?.completionSummary) return;
  queueDialogue(
    {
      kicker: "阶段总结",
      speaker: "记录夹",
      ...card.completionSummary
    },
    `scene_summary:${sceneId}`
  );
}

function queueSceneCompletionDialogue(sceneId) {
  const dialogue = getNpcData().sceneCompletions?.[sceneId];
  queueDialogue(dialogue, `scene_complete:${sceneId}`);
}

function queueFinalReportSequence() {
  const finalCard = getConclusionCard("final_report");
  if (!finalCard) return;
  if (getCardStatus(finalCard).status !== "generated") return;

  showConclusionCard("final_report");
  queueDialogue(buildSceneCompletionDialogue("final_report"), "scene_update:final_report");
}

function showConclusionCard(cardId) {
  state.selectedConclusionId = cardId;
  state.conclusionOpen = true;
  state.journalOpen = false;
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
  return enrichRecord(record);
}

function cleanupLegacyStorage() {
  LEGACY_STORAGE_KEYS.forEach((key) => {
    if (key !== SAVE_KEY) localStorage.removeItem(key);
  });
}

function normalizeWorkbench(workbench) {
  const normalized = {
    ui: {
      tab: "clues",
      chapterSceneId: START_SCENE_ID,
      panelPosition: null
    },
    graph: {
      hypotheses: [],
      userLinks: [],
      workspaces: {}
    }
  };

  if (!workbench || typeof workbench !== "object" || Array.isArray(workbench)) return normalized;

  const ui = workbench.ui && typeof workbench.ui === "object" && !Array.isArray(workbench.ui) ? workbench.ui : {};
  const tab = typeof ui.tab === "string" ? ui.tab : normalized.ui.tab;
  normalized.ui.tab = ["clues", "graph"].includes(tab) ? tab : "clues";
  normalized.ui.chapterSceneId = SCENES[ui.chapterSceneId] ? ui.chapterSceneId : START_SCENE_ID;
  normalized.ui.panelPosition =
    ui.panelPosition &&
    typeof ui.panelPosition === "object" &&
    Number.isFinite(ui.panelPosition.x) &&
    Number.isFinite(ui.panelPosition.y)
      ? { x: ui.panelPosition.x, y: ui.panelPosition.y }
      : null;

  const graph = workbench.graph && typeof workbench.graph === "object" && !Array.isArray(workbench.graph) ? workbench.graph : {};
  normalized.graph.hypotheses = Array.isArray(graph.hypotheses)
    ? graph.hypotheses
        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
        .map((item) => ({
          id: typeof item.id === "string" ? item.id : `hyp_${Math.random().toString(16).slice(2)}`,
          title: typeof item.title === "string" ? item.title : ""
        }))
        .filter((item) => item.title.trim())
    : [];
  normalized.graph.userLinks = Array.isArray(graph.userLinks)
    ? graph.userLinks
        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
        .map((item) => ({
          from: typeof item.from === "string" ? item.from : "",
          to: typeof item.to === "string" ? item.to : ""
        }))
        .filter((item) => item.from && item.to && item.from !== item.to)
    : [];

  normalized.graph.workspaces =
    graph.workspaces && typeof graph.workspaces === "object" && !Array.isArray(graph.workspaces) ? graph.workspaces : {};

  return normalized;
}

function load() {
  cleanupLegacyStorage();
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
    state.conclusionOpen = Boolean(data.conclusionOpen);
    state.workbenchOpen = false;
    state.workbench = normalizeWorkbench(data.workbench);
    state.selectedConclusionId = typeof data.selectedConclusionId === "string" ? data.selectedConclusionId : null;
    state.shownDialogueKeys = Array.isArray(data.shownDialogueKeys) ? data.shownDialogueKeys : [];
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
  state.records.push(buildObservationRecord(scene, hotspot));
  return true;
}

function addManualRecord(record) {
  if (!record?.id || state.records.some((item) => item.id === record.id)) return false;
  state.records.push(enrichRecord(record));
  return true;
}

function getCompletionHint(hotspot, addedRecord) {
  if (!addedRecord) return "";
  const scene = getCurrentScene();
  const completionHint = scene.completionHint;
  if (!completionHint || hasCompletedScene(scene.id)) return "";

  const sourceHotspot = getSceneHotspots(scene).find((item) => item.id === completionHint.sourceHotspotId);
  const requirements = completionHint.recordIds || sourceHotspot?.transition?.missingRecords || [];
  const requiredRecordIds = requirements.flatMap((requirement) => requirement.id || requirement.excludedId || requirement.anyOf || []);
  const currentRecordId = `${scene.id}:${hotspot.id}`;

  if (!requiredRecordIds.includes(currentRecordId)) return "";
  const requirementsMet = requirements.every((requirement) => {
    if (requirement.id) return hasRecord(requirement.id);
    if (requirement.excludedId) return isRecordExcluded(requirement.excludedId);
    if (requirement.anyOf) return requirement.anyOf.some((recordId) => hasRecord(recordId));
    return true;
  });
  if (!requirementsMet) return "";
  return `\n\n${completionHint.text}`;
}

function renderMessageBody(bodyText, detailImage) {
  const text = String(bodyText || "");
  if (!detailImage?.src) {
    messageBody.classList.remove("has-detail-image");
    messageBody.textContent = text;
    return;
  }

  const alt = detailImage.alt || detailImage.caption || "局部放大图";
  const caption = detailImage.caption ? `<figcaption class="message-detail-caption">${escapeHtml(detailImage.caption)}</figcaption>` : "";
  messageBody.classList.add("has-detail-image");
  messageBody.innerHTML = `
    <p class="message-text">${escapeHtml(text)}</p>
    <figure class="message-detail-figure">
      <img src="${escapeHtml(detailImage.src)}" alt="${escapeHtml(alt)}" loading="lazy" />
      ${caption}
    </figure>
  `;
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
  const pendingMiniGame = getPendingMiniGame(hotspot, transition, navigation);

  save();
  renderJournal();
  renderConclusions();
  messageKicker.textContent = "现场观察";
  messageTitle.textContent = activeTransition ? activeTransition.title : hotspot.title;
  renderMessageBody(
    `${activeTransition ? activeTransition.body : lockedBody || hotspot.body}${getCompletionHint(hotspot, addedRecord)}`,
    activeTransition ? null : hotspot.detailImage
  );
  messageClose.textContent = activeTransition?.closeLabel || "收录";
  state.pendingNavigation = navigation;
  state.pendingMiniGame = pendingMiniGame;
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
  if (!reward?.id) return;
  const clueIds = normalizeClueIds(reward.clueIds);
  addManualRecord({
    ...reward,
    clueIds,
    clueId: reward.clueId || clueIds[0] || "",
    track: reward.track || "review",
    recordType: reward.recordType || "review"
  });
  renderConclusions();
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

function getPendingMiniGame(hotspot, transition, navigation) {
  if (shouldOpenInscriptionPuzzle(hotspot)) return INSCRIPTION_PUZZLE_ID;
  if (shouldOpenRelicPuzzle(hotspot)) return RELIC_PUZZLE_ID;
  if (shouldOpenPatternPuzzle(hotspot)) return PATTERN_PUZZLE_ID;
  if (shouldOpenPipePuzzle(hotspot, transition, navigation)) return PIPE_PUZZLE_ID;
  return null;
}

function openMiniGame(puzzleId) {
  if (puzzleId === INSCRIPTION_PUZZLE_ID) {
    openInscriptionPuzzle();
    return;
  }
  if (puzzleId === RELIC_PUZZLE_ID) {
    openRelicPuzzle();
    return;
  }
  if (puzzleId === PATTERN_PUZZLE_ID) {
    openPatternPuzzle();
    return;
  }
  if (puzzleId === PIPE_PUZZLE_ID) {
    openPipePuzzle();
  }
}

function closeMessage() {
  messageLayer.classList.add("hidden");
  messageClose.textContent = "收录";
  messageBody.classList.remove("has-detail-image");
  const pendingMiniGame = state.pendingMiniGame;
  state.pendingMiniGame = null;
  if (state.pendingNavigation) {
    navigateTo(state.pendingNavigation);
    state.pendingNavigation = null;
  }
  save();
  renderScene();
  renderJournal();
  renderConclusions();
  flushDialogueQueue();
  if (pendingMiniGame) openMiniGame(pendingMiniGame);
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
    zIndex: "14",
    display: "none",
    placeItems: "center",
    padding: "24px",
    overflow: "auto",
    background: "linear-gradient(180deg, rgba(55, 39, 24, 0.42), rgba(33, 23, 14, 0.58))",
    backdropFilter: "blur(8px)"
  });
  positionMapLayer.tabIndex = -1;

  const panel = document.createElement("article");
  Object.assign(panel.style, {
    width: "min(980px, 100%)",
    maxHeight: "calc(100vh - 36px)",
    padding: "22px",
    border: "1px solid rgba(71, 52, 30, 0.44)",
    borderRadius: "28px",
    background: "linear-gradient(180deg, rgba(251, 247, 239, 0.98), rgba(239, 229, 210, 0.96))",
    boxShadow: "0 26px 70px rgba(48, 35, 22, 0.24)",
    color: "#352719",
    overflow: "auto"
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
    color: "#a37a43",
    fontSize: "13px",
    letterSpacing: "0.18em",
    textTransform: "uppercase"
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "关闭";
  Object.assign(closeButton.style, {
    minHeight: "34px",
    border: "0",
    color: "#62503d",
    background: "transparent",
    cursor: "pointer"
  });
  closeButton.addEventListener("click", closePositionMap);

  header.append(title, closeButton);

  const summary = document.createElement("p");
  summary.dataset.positionMapSummary = "true";
  Object.assign(summary.style, {
    margin: "0 0 10px",
    color: "#62503d",
    fontSize: "14px",
    lineHeight: "1.65"
  });

  const mapFrame = document.createElement("div");
  Object.assign(mapFrame.style, {
    position: "relative",
    overflow: "hidden",
    borderRadius: "18px",
    border: "1px solid rgba(71, 52, 30, 0.2)",
    background: "linear-gradient(180deg, rgba(255, 250, 242, 0.92), rgba(229, 215, 193, 0.86))"
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
  document.body.appendChild(positionMapLayer);
  return positionMapLayer;
}

function openPositionMap() {
  const layer = ensurePositionMapLayer();
  renderPositionMapSummary();
  renderPositionMapMarkers();
  layer.style.display = "grid";
  layer.focus();
}

function closePositionMap() {
  if (!positionMapLayer) return;
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement && positionMapLayer.contains(activeElement)) {
    activeElement.blur();
  }
  positionMapLayer.remove();
  positionMapLayer = null;
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
    color: "#62503d",
    fontSize: "12px"
  });

  [
    ["#352719", "当前位置"],
    ["#738974", "已完成"],
    ["#a37a43", "已探索"]
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getRequirementStatus(requirement, relationTrail = new Set()) {
  if (requirement.anyOf) {
    return {
      label: requirement.label,
      met: requirement.anyOf.some((recordId) => hasRecord(recordId)),
      detail: requirement.anyOf.some((recordId) => hasRecord(recordId)) ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.id) {
    return {
      label: requirement.label,
      met: hasRecord(requirement.id),
      detail: hasRecord(requirement.id) ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.excludedId) {
    return {
      label: requirement.label,
      met: isRecordExcluded(requirement.excludedId),
      detail: isRecordExcluded(requirement.excludedId) ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.sceneId && requirement.minCount) {
    return {
      label: requirement.label,
      met: getSceneRecordCount(requirement.sceneId) >= requirement.minCount,
      detail:
        getSceneRecordCount(requirement.sceneId) >= requirement.minCount ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.sceneId && requirement.completed) {
    return {
      label: requirement.label,
      met: hasCompletedScene(requirement.sceneId),
      detail: hasCompletedScene(requirement.sceneId) ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.cardId) {
    const card = getConclusionCard(requirement.cardId);
    const cardGenerated = Boolean(card) && getCardStatus(card).status === "generated";
    return {
      label: requirement.label,
      met: cardGenerated,
      detail: cardGenerated ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  if (requirement.relationId) {
    const relationMet = getRelationStatus(requirement.relationId, relationTrail).status === "met";
    return {
      label: requirement.label,
      met: relationMet,
      detail: relationMet ? requirement.metText || "" : requirement.missingText || ""
    };
  }

  return {
    label: requirement.label || "未命名条件",
    met: false,
    detail: requirement.missingText || ""
  };
}

function getRelationStatus(relationId, relationTrail = new Set()) {
  const relation = getConclusionRelation(relationId);
  if (!relation) {
    return {
      relation: null,
      status: "missing",
      requirements: []
    };
  }

  if (relationTrail.has(relationId)) {
    return {
      relation,
      status: "missing",
      requirements: []
    };
  }

  const nextTrail = new Set(relationTrail);
  nextTrail.add(relationId);
  const requirements = (relation.requirements || []).map((requirement) => getRequirementStatus(requirement, nextTrail));
  const metCount = requirements.filter((item) => item.met).length;
  const status = requirements.length && metCount === requirements.length ? "met" : metCount ? "partial" : "missing";

  return {
    relation,
    status,
    requirements
  };
}

function getCardStatus(card) {
  const unlockRequirements =
    card.unlockRequirements || (card.sceneId ? [{ sceneId: card.sceneId, completed: true, label: `完成${card.chapter}` }] : []);
  const unlockStates = unlockRequirements.map((requirement) => getRequirementStatus(requirement));
  const unlockMet = !unlockStates.length || unlockStates.every((item) => item.met);
  const unlockCount = unlockStates.filter((item) => item.met).length;
  const status = unlockMet ? "generated" : unlockCount ? "in_progress" : "locked";

  return {
    card,
    status,
    unlockStates,
    evidenceStates: (card.requirements || []).map((requirement) => getRequirementStatus(requirement)),
    relationStates: (card.relations || []).map((relationId) => getRelationStatus(relationId))
  };
}

function getAllCardStatuses() {
  return getConclusionCards().map(getCardStatus);
}

function getCardStatusById(cardId, statuses = getAllCardStatuses()) {
  return statuses.find((item) => item.card.id === cardId) || null;
}

function getSynthesisLaneStatus(lane, statuses) {
  const cardStatuses = (lane.cardIds || []).map((cardId) => getCardStatusById(cardId, statuses)).filter(Boolean);
  const completeCount = cardStatuses.filter((item) => item.status === "generated").length;

  return {
    completeCount,
    totalCount: cardStatuses.length,
    complete: cardStatuses.length > 0 && completeCount === cardStatuses.length,
    cardStatuses
  };
}

function buildConclusionFlowHtml(statuses) {
  const synthesis = getFinalSynthesis();
  const order = synthesis.chapterOrder || [];
  if (!order.length) return "";

  const steps = order
    .map((cardId, index) => {
      const item = getCardStatusById(cardId, statuses);
      if (!item) return "";

      return `
        ${index ? '<span class="conclusion-flow-arrow" aria-hidden="true">→</span>' : ""}
        <button class="conclusion-flow-step is-${item.status}" type="button" data-conclusion-card="${escapeHtml(cardId)}">
          <span>${escapeHtml(item.card.chapter)}</span>
          <strong>${escapeHtml(getStatusLabel(item.status))}</strong>
        </button>
      `;
    })
    .join("");

  return `
    <section class="conclusion-flow" aria-label="章节结论汇入终章">
      ${steps}
    </section>
  `;
}

function buildFinalSynthesisHtml(selected, statuses) {
  const synthesis = getFinalSynthesis();
  const lanes = synthesis.lanes || [];
  if (!selected || !lanes.length) return "";

  if (selected.card.id === "final_report") {
    return `
      <section>
        <h3 class="conclusion-section-title">${escapeHtml(synthesis.title || "终章总线索")}</h3>
        <p class="empty-note">${escapeHtml(synthesis.summary || "章节结论会汇入终章。")}</p>
        <div class="synthesis-lane-grid">
          ${lanes
            .map((lane) => {
              const laneState = getSynthesisLaneStatus(lane, statuses);
              return `
                <article class="synthesis-lane-card">
                  <div class="conclusion-meta">
                    <span class="status-chip is-${laneState.complete ? "met" : laneState.completeCount ? "partial" : "missing"}">
                      ${laneState.completeCount}/${laneState.totalCount}
                    </span>
                  </div>
                  <h4>${escapeHtml(lane.title)}</h4>
                  <p>${escapeHtml(lane.summary)}</p>
                  <div class="relation-requirements">
                    ${laneState.cardStatuses
                      .map(
                        (item) =>
                          `<span class="relation-requirement${item.status === "generated" ? " is-met" : ""}">${escapeHtml(item.card.chapter)}</span>`
                      )
                      .join("")}
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  const laneIds = synthesis.chapterContributions?.[selected.card.id] || [];
  const linkedLanes = lanes.filter((lane) => laneIds.includes(lane.id));
  if (!linkedLanes.length) return "";

  return `
    <section>
      <h3 class="conclusion-section-title">汇入终章总线索</h3>
      <div class="synthesis-lane-grid">
        ${linkedLanes
          .map(
            (lane) => `
              <article class="synthesis-lane-card">
                <div class="conclusion-meta">
                  <span class="status-chip is-${selected.status === "generated" ? "met" : "partial"}">
                    ${selected.status === "generated" ? "已汇入" : "完成后汇入"}
                  </span>
                </div>
                <h4>${escapeHtml(lane.title)}</h4>
                <p>${escapeHtml(lane.summary)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function ensureSelectedConclusionCard() {
  const statuses = getAllCardStatuses();
  if (!statuses.length) {
    state.selectedConclusionId = null;
    return null;
  }

  const selected = statuses.find((item) => item.card.id === state.selectedConclusionId);
  if (selected) return selected;

  const generatedStatuses = statuses.filter((item) => item.status === "generated");
  const fallback = generatedStatuses.at(-1) || statuses.find((item) => item.status === "in_progress") || statuses[0] || null;
  if (!fallback) {
    state.selectedConclusionId = null;
    return null;
  }
  state.selectedConclusionId = fallback.card.id;
  return fallback;
}

function setConclusionOpen(open) {
  state.conclusionOpen = open;
  if (open) {
    state.journalOpen = false;
    state.workbenchOpen = false;
  }
  save();
  renderJournal();
  renderConclusions();
  renderWorkbench();
}

function selectConclusionCard(cardId) {
  state.selectedConclusionId = cardId;
  save();
  renderConclusions();
}

function setJournal(open) {
  state.journalOpen = open;
  if (open) {
    state.conclusionOpen = false;
    state.workbenchOpen = false;
  }
  save();
  renderConclusions();
  renderJournal();
  renderWorkbench();
}

function setWorkbenchOpen(open, tab = state.workbench.ui.tab) {
  const wasOpen = state.workbenchOpen;
  state.workbenchOpen = open;
  if (open) {
    state.journalOpen = false;
    state.conclusionOpen = false;
  }
  if (open && typeof tab === "string") {
    state.workbench.ui.tab = ["clues", "graph"].includes(tab) ? tab : "clues";
  }
  if (open && !wasOpen) {
    state.workbench.ui.chapterSceneId = getWorkbenchSceneIdForCurrentScene();
  }
  if (open && !SCENES[state.workbench.ui.chapterSceneId]) {
    state.workbench.ui.chapterSceneId = START_SCENE_ID;
  }
  save();
  if (open) {
    renderJournal();
    renderConclusions();
  }
  renderWorkbench();
}

function getSceneViewportSize() {
  const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 0);
  const viewportHeight = Math.max(320, window.innerHeight || document.documentElement.clientHeight || 0);
  return {
    width: viewportWidth,
    height: viewportHeight
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSceneFitProfile(viewport) {
  if (viewport.width <= 560) {
    return {
      widthRatio: 0.92,
      heightRatio: 0.9
    };
  }

  if (viewport.width <= 900) {
    return {
      widthRatio: 0.9,
      heightRatio: 0.88
    };
  }

  return {
    widthRatio: 0.88,
    heightRatio: 0.9
  };
}

function getFocusedViewProfile(viewport) {
  if (viewport.width <= 560) {
    return {
      widthRatio: 1.34,
      heightRatio: 0.92,
      hotspotMargin: 16,
      hotspotWeight: 0.74,
      underlayScale: 1.28,
      underlayOpacity: 0.28
    };
  }

  if (viewport.width <= 900) {
    return {
      widthRatio: 1.08,
      heightRatio: 0.94,
      hotspotMargin: 22,
      hotspotWeight: 0.7,
      underlayScale: 1.24,
      underlayOpacity: 0.28
    };
  }

  return {
    widthRatio: 0.88,
    heightRatio: 0.985,
    hotspotMargin: 28,
    hotspotWeight: 0.5,
    underlayScale: 1.28,
    underlayOpacity: 0.28,
    completeViewport: true
  };
}

function getNormalizedHotspotBounds(hotspot) {
  if (hotspot.shape === "rect") {
    const [x1, y1, x2, y2] = hotspot.rect;
    return { x1, y1, x2, y2 };
  }

  const [cx, cy] = hotspot.center;
  const radius = hotspot.radius || 0;
  return {
    x1: cx - radius,
    y1: cy - radius,
    x2: cx + radius,
    y2: cy + radius
  };
}

function getViewInteractiveBounds(view) {
  const hotspots = [...(view?.hotspots || [])];
  if (POSITION_MAP?.hotspot) hotspots.push(POSITION_MAP.hotspot);
  if (!hotspots.length) {
    return {
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1
    };
  }

  return hotspots.reduce(
    (bounds, hotspot) => {
      const next = getNormalizedHotspotBounds(hotspot);
      return {
        x1: Math.min(bounds.x1, next.x1),
        y1: Math.min(bounds.y1, next.y1),
        x2: Math.max(bounds.x2, next.x2),
        y2: Math.max(bounds.y2, next.y2)
      };
    },
    { x1: 1, y1: 1, x2: 0, y2: 0 }
  );
}

function getFocusedStageMetrics({ view, viewport, safeArea, safeWidth, safeHeight, width, height }) {
  const profile = getFocusedViewProfile(viewport);
  const hotspotBounds = getViewInteractiveBounds(view);
  if (profile.completeViewport) {
    const scale = Math.min(
      MAX_SCENE_IMAGE_SCALE,
      (viewport.width * profile.widthRatio) / width,
      (viewport.height * profile.heightRatio) / height
    );
    const stageWidth = Math.round(width * scale);
    const stageHeight = Math.round(height * scale);

    return {
      stageWidth,
      stageHeight,
      stageLeft: Math.round((viewport.width - stageWidth) / 2),
      stageTop: Math.round((viewport.height - stageHeight) / 2),
      underlayScale: profile.underlayScale,
      underlayOpacity: profile.underlayOpacity
    };
  }

  if (profile.coverViewport) {
    const scale = Math.min(
      MAX_SCENE_IMAGE_SCALE,
      Math.max(viewport.width / width, viewport.height / height) * profile.coverScale
    );
    const stageWidth = Math.round(width * scale);
    const stageHeight = Math.round(height * scale);
    const hotspotCenterX = (hotspotBounds.x1 + hotspotBounds.x2) / 2;
    const hotspotCenterY = (hotspotBounds.y1 + hotspotBounds.y2) / 2;
    const focusX = hotspotCenterX * profile.hotspotWeight + 0.5 * (1 - profile.hotspotWeight);
    const focusY = hotspotCenterY * profile.hotspotWeight + 0.5 * (1 - profile.hotspotWeight);
    const preferredLeft = viewport.width / 2 - focusX * stageWidth;
    const preferredTop = viewport.height / 2 - focusY * stageHeight;
    const minLeft = Math.min(0, viewport.width - stageWidth);
    const minTop = Math.min(0, viewport.height - stageHeight);

    return {
      stageWidth,
      stageHeight,
      stageLeft: Math.round(clamp(preferredLeft, minLeft, 0)),
      stageTop: Math.round(clamp(preferredTop, minTop, 0)),
      underlayScale: profile.underlayScale,
      underlayOpacity: profile.underlayOpacity
    };
  }

  const hotspotWidth = Math.max(0.08, hotspotBounds.x2 - hotspotBounds.x1);
  const hotspotHeight = Math.max(0.08, hotspotBounds.y2 - hotspotBounds.y1);
  const margin = Math.min(profile.hotspotMargin, Math.max(8, safeWidth * 0.06), Math.max(8, safeHeight * 0.06));
  const maxScaleByHotspots = Math.min(
    (safeWidth - margin * 2) / (width * hotspotWidth),
    (safeHeight - margin * 2) / (height * hotspotHeight)
  );
  const desiredScale = Math.max((safeWidth * profile.widthRatio) / width, (safeHeight * profile.heightRatio) / height);
  const containScale = Math.min(safeWidth / width, safeHeight / height);
  const scale = Math.max(containScale, Math.min(MAX_SCENE_IMAGE_SCALE, desiredScale, maxScaleByHotspots));
  const stageWidth = Math.round(width * scale);
  const stageHeight = Math.round(height * scale);
  const hotspotCenterX = (hotspotBounds.x1 + hotspotBounds.x2) / 2;
  const hotspotCenterY = (hotspotBounds.y1 + hotspotBounds.y2) / 2;
  const focusX = hotspotCenterX * profile.hotspotWeight + 0.5 * (1 - profile.hotspotWeight);
  const focusY = hotspotCenterY * profile.hotspotWeight + 0.5 * (1 - profile.hotspotWeight);
  const preferredLeft = safeArea.left + safeWidth / 2 - focusX * stageWidth;
  const preferredTop = safeArea.top + safeHeight / 2 - focusY * stageHeight;
  const minLeft = safeArea.left + margin - hotspotBounds.x1 * stageWidth;
  const maxLeft = safeArea.left + safeWidth - margin - hotspotBounds.x2 * stageWidth;
  const minTop = safeArea.top + margin - hotspotBounds.y1 * stageHeight;
  const maxTop = safeArea.top + safeHeight - margin - hotspotBounds.y2 * stageHeight;
  const stageLeft = Math.round(minLeft <= maxLeft ? clamp(preferredLeft, minLeft, maxLeft) : preferredLeft);
  const stageTop = Math.round(minTop <= maxTop ? clamp(preferredTop, minTop, maxTop) : preferredTop);

  return {
    stageWidth,
    stageHeight,
    stageLeft,
    stageTop,
    underlayScale: profile.underlayScale,
    underlayOpacity: profile.underlayOpacity
  };
}

function shouldUseCompleteStageLayout(viewport) {
  return viewport.width > 900;
}

function readSceneSafeArea() {
  if (!sceneStage) {
    return {
      top: 16,
      right: 16,
      bottom: 16,
      left: 16
    };
  }

  const styles = window.getComputedStyle(sceneStage);
  return {
    top: parseFloat(styles.getPropertyValue("--scene-safe-top")) || 16,
    right: parseFloat(styles.getPropertyValue("--scene-safe-right")) || 16,
    bottom: parseFloat(styles.getPropertyValue("--scene-safe-bottom")) || 16,
    left: parseFloat(styles.getPropertyValue("--scene-safe-left")) || 16
  };
}

function updateSceneSafeArea() {
  if (!sceneStage) return;
  const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 0);
  const viewportHeight = Math.max(320, window.innerHeight || document.documentElement.clientHeight || 0);
  const baseInset = viewportWidth <= 560 ? 8 : 16;
  let topInset = baseInset;
  let rightInset = baseInset;
  let bottomInset = baseInset;
  let leftInset = baseInset;

  if (sceneToolbar) {
    const rect = sceneToolbar.getBoundingClientRect();
    const toolbarConsumesFullRow = rect.width >= viewportWidth - baseInset * 4 || viewportWidth <= 900;
    topInset = Math.max(topInset, Math.ceil(rect.bottom + baseInset));
    if (!toolbarConsumesFullRow) {
      rightInset = Math.max(rightInset, Math.ceil(viewportWidth - rect.left + baseInset));
    }
  }

  sceneStage.style.setProperty("--scene-safe-top", `${topInset}px`);
  sceneStage.style.setProperty("--scene-safe-right", `${rightInset}px`);
  sceneStage.style.setProperty("--scene-safe-bottom", `${bottomInset}px`);
  sceneStage.style.setProperty("--scene-safe-left", `${leftInset}px`);
}

function updateSceneStageMetrics(view = getCurrentView()) {
  if (!sceneStage) return;
  const width = Number(view?.image?.width) || sceneImage.naturalWidth || 1280;
  const height = Number(view?.image?.height) || sceneImage.naturalHeight || 960;
  if (!width || !height) return;

  const viewport = getSceneViewportSize();
  const safeArea = readSceneSafeArea();
  const safeWidth = Math.max(
    MIN_SCENE_FRAME_WIDTH,
    viewport.width - safeArea.left - safeArea.right
  );
  const safeHeight = Math.max(
    MIN_SCENE_FRAME_HEIGHT,
    viewport.height - safeArea.top - safeArea.bottom
  );
  const fitProfile = getSceneFitProfile(viewport);
  const availableWidth = Math.max(MIN_SCENE_FRAME_WIDTH, safeWidth * fitProfile.widthRatio);
  const availableHeight = Math.max(MIN_SCENE_FRAME_HEIGHT, safeHeight * fitProfile.heightRatio);
  const maxScaleByViewport = Math.min(availableWidth / width, availableHeight / height);
  const minScaleByFrame = Math.min(
    safeWidth / width,
    safeHeight / height,
    Math.max(MIN_SCENE_FRAME_WIDTH / width, MIN_SCENE_FRAME_HEIGHT / height)
  );
  const scale = Math.min(MAX_SCENE_IMAGE_SCALE, Math.max(maxScaleByViewport, minScaleByFrame));
  const defaultMetrics = {
    stageWidth: Math.round(width * scale),
    stageHeight: Math.round(height * scale),
    underlayScale: 1.26,
    underlayOpacity: 0.28
  };
  defaultMetrics.stageLeft = Math.round(safeArea.left + (safeWidth - defaultMetrics.stageWidth) / 2);
  defaultMetrics.stageTop = Math.round(safeArea.top + (safeHeight - defaultMetrics.stageHeight) / 2);
  const useCompleteStageLayout = shouldUseCompleteStageLayout(viewport);
  const metrics = useCompleteStageLayout
    ? getFocusedStageMetrics({ view, viewport, safeArea, safeWidth, safeHeight, width, height })
    : defaultMetrics;

  sceneStage.classList.toggle("is-complete-stage-layout", useCompleteStageLayout);
  sceneStage.style.setProperty("--scene-stage-width", `${metrics.stageWidth}px`);
  sceneStage.style.setProperty("--scene-stage-height", `${metrics.stageHeight}px`);
  sceneStage.style.setProperty("--scene-stage-left", `${metrics.stageLeft}px`);
  sceneStage.style.setProperty("--scene-stage-top", `${metrics.stageTop}px`);
  sceneStage.style.setProperty("--scene-underlay-scale", String(metrics.underlayScale));
  sceneStage.style.setProperty("--scene-underlay-opacity", String(metrics.underlayOpacity));
  sceneStage.style.setProperty("--scene-stage-ratio", `${width} / ${height}`);
  sceneStage.style.setProperty("--scene-stage-max-scale", String(MAX_SCENE_IMAGE_SCALE));
}

function renderScene() {
  const scene = getCurrentScene();
  const view = getCurrentView();
  const { image } = view;
  markVisited(scene.id, view.id);
  save();

  sceneRoot.setAttribute("aria-label", view.title || scene.title);
  sceneRoot.dataset.sceneId = scene.id;
  sceneImage.src = image.src;
  sceneImage.alt = image.alt;
  sceneStage.style.setProperty("--scene-stage-backdrop", `url("${image.src}")`);
  hotspotLayer.setAttribute("viewBox", `0 0 ${image.width} ${image.height}`);
  hotspotLayer.setAttribute("aria-label", `${view.title || scene.title}可点击线索区域`);
  if (sceneHeading) sceneHeading.textContent = scene.title || "当前场景";
  if (sceneSubheading) sceneSubheading.textContent = getCurrentPositionLabel();
  document.title = `白沙宋墓 M1 - ${getCurrentPositionLabel()}`;
  updateSceneSafeArea();
  updateSceneStageMetrics(view);
  renderHotspots(view);
}

function getSceneStageScale(image) {
  const styles = window.getComputedStyle(sceneStage);
  const stageWidth = parseFloat(styles.getPropertyValue("--scene-stage-width")) || sceneStage.clientWidth || image.width;
  const stageHeight = parseFloat(styles.getPropertyValue("--scene-stage-height")) || sceneStage.clientHeight || image.height;
  return {
    x: stageWidth / image.width,
    y: stageHeight / image.height
  };
}

function getHotspotBounds(hotspot, image) {
  if (hotspot.shape === "rect") {
    const [x1, y1, x2, y2] = hotspot.rect;
    return {
      x1: x1 * image.width,
      y1: y1 * image.height,
      x2: x2 * image.width,
      y2: y2 * image.height
    };
  }

  const [cx, cy] = hotspot.center;
  const radius = hotspot.radius * Math.min(image.width, image.height);
  return {
    x1: cx * image.width - radius,
    y1: cy * image.height - radius,
    x2: cx * image.width + radius,
    y2: cy * image.height + radius
  };
}

function clampHotspotRange(start, end, minSize, limit) {
  const size = Math.min(limit, Math.max(minSize, end - start));
  const center = (start + end) / 2;
  const nextStart = clamp(center - size / 2, 0, limit - size);
  return {
    start: nextStart,
    end: nextStart + size
  };
}

function getHotspotHitBounds(hotspot, image) {
  const bounds = getHotspotBounds(hotspot, image);
  const scale = getSceneStageScale(image);
  const minWidth = MIN_HOTSPOT_TOUCH_SIZE / Math.max(scale.x, 0.01);
  const minHeight = MIN_HOTSPOT_TOUCH_SIZE / Math.max(scale.y, 0.01);
  const paddingX = HOTSPOT_TOUCH_PADDING / Math.max(scale.x, 0.01);
  const paddingY = HOTSPOT_TOUCH_PADDING / Math.max(scale.y, 0.01);
  const xRange = clampHotspotRange(bounds.x1 - paddingX, bounds.x2 + paddingX, minWidth, image.width);
  const yRange = clampHotspotRange(bounds.y1 - paddingY, bounds.y2 + paddingY, minHeight, image.height);

  return {
    x: xRange.start,
    y: yRange.start,
    width: xRange.end - xRange.start,
    height: yRange.end - yRange.start
  };
}

function bindHotspotActivation(element, hotspot) {
  element.addEventListener("click", () => openMessage(hotspot));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMessage(hotspot);
    }
  });
}

function makeHotspotHitArea(hotspot, image) {
  const ns = "http://www.w3.org/2000/svg";
  const bounds = getHotspotHitBounds(hotspot, image);
  const element = document.createElementNS(ns, "rect");
  element.classList.add("hotspot-hit-area");
  element.setAttribute("x", bounds.x);
  element.setAttribute("y", bounds.y);
  element.setAttribute("width", bounds.width);
  element.setAttribute("height", bounds.height);
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("focusable", "false");
  bindHotspotActivation(element, hotspot);
  return element;
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
  bindHotspotActivation(element, hotspot);
  const hitArea = makeHotspotHitArea(hotspot, image);
  group.appendChild(hitArea);
  group.appendChild(element);
  if (shouldRenderNavLabel(hotspot)) {
    const label = makeNavLabel(hotspot, image);
    group.appendChild(label);
    if (hotspot.navLabelAlwaysVisible) {
      showNavLabel(label);
    }
    [hitArea, element].forEach((target) => {
      target.addEventListener("mouseenter", () => showNavLabel(label));
      target.addEventListener("mouseleave", () => hideNavLabel(label, hotspot));
    });
    element.addEventListener("focus", () => showNavLabel(label));
    element.addEventListener("blur", () => hideNavLabel(label, hotspot));
  }
  return group;
}

function shouldRenderNavLabel(hotspot) {
  if (!getHotspotHoverLabel(hotspot)) return false;
  if (hotspot.navLabelCompletedSceneId) {
    return hasCompletedScene(hotspot.navLabelCompletedSceneId);
  }
  return true;
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

  label.textContent = getHotspotHoverLabel(hotspot);
  label.setAttribute("x", x);
  label.setAttribute("y", y);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("dominant-baseline", "middle");
  label.setAttribute("fill", "#f4ead6");
  label.setAttribute("stroke", "#000");
  label.setAttribute("stroke-opacity", "0.72");
  label.setAttribute("stroke-width", hotspot.navLabelEmphasis ? "10" : "7");
  label.setAttribute("paint-order", "stroke");
  label.setAttribute("opacity", hotspot.navLabelAlwaysVisible ? getNavLabelVisibleOpacity(hotspot) : "0");
  label.setAttribute("font-size", Math.max(34, Math.min(92, image.width * (hotspot.navLabelEmphasis ? 0.029 : 0.025))));
  label.setAttribute("font-weight", hotspot.navLabelEmphasis ? "700" : "600");
  label.setAttribute("font-family", "Microsoft YaHei, Noto Sans SC, sans-serif");
  label.setAttribute("pointer-events", "none");
  return label;
}

function getHotspotHoverLabel(hotspot) {
  return hotspot.navLabel || hotspot.label || hotspot.title || "";
}

function getNavLabelVisibleOpacity(hotspot) {
  return hotspot.navLabelEmphasis ? "0.9" : "0.72";
}

function showNavLabel(label) {
  label.setAttribute("opacity", "0.92");
}

function hideNavLabel(label, hotspot) {
  label.setAttribute("opacity", hotspot?.navLabelAlwaysVisible ? getNavLabelVisibleOpacity(hotspot) : "0");
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
  const previousSceneId = state.currentSceneId;
  completeScene(completeSceneId);

  if (sceneId && SCENES[sceneId]) {
    state.currentSceneId = sceneId;
  }

  const scene = getCurrentScene();
  const nextViewId = viewId || state.currentViewIds[scene.id] || getDefaultViewId(scene);
  if (nextViewId && scene.views?.[nextViewId]) {
    state.currentViewIds[scene.id] = nextViewId;
  }

  if (state.currentSceneId !== previousSceneId) {
    queueSceneEntryDialogue(state.currentSceneId);
  }
}

function getJournalRecordTypeLabel(record) {
  if (record.recordType === "combination") return "组合判断";
  if (record.recordType === "review") return "工具复查";
  if (record.track === "pending") return "待验证";
  if (record.track === "excluded") return "已排除";
  return "现场观察";
}

function getTrackRecords(trackId) {
  const records = state.records.filter((record) => record.track === trackId);
  if (trackId !== "pending") return records.slice().reverse();

  return records
    .map((record, index) => {
      const match = findPendingResolution(record.id);
      const resolutionState = match ? getPendingResolutionState(match.resolution) : null;
      return {
        record,
        index,
        available: Boolean(resolutionState?.available),
        missingCount: resolutionState?.missingReviewIds.length ?? 99,
        priority: match?.resolution.priority ?? 1000
      };
    })
    .sort(
      (a, b) =>
        Number(b.available) - Number(a.available) ||
        a.priority - b.priority ||
        a.missingCount - b.missingCount ||
        b.index - a.index
    )
    .map((item) => item.record);
}

function shouldShowReviewProgress(sceneId, step, stateInfo) {
  if (stateInfo.created || stateInfo.available || !step.guideSteps?.length) return false;
  return (
    hasVisitedScene(sceneId) ||
    stateInfo.collectedSourceIds.length > 0 ||
    stateInfo.missingSourceIds.some((recordId) => getRecord(recordId)?.sceneId === sceneId)
  );
}

function getAvailableReviewActions() {
  return getAllAnalysisWorkflows().flatMap(({ sceneId, workflow }) =>
    (workflow.reviewSteps || [])
      .map((step) => ({ sceneId, workflow, step, stateInfo: getReviewStepState(step) }))
      .filter((item) => item.stateInfo.available || shouldShowReviewProgress(item.sceneId, item.step, item.stateInfo))
  );
}

function getReviewProgressSteps(step) {
  return (step.guideSteps || []).map((guide) => {
    const recordIds = guide.recordIds || [];
    const collectedCount = recordIds.filter((recordId) => hasRecord(recordId)).length;
    return {
      ...guide,
      collectedCount,
      totalCount: recordIds.length,
      complete: recordIds.length > 0 && collectedCount === recordIds.length
    };
  });
}

function getAvailableCombinationActions() {
  return getAllAnalysisWorkflows()
    .map(({ sceneId, workflow }) => ({ sceneId, workflow, stateInfo: getCombinationState(sceneId) }))
    .filter((item) => item.stateInfo.available || shouldShowCombinationProgress(item.sceneId, item.stateInfo));
}

function shouldShowCombinationProgress(sceneId, stateInfo) {
  if (!stateInfo.combination || stateInfo.created) return false;
  return (
    hasVisitedScene(sceneId) ||
    stateInfo.available ||
    (stateInfo.combination.requiresReviewRecordIds || []).some((recordId) => hasRecord(recordId)) ||
    (stateInfo.combination.requiresExcludedRecordIds || []).some((recordId) => getRecord(recordId))
  );
}

function getAnalysisRecordLabel(recordId) {
  for (const { workflow } of getAllAnalysisWorkflows()) {
    const reviewStep = (workflow.reviewSteps || []).find((step) => step.resultRecord.id === recordId);
    if (reviewStep) return reviewStep.resultRecord.title;
    if (workflow.combination?.resultRecord?.id === recordId) return workflow.combination.resultRecord.title;
  }
  return getRecordLabel(recordId);
}

function getCombinationProgressSteps(combination) {
  if (combination.requirementSteps?.length) {
    return combination.requirementSteps.map((requirement) => {
      const complete = requirement.excludedId ? isRecordExcluded(requirement.excludedId) : hasRecord(requirement.id);
      return {
        label: requirement.label,
        detail: complete ? requirement.metText || requirement.detail : requirement.missingText || requirement.detail,
        mobileDetail: requirement.mobileDetail,
        complete,
        statusLabel: complete ? "已完成" : requirement.excludedId ? "待降级" : "待复查"
      };
    });
  }

  const reviewSteps = (combination.requiresReviewRecordIds || []).map((recordId) => ({
    label: getAnalysisRecordLabel(recordId),
    detail: "完成这条工具复查后，才能进入章节组合判断。",
    complete: hasRecord(recordId),
    statusLabel: hasRecord(recordId) ? "已完成" : "待复查"
  }));
  const excludedSteps = (combination.requiresExcludedRecordIds || []).map((recordId) => ({
    label: getRecordLabel(recordId),
    detail: "将这条单点异常降级或排除后，才能进入章节组合判断。",
    complete: isRecordExcluded(recordId),
    statusLabel: isRecordExcluded(recordId) ? "已完成" : "待降级"
  }));
  return [...reviewSteps, ...excludedSteps];
}

function buildJournalActionCard({
  eyebrow,
  title,
  body,
  note,
  buttonLabel,
  actionName,
  actionValue,
  chainItems = [],
  progressLabel,
  progressSteps = [],
  disabled = false
}) {
  const article = document.createElement("article");
  article.className = "journal-action-card";
  const chainHtml = chainItems.length
    ? `
      <div class="evidence-chain-panel" aria-label="证据链小面板">
        ${chainItems
          .map(
            (item, index) => `
              ${index ? '<span class="evidence-chain-arrow" aria-hidden="true">→</span>' : ""}
              <span class="evidence-chain-node">
                <strong>${escapeHtml(item.label)}</strong>
                ${item.role ? `<em>${escapeHtml(item.role)}</em>` : ""}
                <span>${escapeHtml(item.detail)}</span>
              </span>
            `
          )
          .join("")}
      </div>
    `
    : "";
  const progressHtml = progressSteps.length
    ? `
      <div class="review-progress-panel" aria-label="${escapeHtml(progressLabel || "复查点击顺序")}">
        ${progressSteps
          .map((item) => {
            const status =
              item.statusLabel || (item.complete ? "已完成" : item.collectedCount ? `${item.collectedCount}/${item.totalCount}` : "待点击");
            const stateClass = item.complete ? "is-complete" : item.statusLabel || item.collectedCount ? "is-partial" : "is-missing";
            return `
              <span class="review-progress-step ${stateClass}">
                <strong>${escapeHtml(item.label)}</strong>
                <em>${escapeHtml(status)}</em>
                <span class="review-progress-detail${item.mobileDetail ? " is-desktop" : ""}">${escapeHtml(item.detail || "")}</span>
                ${
                  item.mobileDetail
                    ? `<span class="review-progress-detail is-mobile">${escapeHtml(item.mobileDetail)}</span>`
                    : ""
                }
              </span>
            `;
          })
          .join("")}
      </div>
    `
    : "";
  const actionButton = disabled
    ? `<button class="primary-button" type="button" disabled>${escapeHtml(buttonLabel)}</button>`
    : `<button class="primary-button" type="button" data-${actionName}="${escapeHtml(actionValue)}">${escapeHtml(buttonLabel)}</button>`;
  article.innerHTML = `
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(body)}</p>
    ${chainHtml}
    ${progressHtml}
    ${note ? `<p class="journal-note">${escapeHtml(note)}</p>` : ""}
    <div class="journal-card-actions">
      ${actionButton}
    </div>
  `;
  return article;
}

function buildJournalNote(note) {
  const noteInfo = typeof note === "string" ? { text: note } : note;
  const className = `journal-note${noteInfo.tone ? ` is-${noteInfo.tone}` : ""}`;
  return `<p class="${className}">${escapeHtml(noteInfo.text)}</p>`;
}

function renderJournal() {
  journalPanel.classList.toggle("hidden", !state.journalOpen);
  journalToggle.setAttribute("aria-expanded", String(state.journalOpen));
  journalToggle.textContent = state.records.length ? `记录 ${state.records.length}` : "记录";
  journalList.innerHTML = "";
  updateSceneSafeArea();

  getAnalysisTracks().forEach((track) => {
    const section = document.createElement("section");
    section.className = "journal-section";
    const records = getTrackRecords(track.id);
    const sectionActions = [];

    if (track.id === "review") {
      getAvailableReviewActions().forEach((item) => {
        const missingLabels = item.stateInfo.missingSourceIds.map((recordId) => getRecordLabel(recordId));
        const progressSteps = getReviewProgressSteps(item.step);
        const isAvailable = item.stateInfo.available;
        sectionActions.push(
          buildJournalActionCard({
            eyebrow: `${item.workflow.chapter} / 工具复查`,
            title: item.step.resultRecord.title,
            body: item.step.description,
            note: isAvailable
              ? `证据已收齐：${item.step.sourceRecordIds.map((recordId) => getRecordLabel(recordId)).join("、")}`
              : `按下方顺序继续点击；还缺：${missingLabels.join("、")}`,
            buttonLabel: isAvailable ? item.step.buttonLabel : `还缺 ${missingLabels.length} 项证据`,
            actionName: "run-review-step",
            actionValue: item.step.id,
            chainItems: item.step.chainItems || [],
            progressLabel: item.step.progressLabel,
            progressSteps,
            disabled: !isAvailable
          })
        );
      });

      getAvailableCombinationActions().forEach((item) => {
        const progressSteps = getCombinationProgressSteps(item.stateInfo.combination);
        const missingReviewCount = item.stateInfo.missingReviewIds.length;
        const missingExcludedCount = item.stateInfo.missingExcludedIds.length;
        const missingCount = missingReviewCount + missingExcludedCount;
        const isAvailable = item.stateInfo.available;
        sectionActions.push(
          buildJournalActionCard({
            eyebrow: `${item.workflow.chapter} / 章节组合`,
            title: item.stateInfo.combination.resultRecord.title,
            body: item.stateInfo.combination.description,
            note: isAvailable
              ? `复查和降级都已完成，可以生成${item.workflow.chapter}组合判断；生成后会进入结论墙。`
              : `还缺 ${missingCount} 项：${missingReviewCount} 条复查、${missingExcludedCount} 条降级。按下方清单补齐后再生成组合判断。`,
            buttonLabel: isAvailable ? item.stateInfo.combination.buttonLabel : `还缺 ${missingCount} 项条件`,
            actionName: "create-scene-combo",
            actionValue: item.sceneId,
            progressLabel: item.stateInfo.combination.progressLabel,
            progressSteps,
            disabled: !isAvailable
          })
        );
      });
    }

    const header = document.createElement("div");
    header.className = "journal-section-header";
    header.innerHTML = `
      <h2 class="journal-section-title">${escapeHtml(track.label)}</h2>
      <span class="journal-count">${records.length}${sectionActions.length ? ` + ${sectionActions.length} 条提示/动作` : ""}</span>
    `;
    section.appendChild(header);

    sectionActions.forEach((action) => section.appendChild(action));

    if (!records.length) {
      if (!sectionActions.length) {
        const empty = document.createElement("p");
        empty.className = "empty-note";
        empty.textContent = track.emptyText;
        section.appendChild(empty);
      }
      journalList.appendChild(section);
      return;
    }

    records.forEach((record) => {
      const item = document.createElement("article");
      item.className = "journal-card";
      const actionButtons = [];
      const metaChips = [];
      const notes = [];

      if (record.track === "pending") {
        const resolutionMatch = findPendingResolution(record.id);
        if (resolutionMatch) {
          const resolutionState = getPendingResolutionState(resolutionMatch.resolution);
          if (resolutionState.available) {
            metaChips.push('<span class="status-chip is-generated">可处理</span>');
            notes.push({ text: resolutionMatch.resolution.readyText || resolutionMatch.resolution.description, tone: "ready" });
            actionButtons.push(
              `<button class="primary-button" type="button" data-resolve-pending="${escapeHtml(record.id)}">${escapeHtml(resolutionMatch.resolution.buttonLabel)}</button>`
            );
          } else if (resolutionState.missingReviewIds.length) {
            const missingLabels = resolutionState.missingReviewIds.map((recordId) => getRecordLabel(recordId)).join("、");
            metaChips.push('<span class="status-chip is-partial">待复查</span>');
            notes.push({
              text: resolutionMatch.resolution.blockedText || `还需先完成：${missingLabels}`,
              tone: "blocked"
            });
          }
        }
      }

      if (record.track === "excluded" && record.resolutionText) {
        notes.push(record.resolutionText);
      }

      if (record.recordType === "combination" && getConclusionCard(record.sceneId)) {
        metaChips.push('<span class="status-chip is-met">已进入结论墙</span>');
        notes.push({
          text: "这条章节判断已进入结论墙，可在那里查看它如何汇入终章总线索。",
          tone: "ready"
        });
        actionButtons.push(
          `<button class="secondary-button" type="button" data-open-conclusion-card="${escapeHtml(record.sceneId)}">查看结论墙</button>`
        );
      }

      item.innerHTML = `
        <div class="journal-card-meta">
          <span class="status-chip is-${record.track === "excluded" ? "met" : record.track === "pending" ? "partial" : "generated"}">${escapeHtml(getJournalRecordTypeLabel(record))}</span>
          <span class="status-chip is-locked">${escapeHtml(getSceneLabel(record.sceneId))}</span>
          ${metaChips.join("")}
        </div>
        <h2>${escapeHtml(record.title)}</h2>
        <p>${escapeHtml(record.text)}</p>
        ${notes.map((note) => buildJournalNote(note)).join("")}
        ${actionButtons.length ? `<div class="journal-card-actions">${actionButtons.join("")}</div>` : ""}
      `;
      section.appendChild(item);
    });

    journalList.appendChild(section);
  });
}

function getStatusLabel(status) {
  if (status === "generated" || status === "met") return "已完成";
  if (status === "in_progress" || status === "partial") return "进行中";
  return "未完成";
}

function renderConclusions() {
  const statuses = getAllCardStatuses();
  const generatedStatuses = statuses.filter((item) => item.status === "generated");
  const selected = ensureSelectedConclusionCard();
  const generatedCount = generatedStatuses.length;
  const synthesis = getFinalSynthesis();
  const chapterOrder = synthesis.chapterOrder || [];
  const generatedChapterCount = chapterOrder.filter((cardId) => getCardStatusById(cardId, statuses)?.status === "generated").length;

  conclusionPanel.classList.toggle("hidden", !state.conclusionOpen);
  conclusionToggle.setAttribute("aria-expanded", String(state.conclusionOpen));
  conclusionToggle.textContent = generatedCount ? `结论 ${generatedCount}` : "结论";
  conclusionList.innerHTML = "";
  updateSceneSafeArea();

  if (chapterOrder.length) {
    const overview = document.createElement("article");
    overview.className = "conclusion-wall-overview";
    overview.innerHTML = `
      <p class="eyebrow">终章总线索</p>
      <h2>${generatedChapterCount}/${chapterOrder.length}</h2>
      <p>章节结论卡会按空间顺序汇入终章。完成前，可先查看还缺少哪一段。</p>
    `;
    conclusionList.appendChild(overview);
  }

  statuses.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `conclusion-card is-${item.status}${selected?.card.id === item.card.id ? " is-active" : ""}`;
    button.innerHTML = `
      <div class="conclusion-meta">
        <span class="status-chip is-${item.status}">${getStatusLabel(item.status)}</span>
        <span class="status-chip">${escapeHtml(item.card.chapter)}</span>
      </div>
      <h2>${escapeHtml(item.card.title)}</h2>
      <p>${escapeHtml(item.card.summary)}</p>
    `;
    button.addEventListener("click", () => selectConclusionCard(item.card.id));
    conclusionList.appendChild(button);
  });

  if (!selected) {
    conclusionDetail.innerHTML = `
      <p class="empty-note">结论卡会在当前章节的线索收集、复查与推导完成后自动生成。</p>
      <div class="clue-card-actions">
        <button class="secondary-button" type="button" data-open-workbench="clues">打开章节整理台</button>
      </div>
    `;
    return;
  }

  const flowHtml = buildConclusionFlowHtml(statuses);
  const synthesisHtml = buildFinalSynthesisHtml(selected, statuses);
  const missingUnlockStates = selected.unlockStates.filter((item) => !item.met);
  const unlockHtml = missingUnlockStates.length
    ? `
      <h3 class="conclusion-section-title">生成条件</h3>
      <div class="evidence-list">
        ${missingUnlockStates
          .map(
            (item) => `
              <article class="evidence-item">
                <div class="evidence-meta">
                  <span class="status-chip is-${item.met ? "met" : "missing"}">${item.met ? "已满足" : "缺失"}</span>
                </div>
                <p><strong>${escapeHtml(item.label)}</strong></p>
                ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
    `
    : '<p class="empty-note">这张结论卡已生成，可继续结合下方证据和推理链查看。</p>';

  const evidenceHtml = selected.evidenceStates.length
    ? `
      <h3 class="conclusion-section-title">关键证据</h3>
      <div class="evidence-list">
        ${selected.evidenceStates
          .map(
            (item) => `
              <article class="evidence-item">
                <div class="evidence-meta">
                  <span class="status-chip is-${item.met ? "met" : "missing"}">${item.met ? "已收录" : "缺失"}</span>
                </div>
                <p><strong>${escapeHtml(item.label)}</strong></p>
                ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
    `
    : '<p class="empty-note">这张卡主要用于汇总结论，不额外列出章节内证据。</p>';

  conclusionDetail.innerHTML = `
    ${flowHtml}
    <article class="conclusion-detail-card">
      <div class="conclusion-meta">
        <span class="status-chip is-${selected.status}">${getStatusLabel(selected.status)}</span>
        <span class="status-chip">${escapeHtml(selected.card.chapter)}</span>
      </div>
      <h2>${escapeHtml(selected.card.title)}</h2>
      <p>${escapeHtml(selected.card.summary)}</p>
      <p>${escapeHtml(selected.card.conclusion)}</p>
    </article>
    ${unlockHtml}
    ${evidenceHtml}
    ${synthesisHtml}
    <div class="clue-card-actions">
      <button class="secondary-button" type="button" data-open-workbench="clues">打开章节整理台</button>
    </div>
  `;
}

let graphLinkFrom = null;

function getWorkbenchChapterSceneIds() {
  const order = ["environment", "tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber", "final_report"];
  return order.filter((sceneId) => SCENES[sceneId]);
}

function getWorkbenchChapterLabel(sceneId) {
  const workflow = getAnalysisWorkflow(sceneId);
  if (workflow?.chapter) return workflow.chapter;
  return SCENES[sceneId]?.title || sceneId;
}

function getTrackLabel(trackId) {
  if (trackId === "observation") return "观察记录";
  if (trackId === "review") return "工具复查";
  if (trackId === "pending") return "待验证";
  if (trackId === "excluded") return "已排除";
  return trackId;
}

function getRecordKindLabel(record) {
  if (record.recordType === "combination") return "组合判断";
  if (record.recordType === "review") return "复查记录";
  if (record.recordType === "observation") return "现场观察";
  return "记录";
}

function getRecordExcerpt(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  const normalized = raw.replaceAll("\n", " ").replace(/\s+/g, " ");
  return normalized.length > 90 ? `${normalized.slice(0, 90)}…` : normalized;
}

function uniqueRecordIds(recordIds = []) {
  return [...new Set(recordIds.filter(Boolean))];
}

function getWorkbenchSceneIdForCurrentScene() {
  const chapterSceneIds = getWorkbenchChapterSceneIds();
  if (chapterSceneIds.includes(state.currentSceneId)) return state.currentSceneId;
  return state.workbench.ui.chapterSceneId || START_SCENE_ID;
}

function getWorkbenchTargetRecordIds(sceneId) {
  const workflow = getAnalysisWorkflow(sceneId);
  if (!workflow) {
    return uniqueRecordIds(
      state.records
        .filter((record) => record.sceneId === sceneId && record.recordType === "observation")
        .map((record) => record.id)
    );
  }

  return uniqueRecordIds([
    ...(workflow.reviewSteps || []).flatMap((step) => step.sourceRecordIds || []),
    ...(workflow.pendingResolutions || []).map((resolution) => resolution.recordId),
    ...(workflow.combination?.requiresExcludedRecordIds || [])
  ]);
}

function getWorkbenchChapterRecords(sceneId) {
  return state.records.filter((record) => record.sceneId === sceneId);
}

function getWorkbenchSupplementalRecords(sceneId, targetRecordIds) {
  const targetSet = new Set(targetRecordIds);
  return getWorkbenchChapterRecords(sceneId)
    .filter((record) => record.recordType === "observation" && record.track === "observation" && !targetSet.has(record.id))
    .slice()
    .reverse();
}

function getWorkbenchPendingItems(sceneId) {
  const workflow = getAnalysisWorkflow(sceneId);
  const configured = (workflow?.pendingResolutions || []).map((resolution) => ({
    resolution,
    record: getRecord(resolution.recordId),
    stateInfo: getPendingResolutionState(resolution)
  }));
  const configuredIds = new Set(configured.map((item) => item.resolution.recordId));
  const extra = state.records
    .filter((record) => record.sceneId === sceneId && record.track === "pending" && !configuredIds.has(record.id))
    .map((record) => ({ resolution: null, record, stateInfo: null }));
  return [...configured, ...extra].filter((item) => item.record || item.resolution);
}

function getWorkbenchReviewItems(sceneId) {
  const workflow = getAnalysisWorkflow(sceneId);
  return (workflow?.reviewSteps || []).map((step) => ({ step, stateInfo: getReviewStepState(step) }));
}

function getWorkbenchNextStep(sceneId, targetRecordIds, reviewItems, pendingItems, combinationState) {
  const missingTargets = targetRecordIds.filter((recordId) => !hasRecord(recordId));
  if (missingTargets.length) {
    return {
      title: "先补齐本章观察",
      body: `还缺 ${missingTargets.length} 条整理所需观察：${missingTargets.slice(0, 4).map(getRecordLabel).join("、")}${missingTargets.length > 4 ? "等" : ""}。`
    };
  }

  const nextReview = reviewItems.find((item) => !item.stateInfo.created);
  if (nextReview) {
    return nextReview.stateInfo.available
      ? { title: "可以开始复查", body: `证据已收齐，可以执行“${nextReview.step.buttonLabel}”。` }
      : {
          title: "继续补齐复查证据",
          body: `“${nextReview.step.resultRecord.title}”还缺 ${nextReview.stateInfo.missingSourceIds.length} 条观察。`
        };
  }

  const nextPending = pendingItems.find((item) => item.record?.track === "pending");
  if (nextPending?.resolution) {
    return nextPending.stateInfo?.available
      ? { title: "处理待验证观察", body: `可以将“${nextPending.record.title}”降级或归档。` }
      : { title: "待验证还不能处理", body: nextPending.resolution.blockedText || "先完成相关复查，再处理待验证观察。" };
  }

  if (combinationState.combination && !combinationState.created) {
    const missingCount = combinationState.missingReviewIds.length + combinationState.missingExcludedIds.length;
    return combinationState.available
      ? { title: "生成章节判断", body: `复查和待验证处理已经完成，可以形成${getSceneLabel(sceneId)}章节判断。` }
      : { title: "章节判断尚未完成", body: `还缺 ${missingCount} 项条件：先完成复查和待验证处理。` };
  }

  return {
    title: "本章整理已完成",
    body: "章节判断已经形成，可以查看结论卡，或继续整理其他章节。"
  };
}

function buildWorkbenchProgressRows(steps = []) {
  if (!steps.length) return "";
  return `
    <div class="workbench-progress-list">
      ${steps
        .map(
          (step) => `
            <div class="workbench-progress-row${step.complete ? " is-complete" : ""}">
              <strong>${escapeHtml(step.label)}</strong>
              <span>${escapeHtml(step.statusLabel || (step.complete ? "已完成" : "待处理"))}</span>
              <p>${escapeHtml(step.detail || step.mobileDetail || "")}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function getGraphDisplayLabel(nodeId) {
  const node = getGraphNodeInfo(nodeId);
  return node?.label || nodeId;
}

function getWorkbenchFallbackPosition() {
  if (!workbenchLayer) return { x: 24, y: 88 };
  const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 0);
  const viewportHeight = Math.max(320, window.innerHeight || document.documentElement.clientHeight || 0);
  const width = workbenchLayer.offsetWidth || Math.min(540, viewportWidth - 48);
  const height = workbenchLayer.offsetHeight || Math.min(820, viewportHeight * 0.76);
  const gutter = viewportWidth <= 560 ? 8 : 16;
  if (viewportWidth <= 900) {
    return {
      x: Math.max(gutter, viewportWidth - width - gutter),
      y: Math.max(72, viewportHeight - height - gutter)
    };
  }
  return {
    x: Math.max(gutter, viewportWidth - width - 24),
    y: 88
  };
}

function clampWorkbenchPosition(position = state.workbench.ui.panelPosition || getWorkbenchFallbackPosition()) {
  if (!workbenchLayer) return { x: 24, y: 88 };
  const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 0);
  const viewportHeight = Math.max(320, window.innerHeight || document.documentElement.clientHeight || 0);
  const width = workbenchLayer.offsetWidth || Math.min(540, viewportWidth - 48);
  const height = workbenchLayer.offsetHeight || Math.min(820, viewportHeight * 0.76);
  const gutter = viewportWidth <= 560 ? 8 : 12;
  return {
    x: Math.min(Math.max(gutter, position.x), Math.max(gutter, viewportWidth - width - gutter)),
    y: Math.min(Math.max(gutter, position.y), Math.max(gutter, viewportHeight - height - gutter))
  };
}

function syncWorkbenchPosition(persist = false) {
  if (!workbenchLayer || !state.workbenchOpen) return;
  workbenchLayer.style.left = "";
  workbenchLayer.style.top = "";
  workbenchLayer.style.right = "";
  workbenchLayer.style.bottom = "";
  if (persist) save();
}

function renderWorkbench() {
  workbenchLayer.classList.toggle("hidden", !state.workbenchOpen);
  workbenchToggle?.setAttribute("aria-expanded", String(state.workbenchOpen));
  if (!state.workbenchOpen) return;

  workbenchTabs.querySelectorAll("[data-workbench-tab]").forEach((button) => {
    const tab = button.getAttribute("data-workbench-tab");
    const active = tab === state.workbench.ui.tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (state.workbench.ui.tab === "graph") {
    renderWorkbenchGraph();
  } else {
    renderWorkbenchClues();
  }
  syncWorkbenchPosition();
}

function renderWorkbenchClues() {
  const chapterSceneId = SCENES[state.workbench.ui.chapterSceneId] ? state.workbench.ui.chapterSceneId : START_SCENE_ID;
  const chapters = getWorkbenchChapterSceneIds().filter(
    (sceneId) => state.visitedSceneIds.includes(sceneId) || state.records.some((record) => record.sceneId === sceneId)
  );
  const activeChapters = chapters.length ? chapters : [chapterSceneId];
  const selectedChapter = activeChapters.includes(chapterSceneId) ? chapterSceneId : activeChapters[0];
  state.workbench.ui.chapterSceneId = selectedChapter;
  save();

  const chapterButtons = activeChapters
    .map(
      (sceneId) =>
        `<button class="workbench-chip${sceneId === selectedChapter ? " is-active" : ""}" type="button" data-workbench-chapter="${escapeHtml(sceneId)}">${escapeHtml(getWorkbenchChapterLabel(sceneId))}</button>`
    )
    .join("");

  const workflow = getAnalysisWorkflow(selectedChapter);
  const targetRecordIds = getWorkbenchTargetRecordIds(selectedChapter);
  const targetSet = new Set(targetRecordIds);
  const reviewItems = getWorkbenchReviewItems(selectedChapter);
  const pendingItems = getWorkbenchPendingItems(selectedChapter);
  const combinationState = getCombinationState(selectedChapter);
  const supplementalRecords = getWorkbenchSupplementalRecords(selectedChapter, targetRecordIds);
  const nextStep = getWorkbenchNextStep(selectedChapter, targetRecordIds, reviewItems, pendingItems, combinationState);
  const collectedTargetCount = targetRecordIds.filter((recordId) => hasRecord(recordId)).length;
  const completedReviewCount = reviewItems.filter((item) => item.stateInfo.created).length;
  const openPendingCount = pendingItems.filter((item) => item.record?.track === "pending").length;
  const resolvedPendingCount = pendingItems.filter((item) => item.record?.track === "excluded").length;
  const comboLabel = combinationState.created ? "已生成" : combinationState.available ? "可生成" : workflow?.combination ? "待整理" : "未设置";

  const targetCards = targetRecordIds
    .map((recordId) => {
      const record = getRecord(recordId);
      const title = record?.title || getRecordLabel(recordId);
      const statusLabel = record
        ? record.track === "pending"
          ? "待验证"
          : record.track === "excluded"
            ? "已降级"
            : "已收录"
        : "尚未收录";
      const statusClass = record ? (record.track === "pending" ? "partial" : "met") : "missing";
      const actions =
        record && record.track !== "excluded"
          ? `<div class="clue-card-actions"><button class="secondary-button" type="button" data-workbench-open-graph="${escapeHtml(record.id)}">加入关系图</button></div>`
          : "";
      return `
        <article class="clue-card">
          <div class="journal-card-meta">
            <span class="status-chip is-${statusClass}">${escapeHtml(statusLabel)}</span>
            <span class="status-chip">${escapeHtml(getSceneLabel(selectedChapter))}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(record ? getRecordExcerpt(record.text) : "尚未收录。回到场景中继续观察相关图像。")}</p>
          ${actions}
        </article>
      `;
    })
    .join("");

  const pendingCards = pendingItems
    .map((item) => {
      const record = item.record;
      const resolution = item.resolution;
      const title = record?.title || (resolution ? getRecordLabel(resolution.recordId) : "待验证观察");
      const isResolved = record?.track === "excluded";
      const isReady = Boolean(item.stateInfo?.available);
      const statusLabel = !record ? "尚未收录" : isResolved ? "已降级" : isReady ? "可处理" : "待复查";
      const statusClass = !record ? "missing" : isResolved ? "met" : isReady ? "generated" : "partial";
      const note = isResolved
        ? record.resolutionText
        : record
          ? resolution?.readyText || resolution?.blockedText || resolution?.description || "这条观察需要结合复查结果处理。"
          : "尚未在场景中收录。";
      const action =
        isReady && record && resolution
          ? `<div class="clue-card-actions"><button class="primary-button" type="button" data-resolve-pending="${escapeHtml(record.id)}">${escapeHtml(resolution.buttonLabel)}</button></div>`
          : "";
      return `
        <article class="clue-card">
          <div class="journal-card-meta">
            <span class="status-chip is-${statusClass}">${escapeHtml(statusLabel)}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(record ? getRecordExcerpt(record.text) : note)}</p>
          ${note && record ? `<p class="journal-note">${escapeHtml(note)}</p>` : ""}
          ${action}
        </article>
      `;
    })
    .join("");

  const reviewCards = reviewItems
    .map(({ step, stateInfo }) => {
      const statusLabel = stateInfo.created ? "已完成" : stateInfo.available ? "可复查" : "待收集";
      const statusClass = stateInfo.created ? "met" : stateInfo.available ? "generated" : "partial";
      const missingLabels = stateInfo.missingSourceIds.slice(0, 4).map(getRecordLabel);
      const fallbackSteps = (step.sourceRecordIds || []).map((recordId) => ({
        label: getRecordLabel(recordId),
        detail: hasRecord(recordId) ? "已收录。" : "尚未收录。",
        complete: hasRecord(recordId),
        statusLabel: hasRecord(recordId) ? "已完成" : "待观察"
      }));
      const progressRows = getReviewProgressSteps(step);
      const progressHtml = buildWorkbenchProgressRows(progressRows.length ? progressRows : fallbackSteps);
      const action = stateInfo.created
        ? ""
        : `<div class="clue-card-actions"><button class="${stateInfo.available ? "primary-button" : "secondary-button"}" type="button" data-run-review-step="${escapeHtml(step.id)}" ${stateInfo.available ? "" : "disabled"}>${escapeHtml(stateInfo.available ? step.buttonLabel : `还缺 ${stateInfo.missingSourceIds.length} 条观察`)}</button></div>`;
      return `
        <article class="clue-card">
          <div class="journal-card-meta">
            <span class="status-chip is-${statusClass}">${escapeHtml(statusLabel)}</span>
          </div>
          <h3>${escapeHtml(step.resultRecord.title)}</h3>
          <p>${escapeHtml(stateInfo.available || stateInfo.created ? step.description : `还缺：${missingLabels.join("、")}`)}</p>
          ${progressHtml}
          ${action}
        </article>
      `;
    })
    .join("");

  const combinationHtml = combinationState.combination
    ? `
      <article class="clue-card">
        <div class="journal-card-meta">
          <span class="status-chip is-${combinationState.created ? "met" : combinationState.available ? "generated" : "partial"}">${escapeHtml(comboLabel)}</span>
        </div>
        <h3>${escapeHtml(combinationState.combination.resultRecord.title)}</h3>
        <p>${escapeHtml(combinationState.combination.description)}</p>
        ${buildWorkbenchProgressRows(getCombinationProgressSteps(combinationState.combination))}
        ${
          combinationState.created
            ? ""
            : `<div class="clue-card-actions"><button class="${combinationState.available ? "primary-button" : "secondary-button"}" type="button" data-create-scene-combo="${escapeHtml(selectedChapter)}" ${combinationState.available ? "" : "disabled"}>${escapeHtml(combinationState.available ? combinationState.combination.buttonLabel : `还缺 ${combinationState.missingReviewIds.length + combinationState.missingExcludedIds.length} 项条件`)}</button></div>`
        }
      </article>
    `
    : '<p class="empty-note">本章暂未设置章节判断。</p>';

  const supplementalHtml = supplementalRecords.length
    ? `
      <details class="workbench-supplemental">
        <summary>补充观察 ${supplementalRecords.length}</summary>
        <div class="workbench-record-grid">
          ${supplementalRecords
            .map(
              (record) => `
                <article class="clue-card">
                  <div class="journal-card-meta">
                    <span class="status-chip">补充观察</span>
                  </div>
                  <h3>${escapeHtml(record.title)}</h3>
                  <p>${escapeHtml(getRecordExcerpt(record.text))}</p>
                  <div class="clue-card-actions">
                    <button class="secondary-button" type="button" data-workbench-open-graph="${escapeHtml(record.id)}">加入关系图</button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </details>
    `
    : '<p class="empty-note">暂无额外补充观察。</p>';

  workbenchContent.innerHTML = `
    <div class="workbench-layout">
      <aside class="workbench-sidebar">
        <h2 class="workbench-section-title">章节</h2>
        <div class="workbench-chip-list">${chapterButtons}</div>
        <p class="journal-note">默认回到当前所在章节；已访问章节可在这里切换。</p>
        <div class="workbench-next-step">
          <span>下一步</span>
          <strong>${escapeHtml(nextStep.title)}</strong>
          <p>${escapeHtml(nextStep.body)}</p>
        </div>
      </aside>
      <section class="workbench-main">
        <h2 class="workbench-section-title">${escapeHtml(getWorkbenchChapterLabel(selectedChapter))}章节整理</h2>
        <div class="workbench-overview-grid">
          <div class="workbench-status-card">
            <span>整理所需观察</span>
            <strong>${collectedTargetCount}/${targetRecordIds.length || collectedTargetCount}</strong>
          </div>
          <div class="workbench-status-card">
            <span>复查</span>
            <strong>${completedReviewCount}/${reviewItems.length}</strong>
          </div>
          <div class="workbench-status-card">
            <span>待验证</span>
            <strong>${resolvedPendingCount}/${pendingItems.length}</strong>
            ${openPendingCount ? `<em>${openPendingCount} 条待处理</em>` : ""}
          </div>
          <div class="workbench-status-card">
            <span>章节判断</span>
            <strong>${escapeHtml(comboLabel)}</strong>
          </div>
        </div>

        <section>
          <h2 class="workbench-section-title">整理所需观察</h2>
          <div class="workbench-record-grid">${targetCards || '<p class="empty-note">本章尚无整理所需观察。</p>'}</div>
        </section>

        <section>
          <h2 class="workbench-section-title">待验证</h2>
          <div class="workbench-record-grid">${pendingCards || '<p class="empty-note">当前没有待验证观察。</p>'}</div>
        </section>

        <section>
          <h2 class="workbench-section-title">复查</h2>
          <div class="workbench-record-grid">${reviewCards || '<p class="empty-note">本章暂未设置复查动作。</p>'}</div>
        </section>

        <section>
          <h2 class="workbench-section-title">章节判断</h2>
          ${combinationHtml}
        </section>

        <section>
          <h2 class="workbench-section-title">已收录的补充观察</h2>
          ${supplementalHtml}
        </section>
      </section>
    </div>
  `;
}

let graphSuppressClick = false;
let graphDrag = null;
let graphRuntime = null;

function getGraphWorkspace(sceneId) {
  if (!state.workbench.graph.workspaces || typeof state.workbench.graph.workspaces !== "object") {
    state.workbench.graph.workspaces = {};
  }
  if (!state.workbench.graph.workspaces[sceneId]) {
    state.workbench.graph.workspaces[sceneId] = { nodeIds: [], positions: {} };
  }
  const workspace = state.workbench.graph.workspaces[sceneId];
  if (!Array.isArray(workspace.nodeIds)) workspace.nodeIds = [];
  if (!workspace.positions || typeof workspace.positions !== "object" || Array.isArray(workspace.positions)) workspace.positions = {};
  return workspace;
}

function ensureWorkspaceNode(sceneId, nodeId) {
  const workspace = getGraphWorkspace(sceneId);
  if (!workspace.nodeIds.includes(nodeId)) {
    workspace.nodeIds.push(nodeId);
  }
  return workspace;
}

function getGraphNodeInfo(nodeId) {
  if (nodeId.startsWith("clue:")) {
    const recordId = nodeId.slice("clue:".length);
    const record = getRecord(recordId);
    if (!record) return null;
    return { id: nodeId, type: "clue", label: record.title || recordId, recordId };
  }

  if (nodeId.startsWith("rel:")) {
    const relationId = nodeId.slice("rel:".length);
    const relation = getConclusionRelation(relationId);
    if (!relation) return null;
    return { id: nodeId, type: "relation", label: relation.title, relationId };
  }

  if (nodeId.startsWith("hyp:")) {
    const hypothesisId = nodeId.slice("hyp:".length);
    const hypothesis = state.workbench.graph.hypotheses.find((item) => item.id === hypothesisId);
    if (!hypothesis) return null;
    return { id: nodeId, type: "hypothesis", label: hypothesis.title, hypothesisId };
  }

  return null;
}

function buildGraphNodesAndLinks(sceneId) {
  const workspace = getGraphWorkspace(sceneId);
  const nodeIds = workspace.nodeIds;
  const nodes = nodeIds.map(getGraphNodeInfo).filter(Boolean);
  const idSet = new Set(nodes.map((n) => n.id));
  const links = state.workbench.graph.userLinks
    .filter((link) => idSet.has(link.from) && idSet.has(link.to))
    .map((link) => ({ type: "user", from: link.from, to: link.to, label: "" }));

  return { nodes, links, workspace };
}

function layoutGraph(nodes, workspace) {
  const spacing = 62;
  const columns = {
    clue: 90,
    hypothesis: 360,
    relation: 640
  };
  const counters = { clue: 0, hypothesis: 0, relation: 0 };

  let maxY = 0;
  nodes.forEach((node) => {
    const saved = workspace.positions?.[node.id];
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      node.x = saved.x;
      node.y = saved.y;
      maxY = Math.max(maxY, node.y);
      return;
    }
    const x = columns[node.type] || columns.clue;
    const y = 60 + counters[node.type] * spacing;
    counters[node.type] += 1;
    node.x = x;
    node.y = y;
    maxY = Math.max(maxY, y);
  });

  const width = 860;
  const height = Math.max(520, maxY + 120);
  return { width, height };
}

function renderWorkbenchGraph() {
  const chapterSceneId = state.workbench.ui.chapterSceneId;
  const chapters = getWorkbenchChapterSceneIds().filter(
    (sceneId) => state.visitedSceneIds.includes(sceneId) || state.records.some((record) => record.sceneId === sceneId)
  );
  const activeChapters = chapters.length ? chapters : [chapterSceneId];
  const selectedChapter = activeChapters.includes(chapterSceneId) ? chapterSceneId : activeChapters[0];
  state.workbench.ui.chapterSceneId = selectedChapter;
  save();

  const chapterButtons = activeChapters
    .map(
      (sceneId) =>
        `<button class="workbench-chip${sceneId === selectedChapter ? " is-active" : ""}" type="button" data-workbench-chapter="${escapeHtml(sceneId)}">${escapeHtml(getWorkbenchChapterLabel(sceneId))}</button>`
    )
    .join("");

  const { nodes, links, workspace } = buildGraphNodesAndLinks(selectedChapter);
  const { width, height } = layoutGraph(nodes, workspace);

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edgePaths = links
    .map((link, idx) => {
      const from = nodeById.get(link.from);
      const to = nodeById.get(link.to);
      if (!from || !to) return "";
      const c1x = from.x + 80;
      const c2x = to.x - 80;
      const path = `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
      const stroke = "rgba(201, 157, 87, 0.85)";
      const widthPx = 2.6;
      return `<path data-graph-link="${idx}" d="${path}" fill="none" stroke="${stroke}" stroke-width="${widthPx}" />`;
    })
    .join("");

  const nodeGroups = nodes
    .map((node) => {
      const fill =
        node.type === "relation"
          ? "rgba(143, 199, 170, 0.12)"
          : node.type === "hypothesis"
            ? "rgba(201, 157, 87, 0.12)"
            : "rgba(255, 255, 255, 0.08)";
      const stroke =
        graphLinkFrom === node.id
          ? "rgba(201, 157, 87, 0.95)"
          : node.type === "relation"
            ? "rgba(143, 199, 170, 0.38)"
            : "rgba(255, 255, 255, 0.18)";
      const label = escapeHtml(node.label);
      return `
        <g data-graph-node="${escapeHtml(node.id)}" style="cursor:pointer">
          <rect x="${node.x - 110}" y="${node.y - 18}" width="220" height="36" rx="10" fill="${fill}" stroke="${stroke}" />
          <text x="${node.x}" y="${node.y + 5}" text-anchor="middle" fill="#e8dcc7" font-size="12" font-family="Microsoft YaHei, Noto Sans SC, sans-serif">${label}</text>
        </g>
      `;
    })
    .join("");

  const userLinksHtml = links.length
    ? `
      <div class="evidence-list">
        ${links
          .map(
            (link) => `
              <article class="evidence-item">
                <div class="evidence-meta">
                  <span class="status-chip">联线</span>
                </div>
                <p><strong>${escapeHtml(getGraphDisplayLabel(link.from))}</strong> → ${escapeHtml(getGraphDisplayLabel(link.to))}</p>
                <div class="clue-card-actions">
                  <button class="secondary-button" type="button" data-workbench-delete-link="${escapeHtml(`${link.from}|${link.to}`)}">删除</button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `
    : '<p class="empty-note">暂无玩家联线。先从“章节整理”里点“加入关系图”，再在图上点节点进行联线。</p>';

  const relationButtons = getConclusionRelations()
    .map(
      (relation) =>
        `<button class="workbench-chip" type="button" data-workbench-add-relation="${escapeHtml(relation.id)}">${escapeHtml(relation.title)}</button>`
    )
    .join("");

  const emptyGraphHint = nodes.length
    ? ""
    : '<p class="empty-note">本章关系图尚为空。请先到“章节整理”中选择记录并点击“加入关系图”。</p>';

  workbenchContent.innerHTML = `
    <div class="workbench-layout">
      <aside class="workbench-sidebar">
        <h2 class="workbench-section-title">章节</h2>
        <div class="workbench-chip-list">${chapterButtons}</div>
        <h2 class="workbench-section-title">操作</h2>
        <div class="clue-card-actions">
          <button class="secondary-button" type="button" data-workbench-add-hypothesis="1">新建假说</button>
          <button class="secondary-button" type="button" data-workbench-cancel-link="1">取消联线</button>
        </div>
        <h2 class="workbench-section-title">推理链节点</h2>
        <div class="workbench-chip-list">${relationButtons}</div>
        <div class="graph-legend">
          <span class="graph-legend-item"><span class="graph-swatch is-user"></span>玩家联线</span>
        </div>
      </aside>
      <section class="workbench-main">
        <h2 class="workbench-section-title">${escapeHtml(getWorkbenchChapterLabel(selectedChapter))}关系图</h2>
        ${emptyGraphHint}
        <div class="graph-canvas">
          <svg id="workbenchGraph" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin meet" aria-label="推理关系图">
            ${edgePaths}
            ${nodeGroups}
          </svg>
        </div>
        <h2 class="workbench-section-title">玩家联线</h2>
        ${userLinksHtml}
      </section>
    </div>
  `;

  const svg = workbenchContent.querySelector("#workbenchGraph");
  graphRuntime = svg ? { sceneId: selectedChapter, svg } : null;
}

journalToggle.addEventListener("click", () => setJournal(!state.journalOpen));
journalClose.addEventListener("click", () => setJournal(false));
journalList.addEventListener("click", (event) => {
  const conclusionTarget = event.target.closest("[data-open-conclusion-card]");
  if (conclusionTarget) {
    state.selectedConclusionId = conclusionTarget.getAttribute("data-open-conclusion-card");
    setConclusionOpen(true);
    return;
  }

  const reviewTarget = event.target.closest("[data-run-review-step]");
  if (reviewTarget) {
    runReviewStep(reviewTarget.getAttribute("data-run-review-step"));
    return;
  }

  const resolveTarget = event.target.closest("[data-resolve-pending]");
  if (resolveTarget) {
    resolvePendingRecord(resolveTarget.getAttribute("data-resolve-pending"));
    return;
  }

  const comboTarget = event.target.closest("[data-create-scene-combo]");
  if (!comboTarget) return;
  createSceneCombination(comboTarget.getAttribute("data-create-scene-combo"));
});
conclusionDetail.addEventListener("click", (event) => {
  const cardTarget = event.target.closest("[data-conclusion-card]");
  if (cardTarget) {
    selectConclusionCard(cardTarget.getAttribute("data-conclusion-card"));
    return;
  }

  const target = event.target.closest("[data-open-workbench]");
  if (!target) return;
  setWorkbenchOpen(true, target.getAttribute("data-open-workbench") || "clues");
});
conclusionToggle.addEventListener("click", () => setConclusionOpen(!state.conclusionOpen));
conclusionClose.addEventListener("click", () => setConclusionOpen(false));
workbenchClose.addEventListener("click", () => setWorkbenchOpen(false));
workbenchLayer.addEventListener("click", (event) => {
  if (event.target === workbenchLayer) setWorkbenchOpen(false);
});
workbenchTabs.addEventListener("click", (event) => {
  const tabTarget = event.target.closest("[data-workbench-tab]");
  if (!tabTarget) return;
  setWorkbenchOpen(true, tabTarget.getAttribute("data-workbench-tab") || "clues");
});
workbenchContent.addEventListener("click", (event) => {
  const reviewTarget = event.target.closest("[data-run-review-step]");
  if (reviewTarget) {
    runReviewStep(reviewTarget.getAttribute("data-run-review-step"));
    renderWorkbench();
    return;
  }

  const resolveTarget = event.target.closest("[data-resolve-pending]");
  if (resolveTarget) {
    resolvePendingRecord(resolveTarget.getAttribute("data-resolve-pending"));
    renderWorkbench();
    return;
  }

  const comboTarget = event.target.closest("[data-create-scene-combo]");
  if (comboTarget) {
    createSceneCombination(comboTarget.getAttribute("data-create-scene-combo"));
    renderWorkbench();
    return;
  }

  const chapterTarget = event.target.closest("[data-workbench-chapter]");
  if (chapterTarget) {
    state.workbench.ui.chapterSceneId = chapterTarget.getAttribute("data-workbench-chapter");
    save();
    renderWorkbench();
    return;
  }

  const openGraphTarget = event.target.closest("[data-workbench-open-graph]");
  if (openGraphTarget) {
    const recordId = openGraphTarget.getAttribute("data-workbench-open-graph");
    const record = state.records.find((item) => item.id === recordId);
    if (!record?.sceneId) return;
    state.workbench.ui.chapterSceneId = record.sceneId;
    ensureWorkspaceNode(record.sceneId, `clue:${record.id}`);
    graphLinkFrom = null;
    save();
    setWorkbenchOpen(true, "graph");
    return;
  }

  const addHypTarget = event.target.closest("[data-workbench-add-hypothesis]");
  if (addHypTarget) {
    const title = window.prompt("输入假说标题（用于你自己的推理网络）");
    if (!title) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    const hypothesisId = `hyp_${Date.now().toString(16)}`;
    state.workbench.graph.hypotheses.push({ id: hypothesisId, title: trimmed });
    ensureWorkspaceNode(state.workbench.ui.chapterSceneId, `hyp:${hypothesisId}`);
    save();
    renderWorkbench();
    return;
  }

  const addRelationTarget = event.target.closest("[data-workbench-add-relation]");
  if (addRelationTarget) {
    const relationId = addRelationTarget.getAttribute("data-workbench-add-relation");
    if (!relationId) return;
    ensureWorkspaceNode(state.workbench.ui.chapterSceneId, `rel:${relationId}`);
    save();
    renderWorkbench();
    return;
  }

  const cancelLinkTarget = event.target.closest("[data-workbench-cancel-link]");
  if (cancelLinkTarget) {
    graphLinkFrom = null;
    renderWorkbench();
    return;
  }

  const deleteLinkTarget = event.target.closest("[data-workbench-delete-link]");
  if (deleteLinkTarget) {
    const key = deleteLinkTarget.getAttribute("data-workbench-delete-link") || "";
    const [from, to] = key.split("|");
    if (!from || !to) return;
    const idx = state.workbench.graph.userLinks.findIndex((item) => item.from === from && item.to === to);
    if (idx >= 0) state.workbench.graph.userLinks.splice(idx, 1);
    save();
    renderWorkbench();
    return;
  }

  const nodeTarget = event.target.closest("[data-graph-node]");
  if (nodeTarget) {
    if (graphSuppressClick) {
      graphSuppressClick = false;
      return;
    }
    const nodeId = nodeTarget.getAttribute("data-graph-node");
    if (!nodeId) return;
    if (!graphLinkFrom) {
      graphLinkFrom = nodeId;
      renderWorkbench();
      return;
    }
    if (graphLinkFrom === nodeId) {
      graphLinkFrom = null;
      renderWorkbench();
      return;
    }
    const exists = state.workbench.graph.userLinks.some((item) => item.from === graphLinkFrom && item.to === nodeId);
    if (!exists) {
      state.workbench.graph.userLinks.push({ from: graphLinkFrom, to: nodeId });
      save();
    }
    graphLinkFrom = null;
    renderWorkbench();
  }
});

workbenchContent.addEventListener("pointerdown", (event) => {
  const nodeTarget = event.target.closest("[data-graph-node]");
  if (!nodeTarget) return;
  if (!graphRuntime?.svg) return;
  const nodeId = nodeTarget.getAttribute("data-graph-node");
  if (!nodeId) return;
  const svg = graphRuntime.svg;

  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return;
  const start = pt.matrixTransform(ctm.inverse());
  const workspace = getGraphWorkspace(graphRuntime.sceneId);
  const saved = workspace.positions[nodeId];
  const rect = nodeTarget.querySelector("rect");
  const rectX = rect ? Number(rect.getAttribute("x")) : NaN;
  const rectY = rect ? Number(rect.getAttribute("y")) : NaN;
  const current = saved
    ? saved
    : Number.isFinite(rectX) && Number.isFinite(rectY)
      ? { x: rectX + 110, y: rectY + 18 }
      : { x: start.x, y: start.y };
  graphDrag = {
    nodeId,
    startX: start.x,
    startY: start.y,
    originX: Number.isFinite(current.x) ? current.x : start.x,
    originY: Number.isFinite(current.y) ? current.y : start.y,
    moved: 0
  };
  graphSuppressClick = false;
  nodeTarget.setPointerCapture(event.pointerId);
});

workbenchContent.addEventListener("pointermove", (event) => {
  if (!graphDrag) return;
  if (!graphRuntime?.svg) return;
  const svg = graphRuntime.svg;
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return;
  const now = pt.matrixTransform(ctm.inverse());
  const dx = now.x - graphDrag.startX;
  const dy = now.y - graphDrag.startY;
  const x = graphDrag.originX + dx;
  const y = graphDrag.originY + dy;
  graphDrag.moved = Math.max(graphDrag.moved, Math.abs(dx) + Math.abs(dy));
  if (graphDrag.moved > 3) graphSuppressClick = true;
  const workspace = getGraphWorkspace(graphRuntime.sceneId);
  workspace.positions[graphDrag.nodeId] = { x, y };
  const safeId = String(graphDrag.nodeId).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  const nodeGroup = workbenchContent.querySelector(`[data-graph-node="${safeId}"]`);
  if (!nodeGroup) return;
  const rect = nodeGroup.querySelector("rect");
  const text = nodeGroup.querySelector("text");
  if (rect) {
    rect.setAttribute("x", String(x - 110));
    rect.setAttribute("y", String(y - 18));
  }
  if (text) {
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y + 5));
  }
});

workbenchContent.addEventListener("pointerup", () => {
  if (!graphDrag) return;
  save();
  graphDrag = null;
});
workbenchHeader?.addEventListener("pointerdown", (event) => {
  if (!state.workbenchOpen) return;
  if (event.target.closest("button, nav")) return;
  if (!workbenchLayer) return;
  const rect = workbenchLayer.getBoundingClientRect();
  workbenchPanelDrag = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  workbenchHeader.setPointerCapture(event.pointerId);
});
workbenchHeader?.addEventListener("pointermove", (event) => {
  if (!workbenchPanelDrag || workbenchPanelDrag.pointerId !== event.pointerId) return;
  state.workbench.ui.panelPosition = clampWorkbenchPosition({
    x: event.clientX - workbenchPanelDrag.offsetX,
    y: event.clientY - workbenchPanelDrag.offsetY
  });
  syncWorkbenchPosition();
});
workbenchHeader?.addEventListener("pointerup", (event) => {
  if (!workbenchPanelDrag || workbenchPanelDrag.pointerId !== event.pointerId) return;
  workbenchHeader.releasePointerCapture(event.pointerId);
  workbenchPanelDrag = null;
  syncWorkbenchPosition(true);
});
workbenchHeader?.addEventListener("pointercancel", (event) => {
  if (!workbenchPanelDrag || workbenchPanelDrag.pointerId !== event.pointerId) return;
  workbenchPanelDrag = null;
  syncWorkbenchPosition(true);
});
workbenchToggle?.addEventListener("click", () => setWorkbenchOpen(!state.workbenchOpen));
dialogueClose.addEventListener("click", closeDialogue);
messageClose.addEventListener("click", closeMessage);
messageLayer.addEventListener("click", (event) => {
  if (event.target === messageLayer) closeMessage();
});
dialogueLayer.addEventListener("click", (event) => {
  if (event.target === dialogueLayer) closeDialogue();
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
    if (positionMapLayer) closePositionMap();
    if (!messageLayer.classList.contains("hidden")) closeMessage();
    if (!runePuzzleLayer.classList.contains("hidden")) closeRunePuzzle();
    if (!patternPuzzleLayer.classList.contains("hidden")) closePatternPuzzle();
    if (!inscriptionPuzzleLayer.classList.contains("hidden")) closeInscriptionPuzzle();
    if (!relicPuzzleLayer.classList.contains("hidden")) closeRelicPuzzle();
    if (!pipePuzzleLayer.classList.contains("hidden")) closePipePuzzle();
    if (!dialogueLayer.classList.contains("hidden")) closeDialogue();
    if (!workbenchLayer.classList.contains("hidden")) setWorkbenchOpen(false);
    setJournal(false);
    setConclusionOpen(false);
  }
});

window.addEventListener("resize", () => {
  updateSceneSafeArea();
  updateSceneStageMetrics();
  if (state.workbenchOpen) syncWorkbenchPosition();
});
sceneImage.addEventListener("load", () => {
  updateSceneSafeArea();
  updateSceneStageMetrics();
});

load();
navigateTo({ sceneId: state.currentSceneId });
renderScene();
renderJournal();
renderConclusions();
renderWorkbench();
queueOpeningDialogues();
queueSceneEntryDialogue(state.currentSceneId);
flushDialogueQueue();
const startupMiniGame = new URLSearchParams(window.location.search).get("miniGame");
if (startupMiniGame === INSCRIPTION_PUZZLE_ID) {
  openInscriptionPuzzle();
} else if (startupMiniGame === RELIC_PUZZLE_ID) {
  openRelicPuzzle();
} else if (startupMiniGame && PIPE_LEVELS[startupMiniGame]) {
  openPipePuzzle(startupMiniGame);
}

window.M1_PIPE_LEVELS = PIPE_LEVELS;
window.openPipePuzzle = openPipePuzzle;
