const { SAVE_KEY, START_SCENE_ID, SCENES, POSITION_MAP, CONCLUSION_DATA, NPC_DATA, ANALYSIS_DATA } = window.M1_GAME_DATA;
const LEGACY_STORAGE_KEYS = ["m1-gate-immersive-state-v2-source-text"];

const state = {
  currentSceneId: START_SCENE_ID,
  currentViewIds: {},
  visitedSceneIds: [],
  visitedViewIds: {},
  completedSceneIds: [],
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
  pendingNavigation: null
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
let positionMapLayer = null;
let dialogueQueue = [];
let activeDialogue = null;
let workbenchPanelDrag = null;

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
  return /^H/.test(hotspot?.sourceClueId || "");
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
  const missingSourceIds = (step.sourceRecordIds || []).filter((recordId) => !hasRecord(recordId));
  return {
    created,
    available: !created && !missingSourceIds.length,
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
  const shouldPromoteToPending =
    candidate.recordType === "observation" &&
    candidate.track === "observation" &&
    hotspot &&
    getAnalysisWorkflow(sceneId) &&
    isRedHerringHotspot(hotspot);

  return {
    ...candidate,
    title: candidate.title || hotspot?.title || "",
    text: candidate.text || candidate.record || hotspot?.record || "",
    clueId: candidate.clueId || hotspot?.sourceClueId || "",
    sourceFile: candidate.sourceFile || hotspot?.sourceFile || "",
    track: shouldPromoteToPending ? "pending" : candidate.track || getDefaultRecordTrack(hotspot, sceneId),
    recordType: candidate.recordType || (hotspot ? "observation" : "manual"),
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
  messageLayer.classList.remove("hidden");
}

function closeMessage() {
  messageLayer.classList.add("hidden");
  messageClose.textContent = "收录";
  messageBody.classList.remove("has-detail-image");
  if (state.pendingNavigation) {
    navigateTo(state.pendingNavigation);
    state.pendingNavigation = null;
  }
  save();
  renderScene();
  renderJournal();
  renderConclusions();
  flushDialogueQueue();
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

function ensureSelectedConclusionCard() {
  const statuses = getAllCardStatuses().filter((item) => item.status === "generated");
  if (!statuses.length) {
    state.selectedConclusionId = null;
    return null;
  }

  const selected = statuses.find((item) => item.card.id === state.selectedConclusionId);
  if (selected) return selected;

  const fallback = statuses.at(-1) || null;
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
  state.workbenchOpen = open;
  if (open) {
    state.journalOpen = false;
    state.conclusionOpen = false;
  }
  if (open && typeof tab === "string") {
    state.workbench.ui.tab = ["clues", "graph"].includes(tab) ? tab : "clues";
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
    [hitArea, element].forEach((target) => {
      target.addEventListener("mouseenter", () => showNavLabel(label));
      target.addEventListener("mouseleave", () => hideNavLabel(label));
    });
    element.addEventListener("focus", () => showNavLabel(label));
    element.addEventListener("blur", () => hideNavLabel(label));
  }
  return group;
}

function shouldRenderNavLabel(hotspot) {
  if (!hotspot.navLabel) return false;
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
  return state.records.filter((record) => record.track === trackId).slice().reverse();
}

function getAvailableReviewActions() {
  return getAllAnalysisWorkflows().flatMap(({ sceneId, workflow }) =>
    (workflow.reviewSteps || [])
      .map((step) => ({ sceneId, workflow, step, stateInfo: getReviewStepState(step) }))
      .filter((item) => item.stateInfo.available)
  );
}

function getAvailableCombinationActions() {
  return getAllAnalysisWorkflows()
    .map(({ sceneId, workflow }) => ({ sceneId, workflow, stateInfo: getCombinationState(sceneId) }))
    .filter((item) => item.stateInfo.available);
}

function buildJournalActionCard({ eyebrow, title, body, note, buttonLabel, actionName, actionValue, chainItems = [] }) {
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
                <span>${escapeHtml(item.detail)}</span>
              </span>
            `
          )
          .join("")}
      </div>
    `
    : "";
  article.innerHTML = `
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(body)}</p>
    ${chainHtml}
    ${note ? `<p class="journal-note">${escapeHtml(note)}</p>` : ""}
    <div class="journal-card-actions">
      <button class="primary-button" type="button" data-${actionName}="${escapeHtml(actionValue)}">${escapeHtml(buttonLabel)}</button>
    </div>
  `;
  return article;
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
        sectionActions.push(
          buildJournalActionCard({
            eyebrow: `${item.workflow.chapter} / 工具复查`,
            title: item.step.resultRecord.title,
            body: item.step.description,
            note: `需要先取得：${item.step.sourceRecordIds.map((recordId) => getRecordLabel(recordId)).join("、")}`,
            buttonLabel: item.step.buttonLabel,
            actionName: "run-review-step",
            actionValue: item.step.id,
            chainItems: item.step.chainItems || []
          })
        );
      });

      getAvailableCombinationActions().forEach((item) => {
        sectionActions.push(
          buildJournalActionCard({
            eyebrow: `${item.workflow.chapter} / 章节组合`,
            title: item.stateInfo.combination.resultRecord.title,
            body: item.stateInfo.combination.description,
            note: "该组合将直接推动章节完成，并生成对应结论卡。",
            buttonLabel: item.stateInfo.combination.buttonLabel,
            actionName: "create-scene-combo",
            actionValue: item.sceneId
          })
        );
      });
    }

    const header = document.createElement("div");
    header.className = "journal-section-header";
    header.innerHTML = `
      <h2 class="journal-section-title">${escapeHtml(track.label)}</h2>
      <span class="journal-count">${records.length}${sectionActions.length ? ` + ${sectionActions.length} 条可处理动作` : ""}</span>
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
      const notes = [];

      if (record.track === "pending") {
        const resolutionMatch = findPendingResolution(record.id);
        if (resolutionMatch) {
          const resolutionState = getPendingResolutionState(resolutionMatch.resolution);
          if (resolutionState.available) {
            actionButtons.push(
              `<button class="primary-button" type="button" data-resolve-pending="${escapeHtml(record.id)}">${escapeHtml(resolutionMatch.resolution.buttonLabel)}</button>`
            );
          } else if (resolutionState.missingReviewIds.length) {
            notes.push(`还需先完成：${resolutionState.missingReviewIds.map((recordId) => getRecordLabel(recordId)).join("、")}`);
          }
        }
      }

      if (record.track === "excluded" && record.resolutionText) {
        notes.push(record.resolutionText);
      }

      item.innerHTML = `
        <div class="journal-card-meta">
          <span class="status-chip is-${record.track === "excluded" ? "met" : record.track === "pending" ? "partial" : "generated"}">${escapeHtml(getJournalRecordTypeLabel(record))}</span>
          <span class="status-chip is-locked">${escapeHtml(getSceneLabel(record.sceneId))}</span>
        </div>
        <h2>${escapeHtml(record.title)}</h2>
        <p>${escapeHtml(record.text)}</p>
        ${notes.map((note) => `<p class="journal-note">${escapeHtml(note)}</p>`).join("")}
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

  conclusionPanel.classList.toggle("hidden", !state.conclusionOpen);
  conclusionToggle.setAttribute("aria-expanded", String(state.conclusionOpen));
  conclusionToggle.textContent = generatedCount ? `结论 ${generatedCount}` : "结论";
  conclusionList.innerHTML = "";
  updateSceneSafeArea();

  generatedStatuses.forEach((item) => {
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
        <button class="secondary-button" type="button" data-open-workbench="clues">打开推理工作台</button>
      </div>
    `;
    return;
  }

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

  const relationsHtml = selected.relationStates.length
    ? `
      <h3 class="conclusion-section-title">推理链映射</h3>
      <div class="relation-list">
        ${selected.relationStates
          .map(
            ({ relation, status, requirements }) => `
              <article class="relation-card">
                <div class="relation-meta">
                  <span class="status-chip is-${status}">${getStatusLabel(status)}</span>
                </div>
                <p><strong>${escapeHtml(relation.title)}</strong></p>
                <p>${escapeHtml(relation.summary)}</p>
                <div class="relation-requirements">
                  ${requirements
                    .map(
                      (item) =>
                        `<span class="relation-requirement${item.met ? " is-met" : ""}">${escapeHtml(item.label)}</span>`
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `
    : "";

  conclusionDetail.innerHTML = `
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
    ${relationsHtml}
    <div class="clue-card-actions">
      <button class="secondary-button" type="button" data-open-workbench="clues">打开推理工作台</button>
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
  const next = clampWorkbenchPosition(state.workbench.ui.panelPosition || getWorkbenchFallbackPosition());
  state.workbench.ui.panelPosition = next;
  workbenchLayer.style.left = `${next.x}px`;
  workbenchLayer.style.top = `${next.y}px`;
  workbenchLayer.style.right = "auto";
  workbenchLayer.style.bottom = "auto";
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

  const tracks = ["observation", "review", "pending", "excluded"];
  const trackBlocks = tracks
    .map((trackId) => {
      const list = state.records
        .filter((record) => record.sceneId === selectedChapter && record.track === trackId)
        .map((record) => {
          const source = record.sourceFile ? `<details><summary class="journal-note">来源</summary><p class="journal-note">${escapeHtml(record.sourceFile)}</p></details>` : "";
          const actions = `
            <div class="clue-card-actions">
              <button class="secondary-button" type="button" data-workbench-open-graph="${escapeHtml(record.id)}">加入关系图</button>
            </div>
          `;
          return `
            <article class="clue-card">
              <div class="journal-card-meta">
                <span class="status-chip">${escapeHtml(getTrackLabel(record.track))}</span>
                <span class="status-chip">${escapeHtml(getRecordKindLabel(record))}</span>
              </div>
              <h3>${escapeHtml(record.title)}</h3>
              <p>${escapeHtml(getRecordExcerpt(record.text))}</p>
              ${source}
              ${actions}
            </article>
          `;
        })
        .join("");

      return `
        <section>
          <h2 class="workbench-section-title">${escapeHtml(getTrackLabel(trackId))}</h2>
          ${list || '<p class="empty-note">暂无。</p>'}
        </section>
      `;
    })
    .join("");

  workbenchContent.innerHTML = `
    <div class="workbench-layout">
      <aside class="workbench-sidebar">
        <h2 class="workbench-section-title">章节</h2>
        <div class="workbench-chip-list">${chapterButtons}</div>
        <p class="journal-note">只展示已访问或已有记录的章节。</p>
      </aside>
      <section class="workbench-main">
        <h2 class="workbench-section-title">${escapeHtml(getWorkbenchChapterLabel(selectedChapter))}线索卡</h2>
        ${trackBlocks}
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
    : '<p class="empty-note">暂无玩家联线。先从“线索卡”里点“加入关系图”，再在图上点节点进行联线。</p>';

  const relationButtons = getConclusionRelations()
    .map(
      (relation) =>
        `<button class="workbench-chip" type="button" data-workbench-add-relation="${escapeHtml(relation.id)}">${escapeHtml(relation.title)}</button>`
    )
    .join("");

  const emptyGraphHint = nodes.length
    ? ""
    : '<p class="empty-note">本章关系图尚为空。请先到“线索卡”中选择记录并点击“加入关系图”。</p>';

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
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (positionMapLayer) closePositionMap();
    if (!messageLayer.classList.contains("hidden")) closeMessage();
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
