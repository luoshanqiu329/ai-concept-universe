(() => {
  "use strict";

  const CATEGORY_CONFIG = {
    "基座模型": { color: "#6ea8fe", arm: 0 },
    "微调技术": { color: "#79dfc1", arm: 1 },
    "推理优化": { color: "#ffe066", arm: 2 },
    "多模态技术": { color: "#ff8fa3", arm: 3 },
    "智能体Agent": { color: "#b197fc", arm: 4 },
    "RAG与检索": { color: "#99e9b0", arm: 5 },
    "AI安全与对齐": { color: "#ff922b", arm: 6 },
    "开发框架与工具": { color: "#74c0fc", arm: 7 },
    "行业应用场景": { color: "#f783ac", arm: 8 },
    "Agent协议与范式": { color: "#c0eb75", arm: 4 },
  };

  const TYPE_CONFIG = {
    concept: { label: "AI概念", color: "#8cb7ff" },
    company: { label: "顶尖AI公司", color: "#ffffff" },
    person: { label: "关键人物", color: "#ffd43b" },
    achievement: { label: "AI里程碑", color: "#ffe066" },
  };

  const STORAGE_KEY = "ai-concept-universe:last-seen-version";
  const LOW_PERFORMANCE_KEY = "ai-concept-universe:low-performance";
  const MOTION_QUERY = window.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
  const CURRENT_YEAR = 2026;
  const EPOCH_YEAR = 1950;
  const PERFORMANCE = {
    rendererPixelRatio: 1.45,
    lowRendererPixelRatio: 1,
    backgroundPixelRatio: 1.25,
    lowBackgroundPixelRatio: 1,
    labelInterval: 64,
    lowLabelInterval: 118,
    backgroundInterval: 48,
    lowBackgroundInterval: 140,
    lowRenderInterval: 34,
    pointerInterval: 36,
    maxLabels: 92,
    maxStars: 520,
    lowMaxStars: 210,
    maxDust: 120,
    lowMaxDust: 28,
    maxMeteors: 5,
    maxShips: 2,
  };
  const dom = {
    stage: document.getElementById("galaxy-stage"),
    labelLayer: document.getElementById("label-layer"),
    canvas: document.getElementById("space-canvas"),
    categoryList: document.getElementById("category-list"),
    typeList: document.getElementById("type-list"),
    search: document.getElementById("entity-search"),
    datalist: document.getElementById("entity-options"),
    reset: document.getElementById("reset-view"),
    updateBadge: document.getElementById("update-badge"),
    timeline: document.getElementById("timeline-slider"),
    chronicleYear: document.getElementById("chronicle-year"),
    chronicleEvent: document.getElementById("chronicle-event"),
    sliceYear: document.getElementById("slice-year"),
    sliceCount: document.getElementById("slice-count"),
    infoCard: document.getElementById("info-card"),
    closeCard: document.getElementById("close-card"),
    portraitWrap: document.getElementById("portrait-wrap"),
    cardPortrait: document.getElementById("card-portrait"),
    cardSwatch: document.getElementById("card-swatch"),
    cardKind: document.getElementById("card-kind"),
    cardTitle: document.getElementById("card-title"),
    cardDefinition: document.getElementById("card-definition"),
    cardMetrics: document.getElementById("card-metrics"),
    modelSection: document.getElementById("model-section"),
    cardModels: document.getElementById("card-models"),
    peopleSection: document.getElementById("people-section"),
    cardPeople: document.getElementById("card-people"),
    cardRelations: document.getElementById("card-relations"),
    cardLinks: document.getElementById("card-links"),
  };

  const dynamicDom = {};

  const state = {
    payload: null,
    items: [],
    itemById: new Map(),
    links: [],
    chronology: [],
    activeCategories: new Set(Object.keys(CATEGORY_CONFIG)),
    activeTypes: new Set(Object.keys(TYPE_CONFIG)),
    selectedYear: CURRENT_YEAR,
    hoveredId: null,
    selectedId: null,
    searchHitId: null,
    searchClusterIds: new Set(),
    constellationId: null,
    viewMode: "panorama",
    isChroniclePlaying: false,
    prefersReducedMotion: Boolean(MOTION_QUERY?.matches),
    lowPerformance: initialLowPerformance(),
    chronicleTimer: 0,
    radar: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: null,
    pointer: new THREE.Vector2(),
    galaxy: null,
    meshes: new Map(),
    labels: new Map(),
    backgroundLinkObject: null,
    highlightLinkObject: null,
    linkVisibilitySignature: "",
    linkHighlightSignature: "",
    portraitCache: new Map(),
    lastLabelUpdate: 0,
    lastPointerCheck: 0,
    lastRender: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  async function start() {
    if (!window.THREE) {
      dom.stage.innerHTML = '<div class="fallback-error">Three.js 加载失败，请检查网络连接。</div>';
      return;
    }

    if (window.lucide) window.lucide.createIcons();
    setupMotionPreferenceWatcher();
    applyPerformanceMode(false);
    setupDynamicUi();
    initStarfield();
    setupThree();
    bindEvents();
    const payload = await loadUniverseData();
    normalizePayload(payload);
    buildControls();
    buildGalaxy();
    updateTimelineRange();
    applyFilters();
    setupUpdateBadge();
    animate();
  }

  async function loadUniverseData() {
    const embedded = readEmbeddedPayload();
    if (window.location.protocol !== "file:") {
      try {
        const response = await fetch(`data/concepts.json?v=${Date.now()}`, { cache: "no-store" });
        if (response.ok) return response.json();
      } catch (error) {
        console.warn("Falling back to embedded data.", error);
      }
    }
    return embedded;
  }

  function readEmbeddedPayload() {
    try {
      return JSON.parse(document.getElementById("embedded-concepts").textContent);
    } catch (error) {
      console.error("Embedded concept data is invalid.", error);
      return { meta: {}, concepts: [], companies: [], people: [], achievements: [], chronology: [] };
    }
  }

  function normalizePayload(payload) {
    state.payload = payload;
    const concepts = (payload.concepts || []).map((item) => normalizeItem(item, "concept"));
    const companies = (payload.companies || []).map((item) => normalizeItem(item, "company"));
    const people = (payload.people || []).map((item) => normalizeItem(item, "person"));
    const achievements = (payload.achievements || []).map((item) => normalizeItem(item, "achievement"));
    state.items = [...concepts, ...companies, ...people, ...achievements].map((item, index) => ({
      ...item,
      index,
      year: parseYear(item.first_appear || item.founded || item.active_since || item.date || CURRENT_YEAR),
    }));
    state.itemById = new Map(state.items.map((item) => [item.id, item]));
    state.links = buildLinks();
    state.chronology = (payload.chronology || []).slice().sort((a, b) => Number(a.year) - Number(b.year));
  }

  function normalizeItem(item, kind) {
    const normalized = {
      ...item,
      kind: item.kind || kind,
      heat: Number(item.heat || (kind === "company" ? 92 : kind === "person" ? 72 : 50)),
      category: item.category || (kind === "company" ? "顶尖AI公司" : kind === "person" ? "关键人物" : "基座模型"),
      references: item.references || item.links || [],
      relations: item.relations || [],
    };
    normalized.position = item.position || galaxyPosition(normalized);
    return normalized;
  }

  function buildLinks() {
    const links = [];
    const pushLink = (sourceId, targetId, type = "related") => {
      const source = state.itemById.get(sourceId);
      const target = state.itemById.get(targetId);
      if (!source || !target || sourceId === targetId) return;
      const id = `${sourceId}->${targetId}:${type}`;
      if (links.some((link) => link.id === id)) return;
      links.push({ id, source, target, sourceId, targetId, type });
    };

    state.items.forEach((item) => {
      (item.relations || []).forEach((relation) => pushLink(item.id, relation.target, relation.type));
      (item.related || []).forEach((target) => pushLink(item.id, target, "related"));
      (item.people || []).forEach((target) => pushLink(item.id, target, "person"));
      (item.concepts || []).forEach((target) => pushLink(item.id, target, "concept"));
      (item.companies || []).forEach((target) => pushLink(item.id, target, "company"));
      (item.models || []).forEach((model) => (model.related || []).forEach((target) => pushLink(item.id, target, "model")));
    });

    return links;
  }

  function setupThree() {
    state.width = dom.stage.clientWidth || window.innerWidth;
    state.height = dom.stage.clientHeight || window.innerHeight;
    state.scene = new THREE.Scene();
    state.scene.fog = new THREE.FogExp2(0x05050a, 0.00125);
    state.camera = new THREE.PerspectiveCamera(50, state.width / state.height, 0.1, 5200);
    state.camera.position.set(0, 168, 468);

    state.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    state.renderer.setPixelRatio(currentRendererPixelRatio());
    state.renderer.setSize(state.width, state.height);
    state.renderer.outputColorSpace = THREE.SRGBColorSpace;
    state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.renderer.toneMappingExposure = 1.08;
    state.renderer.setClearColor(0x000000, 0);
    dom.stage.prepend(state.renderer.domElement);

    state.controls = createGalaxyControls(state.camera, state.renderer.domElement);

    state.raycaster = new THREE.Raycaster();
    state.galaxy = new THREE.Group();
    state.scene.add(state.galaxy);

    const ambient = new THREE.AmbientLight(0xdfe8ff, 0.96);
    state.scene.add(ambient);
    const coreLight = new THREE.PointLight(0x8cb7ff, 2.25, 760);
    coreLight.position.set(0, 82, 128);
    state.scene.add(coreLight);
    const warmRim = new THREE.PointLight(0xffd6a5, 0.82, 720);
    warmRim.position.set(-260, 120, -180);
    state.scene.add(warmRim);
  }

  function bindEvents() {
    window.addEventListener("resize", debounce(handleResize, 120));
    state.pointer = new THREE.Vector2();
    dom.stage.addEventListener("pointermove", handlePointerMove);
    dom.stage.addEventListener("click", handleClick);
    dom.stage.addEventListener("pointerleave", () => setHovered(null));
    dom.reset.addEventListener("click", resetView);
    dom.closeCard.addEventListener("click", closeInfoCard);
    dom.cardRelations.addEventListener("click", handleRelatedClick);
    dom.cardPeople.addEventListener("click", handleRelatedClick);
    dom.timeline.addEventListener("input", handleTimelineChange);
    dom.search.addEventListener("input", debounce(handleSearchInput, 160));
    dom.search.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleSearchInput();
    });
  }

  function setupDynamicUi() {
    const radarLayer = document.createElement("div");
    radarLayer.id = "radar-layer";
    radarLayer.className = "radar-layer";
    radarLayer.hidden = true;
    radarLayer.innerHTML = `
      <div class="radar-pulse"></div>
      <div class="radar-sweep"></div>
      <div class="radar-core"></div>
    `;
    document.querySelector(".app-shell")?.appendChild(radarLayer);
    dynamicDom.radarLayer = radarLayer;

    const orbitalMenu = document.createElement("div");
    orbitalMenu.id = "orbital-menu";
    orbitalMenu.className = "orbital-menu";
    orbitalMenu.hidden = true;
    orbitalMenu.innerHTML = `
      <button type="button" data-command="reference" title="打开资料" aria-label="打开资料"><i data-lucide="external-link"></i></button>
    `;
    document.querySelector(".app-shell")?.appendChild(orbitalMenu);
    dynamicDom.orbitalMenu = orbitalMenu;
    orbitalMenu.addEventListener("pointerdown", (event) => event.stopPropagation());
    orbitalMenu.addEventListener("click", handleOrbitalCommand);

    const panel = document.querySelector(".filter-panel");
    const brandLockup = panel?.querySelector(".brand-lockup");
    if (brandLockup) {
      const archiveStats = document.createElement("div");
      archiveStats.id = "archive-status-strip";
      archiveStats.className = "archive-status-strip";
      archiveStats.innerHTML = `
        <span><strong>0</strong><em>概念</em></span>
        <span><strong>0</strong><em>公司</em></span>
        <span><strong>0</strong><em>人物</em></span>
        <span><strong>0</strong><em>里程碑</em></span>
      `;
      brandLockup.appendChild(archiveStats);
      dynamicDom.archiveStats = archiveStats;

      const panelToggle = document.createElement("button");
      panelToggle.id = "panel-toggle";
      panelToggle.className = "panel-toggle";
      panelToggle.type = "button";
      panelToggle.innerHTML = '<i data-lucide="sliders-horizontal" aria-hidden="true"></i><span>筛选</span>';
      brandLockup.appendChild(panelToggle);
      dynamicDom.panelToggle = panelToggle;
      panelToggle.addEventListener("click", () => setPanelCompact(!panel.classList.contains("is-compact")));
      setPanelCompact(true);
    }

    const performanceToggle = document.createElement("button");
    performanceToggle.id = "performance-toggle";
    performanceToggle.className = "icon-button performance-toggle";
    performanceToggle.type = "button";
    performanceToggle.innerHTML = '<i data-lucide="gauge" aria-hidden="true"></i>';
    dom.reset?.insertAdjacentElement("afterend", performanceToggle);
    dynamicDom.performanceToggle = performanceToggle;
    performanceToggle.addEventListener("click", togglePerformanceMode);
    updatePerformanceButton();
    updateResponsiveText();

    const typeSection = dom.typeList?.closest(".panel-section");
    if (panel && typeSection) {
      const viewSection = document.createElement("div");
      viewSection.className = "panel-section view-mode-section";
      viewSection.innerHTML = `
        <div class="section-title">浏览视图</div>
        <div id="view-mode-list" class="view-mode-list"></div>
      `;
      panel.insertBefore(viewSection, typeSection);
      dynamicDom.viewModeList = viewSection.querySelector("#view-mode-list");
    }

    const constellationHud = document.createElement("aside");
    constellationHud.id = "constellation-hud";
    constellationHud.className = "constellation-hud";
    constellationHud.hidden = true;
    constellationHud.innerHTML = `
      <div class="constellation-copy">
        <span class="constellation-kicker">CONSTELLATION</span>
        <strong id="constellation-title"></strong>
        <p id="constellation-summary"></p>
        <div id="constellation-route" class="constellation-route"></div>
        <div id="constellation-links" class="constellation-links"></div>
      </div>
      <button id="exit-constellation" class="ghost-button" type="button">退出星座</button>
    `;
    document.querySelector(".app-shell")?.appendChild(constellationHud);
    dynamicDom.constellationHud = constellationHud;
    dynamicDom.constellationTitle = constellationHud.querySelector("#constellation-title");
    dynamicDom.constellationSummary = constellationHud.querySelector("#constellation-summary");
    dynamicDom.constellationRoute = constellationHud.querySelector("#constellation-route");
    dynamicDom.constellationLinks = constellationHud.querySelector("#constellation-links");
    dynamicDom.exitConstellation = constellationHud.querySelector("#exit-constellation");
    dynamicDom.exitConstellation.addEventListener("click", () => clearConstellation());
    constellationHud.addEventListener("click", handleConstellationClick);

    const chronicleButton = document.createElement("button");
    chronicleButton.id = "chronicle-play";
    chronicleButton.className = "icon-button chronicle-play";
    chronicleButton.type = "button";
    chronicleButton.title = "播放编年史";
    chronicleButton.setAttribute("aria-label", "播放编年史");
    chronicleButton.innerHTML = '<i data-lucide="play" aria-hidden="true"></i>';
    document.querySelector(".chronicle-head")?.prepend(chronicleButton);
    dynamicDom.chroniclePlay = chronicleButton;
    chronicleButton.addEventListener("click", toggleChroniclePlay);

    const chronicleTrack = document.createElement("div");
    chronicleTrack.id = "chronicle-track";
    chronicleTrack.className = "chronicle-track";
    document.querySelector("#timeline-slider")?.insertAdjacentElement("afterend", chronicleTrack);
    dynamicDom.chronicleTrack = chronicleTrack;

    const chronicleFocus = document.createElement("div");
    chronicleFocus.id = "chronicle-focus-card";
    chronicleFocus.className = "chronicle-focus-card";
    chronicleFocus.hidden = true;
    document.querySelector("#timeline-slider")?.insertAdjacentElement("beforebegin", chronicleFocus);
    dynamicDom.chronicleFocus = chronicleFocus;
    chronicleFocus.addEventListener("click", handleChronicleFocusClick);

    const archiveSection = document.createElement("div");
    archiveSection.id = "archive-section";
    archiveSection.className = "archive-section";
    archiveSection.hidden = true;
    archiveSection.innerHTML = `
      <div class="archive-row">
        <span>重要性</span>
        <strong id="archive-importance"></strong>
      </div>
      <div class="archive-row">
        <span>影响链</span>
        <strong id="archive-lineage"></strong>
      </div>
    `;
    dom.cardMetrics?.before(archiveSection);
    dynamicDom.archiveSection = archiveSection;
    dynamicDom.archiveImportance = archiveSection.querySelector("#archive-importance");
    dynamicDom.archiveLineage = archiveSection.querySelector("#archive-lineage");

    const archiveId = document.createElement("div");
    archiveId.id = "archive-id";
    archiveId.className = "archive-id";
    archiveId.textContent = "ARCHIVE";
    document.querySelector(".card-kicker")?.before(archiveId);
    dynamicDom.archiveId = archiveId;

    if (window.lucide) window.lucide.createIcons();
  }

  function setPanelCompact(compact) {
    const panel = document.querySelector(".filter-panel");
    if (!panel) return;
    panel.classList.toggle("is-compact", compact);
    updatePanelToggle();
  }

  function updatePanelToggle() {
    const panel = document.querySelector(".filter-panel");
    if (!panel || !dynamicDom.panelToggle) return;
    const compact = panel.classList.contains("is-compact");
    dynamicDom.panelToggle.setAttribute("aria-expanded", String(!compact));
    dynamicDom.panelToggle.title = compact ? "展开筛选" : "收起筛选";
    dynamicDom.panelToggle.querySelector("span").textContent = compact ? "筛选" : "收起";
  }

  function setupMotionPreferenceWatcher() {
    if (!MOTION_QUERY) return;
    const handleChange = () => {
      state.prefersReducedMotion = Boolean(MOTION_QUERY.matches);
      state.lowPerformance = state.prefersReducedMotion || safeStorageGet(LOW_PERFORMANCE_KEY) === "1";
      applyPerformanceMode(true);
    };
    MOTION_QUERY.addEventListener?.("change", handleChange);
  }

  function togglePerformanceMode() {
    if (state.prefersReducedMotion) return;
    state.lowPerformance = !state.lowPerformance;
    safeStorageSet(LOW_PERFORMANCE_KEY, state.lowPerformance ? "1" : "0");
    applyPerformanceMode(true);
  }

  function applyPerformanceMode(syncScene = true) {
    document.body.classList.toggle("is-low-motion", state.lowPerformance);
    updatePerformanceButton();
    if (!syncScene) return;
    if (state.renderer && state.camera) handleResize();
    window.dispatchEvent(new Event("resize"));
  }

  function updatePerformanceButton() {
    if (!dynamicDom.performanceToggle) return;
    const active = state.lowPerformance;
    dynamicDom.performanceToggle.classList.toggle("is-active", active);
    dynamicDom.performanceToggle.disabled = state.prefersReducedMotion;
    dynamicDom.performanceToggle.title = state.prefersReducedMotion
      ? "系统减少动态效果已启用"
      : active
        ? "低性能模式已开启"
        : "开启低性能模式";
    dynamicDom.performanceToggle.setAttribute("aria-label", dynamicDom.performanceToggle.title);
  }

  function buildControls() {
    buildViewModeControls();
    renderArchiveStats();
    buildTypeControls();
    buildCategoryControls();
    buildSearchOptions();
  }

  function buildViewModeControls() {
    if (!dynamicDom.viewModeList) return;
    const modes = [
      { mode: "panorama", label: "全景", detail: "总览", icon: "orbit" },
      { mode: "chronicle", label: "编年", detail: "时间", icon: "history" },
      { mode: "hot", label: "热点", detail: "趋势", icon: "flame" },
      { mode: "company", label: "公司", detail: "机构", icon: "building-2" },
      { mode: "person", label: "人物", detail: "研究者", icon: "user-round" },
    ];
    dynamicDom.viewModeList.innerHTML = modes
      .map(({ mode, label, detail, icon }) => `
        <button class="view-mode ${state.viewMode === mode ? "is-active" : ""}" type="button" data-mode="${mode}">
          <i data-lucide="${icon}" aria-hidden="true"></i>
          <span>${label}</span>
          <small>${detail}</small>
        </button>
      `)
      .join("");
    dynamicDom.viewModeList.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.viewMode = button.dataset.mode;
        if (state.viewMode !== "chronicle") {
          stopChroniclePlay();
          state.selectedYear = Number(dom.timeline.max || CURRENT_YEAR);
          dom.timeline.value = String(state.selectedYear);
        }
        buildControls();
        applyFilters();
      });
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function renderArchiveStats() {
    if (!dynamicDom.archiveStats) return;
    const meta = state.payload?.meta || {};
    const stats = state.payload?.stats || {};
    const values = [
      [meta.conceptCount || stats.conceptCount || state.items.filter((item) => item.kind === "concept").length, "概念"],
      [meta.companyCount || stats.companyCount || state.items.filter((item) => item.kind === "company").length, "公司"],
      [meta.peopleCount || stats.peopleCount || state.items.filter((item) => item.kind === "person").length, "人物"],
      [meta.achievementCount || stats.achievementCount || state.items.filter((item) => item.kind === "achievement").length, "里程碑"],
    ];
    dynamicDom.archiveStats.innerHTML = values
      .map(([value, label]) => `<span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(label)}</em></span>`)
      .join("");
  }

  function buildTypeControls() {
    const counts = countBy(state.items, (item) => item.kind);
    dom.typeList.innerHTML = "";
    Object.entries(TYPE_CONFIG).forEach(([type, config]) => {
      const label = document.createElement("label");
      label.className = "type-item";
      label.style.setProperty("--item-color", config.color);
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.activeTypes.has(type);
      input.addEventListener("change", () => {
        if (input.checked) state.activeTypes.add(type);
        else state.activeTypes.delete(type);
        applyFilters();
      });
      label.innerHTML = `<span>${escapeHtml(config.label)}</span><span class="type-count">${counts.get(type) || 0}</span>`;
      label.prepend(input);
      dom.typeList.appendChild(label);
    });
  }

  function buildCategoryControls() {
    const concepts = state.items.filter((item) => item.kind === "concept");
    const counts = countBy(concepts, (item) => item.category);
    dom.categoryList.innerHTML = "";
    Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
      const label = document.createElement("label");
      label.className = "category-item";
      label.style.setProperty("--item-color", config.color);
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.activeCategories.has(category);
      input.addEventListener("change", () => {
        if (input.checked) state.activeCategories.add(category);
        else state.activeCategories.delete(category);
        applyFilters();
      });
      const swatch = document.createElement("span");
      swatch.className = "category-swatch";
      const name = document.createElement("span");
      name.textContent = category;
      const count = document.createElement("span");
      count.className = "category-count";
      count.textContent = counts.get(category) || 0;
      label.append(input, swatch, name, count);
      dom.categoryList.appendChild(label);
    });
  }

  function buildSearchOptions() {
    dom.datalist.innerHTML = state.items
      .slice()
      .sort((a, b) => b.heat - a.heat || a.name.localeCompare(b.name))
      .flatMap((item) => [item.name, item.nativeName, ...(item.aliases || [])].filter(Boolean))
      .map((name) => `<option value="${escapeHtml(name)}"></option>`)
      .join("");
  }

  function buildGalaxy() {
    clearGroup(state.galaxy);
    state.meshes.clear();
    state.labels.clear();
    state.backgroundLinkObject = null;
    state.highlightLinkObject = null;
    state.linkVisibilitySignature = "";
    state.linkHighlightSignature = "";
    addGalaxyMist();
    addItemMeshes();
  }

  function addItemMeshes() {
    state.items.forEach((item) => {
      const color = itemColor(item);
      const size = nodeSize(item);
      const material = new THREE.SpriteMaterial({
        color: 0xffffff,
        map: planetTexture(item, color),
        transparent: true,
        opacity: item.kind === "achievement" ? 0.97 : 0.92,
        depthWrite: false,
      });
      const mesh = new THREE.Sprite(material);
      mesh.scale.setScalar(size * 2.12);
      mesh.position.set(item.position.x, item.position.y, item.position.z);
      mesh.userData.itemId = item.id;
      mesh.userData.baseScale = size * 2.12;
      mesh.userData.baseOpacity = material.opacity;
      mesh.userData.pulse = (stableHash(`pulse-${item.id}`) % 1000) / 1000;
      state.galaxy.add(mesh);

      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: haloTexture(),
          color,
          transparent: true,
          opacity: item.kind === "achievement" ? 0.15 : item.kind === "company" ? 0.12 : item.kind === "person" ? 0.11 : 0.075,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.scale.setScalar(size * (item.kind === "achievement" ? 5.1 : item.kind === "company" ? 4.05 : 3.35));
      halo.position.copy(mesh.position);
      halo.userData.follows = mesh;
      halo.userData.baseOpacity = halo.material.opacity;
      halo.userData.baseScale = halo.scale.x;
      halo.userData.planetHalo = true;
      state.galaxy.add(halo);

      if (item.kind === "achievement") {
        const starburst = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: starburstTexture(),
            color,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
          })
        );
        starburst.scale.set(size * 10.2, size * 10.2, 1);
        starburst.position.copy(mesh.position);
        starburst.userData.follows = mesh;
        starburst.userData.starburst = true;
        starburst.userData.baseOpacity = starburst.material.opacity;
        state.galaxy.add(starburst);
      }

      if (item.kind !== "concept") {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(size * 1.7, size * 1.92, 48),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.48,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        ring.position.copy(mesh.position);
        ring.lookAt(state.camera.position);
        ring.userData.follows = mesh;
        ring.userData.baseOpacity = ring.material.opacity;
        state.galaxy.add(ring);
      }

      state.meshes.set(item.id, mesh);
      createLabel(item);
    });
  }

  function updateLinkLayers(focusRelated, constellationIds) {
    const visibleLinks = state.links.filter((link) => isItemVisible(link.source) && isItemVisible(link.target));
    const visibilitySignature = visibleLinks.map((link) => link.id).join("|");
    if (visibilitySignature !== state.linkVisibilitySignature) {
      disposeSceneObject(state.backgroundLinkObject);
      state.backgroundLinkObject = createLinkLayer(visibleLinks, 0.12, -1);
      if (state.backgroundLinkObject) state.galaxy.add(state.backgroundLinkObject);
      state.linkVisibilitySignature = visibilitySignature;
    }

    const highlightedLinks = focusRelated.size
      ? visibleLinks.filter((link) => focusRelated.has(link.sourceId) && focusRelated.has(link.targetId))
      : [];
    const highlightSignature = highlightedLinks.map((link) => link.id).join("|");
    if (highlightSignature !== state.linkHighlightSignature) {
      disposeSceneObject(state.highlightLinkObject);
      state.highlightLinkObject = createLinkLayer(highlightedLinks, constellationIds.size ? 0.78 : 0.62, 2);
      if (state.highlightLinkObject) state.galaxy.add(state.highlightLinkObject);
      state.linkHighlightSignature = highlightSignature;
    }

    if (state.backgroundLinkObject) {
      state.backgroundLinkObject.visible = visibleLinks.length > 0;
      state.backgroundLinkObject.material.opacity = focusRelated.size ? 0.018 : 0.12;
    }
    if (state.highlightLinkObject) {
      state.highlightLinkObject.visible = highlightedLinks.length > 0;
      state.highlightLinkObject.material.opacity = constellationIds.size ? 0.78 : 0.62;
    }
  }

  function createLinkLayer(links, opacity, renderOrder) {
    if (!links.length) return null;
    const positions = [];
    const colors = [];
    const color = new THREE.Color();
    links.forEach((link) => {
      const start = new THREE.Vector3(link.source.position.x, link.source.position.y, link.source.position.z);
      const end = new THREE.Vector3(link.target.position.x, link.target.position.y, link.target.position.z);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.multiplyScalar(0.76);
      mid.y += 18 + (stableHash(link.id) % 26);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(14);
      color.setHex(relationColor(link));
      for (let index = 0; index < points.length - 1; index += 1) {
        const a = points[index];
        const b = points[index + 1];
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
    const material = new THREE.LineBasicMaterial({
      transparent: true,
      opacity,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const layer = new THREE.LineSegments(geometry, material);
    layer.renderOrder = renderOrder;
    layer.userData.linkLayer = true;
    return layer;
  }

  function disposeSceneObject(object) {
    if (!object) return;
    object.parent?.remove(object);
    object.geometry?.dispose?.();
    object.material?.dispose?.();
  }

  function addGalaxyMist() {
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let index = 0; index < count; index += 1) {
      const hash = stableHash(`mist-${index}`);
      const arm = hash % 9;
      const radius = 24 + Math.pow(((hash >>> 3) % 1000) / 1000, 0.72) * 390;
      const angle = (arm / 9) * Math.PI * 2 + radius * 0.013 + (((hash >>> 12) % 100) / 100 - 0.5) * 0.74;
      const y = (((hash >>> 22) % 100) / 100 - 0.5) * (64 + radius * 0.16);
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
      color.set(CATEGORY_CONFIG[Object.keys(CATEGORY_CONFIG)[arm]]?.color || "#8cb7ff");
      colors[index * 3] = color.r * 0.82;
      colors[index * 3 + 1] = color.g * 0.82;
      colors[index * 3 + 2] = color.b * 0.82;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 1.05,
      transparent: true,
      opacity: 0.2,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    points.userData.mist = true;
    state.galaxy.add(points);

    const core = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTexture(),
        color: 0xf7fbff,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      })
    );
    core.scale.set(180, 180, 1);
    core.userData.core = true;
    state.galaxy.add(core);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(112, 114, 160),
      new THREE.MeshBasicMaterial({
        color: 0x8cb7ff,
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2.9;
    ring.rotation.z = -0.32;
    ring.userData.coreRing = true;
    state.galaxy.add(ring);
  }

  function createLabel(item) {
    const label = document.createElement("button");
    label.type = "button";
    label.className = `space-label is-${item.kind}`;
    label.style.setProperty("--label-color", itemColor(item).getStyle());
    label.style.setProperty("--label-x", "-9999px");
    label.style.setProperty("--label-y", "-9999px");
    label.textContent = item.name;
    label.dataset.target = item.id;
    label.title = `查看 ${item.name}`;
    label.addEventListener("pointerdown", (event) => event.stopPropagation());
    label.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = state.itemById.get(item.id);
      if (!next) return;
      activateItem(next);
    });
    dom.labelLayer.appendChild(label);
    item.labelSize = {
      width: Math.min(180, Math.max(44, item.name.length * 6.8 + 28)),
      height: 24,
    };
    state.labels.set(item.id, label);
  }

  function updateLabels() {
    const halfW = state.width / 2;
    const halfH = state.height / 2;
    const vector = new THREE.Vector3();
    const candidates = [];
    const labelClusterIds = emphasizedLabelIds();
    state.items.forEach((item) => {
      const label = state.labels.get(item.id);
      const mesh = state.meshes.get(item.id);
      if (!label || !mesh || !mesh.visible) {
        if (label) label.classList.remove("is-visible", "is-focus", "is-cluster", "is-new");
        return;
      }
      const focus = item.id === state.hoveredId || item.id === state.selectedId || item.id === state.searchHitId || labelClusterIds.has(item.id);
      vector.copy(mesh.position).project(state.camera);
      const isBehind = vector.z > 1;
      if (isBehind) {
        label.classList.remove("is-visible", "is-focus", "is-cluster", "is-new");
        return;
      }
      const x = vector.x * halfW + halfW;
      const y = -vector.y * halfH + halfH;
      const { width, height } = item.labelSize || { width: Math.min(180, item.name.length * 7 + 22), height: 24 };
      candidates.push({
        item,
        label,
        focus,
        x,
        y,
        priority: labelPriority(item, focus),
        rect: {
          left: x - width / 2,
          right: x + width / 2,
          top: y - height / 2,
          bottom: y + height / 2,
        },
      });
    });

    const placed = [];
    candidates
      .sort((a, b) => b.priority - a.priority || b.item.heat - a.item.heat || a.item.name.localeCompare(b.item.name))
      .forEach((candidate, index) => {
        const { item, label, rect, x, y } = candidate;
        const focus = candidate.focus || labelClusterIds.has(item.id);
        if (index >= PERFORMANCE.maxLabels && !focus) {
          label.classList.remove("is-visible", "is-focus", "is-revealed", "is-cluster", "is-new");
          return;
        }
        const revealed = isRadarRevealed(item.id);
        const insideViewport = rect.right >= 0 && rect.left <= state.width && rect.bottom >= 0 && rect.top <= state.height;
        const overlaps = !focus && placed.some((placedLabel) => rectsOverlap(rect, placedLabel.rect, 6));
        const visible = insideViewport && (!overlaps || focus);
        label.style.setProperty("--label-x", `${x}px`);
        label.style.setProperty("--label-y", `${y}px`);
        label.style.zIndex = String(focus ? 1000 : Math.round(candidate.priority));
        label.classList.toggle("is-visible", visible);
        label.classList.toggle("is-focus", focus);
        label.classList.toggle("is-cluster", labelClusterIds.has(item.id) && item.id !== state.selectedId && item.id !== state.searchHitId && item.id !== state.constellationId);
        label.classList.toggle("is-new", isEmergingItem(item));
        label.classList.toggle("is-revealed", revealed);
        if (visible) placed.push(candidate);
      });
  }

  function labelPriority(item, focus) {
    if (focus) return 10000;
    const kindBoost = { company: 420, person: 360, achievement: 300, concept: 0 }[item.kind] || 0;
    const clusterBoost = state.searchClusterIds.has(item.id) ? 950 : 0;
    const newBoost = isEmergingItem(item) ? 320 : 0;
    return clusterBoost + newBoost + kindBoost + Number(item.heat || 0);
  }

  function rectsOverlap(a, b, padding = 0) {
    return !(a.right + padding < b.left || a.left - padding > b.right || a.bottom + padding < b.top || a.top - padding > b.bottom);
  }

  function applyFilters() {
    let visibleCount = 0;
    const chronicleMode = state.viewMode === "chronicle";
    const constellationIds = constellationRelatedIds();
    const hoverRelated = relatedIds(state.hoveredId || state.searchHitId);
    const searchRelated = state.searchClusterIds.size ? state.searchClusterIds : relatedIds(state.searchHitId);
    const focusRelated = constellationIds.size ? constellationIds : searchRelated.size ? searchRelated : hoverRelated;
    document.body.classList.toggle("is-chronicle-mode", chronicleMode);
    state.items.forEach((item) => {
      const mesh = state.meshes.get(item.id);
      if (!mesh) return;
      const visible = isItemVisible(item);
      visibleCount += visible ? 1 : 0;
      const focused = focusRelated.size ? focusRelated.has(item.id) : true;
      mesh.visible = visible;
      mesh.material.opacity = visible ? (focused ? 0.95 : constellationIds.size ? 0.055 : 0.16) : 0;
      const scaleBoost = item.id === state.constellationId ? 1.5 : item.id === state.hoveredId || item.id === state.searchHitId ? 1.36 : 1;
      const scale = mesh.userData.baseScale * scaleBoost;
      mesh.userData.focusBoost = Math.max(0, scaleBoost - 1);
      mesh.scale.setScalar(scale);
    });

    state.galaxy.children.forEach((child) => {
      if (child.userData?.follows) {
        const follows = child.userData.follows;
        child.visible = follows.visible;
        if (child.material) {
          const focusRatio = follows.material.opacity / (follows.userData.baseOpacity || 0.9);
          const boost = follows.userData.focusBoost || 0;
          child.material.opacity = (child.userData.baseOpacity || 0.12) * clampNumber(focusRatio + boost * 0.7, 0.1, 1.35);
          if (child.userData.planetHalo && child.userData.baseScale) {
            child.scale.setScalar(child.userData.baseScale * (1 + boost * 0.32));
          }
        }
        if (child.geometry?.type === "RingGeometry") child.lookAt(state.camera.position);
      }
    });

    updateLinkLayers(focusRelated, constellationIds);

    dom.sliceYear.textContent = String(state.selectedYear);
    dom.sliceCount.textContent = `${visibleCount} nodes`;
    updateConstellationHud(constellationIds);
    updateChronicle();
    updateLabels();
    updateInteractionOverlays();
  }

  function isItemVisible(item) {
    if (item.year > state.selectedYear) return false;
    if (!state.activeTypes.has(item.kind)) return false;
    if (item.kind === "concept" && !state.activeCategories.has(item.category)) return false;
    if (!matchesViewMode(item)) return false;
    return true;
  }

  function matchesViewMode(item) {
    if (state.viewMode === "panorama" || state.viewMode === "chronicle") return true;
    if (state.viewMode === "hot") {
      const changed = state.payload?.meta?.changedConcepts || [];
      return Number(item.heat || 0) >= 86 || changed.some((change) => change.id === item.id) || item.kind === "achievement" && Number(item.year) >= 2022;
    }
    if (state.viewMode === "company") {
      if (item.kind === "company") return true;
      return state.links.some((link) => (link.source.kind === "company" || link.target.kind === "company") && (link.sourceId === item.id || link.targetId === item.id));
    }
    if (state.viewMode === "person") {
      if (item.kind === "person") return true;
      return state.links.some((link) => (link.source.kind === "person" || link.target.kind === "person") && (link.sourceId === item.id || link.targetId === item.id));
    }
    return true;
  }

  function relatedIds(focusId) {
    const set = new Set();
    if (!focusId) return set;
    set.add(focusId);
    state.links.forEach((link) => {
      if (link.sourceId === focusId || link.targetId === focusId) {
        set.add(link.sourceId);
        set.add(link.targetId);
      }
    });
    return set;
  }

  function expandedRelatedIds(root) {
    const direct = relatedIds(root?.id);
    if (!root) return direct;
    state.items.forEach((item) => {
      if (item.id === root.id) return;
      const sameConcept = (item.concepts || []).some((id) => id === root.id || (root.concepts || []).includes(id));
      const rootConcept = root.concepts?.some((id) => id === item.id);
      const sameCompany = (item.companies || []).some((id) => id === root.id || (root.companies || []).includes(id));
      if (sameConcept || rootConcept || sameCompany) direct.add(item.id);
    });
    Array.from(direct)
      .map((id) => state.itemById.get(id))
      .filter((item) => item && item.id !== root.id)
      .sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || b.heat - a.heat)
      .slice(0, 8)
      .forEach((item) => relatedIds(item.id).forEach((id) => direct.add(id)));
    semanticFamilyIds(root).forEach((id) => direct.add(id));
    return direct;
  }

  function semanticFamilyIds(root) {
    const text = searchableText(root);
    const ids = new Set();
    const add = (id) => {
      if (state.itemById.has(id)) ids.add(id);
    };
    if (text.includes("hook")) {
      ["agent-hook", "webhook", "trigger", "workflow", "workflow-orchestration", "agentic-workflow"].forEach(add);
    }
    if (text.includes("workflow")) {
      ["workflow", "agentic-workflow", "autonomous-workflow", "workflow-orchestration", "agent-hook", "webhook", "trigger"].forEach(add);
    }
    if (text.includes("trigger")) {
      ["trigger", "webhook", "workflow", "agent-hook", "agent-loop"].forEach(add);
    }
    return ids;
  }

  function emphasizedLabelIds() {
    const ids = new Set();
    constellationRelatedIds().forEach((id) => ids.add(id));
    state.searchClusterIds.forEach((id) => ids.add(id));
    if (state.radar) {
      ids.add(state.radar.itemId);
      state.radar.ids.forEach((id) => ids.add(id));
    }
    return ids;
  }

  function isEmergingItem(item) {
    const changed = state.payload?.meta?.changedConcepts || [];
    if (changed.some((change) => change.id === item.id)) return true;
    if (item.kind !== "concept") return false;
    return Number(item.year || 0) >= CURRENT_YEAR - 1 && Number(item.heat || 0) >= 58;
  }

  function constellationRelatedIds() {
    return expandedRelatedIds(state.itemById.get(state.constellationId));
  }

  function updateConstellationHud(constellationIds) {
    if (!dynamicDom.constellationHud) return;
    const root = state.itemById.get(state.constellationId);
    dynamicDom.constellationHud.hidden = !root;
    if (!root) return;
    const story = constellationStory(root, constellationIds);
    dynamicDom.constellationHud.querySelector(".constellation-kicker").textContent = "聚焦星座";
    dynamicDom.exitConstellation.textContent = "退出聚焦";
    dynamicDom.constellationTitle.textContent = `${root.name} 星座`;
    dynamicDom.constellationSummary.textContent = story.summary;
    dynamicDom.constellationRoute.innerHTML = story.route.map((name) => `<span>${escapeHtml(name)}</span>`).join("");
    dynamicDom.constellationLinks.innerHTML = story.links
      .map((item) => `<button class="constellation-chip" type="button" data-target="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button>`)
      .join("");
  }

  function enterConstellation(item) {
    state.constellationId = item.id;
    applyFilters();
  }

  function clearConstellation() {
    state.constellationId = null;
    applyFilters();
  }

  function constellationStory(root, constellationIds) {
    const members = Array.from(constellationIds)
      .map((id) => state.itemById.get(id))
      .filter((item) => item && item.id !== root.id)
      .sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || b.heat - a.heat || a.name.localeCompare(b.name));
    const achievements = members.filter((item) => item.kind === "achievement").slice(0, 2);
    const people = members.filter((item) => item.kind === "person").slice(0, 2);
    const companies = members.filter((item) => item.kind === "company").slice(0, 2);
    const concepts = members.filter((item) => item.kind === "concept").slice(0, 4);
    const route = [root, ...achievements, ...people, ...concepts].map((item) => item.name).slice(0, 6);
    const links = [...achievements, ...people, ...concepts, ...companies].slice(0, 8);
    const anchor = achievements[0]?.name || people[0]?.name || concepts[0]?.name || "相关概念";
    const base = root.definition || root.role || root.impact || "该节点是 AI 知识图谱中的关键档案。";
    const summary = `${base} 当前保留 ${Math.max(0, constellationIds.size - 1)} 个强关联节点，优先呈现 ${anchor} 与它的演化路径。`;
    return { route, links, summary };
  }

  function handleConstellationClick(event) {
    const chip = event.target.closest("[data-target]");
    if (!chip) return;
    const item = state.itemById.get(chip.dataset.target);
    if (!item) return;
    activateItem(item);
  }

  function kindRank(kind) {
    return { company: 0, achievement: 1, person: 2, concept: 3 }[kind] ?? 4;
  }

  function handlePointerMove(event) {
    const now = performance.now();
    if (now - state.lastPointerCheck < PERFORMANCE.pointerInterval) return;
    state.lastPointerCheck = now;
    const rect = state.renderer.domElement.getBoundingClientRect();
    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const intersections = state.raycaster.intersectObjects(Array.from(state.meshes.values()).filter((mesh) => mesh.visible), false);
    const itemId = intersections[0]?.object?.userData?.itemId || null;
    setHovered(itemId);
  }

  function handleClick() {
    if (!state.hoveredId) return;
    const item = state.itemById.get(state.hoveredId);
    if (!item) return;
    activateItem(item);
  }

  function setHovered(itemId) {
    if (state.hoveredId === itemId) return;
    state.hoveredId = itemId;
    applyFilters();
  }

  function handleTimelineChange() {
    stopChroniclePlay();
    state.selectedYear = Number(dom.timeline.value);
    applyFilters();
  }

  function updateTimelineRange() {
    const years = [
      EPOCH_YEAR,
      CURRENT_YEAR,
      ...state.items.map((item) => item.year),
      ...state.chronology.map((event) => Number(event.year)),
    ].filter(Boolean);
    const min = Math.min(...years);
    const max = Math.max(...years, CURRENT_YEAR);
    dom.timeline.min = String(min);
    dom.timeline.max = String(max);
    dom.timeline.value = String(max);
    state.selectedYear = max;
    renderChronicleMarks();
  }

  function updateChronicle() {
    dom.chronicleYear.textContent = String(state.selectedYear);
    const events = state.chronology.filter((event) => Number(event.year) <= state.selectedYear);
    const latest = events[events.length - 1];
    dom.chronicleEvent.textContent = latest
      ? `${latest.year} · ${latest.title}：${latest.summary}`
      : "拖动时间，查看概念、公司和人物如何逐步出现。";
    renderChronicleMarks(latest);
    renderChronicleFocus(latest);
  }

  function renderChronicleFocus(event) {
    if (!dynamicDom.chronicleFocus) return;
    const visible = state.viewMode === "chronicle" && event;
    dynamicDom.chronicleFocus.hidden = !visible;
    if (!visible) return;
    const concepts = (event.concepts || [])
      .map((id) => state.itemById.get(id))
      .filter(Boolean)
      .slice(0, 5);
    const achievement = state.items.find((item) => item.kind === "achievement" && Number(item.year) === Number(event.year));
    dynamicDom.chronicleFocus.innerHTML = `
      <div class="chronicle-focus-year">${escapeHtml(event.year)}</div>
      <div class="chronicle-focus-main">
        <span>中心事件</span>
        <strong>${escapeHtml(event.title)}</strong>
        <p>${escapeHtml(event.summary)}</p>
      </div>
      <div class="chronicle-focus-links">
        ${achievement ? clickableChronicleChip(achievement.id, "里程碑") : ""}
        ${concepts.map((item) => clickableChronicleChip(item.id, item.name)).join("")}
      </div>
    `;
  }

  function clickableChronicleChip(id, label) {
    return `<button class="chronicle-focus-chip" type="button" data-target="${escapeHtml(id)}">${escapeHtml(label)}</button>`;
  }

  function renderChronicleMarks(activeEvent = null) {
    if (!dynamicDom.chronicleTrack || !dom.timeline) return;
    const min = Number(dom.timeline.min || EPOCH_YEAR);
    const max = Number(dom.timeline.max || CURRENT_YEAR);
    const span = Math.max(1, max - min);
    const activeYear = Number(activeEvent?.year || state.selectedYear);
    dynamicDom.chronicleTrack.innerHTML = state.chronology
      .map((event) => {
        const year = Number(event.year);
        const left = clampNumber(((year - min) / span) * 100, 0, 100);
        const active = year <= activeYear;
        return `
          <button
            class="chronicle-mark ${active ? "is-active" : ""} ${year === activeYear ? "is-current" : ""}"
            type="button"
            style="left:${left}%"
            data-year="${year}"
            title="${escapeHtml(`${year} · ${event.title}`)}"
            aria-label="${escapeHtml(`${year} · ${event.title}`)}"
          >
            <span>${escapeHtml(year)}</span>
          </button>
        `;
      })
      .join("");
    dynamicDom.chronicleTrack.querySelectorAll("[data-year]").forEach((button) => {
      button.addEventListener("click", () => {
        stopChroniclePlay();
        state.viewMode = "chronicle";
        jumpToChronicleYear(Number(button.dataset.year));
        buildControls();
      });
    });
  }

  function handleChronicleFocusClick(event) {
    const chip = event.target.closest("[data-target]");
    if (!chip) return;
    const item = state.itemById.get(chip.dataset.target);
    if (!item) return;
    activateItem(item);
  }

  function handleSearchInput() {
    const query = dom.search.value.trim().toLowerCase();
    if (!query) {
      state.searchHitId = null;
      state.searchClusterIds = new Set();
      applyFilters();
      return;
    }
    const exact = state.items.find((item) => item.name.toLowerCase() === query || item.id.toLowerCase() === query || (item.aliases || []).some((alias) => String(alias).toLowerCase() === query));
    const fuzzy = state.items.find((item) => searchableText(item).includes(query) || (item.aliases || []).some((alias) => query.includes(String(alias).toLowerCase())));
    const item = exact || fuzzy;
    if (!item) {
      state.searchHitId = null;
      state.searchClusterIds = new Set();
      applyFilters();
      return;
    }
    if (item.year > state.selectedYear) {
      state.selectedYear = item.year;
      dom.timeline.value = String(item.year);
    }
    state.activeTypes.add(item.kind);
    if (item.kind === "concept") state.activeCategories.add(item.category);
    buildControls();
    state.searchHitId = item.id;
    state.searchClusterIds = expandedRelatedIds(item);
    applyFilters();
    focusOnItem(item);
    openInfoCard(item);
  }

  function openInfoCard(item) {
    state.selectedId = item.id;
    state.constellationId = item.id;
    dom.infoCard.hidden = false;
    const color = itemColor(item);
    dom.cardSwatch.style.background = color.getStyle();
    dom.cardSwatch.style.boxShadow = `0 0 18px ${color.getStyle()}`;
    dom.cardKind.textContent = `${TYPE_CONFIG[item.kind]?.label || item.kind}${item.kind === "concept" ? ` · ${item.category}` : ""}`;
    dom.cardTitle.textContent = item.name;
    dom.cardDefinition.textContent = item.definition || item.description || "";
    renderPortrait(item);
    renderArchiveNotes(item);
    renderMetrics(item);
    renderModels(item);
    renderPeople(item);
    renderRelations(item);
    renderReferences(item);
    startRadarPulse(item);
    applyFilters();
  }

  function closeInfoCard() {
    state.selectedId = null;
    state.radar = null;
    dom.infoCard.hidden = true;
    updateInteractionOverlays();
    applyFilters();
  }

  function renderArchiveNotes(item) {
    if (!dynamicDom.archiveSection) return;
    dynamicDom.archiveSection.hidden = false;
    if (dynamicDom.archiveId) {
      dynamicDom.archiveId.textContent = `ARCHIVE · ${TYPE_CONFIG[item.kind]?.label || item.kind} · ${String(item.id || "").toUpperCase()}`;
    }
    dynamicDom.archiveImportance.textContent = archiveImportance(item);
    dynamicDom.archiveLineage.textContent = archiveLineage(item);
  }

  function archiveImportance(item) {
    if (item.kind === "company") return item.achievements || item.definition || "推动 AI 产业路线演化。";
    if (item.kind === "person") return item.contribution || item.role || "影响关键 AI 概念的形成。";
    if (item.kind === "achievement") return item.impact || item.definition || "改变 AI 技术演化路径。";
    if (item.origin) return item.origin;
    if (Number(item.heat || 0) >= 88) return "当前高热度概念，正在影响模型、工具或应用生态。";
    return "AI 知识图谱中的关键概念节点。";
  }

  function archiveLineage(item) {
    const peers = state.links
      .filter((link) => link.sourceId === item.id || link.targetId === item.id)
      .map((link) => (link.sourceId === item.id ? link.target : link.source))
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 4)
      .map((peer) => peer.name);
    if (peers.length) return peers.join(" / ");
    const conceptNames = (item.concepts || []).map(nameForId).filter(Boolean).slice(0, 4);
    return conceptNames.length ? conceptNames.join(" / ") : "独立档案节点";
  }

  function renderPortrait(item) {
    dom.cardPortrait.onerror = () => {
      if (state.selectedId === item.id && item.kind === "person") showGeneratedAvatar(item);
    };
    const portrait = item.portrait || item.logo;
    if (portrait) {
      dom.cardPortrait.src = portrait;
      dom.cardPortrait.alt = `${item.name} 肖像`;
      dom.portraitWrap.hidden = false;
    } else if (item.portraitPage) {
      showGeneratedAvatar(item);
      loadPortrait(item).then((source) => {
        if (state.selectedId !== item.id || !source) return;
        dom.cardPortrait.src = source;
        dom.cardPortrait.alt = `${item.name} 肖像`;
        dom.portraitWrap.hidden = false;
      });
    } else if (item.kind === "person") {
      showGeneratedAvatar(item);
    } else {
      dom.portraitWrap.hidden = true;
      dom.cardPortrait.removeAttribute("src");
    }
  }

  function showGeneratedAvatar(item) {
    dom.cardPortrait.src = generatedAvatar(item);
    dom.cardPortrait.alt = `${item.name} 头像`;
    dom.portraitWrap.hidden = false;
  }

  function generatedAvatar(item) {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const context = canvas.getContext("2d");
    const color = itemColor(item).getStyle();
    const gradient = context.createRadialGradient(58, 46, 6, 80, 80, 88);
    gradient.addColorStop(0, "rgba(255,255,255,0.88)");
    gradient.addColorStop(0.22, color);
    gradient.addColorStop(1, "rgba(14,17,31,1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 160, 160);
    context.strokeStyle = "rgba(255,255,255,0.36)";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(80, 80, 66, 0, Math.PI * 2);
    context.stroke();
    const initials = item.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    context.fillStyle = "rgba(255,255,255,0.94)";
    context.font = "700 42px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initials, 80, 82);
    return canvas.toDataURL("image/png");
  }

  async function loadPortrait(item) {
    if (state.portraitCache.has(item.id)) return state.portraitCache.get(item.id);
    try {
      const page = encodeURIComponent(item.portraitPage);
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${page}`, { cache: "force-cache" });
      if (!response.ok) throw new Error(`portrait ${response.status}`);
      const data = await response.json();
      const source = data.thumbnail?.source || data.originalimage?.source || "";
      state.portraitCache.set(item.id, source);
      return source;
    } catch (error) {
      state.portraitCache.set(item.id, "");
      return "";
    }
  }

  function renderMetrics(item) {
    const rows = [];
    if (item.kind === "concept") {
      rows.push(["出现时间", item.first_appear || "-"]);
      rows.push(["热度", Math.round(item.heat)]);
      rows.push(["来源/提出者", item.origin || "研究与产业共同演化"]);
      rows.push(["成熟度", item.maturity || "持续演进"]);
    } else if (item.kind === "company") {
      rows.push(["估值/市值", item.valuation || item.market_cap || "未披露"]);
      rows.push(["总部", item.headquarters || "-"]);
      rows.push(["人数", item.employees || "未披露"]);
      rows.push(["代表模型", (item.models || []).map((model) => model.name).slice(0, 2).join(" / ") || "-"]);
      rows.push(["数据口径", item.valuation_basis || "公开报道估算，非实时数据"]);
    } else if (item.kind === "achievement") {
      rows.push(["发生年份", item.first_appear || item.year || "-"]);
      rows.push(["关联概念", (item.concepts || []).map(nameForId).filter(Boolean).slice(0, 2).join(" / ") || "-"]);
      rows.push(["档案类型", "AI里程碑"]);
      rows.push(["影响", item.impact || "推动 AI 范式演化"]);
    } else {
      rows.push(["关键角色", item.role || "-"]);
      rows.push(["代表贡献", item.contribution || "-"]);
      rows.push(["关联概念", (item.concepts || []).map(nameForId).filter(Boolean).slice(0, 2).join(" / ") || "-"]);
      rows.push(["活跃时期", item.active_since || item.first_appear || "-"]);
    }
    dom.cardMetrics.innerHTML = rows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");
  }

  function renderModels(item) {
    const models = item.models || [];
    dom.modelSection.hidden = !models.length;
    dom.cardModels.innerHTML = models
      .map((model) => {
        const content = `<strong>${escapeHtml(model.name)}</strong> · ${escapeHtml(model.release || "时间未披露")}<br>${escapeHtml(model.capability || "")}`;
        if (!model.url) return `<span class="model-pill">${content}</span>`;
        return `<a class="model-pill" href="${escapeHtml(model.url)}" target="_blank" rel="noreferrer">${content}</a>`;
      })
      .join("");
  }

  function renderPeople(item) {
    const people = (item.people || item.key_people || []).map((id) => ({ id, name: state.itemById.get(id)?.name || id }));
    dom.peopleSection.hidden = !people.length;
    dom.cardPeople.innerHTML = people.map((person) => clickableChip(person.id, person.name)).join("");
  }

  function renderRelations(item) {
    const seen = new Set();
    const related = state.links
      .filter((link) => link.sourceId === item.id || link.targetId === item.id)
      .map((link) => {
        const peer = link.sourceId === item.id ? link.target : link.source;
        if (seen.has(peer.id)) return "";
        seen.add(peer.id);
        return clickableChip(peer.id, peer.name);
      })
      .filter(Boolean)
      .slice(0, 14);
    dom.cardRelations.innerHTML = related.length ? related.join("") : '<span class="relation-chip">暂无关联</span>';
  }

  function clickableChip(id, label) {
    return `<button class="relation-chip" type="button" data-target="${escapeHtml(id)}">${escapeHtml(label)}</button>`;
  }

  function handleRelatedClick(event) {
    const chip = event.target.closest("[data-target]");
    if (!chip) return;
    const item = state.itemById.get(chip.dataset.target);
    if (!item) return;
    activateItem(item);
  }

  function activateItem(item) {
    if (item.year > state.selectedYear) {
      state.selectedYear = item.year;
      dom.timeline.value = String(item.year);
    }
    state.activeTypes.add(item.kind);
    if (item.kind === "concept") state.activeCategories.add(item.category);
    buildControls();
    state.searchHitId = item.id;
    state.searchClusterIds = expandedRelatedIds(item);
    openInfoCard(item);
    focusOnItem(item);
    applyFilters();
  }

  function startRadarPulse(item) {
    if (!item) {
      state.radar = null;
      updateInteractionOverlays();
      return;
    }
    if (state.lowPerformance) {
      state.radar = null;
      if (dynamicDom.radarLayer) {
        dynamicDom.radarLayer.classList.remove("is-active");
        dynamicDom.radarLayer.hidden = true;
      }
      renderOrbitalMenu(item);
      return;
    }
    const ids = orderedRelatedIds(item);
    state.radar = {
      itemId: item.id,
      ids,
      start: performance.now(),
      duration: clampNumber(1400 + ids.length * 135, 1800, 4200),
    };
    if (dynamicDom.radarLayer) {
      dynamicDom.radarLayer.style.setProperty("--radar-color", itemColor(item).getStyle());
      dynamicDom.radarLayer.hidden = false;
      dynamicDom.radarLayer.classList.remove("is-active");
      void dynamicDom.radarLayer.offsetWidth;
      dynamicDom.radarLayer.classList.add("is-active");
    }
    renderOrbitalMenu(item);
  }

  function orderedRelatedIds(item) {
    const ids = Array.from(relatedIds(item.id)).filter((id) => id !== item.id && state.itemById.has(id));
    return ids
      .map((id) => state.itemById.get(id))
      .sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || b.heat - a.heat || a.name.localeCompare(b.name))
      .slice(0, 18)
      .map((entry) => entry.id);
  }

  function radarRevealRatio(itemId) {
    if (!state.radar || !state.radar.ids.includes(itemId)) return 0;
    const index = state.radar.ids.indexOf(itemId);
    const elapsed = performance.now() - state.radar.start;
    const delay = 280 + index * 135;
    return clampNumber((elapsed - delay) / 520, 0, 1);
  }

  function isRadarRevealed(itemId) {
    if (!state.radar) return false;
    return itemId === state.radar.itemId || radarRevealRatio(itemId) > 0;
  }

  function renderOrbitalMenu(item) {
    if (!dynamicDom.orbitalMenu || !item) return;
    dynamicDom.orbitalMenu.dataset.target = item.id;
    const referenceButton = dynamicDom.orbitalMenu.querySelector('[data-command="reference"]');
    if (referenceButton) referenceButton.disabled = !(item.references || []).length;
    dynamicDom.orbitalMenu.hidden = false;
    if (window.lucide) window.lucide.createIcons();
    updateInteractionOverlays();
  }

  function handleOrbitalCommand(event) {
    const button = event.target.closest("[data-command]");
    if (!button || button.disabled) return;
    event.stopPropagation();
    const item = state.itemById.get(dynamicDom.orbitalMenu?.dataset.target || state.selectedId);
    if (!item) return;
    const command = button.dataset.command;
    if (command === "reference") {
      const first = (item.references || [])[0];
      if (first?.url) window.open(first.url, "_blank", "noreferrer");
    }
  }

  function renderReferences(item) {
    const references = item.references || [];
    dom.cardLinks.innerHTML = references
      .map((reference) => `<a href="${reference.url}" target="_blank" rel="noreferrer">${escapeHtml(reference.label)}</a>`)
      .join("");
  }

  function focusOnItem(item) {
    const position = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
    const direction = position.clone().normalize().multiplyScalar(115);
    const targetCamera = position.clone().add(new THREE.Vector3(direction.x || 95, 76, direction.z || 160));
    animateCamera(targetCamera, position, 850);
  }

  function screenPointForItem(item) {
    const mesh = state.meshes.get(item?.id);
    if (!mesh || !mesh.visible || !state.camera) return null;
    const vector = new THREE.Vector3().copy(mesh.position).project(state.camera);
    if (vector.z > 1) return null;
    return {
      x: vector.x * state.width / 2 + state.width / 2,
      y: -vector.y * state.height / 2 + state.height / 2,
      z: vector.z,
    };
  }

  function updateInteractionOverlays() {
    const item = state.itemById.get(state.selectedId || state.constellationId);
    const shouldShow = item && !dom.infoCard.hidden;
    const point = shouldShow ? screenPointForItem(item) : null;
    const visible = Boolean(point);
    if (dynamicDom.radarLayer) {
      dynamicDom.radarLayer.hidden = !visible || !state.radar;
      if (visible && state.radar) {
        const size = clampNumber(210 + state.radar.ids.length * 10, 210, 390);
        dynamicDom.radarLayer.style.width = `${size}px`;
        dynamicDom.radarLayer.style.height = `${size}px`;
        dynamicDom.radarLayer.style.left = `${point.x}px`;
        dynamicDom.radarLayer.style.top = `${point.y}px`;
      }
    }
    if (dynamicDom.orbitalMenu) {
      dynamicDom.orbitalMenu.hidden = !visible;
      if (visible) {
        dynamicDom.orbitalMenu.style.left = `${point.x}px`;
        dynamicDom.orbitalMenu.style.top = `${point.y}px`;
      }
    }
  }

  function updateRadarReveal() {
    if (!state.radar) return;
    const elapsed = performance.now() - state.radar.start;
    const expired = elapsed > state.radar.duration + 900;
    state.radar.ids.forEach((id) => {
      const mesh = state.meshes.get(id);
      if (!mesh || !mesh.visible) return;
      const ratio = radarRevealRatio(id);
      if (ratio <= 0) return;
      const pulse = Math.sin(Math.min(1, ratio) * Math.PI);
      const scale = mesh.userData.baseScale * (1 + pulse * 0.34);
      mesh.scale.setScalar(scale);
      mesh.material.opacity = Math.max(mesh.material.opacity || 0, 0.62 + pulse * 0.32);
    });
    if (expired) {
      state.radar = null;
      if (dynamicDom.radarLayer) {
        dynamicDom.radarLayer.classList.remove("is-active");
        dynamicDom.radarLayer.hidden = true;
      }
    }
  }

  function resetView() {
    state.searchHitId = null;
    state.searchClusterIds = new Set();
    state.constellationId = null;
    state.selectedId = null;
    state.radar = null;
    stopChroniclePlay();
    dom.search.value = "";
    dom.infoCard.hidden = true;
    updateInteractionOverlays();
    animateCamera(new THREE.Vector3(0, 175, 440), new THREE.Vector3(0, 0, 0), 780);
    applyFilters();
  }

  function toggleChroniclePlay() {
    if (state.isChroniclePlaying) {
      stopChroniclePlay();
    } else {
      startChroniclePlay();
    }
  }

  function startChroniclePlay() {
    const years = chronicleYears();
    if (!years.length) return;
    state.viewMode = "chronicle";
    state.isChroniclePlaying = true;
    buildControls();
    updateChroniclePlayButton();
    const lastYear = years[years.length - 1];
    const nextYear = state.selectedYear >= lastYear ? years[0] : years.find((year) => year > state.selectedYear) || years[0];
    jumpToChronicleYear(nextYear);
    window.clearInterval(state.chronicleTimer);
    state.chronicleTimer = window.setInterval(() => {
      const currentIndex = years.findIndex((year) => year > state.selectedYear);
      if (currentIndex < 0) {
        stopChroniclePlay();
        return;
      }
      jumpToChronicleYear(years[currentIndex]);
    }, 2400);
  }

  function stopChroniclePlay() {
    if (!state.isChroniclePlaying && !state.chronicleTimer) return;
    state.isChroniclePlaying = false;
    window.clearInterval(state.chronicleTimer);
    state.chronicleTimer = 0;
    updateChroniclePlayButton();
  }

  function updateChroniclePlayButton() {
    if (!dynamicDom.chroniclePlay) return;
    dynamicDom.chroniclePlay.classList.toggle("is-playing", state.isChroniclePlaying);
    dynamicDom.chroniclePlay.title = state.isChroniclePlaying ? "暂停编年史" : "播放编年史";
    dynamicDom.chroniclePlay.setAttribute("aria-label", dynamicDom.chroniclePlay.title);
    dynamicDom.chroniclePlay.innerHTML = `<i data-lucide="${state.isChroniclePlaying ? "pause" : "play"}" aria-hidden="true"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  function chronicleYears() {
    return Array.from(new Set(state.chronology.map((event) => Number(event.year)).filter(Boolean))).sort((a, b) => a - b);
  }

  function jumpToChronicleYear(year) {
    state.selectedYear = Number(year);
    dom.timeline.value = String(year);
    const achievement = state.items
      .filter((item) => item.kind === "achievement" && Number(item.year) === Number(year))
      .sort((a, b) => b.heat - a.heat)[0];
    const event = state.chronology.find((entry) => Number(entry.year) === Number(year));
    const concept = event?.concepts?.map((id) => state.itemById.get(id)).find(Boolean);
    const target = achievement || concept;
    if (target) {
      openInfoCard(target);
      focusOnItem(target);
    } else {
      applyFilters();
    }
  }

  function animateCamera(cameraTarget, controlsTarget, duration) {
    if (state.lowPerformance || duration <= 0) {
      state.camera.position.copy(cameraTarget);
      state.controls.target.copy(controlsTarget);
      state.camera.lookAt(state.controls.target);
      state.controls.syncFromCamera();
      return;
    }
    const startCamera = state.camera.position.clone();
    const startTarget = state.controls.target.clone();
    const start = performance.now();
    state.controls.enabled = false;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      state.camera.position.lerpVectors(startCamera, cameraTarget, eased);
      state.controls.target.lerpVectors(startTarget, controlsTarget, eased);
      state.camera.lookAt(state.controls.target);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        state.controls.syncFromCamera();
        state.controls.enabled = true;
      }
    }
    requestAnimationFrame(tick);
  }

  function handleResize() {
    state.width = dom.stage.clientWidth || window.innerWidth;
    state.height = dom.stage.clientHeight || window.innerHeight;
    state.camera.aspect = state.width / state.height;
    state.camera.updateProjectionMatrix();
    state.renderer.setPixelRatio(currentRendererPixelRatio());
    state.renderer.setSize(state.width, state.height);
    updateResponsiveText();
  }

  function updateResponsiveText() {
    if (!dom.search) return;
    dom.search.placeholder = window.innerWidth < 560 ? "搜索节点" : "搜索概念 / 公司 / 人物";
  }

  function createGalaxyControls(camera, element) {
    const target = new THREE.Vector3(0, 0, 0);
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
    const goal = { radius: spherical.radius, theta: spherical.theta, phi: spherical.phi };
    const current = { ...goal };
    const pointerStart = { x: 0, y: 0 };
    let dragging = false;
    let mode = "rotate";
    const controls = {
      target,
      enabled: true,
      minDistance: 90,
      maxDistance: 860,
      update,
      syncFromCamera,
    };

    element.addEventListener("contextmenu", (event) => event.preventDefault());
    element.addEventListener("pointerdown", (event) => {
      if (!controls.enabled) return;
      dragging = true;
      mode = event.button === 2 || event.shiftKey || event.metaKey ? "pan" : "rotate";
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
      element.setPointerCapture?.(event.pointerId);
    });
    element.addEventListener("pointermove", (event) => {
      if (!dragging || !controls.enabled) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
      if (mode === "rotate") {
        goal.theta -= dx * 0.006;
        goal.phi = clampNumber(goal.phi - dy * 0.0048, 0.22, Math.PI - 0.22);
      } else {
        const distanceScale = goal.radius / 420;
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).multiplyScalar(-dx * distanceScale * 0.62);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1).multiplyScalar(dy * distanceScale * 0.62);
        target.add(right).add(up);
      }
    });
    element.addEventListener("pointerup", (event) => {
      dragging = false;
      element.releasePointerCapture?.(event.pointerId);
    });
    element.addEventListener("wheel", (event) => {
      if (!controls.enabled) return;
      event.preventDefault();
      const factor = Math.exp(event.deltaY * 0.0011);
      goal.radius = clampNumber(goal.radius * factor, controls.minDistance, controls.maxDistance);
    }, { passive: false });

    function update() {
      current.radius += (goal.radius - current.radius) * 0.09;
      current.theta += (goal.theta - current.theta) * 0.09;
      current.phi += (goal.phi - current.phi) * 0.09;
      const next = new THREE.Vector3().setFromSphericalCoords(current.radius, current.phi, current.theta).add(target);
      camera.position.copy(next);
      camera.lookAt(target);
    }

    function syncFromCamera() {
      const synced = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
      goal.radius = current.radius = synced.radius;
      goal.theta = current.theta = synced.theta;
      goal.phi = current.phi = synced.phi;
    }

    return controls;
  }

  function setupUpdateBadge() {
    const currentVersion = state.payload?.meta?.currentVersion;
    if (!currentVersion) return;
    const seenVersion = localStorage.getItem(STORAGE_KEY);
    if (seenVersion !== currentVersion) {
      dom.updateBadge.hidden = false;
      dom.updateBadge.querySelector("span").textContent = `有新内容 · ${currentVersion}`;
    }
    dom.updateBadge.addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEY, currentVersion);
      dom.updateBadge.hidden = true;
    });
  }

  function animate(now = 0) {
    requestAnimationFrame(animate);
    if (document.hidden) return;
    const renderInterval = state.lowPerformance ? PERFORMANCE.lowRenderInterval : 0;
    if (renderInterval && now - state.lastRender < renderInterval) return;
    state.lastRender = now;
    if (!state.lowPerformance) state.galaxy.rotation.y += 0.00058;
    state.controls.update();
    state.galaxy.children.forEach((child) => {
      if (child.userData?.follows) {
        child.position.copy(child.userData.follows.position);
        if (child.geometry?.type === "RingGeometry") child.lookAt(state.camera.position);
        if (!state.lowPerformance && child.userData.starburst && child.material) child.material.rotation += 0.0016;
      }
      if (child.userData?.coreRing) {
        if (!state.lowPerformance) child.rotation.z += 0.00035;
      }
      if (child.userData?.mist) {
        if (!state.lowPerformance) child.rotation.y += 0.00012;
      }
    });
    if (!state.lowPerformance) updateRadarReveal();
    if (now - state.lastLabelUpdate > currentLabelInterval()) {
      state.lastLabelUpdate = now;
      updateLabels();
      updateInteractionOverlays();
    }
    state.renderer.render(state.scene, state.camera);
  }

  function itemColor(item) {
    if (item.kind === "company") return new THREE.Color(item.color || "#ffffff");
    if (item.kind === "person") return new THREE.Color(item.color || "#ffd43b");
    if (item.kind === "achievement") return new THREE.Color(item.color || "#ffe066");
    return new THREE.Color(CATEGORY_CONFIG[item.category]?.color || "#8cb7ff");
  }

  function nodeSize(item) {
    const heat = Math.max(0, Math.min(100, item.heat || 50));
    if (item.kind === "company") return 3.7 + heat / 38;
    if (item.kind === "person") return 2.2 + heat / 58;
    if (item.kind === "achievement") return 4.8 + heat / 44;
    return 1.45 + heat / 62;
  }

  function relationColor(link) {
    if (link.type === "person") return 0xffd43b;
    if (link.type === "model") return 0xffffff;
    if (link.type === "optimizes") return 0x79dfc1;
    if (link.type === "applies") return 0xff8fa3;
    return 0x9bbcff;
  }

  function galaxyPosition(item) {
    const year = parseYear(item.first_appear || item.founded || item.active_since || CURRENT_YEAR);
    const category = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG["基座模型"];
    const hash = stableHash(item.id || item.name);
    const ageFactor = Math.max(0, Math.min(1, (year - EPOCH_YEAR) / (CURRENT_YEAR - EPOCH_YEAR)));
    const baseRadius = item.kind === "person" ? 260 : item.kind === "company" ? 310 : item.kind === "achievement" ? 78 + ageFactor * 260 : 52 + ageFactor * 300;
    const arm = item.kind === "company" ? 9.3 : item.kind === "person" ? 10.8 : item.kind === "achievement" ? 1.6 : category.arm;
    const angle = (arm / 11) * Math.PI * 2 + ageFactor * 5.8 + (((hash >>> 4) % 100) / 100 - 0.5) * 0.72;
    const verticalSpread = item.kind === "company" ? 96 : item.kind === "person" ? 120 : 82;
    const y = (((hash >>> 17) % 100) / 100 - 0.5) * verticalSpread + (item.kind === "company" ? 38 : item.kind === "person" ? -36 : item.kind === "achievement" ? 74 : 0);
    const radius = baseRadius + ((hash % 100) / 100 - 0.5) * 74;
    return {
      x: Number((Math.cos(angle) * radius).toFixed(2)),
      y: Number(y.toFixed(2)),
      z: Number((Math.sin(angle) * radius).toFixed(2)),
    };
  }

  function parseYear(value) {
    const match = String(value || "").match(/\d{4}/);
    return match ? Number(match[0]) : CURRENT_YEAR;
  }

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function countBy(items, getter) {
    const map = new Map();
    items.forEach((item) => {
      const key = getter(item);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }

  function groupBy(items, getter) {
    const map = new Map();
    items.forEach((item) => {
      const key = getter(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }

  function nameForId(id) {
    return state.itemById.get(id)?.name || id;
  }

  function searchableText(item) {
    return [
      item.id,
      item.name,
      item.nativeName,
      item.role,
      item.contribution,
      item.definition,
      item.headquarters,
      item.origin,
      ...(item.aliases || []),
      ...(item.concepts || []).map(nameForId),
      ...(item.people || []).map(nameForId),
      ...(item.companies || []).map(nameForId),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function initialLowPerformance() {
    return Boolean(MOTION_QUERY?.matches) || safeStorageGet(LOW_PERFORMANCE_KEY) === "1";
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be unavailable in strict privacy modes.
    }
  }

  function currentRendererPixelRatio() {
    return Math.min(window.devicePixelRatio || 1, state.lowPerformance ? PERFORMANCE.lowRendererPixelRatio : PERFORMANCE.rendererPixelRatio);
  }

  function currentLabelInterval() {
    return state.lowPerformance ? PERFORMANCE.lowLabelInterval : PERFORMANCE.labelInterval;
  }

  function currentBackgroundInterval() {
    return state.lowPerformance ? PERFORMANCE.lowBackgroundInterval : PERFORMANCE.backgroundInterval;
  }

  function clearGroup(group) {
    while (group.children.length) {
      const child = group.children.pop();
      child.geometry?.dispose?.();
      child.material?.dispose?.();
    }
    dom.labelLayer.innerHTML = "";
  }

  const planetTextureCache = new Map();
  function planetTexture(item, color) {
    const variant = stableHash(`${item.kind}-${item.category || ""}-${item.id}`) % 7;
    const key = `${item.kind}-${item.category || ""}-${color.getHexString()}-${variant}`;
    if (planetTextureCache.has(key)) return planetTextureCache.get(key);

    const canvas = document.createElement("canvas");
    canvas.width = 192;
    canvas.height = 192;
    const context = canvas.getContext("2d");
    const center = 96;
    const radius = 70;
    const base = color.clone();
    const light = color.clone().lerp(new THREE.Color("#ffffff"), item.kind === "company" ? 0.78 : 0.56);
    const dark = color.clone().multiplyScalar(item.kind === "achievement" ? 0.42 : 0.2);
    const rim = color.clone().lerp(new THREE.Color("#ffffff"), 0.64);

    context.clearRect(0, 0, 192, 192);
    context.save();
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.clip();

    const baseGradient = context.createRadialGradient(56, 48, 8, 114, 122, 106);
    baseGradient.addColorStop(0, rgbString(light));
    baseGradient.addColorStop(0.34, rgbString(base));
    baseGradient.addColorStop(0.72, rgbString(base.clone().multiplyScalar(0.62)));
    baseGradient.addColorStop(1, rgbString(dark));
    context.fillStyle = baseGradient;
    context.fillRect(0, 0, 192, 192);

    const bandCount = item.kind === "achievement" ? 4 : item.kind === "company" ? 3 : 5;
    for (let index = 0; index < bandCount; index += 1) {
      const hash = stableHash(`${key}-band-${index}`);
      const y = 44 + (hash % 98);
      const alpha = 0.055 + ((hash >>> 8) % 16) / 100;
      const bandColor = index % 2 ? light.clone().lerp(base, 0.36) : dark.clone().lerp(base, 0.28);
      context.fillStyle = rgbString(bandColor, alpha);
      context.beginPath();
      context.ellipse(center, y, 92, 3.2 + ((hash >>> 16) % 22) / 10, (((hash >>> 24) % 100) / 100 - 0.5) * 0.28, 0, Math.PI * 2);
      context.fill();
    }

    for (let index = 0; index < 44; index += 1) {
      const hash = stableHash(`${key}-continent-${index}`);
      const angle = ((hash % 628) / 100);
      const distance = Math.sqrt(((hash >>> 8) % 1000) / 1000) * radius * 0.86;
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      const w = 4 + ((hash >>> 18) % 22) / 4;
      const h = 1.5 + ((hash >>> 24) % 16) / 4;
      context.fillStyle = rgbString(index % 3 ? dark.clone().lerp(base, 0.55) : light.clone().lerp(base, 0.52), 0.08);
      context.beginPath();
      context.ellipse(x, y, w, h, angle * 0.35, 0, Math.PI * 2);
      context.fill();
    }

    for (let index = 0; index < 120; index += 1) {
      const hash = stableHash(`${key}-grain-${index}`);
      const angle = ((hash % 628) / 100);
      const distance = Math.sqrt(((hash >>> 8) % 1000) / 1000) * radius * 0.96;
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      const grainRadius = 0.35 + ((hash >>> 16) % 20) / 22;
      const useLight = ((hash >>> 22) & 1) === 1;
      context.fillStyle = rgbString(useLight ? light : dark, useLight ? 0.16 : 0.14);
      context.beginPath();
      context.arc(x, y, grainRadius, 0, Math.PI * 2);
      context.fill();
    }

    const daySide = context.createRadialGradient(54, 46, 4, 66, 58, 62);
    daySide.addColorStop(0, "rgba(255,255,255,0.34)");
    daySide.addColorStop(0.28, "rgba(255,255,255,0.08)");
    daySide.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = daySide;
    context.fillRect(0, 0, 192, 192);

    const terminator = context.createLinearGradient(46, 36, 158, 154);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.54, "rgba(0,0,0,0.08)");
    terminator.addColorStop(1, "rgba(0,0,0,0.58)");
    context.fillStyle = terminator;
    context.fillRect(0, 0, 192, 192);

    const vignette = context.createRadialGradient(54, 48, 20, center, center, radius + 8);
    vignette.addColorStop(0, "rgba(255,255,255,0.04)");
    vignette.addColorStop(0.64, "rgba(255,255,255,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.5)");
    context.fillStyle = vignette;
    context.fillRect(0, 0, 192, 192);
    context.restore();

    const atmosphere = context.createRadialGradient(center, center, radius - 7, center, center, radius + 18);
    atmosphere.addColorStop(0, rgbString(rim, 0.08));
    atmosphere.addColorStop(0.42, rgbString(rim, item.kind === "achievement" ? 0.36 : 0.22));
    atmosphere.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = atmosphere;
    context.beginPath();
    context.arc(center, center, radius + 18, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = rgbString(rim, item.kind === "achievement" ? 0.62 : 0.42);
    context.lineWidth = item.kind === "company" ? 2.6 : 1.8;
    context.beginPath();
    context.arc(center, center, radius - 0.5, 0, Math.PI * 2);
    context.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    planetTextureCache.set(key, texture);
    return texture;
  }

  let cachedHalo = null;
  function haloTexture() {
    if (cachedHalo) return cachedHalo;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.18, "rgba(255,255,255,0.38)");
    gradient.addColorStop(0.52, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    cachedHalo = new THREE.CanvasTexture(canvas);
    return cachedHalo;
  }

  function rgbString(color, alpha = 1) {
    return `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${alpha})`;
  }

  let cachedStarburst = null;
  function starburstTexture() {
    if (cachedStarburst) return cachedStarburst;
    const canvas = document.createElement("canvas");
    canvas.width = 192;
    canvas.height = 192;
    const context = canvas.getContext("2d");
    const center = 96;
    const gradient = context.createRadialGradient(center, center, 0, center, center, 92);
    gradient.addColorStop(0, "rgba(255,255,255,0.92)");
    gradient.addColorStop(0.08, "rgba(255,255,255,0.42)");
    gradient.addColorStop(0.34, "rgba(255,255,255,0.1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 192, 192);
    context.strokeStyle = "rgba(255,255,255,0.46)";
    context.lineWidth = 1;
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const inner = index % 3 === 0 ? 12 : 22;
      const outer = index % 3 === 0 ? 92 : 66;
      context.globalAlpha = index % 3 === 0 ? 0.48 : 0.24;
      context.beginPath();
      context.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner);
      context.lineTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer);
      context.stroke();
    }
    cachedStarburst = new THREE.CanvasTexture(canvas);
    return cachedStarburst;
  }

  function initStarfield() {
    const canvas = dom.canvas;
    const context = canvas.getContext("2d");
    let stars = [];
    let dust = [];
    let meteors = [];
    let ships = [];
    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, state.lowPerformance ? PERFORMANCE.lowBackgroundPixelRatio : PERFORMANCE.backgroundPixelRatio);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const starLimit = state.lowPerformance ? PERFORMANCE.lowMaxStars : PERFORMANCE.maxStars;
      const dustLimit = state.lowPerformance ? PERFORMANCE.lowMaxDust : PERFORMANCE.maxDust;
      stars = Array.from({ length: Math.min(starLimit, Math.floor(window.innerWidth / 3.2)) }, (_, index) => {
        const hash = stableHash(`star-${index}-${window.innerWidth}`);
        return {
          x: hash % window.innerWidth,
          y: (hash >>> 8) % window.innerHeight,
          r: 0.22 + ((hash >>> 16) % 18) / 18,
          bright: ((hash >>> 20) % 100) > 88,
          tint: ["238,243,255", "191,216,255", "255,226,186", "197,255,235"][(hash >>> 24) % 4],
          speed: 0.035 + ((hash >>> 4) % 10) / 210,
          phase: (hash % 628) / 100,
        };
      });
      dust = Array.from({ length: Math.min(dustLimit, Math.floor(window.innerWidth / 10)) }, (_, index) => {
        const hash = stableHash(`dust-${index}-${window.innerWidth}`);
        const diagonal = ((hash >>> 7) % 1000) / 1000;
        return {
          x: diagonal * window.innerWidth + (((hash >>> 17) % 100) - 50),
          y: diagonal * window.innerHeight * 0.62 + ((hash >>> 23) % window.innerHeight) * 0.26,
          r: 0.4 + (hash % 24) / 10,
          alpha: 0.016 + ((hash >>> 12) % 20) / 1000,
          tint: ["116,192,252", "121,223,193", "255,143,163"][(hash >>> 20) % 3],
        };
      });
      meteors = Array.from({ length: state.lowPerformance ? 0 : PERFORMANCE.maxMeteors }, (_, index) => {
        const hash = stableHash(`meteor-${index}-${window.innerWidth}`);
        return {
          delay: (hash % 9000) + index * 1400,
          duration: 3800 + ((hash >>> 6) % 4200),
          startX: (hash % window.innerWidth) - window.innerWidth * 0.25,
          startY: ((hash >>> 9) % Math.max(1, window.innerHeight * 0.46)),
          length: 130 + ((hash >>> 15) % 160),
          speed: 0.2 + ((hash >>> 21) % 80) / 250,
        };
      });
      ships = Array.from({ length: state.lowPerformance ? 0 : PERFORMANCE.maxShips }, (_, index) => {
        const hash = stableHash(`ship-${index}-${window.innerWidth}`);
        return {
          x: (hash % window.innerWidth),
          y: ((hash >>> 8) % window.innerHeight),
          scale: 0.82 + ((hash >>> 15) % 54) / 100,
          drift: 0.006 + ((hash >>> 22) % 15) / 1000,
          phase: (hash % 628) / 100,
          angle: (((hash >>> 12) % 100) / 100 - 0.5) * 0.7,
          variant: (hash >>> 26) % 3,
        };
      });
    }
    let lastDraw = 0;
    function draw(time) {
      requestAnimationFrame(draw);
      if (document.hidden || time - lastDraw < currentBackgroundInterval()) return;
      lastDraw = time;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.save();
      context.globalCompositeOperation = "lighter";
      for (const particle of dust) {
        context.beginPath();
        context.fillStyle = `rgba(${particle.tint}, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      for (const star of stars) {
        const alpha = state.lowPerformance
          ? star.bright ? 0.32 : 0.16
          : (star.bright ? 0.34 : 0.16) + Math.sin(time * star.speed * 0.01 + star.phase) * (star.bright ? 0.18 : 0.09);
        context.beginPath();
        context.fillStyle = `rgba(${star.tint}, ${alpha})`;
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fill();
        if (star.bright) {
          context.save();
          context.globalAlpha = Math.max(0, alpha * 0.36);
          context.strokeStyle = `rgba(${star.tint}, 0.5)`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(star.x - star.r * 3.4, star.y);
          context.lineTo(star.x + star.r * 3.4, star.y);
          context.moveTo(star.x, star.y - star.r * 3.4);
          context.lineTo(star.x, star.y + star.r * 3.4);
          context.stroke();
          context.restore();
        }
      }
      for (const meteor of meteors) {
        const cycle = meteor.duration + meteor.delay;
        const t = ((time + meteor.delay) % cycle) / meteor.duration;
        if (t < 0 || t > 1) continue;
        const alpha = Math.sin(Math.PI * t) * 0.58;
        const x = meteor.startX + t * window.innerWidth * meteor.speed;
        const y = meteor.startY + t * window.innerHeight * meteor.speed * 0.34;
        context.save();
        context.globalAlpha = alpha;
        const gradient = context.createLinearGradient(x, y, x - meteor.length, y - meteor.length * 0.34);
        gradient.addColorStop(0, "rgba(255,255,255,0.92)");
        gradient.addColorStop(0.24, "rgba(116,192,252,0.48)");
        gradient.addColorStop(0.56, "rgba(255,143,163,0.12)");
        gradient.addColorStop(1, "rgba(116,192,252,0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.25;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - meteor.length, y - meteor.length * 0.34);
        context.stroke();
        context.restore();
      }
      for (const ship of ships) {
        const driftX = Math.sin(time * ship.drift * 0.001 + ship.phase) * 26;
        const driftY = Math.cos(time * ship.drift * 0.001 + ship.phase) * 12;
        const alpha = 0.11 + Math.sin(time * 0.0008 + ship.phase) * 0.035;
        context.save();
        context.translate(ship.x + driftX, ship.y + driftY);
        context.rotate(ship.angle + Math.sin(time * 0.0002 + ship.phase) * 0.05);
        context.scale(ship.scale, ship.scale);
        context.globalAlpha = Math.max(0.02, alpha);
        drawSpaceship(context, ship.variant, time + ship.phase * 1000);
        context.restore();
      }
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }

  function drawSpaceship(context, variant, time) {
    const flamePulse = 0.72 + Math.sin(time * 0.006) * 0.28;
    context.shadowColor = "rgba(116,192,252,0.42)";
    context.shadowBlur = 9;
    context.save();
    context.globalCompositeOperation = "lighter";
    const flame = context.createLinearGradient(-31, 0, -10, 0);
    flame.addColorStop(0, "rgba(116,192,252,0)");
    flame.addColorStop(0.4, "rgba(116,192,252,0.34)");
    flame.addColorStop(1, "rgba(255,224,102,0.7)");
    context.fillStyle = flame;
    context.beginPath();
    context.moveTo(-12, -3.2);
    context.lineTo(-28 - flamePulse * 5, 0);
    context.lineTo(-12, 3.2);
    context.closePath();
    context.fill();
    context.restore();

    const hull = context.createLinearGradient(-18, -8, 24, 9);
    hull.addColorStop(0, "rgba(116,192,252,0.24)");
    hull.addColorStop(0.36, "rgba(238,243,255,0.88)");
    hull.addColorStop(1, "rgba(121,223,193,0.34)");
    context.strokeStyle = "rgba(213,228,255,0.72)";
    context.lineWidth = 1.15;

    if (variant === 1) {
      context.fillStyle = "rgba(116,192,252,0.3)";
      context.beginPath();
      context.moveTo(-10, -7);
      context.lineTo(3, -15);
      context.lineTo(7, -4);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(-10, 7);
      context.lineTo(3, 15);
      context.lineTo(7, 4);
      context.closePath();
      context.fill();
      context.fillStyle = hull;
      context.beginPath();
      context.moveTo(-20, -3.5);
      context.quadraticCurveTo(0, -8, 28, 0);
      context.quadraticCurveTo(0, 8, -20, 3.5);
      context.quadraticCurveTo(-16, 0, -20, -3.5);
      context.closePath();
      context.fill();
      context.stroke();
    } else if (variant === 2) {
      context.fillStyle = "rgba(255,255,255,0.18)";
      context.fillRect(-15, -5, 23, 10);
      context.fillStyle = "rgba(116,192,252,0.28)";
      context.beginPath();
      context.moveTo(-6, -5);
      context.lineTo(7, -18);
      context.lineTo(12, -4);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(-6, 5);
      context.lineTo(7, 18);
      context.lineTo(12, 4);
      context.closePath();
      context.fill();
      context.fillStyle = hull;
      context.beginPath();
      context.moveTo(-18, -6);
      context.lineTo(13, -6);
      context.lineTo(28, 0);
      context.lineTo(13, 6);
      context.lineTo(-18, 6);
      context.quadraticCurveTo(-23, 0, -18, -6);
      context.closePath();
      context.fill();
      context.stroke();
    } else {
      context.fillStyle = "rgba(116,192,252,0.25)";
      context.beginPath();
      context.moveTo(-12, -4);
      context.lineTo(5, -19);
      context.lineTo(10, -5);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(-12, 4);
      context.lineTo(5, 19);
      context.lineTo(10, 5);
      context.closePath();
      context.fill();
      context.fillStyle = hull;
      context.beginPath();
      context.moveTo(-22, -5);
      context.quadraticCurveTo(0, -13, 30, 0);
      context.quadraticCurveTo(0, 13, -22, 5);
      context.quadraticCurveTo(-16, 0, -22, -5);
      context.closePath();
      context.fill();
      context.stroke();
    }

    context.fillStyle = "rgba(9,13,26,0.7)";
    context.beginPath();
    context.ellipse(10, -1.6, 4.8, 2.5, -0.14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(199,235,255,0.72)";
    context.beginPath();
    context.ellipse(11, -2, 2.1, 1, -0.14, 0, Math.PI * 2);
    context.fill();
  }

  function stableHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < String(value).length; index += 1) {
      hash ^= String(value).charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function debounce(fn, delay) {
    let timer = 0;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  start();
})();
