global.window = {};
require("../data/scenes.js");

const { START_SCENE_ID, SCENES, CONCLUSION_DATA, ANALYSIS_DATA, NPC_DATA } = window.M1_GAME_DATA;

const REQUIRED_PUZZLES = {
  tomb_gate: ["mg_dig_match3"],
  corridor: ["corridor_pattern_align"],
  passage: ["mg_inscription_reading"],
  rear_chamber: ["mg_rear_relic_position"]
};

const NEXT_SCENE = {
  environment: "tomb_gate",
  tomb_gate: "corridor",
  corridor: "front_chamber",
  front_chamber: "passage",
  passage: "rear_chamber"
};

const state = {
  currentSceneId: START_SCENE_ID,
  completedSceneIds: [],
  completedPuzzleIds: [],
  records: [],
  classifications: {},
  shownDialogueKeys: new Set(),
  dialogueLog: [],
  issues: []
};

function fail(message) {
  state.issues.push(message);
}

function hasRecord(recordId) {
  return state.records.some((record) => record.id === recordId);
}

function getRecord(recordId) {
  return state.records.find((record) => record.id === recordId) || null;
}

function hasCompletedScene(sceneId) {
  return state.completedSceneIds.includes(sceneId);
}

function hasCompletedPuzzle(puzzleId) {
  return state.completedPuzzleIds.includes(puzzleId);
}

function getSceneHotspots(sceneId) {
  const scene = SCENES[sceneId];
  return Object.values(scene.views || {}).flatMap((view) => view.hotspots || []);
}

function getHotspot(sceneId, hotspotId) {
  return getSceneHotspots(sceneId).find((hotspot) => hotspot.id === hotspotId) || null;
}

function getWorkflow(sceneId) {
  return ANALYSIS_DATA.sceneWorkflows?.[sceneId] || null;
}

function toDialogueList(dialogues) {
  if (!dialogues) return [];
  return Array.isArray(dialogues) ? dialogues.filter(Boolean) : [dialogues];
}

function queueDialogues(dialogues, keyPrefix) {
  for (const [index, dialogue] of toDialogueList(dialogues).entries()) {
    const key = `${keyPrefix}:${dialogue.id || index}`;
    if (state.shownDialogueKeys.has(key)) continue;
    state.shownDialogueKeys.add(key);
    state.dialogueLog.push({ key, title: dialogue.title || "", body: dialogue.body || "" });
  }
}

function addRecord(sceneId, hotspotId) {
  const hotspot = getHotspot(sceneId, hotspotId);
  if (!hotspot) {
    fail(`${sceneId}:${hotspotId} hotspot missing`);
    return;
  }
  if (!hotspot.record || hotspot.sourceClueId === "NAV") return;

  const recordId = `${sceneId}:${hotspot.id}`;
  if (!hasRecord(recordId)) {
    state.records.push({
      id: recordId,
      sceneId,
      title: hotspot.title,
      text: hotspot.record,
      track: isRedHerring(sceneId, recordId) ? "pending" : "observation",
      recordType: "observation"
    });
    queueDialogues(NPC_DATA.clueReactions?.[recordId], `clue:${recordId}`);
  }
}

function addManualRecord(record) {
  if (!hasRecord(record.id)) {
    state.records.push({ ...record });
  }
}

function isRedHerring(sceneId, recordId) {
  const workflow = getWorkflow(sceneId);
  return Boolean((workflow?.pendingResolutions || []).find((item) => item.recordId === recordId));
}

function classify(sceneId) {
  const workflow = getWorkflow(sceneId);
  if (!workflow) return;
  const targetIds = new Set();
  for (const step of workflow.reviewSteps || []) {
    for (const recordId of step.sourceRecordIds || []) targetIds.add(recordId);
  }
  for (const resolution of workflow.pendingResolutions || []) targetIds.add(resolution.recordId);

  for (const recordId of targetIds) {
    if (!hasRecord(recordId)) continue;
    state.classifications[recordId] = isRedHerring(sceneId, recordId) ? "doubt" : "evidence";
  }
}

function runReviewSteps(sceneId) {
  const workflow = getWorkflow(sceneId);
  if (!workflow) return;
  for (const step of workflow.reviewSteps || []) {
    const missing = (step.sourceRecordIds || []).filter((recordId) => !hasRecord(recordId));
    const unclassified = (step.sourceRecordIds || []).filter((recordId) => !state.classifications[recordId]);
    const blocked = (step.sourceRecordIds || []).filter((recordId) => !["fact", "evidence", "doubt"].includes(state.classifications[recordId]));
    if (missing.length) fail(`${sceneId}:${step.id} missing source records ${missing.join(", ")}`);
    if (unclassified.length) fail(`${sceneId}:${step.id} unclassified records ${unclassified.join(", ")}`);
    if (blocked.length) fail(`${sceneId}:${step.id} blocked by classification ${blocked.join(", ")}`);
    if (!missing.length && !unclassified.length && !blocked.length) {
      addManualRecord(step.resultRecord);
      queueDialogues(
        { id: step.resultRecord.id, title: step.resultRecord.title, body: step.resultRecord.text },
        `analysis_review:${step.resultRecord.id}`
      );
    }
  }
}

function resolvePending(sceneId) {
  const workflow = getWorkflow(sceneId);
  if (!workflow) return;
  for (const resolution of workflow.pendingResolutions || []) {
    const record = getRecord(resolution.recordId);
    const missingReview = (resolution.requiresReviewRecordIds || []).filter((recordId) => !hasRecord(recordId));
    if (!record) {
      fail(`${sceneId}:${resolution.recordId} pending record missing`);
      continue;
    }
    if (record.track !== "pending") {
      fail(`${sceneId}:${resolution.recordId} expected pending track, got ${record.track}`);
      continue;
    }
    if (missingReview.length) {
      fail(`${sceneId}:${resolution.recordId} cannot resolve before reviews ${missingReview.join(", ")}`);
      continue;
    }
    record.track = "excluded";
    state.classifications[resolution.recordId] = "detail";
    queueDialogues(
      { id: resolution.recordId, title: `${record.title}已降级`, body: resolution.resolutionText },
      `analysis_exclude:${resolution.recordId}`
    );
  }
}

function createCombination(sceneId) {
  const workflow = getWorkflow(sceneId);
  if (!workflow?.combination) return;
  const combination = workflow.combination;
  const missingReviews = (combination.requiresReviewRecordIds || []).filter((recordId) => !hasRecord(recordId));
  const missingExcluded = (combination.requiresExcludedRecordIds || []).filter((recordId) => getRecord(recordId)?.track !== "excluded");
  const targetIds = new Set((workflow.reviewSteps || []).flatMap((step) => step.sourceRecordIds || []));
  for (const resolution of workflow.pendingResolutions || []) targetIds.add(resolution.recordId);
  const missingClassifications = [...targetIds].filter((recordId) => hasRecord(recordId) && !state.classifications[recordId]);

  if (missingReviews.length) fail(`${sceneId} combination missing reviews ${missingReviews.join(", ")}`);
  if (missingExcluded.length) fail(`${sceneId} combination missing excluded records ${missingExcluded.join(", ")}`);
  if (missingClassifications.length) fail(`${sceneId} combination missing classifications ${missingClassifications.join(", ")}`);
  if (!missingReviews.length && !missingExcluded.length && !missingClassifications.length) {
    addManualRecord(combination.resultRecord);
    completeScene(sceneId);
  }
}

function completePuzzle(puzzleId) {
  if (!puzzleId || hasCompletedPuzzle(puzzleId)) return;
  state.completedPuzzleIds.push(puzzleId);
  queueDialogues(NPC_DATA.puzzleCompletions?.[puzzleId], `minigame:${puzzleId}:complete`);
}

function completeScene(sceneId) {
  if (hasCompletedScene(sceneId)) return;
  const workflow = getWorkflow(sceneId);
  const comboId = workflow?.combination?.resultRecord?.id;
  if (comboId && !hasRecord(comboId)) {
    fail(`${sceneId} completed before combination ${comboId}`);
    return;
  }
  state.completedSceneIds.push(sceneId);
  queueDialogues(NPC_DATA.sceneCompletions?.[sceneId], `scene_complete:${sceneId}`);
}

function verifyScene(sceneId) {
  const required = REQUIRED_PUZZLES[sceneId] || [];
  for (const puzzleId of required) {
    if (!hasCompletedPuzzle(puzzleId)) fail(`${sceneId} missing required puzzle ${puzzleId}`);
  }
  if (!hasCompletedScene(sceneId)) fail(`${sceneId} not completed`);
  const card = CONCLUSION_DATA.cards.find((item) => item.id === sceneId);
  for (const requirement of card?.requirements || []) {
    if (requirement.id && !hasRecord(requirement.id)) fail(`${sceneId} conclusion missing record ${requirement.id}`);
    if (requirement.excludedId && getRecord(requirement.excludedId)?.track !== "excluded") {
      fail(`${sceneId} conclusion missing excluded ${requirement.excludedId}`);
    }
  }
}

function collectWorkflowRecords(sceneId) {
  const workflow = getWorkflow(sceneId);
  if (!workflow) return;
  const sourceIds = new Set((workflow.reviewSteps || []).flatMap((step) => step.sourceRecordIds || []));
  for (const resolution of workflow.pendingResolutions || []) sourceIds.add(resolution.recordId);
  for (const recordId of sourceIds) {
    const [recordSceneId, hotspotId] = recordId.split(":");
    addRecord(recordSceneId, hotspotId);
  }
}

function playChapter(sceneId) {
  queueDialogues(NPC_DATA.sceneEntries?.[sceneId], `scene_entry:${sceneId}`);
  collectWorkflowRecords(sceneId);
  for (const puzzleId of REQUIRED_PUZZLES[sceneId] || []) completePuzzle(puzzleId);
  classify(sceneId);
  runReviewSteps(sceneId);
  resolvePending(sceneId);
  createCombination(sceneId);
  verifyScene(sceneId);
  if (NEXT_SCENE[sceneId] && !hasCompletedScene(sceneId)) {
    fail(`${sceneId} tried to navigate to ${NEXT_SCENE[sceneId]} before completion`);
  }
}

queueDialogues(NPC_DATA.opening, "opening");
queueDialogues(NPC_DATA.sceneEntries?.[START_SCENE_ID], `scene_entry:${START_SCENE_ID}`);
addRecord("environment", "baisha_location");
addRecord("environment", "m1_sequence_map");
addRecord("environment", "six_part_sequence");
completeScene("environment");

for (const sceneId of ["tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber"]) {
  playChapter(sceneId);
}

const finalCard = CONCLUSION_DATA.cards.find((item) => item.id === "final_report");
for (const requirement of finalCard.unlockRequirements || []) {
  if (requirement.sceneId && requirement.completed && !hasCompletedScene(requirement.sceneId)) {
    fail(`final_report missing completed scene ${requirement.sceneId}`);
  }
}
if (!state.issues.length) {
  queueDialogues(NPC_DATA.sceneCompletions?.final_report, "scene_complete:final_report");
}

const duplicateKeys = state.dialogueLog
  .map((item) => item.key)
  .filter((key, index, list) => list.indexOf(key) !== index);
if (duplicateKeys.length) fail(`duplicate dialogue keys ${duplicateKeys.join(", ")}`);

const longDialogues = state.dialogueLog.filter((item) => item.body.length > 130);
const result = {
  completedScenes: state.completedSceneIds,
  completedPuzzles: state.completedPuzzleIds,
  recordCount: state.records.length,
  dialogueCount: state.dialogueLog.length,
  longDialogues: longDialogues.map((item) => ({ key: item.key, title: item.title, length: item.body.length })),
  issues: state.issues
};

console.log(JSON.stringify(result, null, 2));
if (state.issues.length) process.exit(1);
