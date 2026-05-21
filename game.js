const { SAVE_KEY, START_SCENE_ID, SCENES, POSITION_MAP } = window.M1_GAME_DATA;

const state = {
  currentSceneId: START_SCENE_ID,
  currentViewIds: {},
  visitedSceneIds: [],
  visitedViewIds: {},
  completedSceneIds: [],
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
let positionMapLayer = null;

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
  state.completedSceneIds.push(sceneId);
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
    text: hotspot.record
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

  save();
  renderJournal();
  messageKicker.textContent = "现场观察";
  messageTitle.textContent = activeTransition ? activeTransition.title : hotspot.title;
  messageBody.textContent = `${activeTransition ? activeTransition.body : lockedBody || hotspot.body}${getCompletionHint(hotspot, addedRecord)}`;
  messageClose.textContent = activeTransition?.closeLabel || "收录";
  state.pendingNavigation = navigation;
  messageLayer.classList.remove("hidden");
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
    item.innerHTML = `<h2>${record.title}</h2><p>${record.text}</p>`;
    journalList.appendChild(item);
  });
}

journalToggle.addEventListener("click", () => setJournal(!state.journalOpen));
journalClose.addEventListener("click", () => setJournal(false));
messageClose.addEventListener("click", closeMessage);
messageLayer.addEventListener("click", (event) => {
  if (event.target === messageLayer) closeMessage();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMessage();
    setJournal(false);
  }
});

load();
navigateTo({ sceneId: state.currentSceneId });
renderScene();
renderJournal();
