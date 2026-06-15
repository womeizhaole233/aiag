global.window = {};

require("../data/scenes.js");

const data = window.M1_GAME_DATA;
const errors = [];
const warnings = [];

function fail(code, message, detail = {}) {
  errors.push({ code, message, ...detail });
}

function warn(code, message, detail = {}) {
  warnings.push({ code, message, ...detail });
}

function assert(condition, code, message, detail = {}) {
  if (!condition) fail(code, message, detail);
}

const sceneIds = new Set(Object.keys(data.SCENES));
const viewIds = new Map();
const hotspotIds = new Set();
const analysisRecordIds = new Set();
const reviewResultIds = new Set();
const comboResultIds = new Set();

for (const [sceneId, scene] of Object.entries(data.SCENES)) {
  const views = scene.views ? scene.views : { default: scene };
  viewIds.set(sceneId, new Set(Object.keys(views)));
  for (const view of Object.values(views)) {
    for (const hotspot of view.hotspots || []) {
      hotspotIds.add(`${sceneId}:${hotspot.id}`);
    }
  }
}

for (const workflow of Object.values(data.ANALYSIS_DATA.sceneWorkflows || {})) {
  for (const step of workflow.reviewSteps || []) {
    reviewResultIds.add(step.resultRecord.id);
    analysisRecordIds.add(step.resultRecord.id);
  }
  if (workflow.combination?.resultRecord?.id) {
    comboResultIds.add(workflow.combination.resultRecord.id);
    analysisRecordIds.add(workflow.combination.resultRecord.id);
  }
}

function recordExists(id) {
  return hotspotIds.has(id) || analysisRecordIds.has(id);
}

function sceneExists(sceneId) {
  return sceneIds.has(sceneId);
}

function viewExists(sceneId, viewId) {
  return viewIds.get(sceneId)?.has(viewId);
}

function findHotspot(sceneId, viewId, hotspotId) {
  const view = data.SCENES[sceneId]?.views?.[viewId];
  return (view?.hotspots || []).find((item) => item.id === hotspotId) || null;
}

function targetViewOf(hotspot) {
  return hotspot?.transition?.targetViewId || hotspot?.viewTransition?.targetViewId || hotspot?.closeupTransition?.targetViewId || null;
}

for (const [sceneId, scene] of Object.entries(data.SCENES)) {
  const views = scene.views ? scene.views : { default: scene };
  for (const [viewId, view] of Object.entries(views)) {
    for (const hotspot of view.hotspots || []) {
      for (const key of ["transition", "viewTransition", "closeupTransition"]) {
        const transition = hotspot[key];
        if (!transition) continue;

        const targetSceneId = transition.targetSceneId || sceneId;
        if (transition.targetSceneId && !sceneExists(transition.targetSceneId)) {
          fail("bad-target-scene", `${sceneId}.${viewId}.${hotspot.id} target scene missing`, {
            key,
            targetSceneId: transition.targetSceneId
          });
        }
        if (transition.targetViewId && !viewExists(targetSceneId, transition.targetViewId)) {
          fail("bad-target-view", `${sceneId}.${viewId}.${hotspot.id} target view missing`, {
            key,
            targetSceneId,
            targetViewId: transition.targetViewId
          });
        }

        for (const requirement of transition.missingRecords || []) {
          if (requirement.id && !recordExists(requirement.id)) {
            fail("missing-record-id", `${sceneId}.${viewId}.${hotspot.id} missing record reference`, { id: requirement.id });
          }
          if (requirement.excludedId && !hotspotIds.has(requirement.excludedId)) {
            fail("missing-excluded-id", `${sceneId}.${viewId}.${hotspot.id} missing excluded hotspot reference`, {
              id: requirement.excludedId
            });
          }
          if (requirement.sceneId && !sceneExists(requirement.sceneId)) {
            fail("missing-scene-id", `${sceneId}.${viewId}.${hotspot.id} missing scene requirement`, {
              sceneId: requirement.sceneId
            });
          }
        }
      }
    }
  }
}

const rear = data.ANALYSIS_DATA.sceneWorkflows.rear_chamber;
const rearSummary = findHotspot("rear_chamber", "rear_overview", "rear_summary");
const finalGate = findHotspot("rear_chamber", "rear_overview", "final_report_placeholder");
const burial = rear.reviewSteps.find((step) => step.id === "review_burial_distribution");
const combo = rear.combination;
const finalCard = data.CONCLUSION_DATA.cards.find((card) => card.id === "final_report");

assert(Boolean(rearSummary?.transition?.completeOnly), "rear-summary-gate", "rear summary must be a locked completion gate");
assert(rearSummary?.transition?.completesSceneId === "rear_chamber", "rear-summary-completes-scene", "rear summary must complete rear_chamber");
assert(Boolean(finalGate?.transition?.completeOnly), "final-gate-complete-only", "final report gate must use completeOnly");

const rearSummaryIds = new Set((rearSummary?.transition?.missingRecords || []).flatMap((requirement) => [requirement.id, requirement.excludedId].filter(Boolean)));
for (const id of [
  "analysis:rear_chamber:review_false_door_structure",
  "analysis:rear_chamber:review_document_layer",
  "analysis:rear_chamber:review_burial_distribution",
  "rear_chamber:woman_hand",
  "rear_chamber:nail_count",
  "analysis:rear_chamber:combo"
]) {
  assert(rearSummaryIds.has(id), "rear-summary-missing-check", "rear summary gate missing expected requirement", { id });
}

const finalGateSceneReqs = (finalGate?.transition?.missingRecords || [])
  .filter((requirement) => requirement.sceneId && requirement.completed)
  .map((requirement) => requirement.sceneId)
  .sort();
const finalCardSceneReqs = (finalCard?.unlockRequirements || [])
  .filter((requirement) => requirement.sceneId && requirement.completed)
  .map((requirement) => requirement.sceneId)
  .sort();
assert(
  JSON.stringify(finalGateSceneReqs) === JSON.stringify(finalCardSceneReqs),
  "final-gate-card-mismatch",
  "final gate scene requirements must match final card unlock requirements",
  { finalGateSceneReqs, finalCardSceneReqs }
);
assert((finalGate?.transition?.missingRecords || []).some((requirement) => requirement.id === combo.resultRecord.id), "final-gate-rear-combo", "final gate must require rear combination record");

if (finalGate?.navLabelCompletedSceneId === "rear_chamber" && finalGateSceneReqs.length > 1) {
  warn("final-label-rear-only", "final gate label appears after rear completion, while transition still checks all chapters; normal path is fine, abnormal saves may show a locked label", {
    navLabelCompletedSceneId: finalGate.navLabelCompletedSceneId
  });
}

const burialSource = new Set(burial.sourceRecordIds || []);
const burialGuide = new Set((burial.guideSteps || []).flatMap((guide) => guide.recordIds || []));
for (const id of burialSource) assert(hotspotIds.has(id), "burial-source-missing", "burial review source id has no hotspot", { id });
for (const id of burialSource) assert(burialGuide.has(id), "burial-guide-missing-source", "burial guide does not cover source id", { id });
for (const id of burialGuide) assert(burialSource.has(id), "burial-guide-extra-source", "burial guide references id outside sourceRecordIds", { id });
assert((burial.sourceRecordIds || []).length === 7, "burial-source-count", "burial review should require 7 source records", {
  count: burial.sourceRecordIds?.length
});

const comboStepIds = (combo.requirementSteps || []).map((step) => step.id || step.excludedId);
const comboRequiredIds = [...(combo.requiresReviewRecordIds || []), ...(combo.requiresExcludedRecordIds || [])];
assert(comboStepIds.length === 5, "combo-step-count", "rear combination should expose five checklist steps", { comboStepIds });
for (const id of comboRequiredIds) assert(comboStepIds.includes(id), "combo-step-missing-required", "rear combination checklist missing required id", { id });
for (const id of comboStepIds) assert(comboRequiredIds.includes(id), "combo-step-extra-required", "rear combination checklist contains id outside requirements", { id });

const pendingById = new Map((rear.pendingResolutions || []).map((item) => [item.recordId, item]));
assert(
  pendingById.get("rear_chamber:woman_hand")?.requiresReviewRecordIds?.includes("analysis:rear_chamber:review_false_door_structure"),
  "woman-hand-resolution",
  "woman hand pending resolution must wait for false door review"
);
assert(
  pendingById.get("rear_chamber:nail_count")?.requiresReviewRecordIds?.includes("analysis:rear_chamber:review_burial_distribution"),
  "nail-resolution",
  "nail count pending resolution must wait for burial review"
);
for (const id of ["rear_chamber:woman_hand", "rear_chamber:nail_count"]) {
  const item = pendingById.get(id);
  assert(Boolean(item?.blockedText && item?.readyText && item?.resolutionText), "pending-resolution-copy", "pending resolution must have blocked, ready and resolution text", { id });
}

const requiredRouteChecks = [
  ["rear_chamber", "rear_overview", "rear_overview_enter_north", "rear_north"],
  ["rear_chamber", "rear_north", "rear_north_lower_link", "rear_north_lower_closeup"],
  ["rear_chamber", "rear_north", "bones_nails", "rear_bones_nails_closeup"],
  ["rear_chamber", "rear_north", "find_distribution", "rear_distribution_closeup"],
  ["rear_chamber", "rear_distribution_closeup", "bones_position_link", "rear_bones_position_closeup"],
  ["rear_chamber", "rear_north", "land_deed", "rear_land_deed_closeup"],
  ["rear_chamber", "rear_land_deed_closeup", "land_deed_cover_link", "rear_land_deed_cover_closeup"]
];
for (const [sceneId, viewId, hotspotId, targetViewId] of requiredRouteChecks) {
  const hotspot = findHotspot(sceneId, viewId, hotspotId);
  if (!hotspot) {
    fail("route-hotspot-missing", `route hotspot missing: ${sceneId}.${viewId}.${hotspotId}`);
    continue;
  }
  assert(targetViewOf(hotspot) === targetViewId, "route-target-mismatch", "route hotspot does not point to expected view", {
    sceneId,
    viewId,
    hotspotId,
    target: targetViewOf(hotspot),
    targetViewId
  });
}

const finalGateMissing = finalGate.transition.missingRecords;
function missingFor(completedScenes, records) {
  const completed = new Set(completedScenes);
  const has = new Set(records);
  return finalGateMissing.filter((requirement) => {
    if (requirement.id) return !has.has(requirement.id);
    if (requirement.sceneId && requirement.completed) return !completed.has(requirement.sceneId);
    return false;
  }).length;
}
assert(missingFor([], []) === 6, "final-gate-none", "final gate should list six missing items from empty state");
assert(missingFor(["rear_chamber"], ["analysis:rear_chamber:combo"]) === 4, "final-gate-rear-only", "final gate should still block if only rear is complete");
assert(missingFor(["tomb_gate", "corridor", "front_chamber", "passage"], []) === 2, "final-gate-all-but-rear", "final gate should still block if rear combo and summary are missing");
assert(
  missingFor(["tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber"], ["analysis:rear_chamber:combo"]) === 0,
  "final-gate-all-done",
  "final gate should unlock only when all chapter gates are satisfied"
);

const result = {
  ok: errors.length === 0,
  errors,
  warnings,
  counts: {
    scenes: sceneIds.size,
    hotspots: hotspotIds.size,
    analysisRecords: analysisRecordIds.size
  }
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
