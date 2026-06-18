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
    achievement: { label: "AI成就恒星", color: "#ffe066" },
  };

  const GEO_LOCATIONS = {
    "openai": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "anthropic": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "xai": { name: "San Francisco / Austin", label: "旧金山 / 奥斯汀", country: "美国", lat: 37.7749, lon: -122.4194 },
    "google-deepmind": { name: "London", label: "伦敦", country: "英国", lat: 51.5074, lon: -0.1278 },
    "meta-ai": { name: "Menlo Park", label: "门洛帕克", country: "美国", lat: 37.453, lon: -122.1817 },
    "minimax": { name: "Shanghai", label: "上海", country: "中国", lat: 31.2304, lon: 121.4737 },
    "moonshot-ai": { name: "Beijing", label: "北京", country: "中国", lat: 39.9042, lon: 116.4074 },
    "deepseek": { name: "Hangzhou", label: "杭州", country: "中国", lat: 30.2741, lon: 120.1551 },
    "mistral-ai": { name: "Paris", label: "巴黎", country: "法国", lat: 48.8566, lon: 2.3522 },
    "perplexity": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "cohere": { name: "Toronto", label: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
    "alan-turing": { name: "Cambridge", label: "剑桥", country: "英国", lat: 52.2053, lon: 0.1218 },
    "geoffrey-hinton": { name: "Toronto", label: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
    "yoshua-bengio": { name: "Montreal", label: "蒙特利尔", country: "加拿大", lat: 45.5017, lon: -73.5673 },
    "yann-lecun": { name: "New York", label: "纽约", country: "美国", lat: 40.7128, lon: -74.006 },
    "fei-fei-li": { name: "Stanford", label: "斯坦福", country: "美国", lat: 37.4275, lon: -122.1697 },
    "andrew-ng": { name: "Stanford", label: "斯坦福", country: "美国", lat: 37.4275, lon: -122.1697 },
    "ashish-vaswani": { name: "Mountain View", label: "山景城", country: "美国", lat: 37.3861, lon: -122.0839 },
    "shunyu-yao": { name: "Princeton / San Francisco", label: "普林斯顿 / 旧金山", country: "美国", lat: 40.343, lon: -74.6514 },
    "sam-altman": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "dario-amodei": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "demis-hassabis": { name: "London", label: "伦敦", country: "英国", lat: 51.5074, lon: -0.1278 },
    "ilya-sutskever": { name: "Toronto / San Francisco", label: "多伦多 / 旧金山", country: "加拿大 / 美国", lat: 43.6532, lon: -79.3832 },
    "andrej-karpathy": { name: "Stanford / San Francisco", label: "斯坦福 / 旧金山", country: "美国", lat: 37.4275, lon: -122.1697 },
    "liang-wenfeng": { name: "Hangzhou", label: "杭州", country: "中国", lat: 30.2741, lon: 120.1551 },
    "elon-musk": { name: "Austin / San Francisco", label: "奥斯汀 / 旧金山", country: "美国", lat: 30.2672, lon: -97.7431 },
    "yan-junjie": { name: "Shanghai", label: "上海", country: "中国", lat: 31.2304, lon: 121.4737 },
    "transformer": { name: "Mountain View", label: "山景城", country: "美国", lat: 37.3861, lon: -122.0839 },
    "bert": { name: "Mountain View", label: "山景城", country: "美国", lat: 37.3861, lon: -122.0839 },
    "gpt": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "rag": { name: "London / New York", label: "伦敦 / 纽约", country: "英国 / 美国", lat: 51.5074, lon: -0.1278 },
    "lora": { name: "Seattle / Microsoft", label: "西雅图", country: "美国", lat: 47.6062, lon: -122.3321 },
    "mcp": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "skills": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "agent-loop": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "react": { name: "Princeton", label: "普林斯顿", country: "美国", lat: 40.343, lon: -74.6514 },
    "deepseek-r1": { name: "Hangzhou", label: "杭州", country: "中国", lat: 30.2741, lon: 120.1551 },
    "achievement-1950-turing-test": { name: "Cambridge", label: "剑桥", country: "英国", lat: 52.2053, lon: 0.1218 },
    "achievement-1956-dartmouth-workshop": { name: "Hanover", label: "汉诺威", country: "美国", lat: 43.7022, lon: -72.2896 },
    "achievement-1986-backpropagation": { name: "Toronto", label: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
    "achievement-1997-lstm-deep-blue": { name: "Munich / New York", label: "慕尼黑 / 纽约", country: "德国 / 美国", lat: 48.1351, lon: 11.582 },
    "achievement-2006-deep-learning": { name: "Toronto", label: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
    "achievement-2012-alexnet": { name: "Toronto", label: "多伦多", country: "加拿大", lat: 43.6532, lon: -79.3832 },
    "achievement-2014-gan": { name: "Montreal", label: "蒙特利尔", country: "加拿大", lat: 45.5017, lon: -73.5673 },
    "achievement-2017-transformer": { name: "Mountain View", label: "山景城", country: "美国", lat: 37.3861, lon: -122.0839 },
    "achievement-2018-bert-gpt": { name: "Mountain View / San Francisco", label: "山景城 / 旧金山", country: "美国", lat: 37.3861, lon: -122.0839 },
    "achievement-2020-rag-gpt-3": { name: "London / San Francisco", label: "伦敦 / 旧金山", country: "英国 / 美国", lat: 51.5074, lon: -0.1278 },
    "achievement-2021-foundation-model": { name: "Stanford", label: "斯坦福", country: "美国", lat: 37.4275, lon: -122.1697 },
    "achievement-2022-chatgpt-react": { name: "San Francisco / Princeton", label: "旧金山 / 普林斯顿", country: "美国", lat: 37.7749, lon: -122.4194 },
    "achievement-2023-agent-boom": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "achievement-2024-mcp": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "achievement-2025-reasoning-skills": { name: "San Francisco", label: "旧金山", country: "美国", lat: 37.7749, lon: -122.4194 },
    "achievement-2026-ai-concept-universe": { name: "Global", label: "全球", country: "Global", lat: 22, lon: 24 },
  };

  const EARTH_TEXTURE_URL = "assets/earth_atmos_2048.jpg";
  const GLOBE_RADIUS = 132;
  const STORAGE_KEY = "ai-concept-universe:last-seen-version";
  const CURRENT_YEAR = 2026;
  const EPOCH_YEAR = 1950;
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
    constellationId: null,
    viewMode: "panorama",
    isChroniclePlaying: false,
    chronicleTimer: 0,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: null,
    pointer: new THREE.Vector2(),
    galaxy: null,
    meshes: new Map(),
    labels: new Map(),
    linkObjects: [],
    portraitCache: new Map(),
    atlasItems: [],
    atlasFocusCity: null,
    atlasCityEntries: [],
    atlasScene: null,
    atlasCamera: null,
    atlasRenderer: null,
    atlasGroup: null,
    atlasEarth: null,
    atlasAtmosphere: null,
    atlasNodeGroup: null,
    atlasLineGroup: null,
    atlasControls: null,
    atlasRaycaster: null,
    atlasPointer: new THREE.Vector2(),
    atlasNodeMeshes: new Map(),
    atlasLabelEntries: [],
    atlasCityLabelEntries: [],
    atlasNeedsLabelUpdate: true,
    atlasNeedsRender: true,
    atlasLastLabelUpdate: 0,
    atlasLastFrame: 0,
    atlasLastResizeCheck: 0,
    atlasLastRenderSize: "",
    width: window.innerWidth,
    height: window.innerHeight,
  };

  async function start() {
    if (!window.THREE) {
      dom.stage.innerHTML = '<div class="fallback-error">Three.js 加载失败，请检查网络连接。</div>';
      return;
    }

    if (window.lucide) window.lucide.createIcons();
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

    state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
    addGalaxyMist();
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
    const atlasLayer = document.createElement("section");
    atlasLayer.id = "atlas-layer";
    atlasLayer.className = "atlas-layer";
    atlasLayer.hidden = true;
    atlasLayer.setAttribute("aria-label", "AI World Atlas");
    atlasLayer.innerHTML = `
      <div class="atlas-stage">
        <div id="atlas-globe" class="atlas-globe" aria-hidden="true"></div>
        <div class="atlas-header">
          <p class="eyebrow">AI World Atlas</p>
          <h2>3D 全球 AI 版图</h2>
          <p>拖拽旋转地球，观察公司、人物、论文与关键事件在真实地理空间中的分布。</p>
        </div>
        <div id="atlas-city-rail" class="atlas-city-rail" aria-label="AI 热区"></div>
        <div id="atlas-nodes" class="atlas-nodes"></div>
        <div class="atlas-legend" aria-hidden="true">
          <span><i class="is-company"></i>公司</span>
          <span><i class="is-person"></i>人物</span>
          <span><i class="is-achievement"></i>成就</span>
          <span><i class="is-concept"></i>概念</span>
        </div>
        <div id="atlas-meta" class="atlas-meta"></div>
      </div>
    `;
    document.querySelector(".app-shell")?.appendChild(atlasLayer);
    dynamicDom.atlasLayer = atlasLayer;
    dynamicDom.atlasStage = atlasLayer.querySelector(".atlas-stage");
    dynamicDom.atlasGlobe = atlasLayer.querySelector("#atlas-globe");
    dynamicDom.atlasCityRail = atlasLayer.querySelector("#atlas-city-rail");
    dynamicDom.atlasNodes = atlasLayer.querySelector("#atlas-nodes");
    dynamicDom.atlasMeta = atlasLayer.querySelector("#atlas-meta");
    dynamicDom.atlasNodes.addEventListener("click", handleAtlasClick);
    dynamicDom.atlasCityRail.addEventListener("click", handleAtlasCityRailClick);
    dynamicDom.atlasStage.addEventListener("click", handleAtlasStageClick);

    const panel = document.querySelector(".filter-panel");
    const typeSection = dom.typeList?.closest(".panel-section");
    if (panel && typeSection) {
      const viewSection = document.createElement("div");
      viewSection.className = "panel-section view-mode-section";
      viewSection.innerHTML = `
        <div class="section-title">观测视角</div>
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
      <div>
        <span class="constellation-kicker">CONSTELLATION</span>
        <strong id="constellation-title"></strong>
      </div>
      <button id="exit-constellation" class="ghost-button" type="button">退出星座</button>
    `;
    document.querySelector(".app-shell")?.appendChild(constellationHud);
    dynamicDom.constellationHud = constellationHud;
    dynamicDom.constellationTitle = constellationHud.querySelector("#constellation-title");
    dynamicDom.exitConstellation = constellationHud.querySelector("#exit-constellation");
    dynamicDom.exitConstellation.addEventListener("click", () => clearConstellation());

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

    if (window.lucide) window.lucide.createIcons();
  }

  function buildControls() {
    buildViewModeControls();
    buildTypeControls();
    buildCategoryControls();
    buildSearchOptions();
  }

  function buildViewModeControls() {
    if (!dynamicDom.viewModeList) return;
    const modes = [
      ["panorama", "全景"],
      ["atlas", "地图"],
      ["chronicle", "编年史"],
      ["hot", "热点"],
      ["company", "公司"],
      ["person", "人物"],
    ];
    dynamicDom.viewModeList.innerHTML = modes
      .map(([mode, label]) => `<button class="view-mode ${state.viewMode === mode ? "is-active" : ""}" type="button" data-mode="${mode}">${label}</button>`)
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
    state.linkObjects = [];
    addGalaxyMist();
    addRelationLines();
    addItemMeshes();
  }

  function addItemMeshes() {
    const sphere = new THREE.SphereGeometry(1, 24, 18);
    state.items.forEach((item) => {
      const color = itemColor(item);
      const size = nodeSize(item);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: item.kind === "achievement" ? 0.98 : 0.9,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(sphere, material);
      mesh.scale.setScalar(size);
      mesh.position.set(item.position.x, item.position.y, item.position.z);
      mesh.userData.itemId = item.id;
      mesh.userData.baseScale = size;
      mesh.userData.baseOpacity = material.opacity;
      mesh.userData.pulse = (stableHash(`pulse-${item.id}`) % 1000) / 1000;
      state.galaxy.add(mesh);

      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: haloTexture(),
          color,
          transparent: true,
          opacity: item.kind === "achievement" ? 0.22 : item.kind === "company" ? 0.19 : item.kind === "person" ? 0.17 : 0.125,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.scale.setScalar(size * (item.kind === "achievement" ? 7.2 : item.kind === "company" ? 5.6 : 4.7));
      halo.position.copy(mesh.position);
      halo.userData.follows = mesh;
      halo.userData.baseOpacity = halo.material.opacity;
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

  function addRelationLines() {
    state.links.forEach((link) => {
      const start = new THREE.Vector3(link.source.position.x, link.source.position.y, link.source.position.z);
      const end = new THREE.Vector3(link.target.position.x, link.target.position.y, link.target.position.z);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.multiplyScalar(0.76);
      mid.y += 18 + (stableHash(link.id) % 26);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(18));
      const material = new THREE.LineBasicMaterial({
        color: relationColor(link),
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      line.userData.link = link;
      state.galaxy.add(line);
      state.linkObjects.push(line);
    });
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
    state.labels.set(item.id, label);
  }

  function updateLabels() {
    const halfW = state.width / 2;
    const halfH = state.height / 2;
    const vector = new THREE.Vector3();
    const candidates = [];
    state.items.forEach((item) => {
      const label = state.labels.get(item.id);
      const mesh = state.meshes.get(item.id);
      if (!label || !mesh || !mesh.visible) {
        if (label) label.classList.remove("is-visible", "is-focus");
        return;
      }
      const focus = item.id === state.hoveredId || item.id === state.selectedId || item.id === state.searchHitId;
      vector.copy(mesh.position).project(state.camera);
      const isBehind = vector.z > 1;
      if (isBehind) {
        label.classList.remove("is-visible", "is-focus");
        return;
      }
      const x = vector.x * halfW + halfW;
      const y = -vector.y * halfH + halfH;
      const width = label.offsetWidth || Math.min(180, item.name.length * 7 + 14);
      const height = label.offsetHeight || 20;
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
    const constellationIds = constellationRelatedIds();
    candidates
      .sort((a, b) => b.priority - a.priority || b.item.heat - a.item.heat || a.item.name.localeCompare(b.item.name))
      .forEach((candidate) => {
        const { item, label, rect, x, y } = candidate;
        const focus = candidate.focus || constellationIds.has(item.id);
        const insideViewport = rect.right >= 0 && rect.left <= state.width && rect.bottom >= 0 && rect.top <= state.height;
        const overlaps = !focus && placed.some((placedLabel) => rectsOverlap(rect, placedLabel.rect, 6));
        const visible = insideViewport && (!overlaps || focus);
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.zIndex = String(focus ? 1000 : Math.round(candidate.priority));
        label.classList.toggle("is-visible", visible);
        label.classList.toggle("is-focus", focus);
        if (visible) placed.push(candidate);
      });
  }

  function labelPriority(item, focus) {
    if (focus) return 10000;
    const kindBoost = { company: 420, person: 360, achievement: 300, concept: 0 }[item.kind] || 0;
    return kindBoost + Number(item.heat || 0);
  }

  function rectsOverlap(a, b, padding = 0) {
    return !(a.right + padding < b.left || a.left - padding > b.right || a.bottom + padding < b.top || a.top - padding > b.bottom);
  }

  function applyFilters() {
    let visibleCount = 0;
    const atlasMode = state.viewMode === "atlas";
    const constellationIds = constellationRelatedIds();
    const hoverRelated = relatedIds(state.hoveredId || state.searchHitId);
    const focusRelated = constellationIds.size ? constellationIds : hoverRelated;
    document.body.classList.toggle("is-atlas-mode", atlasMode);
    if (dynamicDom.atlasLayer) dynamicDom.atlasLayer.hidden = !atlasMode;
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
      mesh.scale.setScalar(scale);
    });

    state.galaxy.children.forEach((child) => {
      if (child.userData?.follows) {
        const follows = child.userData.follows;
        child.visible = follows.visible;
        if (child.material) {
          const focusRatio = follows.material.opacity / (follows.userData.baseOpacity || 0.9);
          child.material.opacity = (child.userData.baseOpacity || 0.12) * clampNumber(focusRatio, 0.12, 1.18);
        }
        if (child.geometry?.type === "RingGeometry") child.lookAt(state.camera.position);
      }
    });

    state.linkObjects.forEach((line) => {
      const link = line.userData.link;
      const visible = isItemVisible(link.source) && isItemVisible(link.target);
      const highlighted = focusRelated.has(link.sourceId) && focusRelated.has(link.targetId) && focusRelated.size > 0;
      line.visible = visible;
      line.material.opacity = visible ? (highlighted ? (constellationIds.size ? 0.78 : 0.62) : focusRelated.size ? 0.018 : 0.12) : 0;
    });

    dom.sliceYear.textContent = String(state.selectedYear);
    dom.sliceCount.textContent = `${visibleCount} nodes`;
    updateConstellationHud(constellationIds);
    renderAtlas();
    updateChronicle();
    updateLabels();
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
    if (state.viewMode === "atlas") return Boolean(geoLocationFor(item));
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

  function constellationRelatedIds() {
    if (!state.constellationId) return new Set();
    const direct = relatedIds(state.constellationId);
    const root = state.itemById.get(state.constellationId);
    if (!root) return direct;
    state.items.forEach((item) => {
      if (item.id === root.id) return;
      const sameConcept = (item.concepts || []).some((id) => id === root.id || (root.concepts || []).includes(id));
      const rootConcept = root.concepts?.some((id) => id === item.id);
      const sameCompany = (item.companies || []).some((id) => id === root.id || (root.companies || []).includes(id));
      if (sameConcept || rootConcept || sameCompany) direct.add(item.id);
    });
    return direct;
  }

  function updateConstellationHud(constellationIds) {
    if (!dynamicDom.constellationHud) return;
    const root = state.itemById.get(state.constellationId);
    dynamicDom.constellationHud.hidden = !root;
    if (!root) return;
    const location = geoLocationFor(root);
    dynamicDom.constellationHud.querySelector(".constellation-kicker").textContent = state.viewMode === "atlas" ? "AI WORLD ATLAS" : "CONSTELLATION";
    dynamicDom.exitConstellation.textContent = "退出聚焦";
    dynamicDom.constellationTitle.textContent =
      state.viewMode === "atlas" && location
        ? `${root.name} · ${location.label || location.name}`
        : `${root.name} 星座 · ${Math.max(0, constellationIds.size - 1)} related`;
  }

  function enterConstellation(item) {
    state.constellationId = item.id;
    applyFilters();
  }

  function clearConstellation() {
    state.constellationId = null;
    applyFilters();
  }

  function renderAtlas() {
    if (!dynamicDom.atlasLayer || state.viewMode !== "atlas") {
      state.atlasItems = [];
      state.atlasCityEntries = [];
      state.atlasLabelEntries = [];
      state.atlasCityLabelEntries = [];
      return;
    }

    ensureAtlasGlobe();
    const visibleItems = state.items
      .filter(isItemVisible)
      .map((item) => ({ item, location: geoLocationFor(item) }))
      .filter((entry) => entry.location)
      .sort((a, b) => kindRank(a.item.kind) - kindRank(b.item.kind) || b.item.heat - a.item.heat);
    state.atlasItems = visibleItems;

    const constellationIds = constellationRelatedIds();
    const hasFocus = constellationIds.size > 0;
    const cityGroups = groupBy(visibleItems, (entry) => entry.location.name);
    const focusItem = state.itemById.get(state.constellationId);
    let focusCity = state.atlasFocusCity;
    if (focusCity && !cityGroups.has(focusCity)) {
      state.atlasFocusCity = null;
      focusCity = null;
    }

    clearThreeGroup(state.atlasNodeGroup);
    clearThreeGroup(state.atlasLineGroup);
    state.atlasNodeMeshes.clear();
    state.atlasNeedsLabelUpdate = true;
    state.atlasNeedsRender = true;
    const anchors = new Map();

    const cityEntries = Array.from(cityGroups.entries())
      .map(([city, entries]) => {
        const heat = Math.max(...entries.map((entry) => entry.item.heat || 50));
        const location = entries[0].location;
        const anchor = globePosition(location, GLOBE_RADIUS + 3.6);
        const lead = entries.slice().sort((a, b) => kindRank(a.item.kind) - kindRank(b.item.kind) || b.item.heat - a.item.heat)[0];
        addAtlasCityGlow(entries, anchor, itemColor(lead.item).getStyle());
        return { city, entries, heat, location, anchor };
      })
      .sort((a, b) => b.entries.length - a.entries.length || b.heat - a.heat)
      .slice(0, 9);
    state.atlasCityEntries = cityEntries;
    renderAtlasCityRail(cityEntries);

    const cityHtml = cityEntries
      .map((entry) => `<button class="atlas-city-label ${entry.city === focusCity ? "is-focus" : ""}" type="button" data-city="${escapeHtml(entry.city)}" title="${escapeHtml(entry.location.label || entry.city)}">${escapeHtml(entry.location.label || entry.city)} · ${entry.entries.length}</button>`)
      .join("");

    const itemHtml = visibleItems
      .map((entry, index) => {
        const { item, location } = entry;
        const peers = cityGroups.get(location.name) || [];
        const localIndex = peers.findIndex((peer) => peer.item.id === item.id);
        const spread = atlasSpread(localIndex, peers.length);
        const color = itemColor(item).getStyle();
        const related = hasFocus
          ? constellationIds.has(item.id)
          : !focusCity || location.name === focusCity;
        const size = atlasNodeSize(item);
        const zIndex = 10 + (4 - kindRank(item.kind)) * 3 + Math.round((item.heat || 50) / 22);
        const anchor = spreadGlobeAnchor(location, spread, GLOBE_RADIUS + 5 + kindRank(item.kind) * 0.65);
        anchors.set(item.id, anchor);
        addAtlasPin(item, anchor, related, color, size);
        const classes = ["atlas-node", `is-${item.kind}`, item.id === state.constellationId ? "is-focus" : "", related ? "" : "is-dim"].filter(Boolean).join(" ");
        return `
          <button class="${classes}" type="button" data-target="${escapeHtml(item.id)}" title="${escapeHtml(item.name)} · ${escapeHtml(location.label || location.name)}" style="--node-color:${color};--node-size:${size}px;--node-z:${zIndex}">
            <span class="atlas-pulse"></span>
            <span class="atlas-dot"></span>
            <span class="atlas-node-label">${escapeHtml(item.name)}</span>
          </button>
        `;
      })
      .join("");
    dynamicDom.atlasNodes.innerHTML = `${cityHtml}${itemHtml}`;

    const cityLabels = Array.from(dynamicDom.atlasNodes.querySelectorAll(".atlas-city-label"));
    state.atlasCityLabelEntries = cityEntries.map((entry, index) => ({
      ...entry,
      element: cityLabels[index],
    }));

    const labelButtons = Array.from(dynamicDom.atlasNodes.querySelectorAll(".atlas-node"));
    state.atlasLabelEntries = visibleItems.map((entry, index) => ({
      ...entry,
      anchor: anchors.get(entry.item.id),
      labelOffset: labelOffsetForAtlasEntry(entry, cityGroups),
      element: labelButtons[index],
    }));

    const geoById = new Map(visibleItems.map((entry) => [entry.item.id, entry.location]));
    state.links
      .filter((link) => geoById.has(link.sourceId) && geoById.has(link.targetId))
      .filter((link) => !hasFocus || (constellationIds.has(link.sourceId) && constellationIds.has(link.targetId)))
      .slice(0, hasFocus ? 80 : 34)
      .forEach((link) => {
        const start = globePosition(geoById.get(link.sourceId), GLOBE_RADIUS + 6);
        const end = globePosition(geoById.get(link.targetId), GLOBE_RADIUS + 6);
        addAtlasArc(link, start, end, hasFocus ? 0.44 : 0.13);
      });

    const topCities = Array.from(cityGroups.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 4)
      .map(([city, entries]) => `${city} ${entries.length}`)
      .join(" · ");
    dynamicDom.atlasMeta.innerHTML = `
      <span>${visibleItems.length} geo nodes · 3D Earth</span>
      <strong>${focusItem ? `${focusItem.name} · ${geoLocationFor(focusItem)?.label || ""}` : focusCity ? atlasCitySummary(focusCity) : topCities || "全球 AI 版图"}</strong>
    `;
    updateAtlasLabels(true);
  }

  function renderAtlasCityRail(cityEntries) {
    if (!dynamicDom.atlasCityRail) return;
    const buttons = cityEntries.slice(0, 6).map((entry) => {
      const leadNames = entry.entries
        .slice()
        .sort((a, b) => kindRank(a.item.kind) - kindRank(b.item.kind) || b.item.heat - a.item.heat)
        .slice(0, 2)
        .map(({ item }) => item.name)
        .join(" / ");
      const active = entry.city === state.atlasFocusCity ? "is-active" : "";
      return `
        <button class="atlas-city-chip ${active}" type="button" data-city="${escapeHtml(entry.city)}">
          <span>${escapeHtml(entry.location.label || entry.city)}</span>
          <strong>${entry.entries.length}</strong>
          <small>${escapeHtml(leadNames)}</small>
        </button>
      `;
    }).join("");
    dynamicDom.atlasCityRail.innerHTML = `
      <button class="atlas-city-chip is-reset ${state.atlasFocusCity ? "" : "is-active"}" type="button" data-city="">
        <span>全球</span>
        <strong>${state.atlasItems.length}</strong>
        <small>全部 AI 星体</small>
      </button>
      ${buttons}
    `;
  }

  function atlasCitySummary(cityName) {
    const entry = state.atlasCityEntries.find((city) => city.city === cityName);
    if (!entry) return cityName;
    const leadNames = entry.entries
      .slice()
      .sort((a, b) => kindRank(a.item.kind) - kindRank(b.item.kind) || b.item.heat - a.item.heat)
      .slice(0, 3)
      .map(({ item }) => item.name)
      .join(" · ");
    return `${entry.location.label || cityName} ${entry.entries.length} · ${leadNames}`;
  }

  function ensureAtlasGlobe() {
    if (state.atlasRenderer || !dynamicDom.atlasGlobe) {
      resizeAtlasGlobe();
      return;
    }

    state.atlasScene = new THREE.Scene();
    state.atlasCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 1600);
    state.atlasCamera.position.set(0, 0, 430);

    state.atlasRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    state.atlasRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    state.atlasRenderer.outputColorSpace = THREE.SRGBColorSpace;
    state.atlasRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.atlasRenderer.toneMappingExposure = 1.02;
    state.atlasRenderer.setClearColor(0x000000, 0);
    state.atlasRenderer.domElement.className = "atlas-globe-canvas";
    dynamicDom.atlasGlobe.appendChild(state.atlasRenderer.domElement);

    state.atlasGroup = new THREE.Group();
    state.atlasGroup.rotation.x = 0.56;
    state.atlasGroup.rotation.y = 0.74;
    state.atlasScene.add(state.atlasGroup);

    const ambient = new THREE.AmbientLight(0x7f9fc8, 1.18);
    state.atlasScene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 2.35);
    sun.position.set(-220, 180, 360);
    state.atlasScene.add(sun);
    const rim = new THREE.DirectionalLight(0x74c0fc, 1.45);
    rim.position.set(260, -120, -260);
    state.atlasScene.add(rim);

    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 48);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x213653,
      emissive: 0x07111d,
      emissiveIntensity: 0.22,
      shininess: 18,
      specular: 0x1b3857,
    });
    state.atlasEarth = new THREE.Mesh(earthGeometry, earthMaterial);
    state.atlasGroup.add(state.atlasEarth);

    const loader = new THREE.TextureLoader();
    loader.load(
      EARTH_TEXTURE_URL,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(8, state.atlasRenderer.capabilities.getMaxAnisotropy?.() || 1);
        state.atlasEarth.material.map = texture;
        state.atlasEarth.material.color.set(0xffffff);
        state.atlasEarth.material.needsUpdate = true;
        state.atlasNeedsRender = true;
      },
      undefined,
      () => {
        state.atlasEarth.material.map = generatedEarthTexture();
        state.atlasEarth.material.color.set(0xffffff);
        state.atlasEarth.material.needsUpdate = true;
        state.atlasNeedsRender = true;
      }
    );

    state.atlasAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 72, 48),
      new THREE.MeshBasicMaterial({
        color: 0x74c0fc,
        transparent: true,
        opacity: 0.105,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    state.atlasGroup.add(state.atlasAtmosphere);
    addAtlasGuideRings();

    state.atlasLineGroup = new THREE.Group();
    state.atlasNodeGroup = new THREE.Group();
    state.atlasGroup.add(state.atlasLineGroup);
    state.atlasGroup.add(state.atlasNodeGroup);
    state.atlasControls = createAtlasGlobeControls(dynamicDom.atlasStage, state.atlasGroup, state.atlasCamera);
    resizeAtlasGlobe();
  }

  function addAtlasGuideRings() {
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x8cb7ff,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    [-60, -30, 0, 30, 60].forEach((lat) => {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 6) {
        points.push(globePosition({ lat, lon }, GLOBE_RADIUS + 1.1));
      }
      state.atlasGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial.clone()));
    });
    for (let lon = -150; lon <= 180; lon += 45) {
      const points = [];
      for (let lat = -78; lat <= 78; lat += 6) {
        points.push(globePosition({ lat, lon }, GLOBE_RADIUS + 1.05));
      }
      state.atlasGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial.clone()));
    }
  }

  function addAtlasPin(item, anchor, related, color, size) {
    const pinScale = Math.max(1.8, size / 5.1);
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 8),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: related ? 0.96 : 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    pin.position.copy(anchor);
    pin.scale.setScalar(pinScale);
    pin.userData.itemId = item.id;
    state.atlasNodeGroup.add(pin);
    state.atlasNodeMeshes.set(item.id, pin);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTexture(),
        color,
        transparent: true,
        opacity: related ? 0.26 : 0.04,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.position.copy(anchor.clone().multiplyScalar(1.003));
    glow.scale.setScalar(pinScale * (item.kind === "achievement" ? 8.2 : item.kind === "company" ? 7 : 5.6));
    state.atlasNodeGroup.add(glow);
  }

  function addAtlasCityGlow(entries, anchor, color) {
    const strength = Math.min(1, entries.length / 12);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTexture(),
        color,
        transparent: true,
        opacity: 0.09 + strength * 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.position.copy(anchor.clone().multiplyScalar(1.002));
    glow.scale.setScalar(28 + entries.length * 4.4);
    state.atlasNodeGroup.add(glow);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.4 + entries.length * 0.18, 4.4 + entries.length * 0.22, 28),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.position.copy(anchor.clone().multiplyScalar(1.004));
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), anchor.clone().normalize());
    state.atlasNodeGroup.add(ring);
  }

  function labelOffsetForAtlasEntry(entry, cityGroups) {
    const peers = cityGroups.get(entry.location.name) || [];
    if (peers.length <= 1) return { x: 0, y: 0 };
    const localIndex = peers.findIndex((peer) => peer.item.id === entry.item.id);
    const angle = (localIndex / peers.length) * Math.PI * 2 - Math.PI / 2;
    const radius = Math.min(28, 10 + peers.length * 1.8);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  function addAtlasArc(link, start, end, opacity) {
    if (start.distanceToSquared(end) < 1) return;
    const angle = start.angleTo(end);
    const mid = start.clone().normalize().add(end.clone().normalize());
    if (mid.lengthSq() < 0.0001) mid.set(0, 1, 0).cross(start).normalize();
    const lift = GLOBE_RADIUS * (0.08 + Math.min(Math.PI, angle) * 0.18);
    mid.normalize().multiplyScalar(GLOBE_RADIUS + lift);
    const curve = new THREE.QuadraticBezierCurve3(
      start.clone().normalize().multiplyScalar(GLOBE_RADIUS + 7),
      mid,
      end.clone().normalize().multiplyScalar(GLOBE_RADIUS + 7)
    );
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
      new THREE.LineBasicMaterial({
        color: relationColor(link),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    state.atlasLineGroup.add(line);
  }

  function animateAtlasGlobe() {
    if (!state.atlasRenderer || state.viewMode !== "atlas") return;
    const now = performance.now();
    if (now - state.atlasLastResizeCheck > 360) {
      resizeAtlasGlobe();
      state.atlasLastResizeCheck = now;
    }
    const controlsChanged = state.atlasControls?.update() || false;
    if (controlsChanged) {
      state.atlasNeedsLabelUpdate = true;
      state.atlasNeedsRender = true;
    }
    const shouldUpdateLabels = state.atlasNeedsLabelUpdate && now - state.atlasLastLabelUpdate > 58;
    const minFrameGap = state.atlasControls?.isDragging?.() ? 16 : 32;
    if (!state.atlasNeedsRender && !shouldUpdateLabels) return;
    if (now - state.atlasLastFrame < minFrameGap) return;
    if (state.atlasAtmosphere) state.atlasAtmosphere.rotation.y += 0.00018;
    if (shouldUpdateLabels) {
      updateAtlasLabels(true);
    }
    state.atlasRenderer.render(state.atlasScene, state.atlasCamera);
    state.atlasNeedsRender = false;
    state.atlasLastFrame = now;
  }

  function resizeAtlasGlobe() {
    if (!state.atlasRenderer || !dynamicDom.atlasGlobe) return;
    const width = dynamicDom.atlasGlobe.clientWidth || 1;
    const height = dynamicDom.atlasGlobe.clientHeight || 1;
    const renderSize = `${width}x${height}`;
    if (state.atlasRenderer.domElement.width === Math.round(width * state.atlasRenderer.getPixelRatio()) && state.atlasRenderer.domElement.height === Math.round(height * state.atlasRenderer.getPixelRatio()) && state.atlasLastRenderSize === renderSize) return;
    state.atlasCamera.aspect = width / height;
    state.atlasCamera.updateProjectionMatrix();
    state.atlasRenderer.setSize(width, height, false);
    state.atlasLastRenderSize = renderSize;
    state.atlasNeedsLabelUpdate = true;
    state.atlasNeedsRender = true;
  }

  function updateAtlasLabels(force = false) {
    if (!state.atlasRenderer || state.viewMode !== "atlas" || !dynamicDom.atlasNodes) return;
    const now = performance.now();
    if (!force && !state.atlasNeedsLabelUpdate && now - state.atlasLastLabelUpdate < 90) return;
    const width = dynamicDom.atlasNodes.clientWidth || 1;
    const height = dynamicDom.atlasNodes.clientHeight || 1;
    const cameraVector = state.atlasCamera.position.clone().normalize();
    const projected = [];
    const cityProjected = [];
    state.atlasGroup.updateMatrixWorld(true);
    state.atlasCityLabelEntries.forEach((entry) => {
      const { anchor, element } = entry;
      if (!anchor || !element) return;
      const world = anchor.clone().applyMatrix4(state.atlasGroup.matrixWorld);
      const normal = anchor.clone().normalize().applyQuaternion(state.atlasGroup.quaternion);
      const screen = world.clone().project(state.atlasCamera);
      const front = normal.dot(cameraVector) > -0.04;
      const x = (screen.x * 0.5 + 0.5) * width;
      const y = (-screen.y * 0.5 + 0.5) * height;
      const rect = {
        left: x - 54,
        right: x + 54,
        top: y - 12,
        bottom: y + 18,
      };
      cityProjected.push({ ...entry, front, x, y, rect, priority: 900 + entry.entries.length * 24 + entry.heat });
    });

    state.atlasLabelEntries.forEach((entry) => {
      const { item, anchor, element } = entry;
      if (!anchor || !element) return;
      const world = anchor.clone().applyMatrix4(state.atlasGroup.matrixWorld);
      const normal = anchor.clone().normalize().applyQuaternion(state.atlasGroup.quaternion);
      const screen = world.clone().project(state.atlasCamera);
      const focus = item.id === state.constellationId || item.id === state.selectedId || item.id === state.searchHitId;
      const front = normal.dot(cameraVector) > -0.08;
      const offset = entry.labelOffset || { x: 0, y: 0 };
      const x = (screen.x * 0.5 + 0.5) * width + offset.x;
      const y = (-screen.y * 0.5 + 0.5) * height + offset.y;
      const labelWidth = clampNumber(44 + String(item.name || "").length * 4.7, 72, focus ? 150 : 112);
      const rect = {
        left: x - labelWidth / 2,
        right: x + labelWidth / 2,
        top: y - 14,
        bottom: y + 22,
      };
      projected.push({ item, element, focus, front, x, y, rect, priority: labelPriority(item, focus) });
    });

    const placed = [];
    const constellationIds = constellationRelatedIds();
    cityProjected
      .sort((a, b) => b.priority - a.priority || a.city.localeCompare(b.city))
      .forEach((entry) => {
        const inside = entry.x >= -40 && entry.x <= width + 40 && entry.y >= -40 && entry.y <= height + 40;
        const overlaps = placed.some((placedEntry) => rectsOverlap(entry.rect, placedEntry.rect, 8));
        const visible = entry.front && inside && !overlaps;
        entry.element.style.left = `${entry.x}px`;
        entry.element.style.top = `${entry.y}px`;
        entry.element.style.zIndex = String(Math.round(entry.priority / 20));
        entry.element.classList.toggle("is-visible", visible);
        entry.element.classList.toggle("is-rear", !entry.front);
        if (visible) placed.push(entry);
      });

    projected
      .sort((a, b) => b.priority - a.priority || b.item.heat - a.item.heat || a.item.name.localeCompare(b.item.name))
      .forEach((entry) => {
        const focus = entry.focus || constellationIds.has(entry.item.id);
        const inside = entry.x >= -40 && entry.x <= width + 40 && entry.y >= -40 && entry.y <= height + 40;
        const overlaps = !focus && placed.some((placedEntry) => rectsOverlap(entry.rect, placedEntry.rect, 7));
        const alwaysShowKind = entry.item.kind === "company" || entry.item.kind === "achievement";
        const visible = entry.front && inside && (!overlaps || focus || alwaysShowKind && placed.length < 14);
        entry.element.style.left = `${entry.x}px`;
        entry.element.style.top = `${entry.y}px`;
        entry.element.style.zIndex = String(focus ? 60 : Math.round(entry.priority / 16));
        entry.element.classList.toggle("is-visible", visible);
        entry.element.classList.toggle("is-focus", focus);
        entry.element.classList.toggle("is-rear", !entry.front);
        if (visible) placed.push(entry);
      });
    state.atlasNeedsLabelUpdate = false;
    state.atlasLastLabelUpdate = now;
  }

  function globePosition(location, radius = GLOBE_RADIUS) {
    const lat = THREE.MathUtils.degToRad(location.lat);
    const lon = THREE.MathUtils.degToRad(location.lon);
    const phi = Math.PI / 2 - lat;
    const theta = lon + Math.PI;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function spreadGlobeAnchor(location, spread, radius) {
    const base = globePosition(location, radius);
    if (!spread.x && !spread.y) return base;
    const normal = base.clone().normalize();
    const east = new THREE.Vector3(-normal.z, 0, normal.x);
    if (east.lengthSq() < 0.0001) east.set(1, 0, 0);
    east.normalize();
    const north = new THREE.Vector3().crossVectors(normal, east).normalize();
    return base
      .clone()
      .add(east.multiplyScalar(spread.x * 0.35))
      .add(north.multiplyScalar(spread.y * 0.35))
      .normalize()
      .multiplyScalar(radius);
  }

  function handleAtlasClick(event) {
    const cityTarget = event.target.closest("[data-city]");
    if (cityTarget) {
      event.stopPropagation();
      focusAtlasCity(cityTarget.dataset.city || "");
      return;
    }
    const target = event.target.closest("[data-target]");
    if (!target) return;
    event.stopPropagation();
    const item = state.itemById.get(target.dataset.target);
    if (!item) return;
    activateItem(item);
  }

  function handleAtlasCityRailClick(event) {
    const target = event.target.closest("[data-city]");
    if (!target) return;
    event.stopPropagation();
    focusAtlasCity(target.dataset.city || "");
  }

  function focusAtlasCity(cityName) {
    state.atlasFocusCity = cityName || null;
    state.constellationId = null;
    state.selectedId = null;
    state.searchHitId = null;
    dom.infoCard.hidden = true;
    if (state.atlasFocusCity) {
      const entry = state.atlasCityEntries.find((city) => city.city === state.atlasFocusCity);
      if (entry) state.atlasControls?.focusLocation(entry.location);
    }
    renderAtlas();
  }

  function handleAtlasStageClick(event) {
    if (state.viewMode !== "atlas" || event.target.closest("[data-target]") || event.target.closest("[data-city]") || !state.atlasRenderer) return;
    if (state.atlasControls?.shouldIgnoreClick?.()) return;
    const rect = state.atlasRenderer.domElement.getBoundingClientRect();
    state.atlasPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.atlasPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    if (!state.atlasRaycaster) state.atlasRaycaster = new THREE.Raycaster();
    state.atlasRaycaster.setFromCamera(state.atlasPointer, state.atlasCamera);
    const intersections = state.atlasRaycaster.intersectObjects(Array.from(state.atlasNodeMeshes.values()), false);
    const cameraVector = state.atlasCamera.position.clone().normalize();
    const frontHit = intersections.find((hit) => {
      const normal = hit.object.position.clone().normalize().applyQuaternion(state.atlasGroup.quaternion);
      return hit.object?.userData?.itemId && normal.dot(cameraVector) > -0.08;
    });
    const itemId = frontHit?.object?.userData?.itemId;
    if (!itemId) return;
    const item = state.itemById.get(itemId);
    if (item) activateItem(item);
  }

  function projectGeo(location) {
    return {
      x: ((location.lon + 180) / 360) * 100,
      y: ((90 - location.lat) / 180) * 100,
    };
  }

  function atlasSpread(index, total) {
    if (total <= 1) return { x: 0, y: 0 };
    const radius = Math.min(108, 24 + total * 7.4);
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  function atlasNodeSize(item) {
    const base = item.kind === "company" ? 15 : item.kind === "achievement" ? 14 : item.kind === "person" ? 12 : 10;
    return Math.round(base + Math.max(0, Math.min(100, item.heat || 50)) / 18);
  }

  function kindRank(kind) {
    return { company: 0, achievement: 1, person: 2, concept: 3 }[kind] ?? 4;
  }

  function geoLocationFor(item) {
    if (!item) return null;
    if (GEO_LOCATIONS[item.id]) return GEO_LOCATIONS[item.id];
    if (item.kind === "company") return geoFromHeadquarters(item.headquarters);
    if (item.kind === "achievement") {
      const byConcept = (item.concepts || []).map((id) => GEO_LOCATIONS[id]).find(Boolean);
      if (byConcept) return byConcept;
    }
    return null;
  }

  function geoFromHeadquarters(value = "") {
    const text = String(value).toLowerCase();
    if (text.includes("旧金山") || text.includes("san francisco")) return GEO_LOCATIONS.openai;
    if (text.includes("伦敦") || text.includes("london")) return GEO_LOCATIONS["google-deepmind"];
    if (text.includes("山景") || text.includes("mountain view")) return GEO_LOCATIONS.transformer;
    if (text.includes("门洛") || text.includes("menlo")) return GEO_LOCATIONS["meta-ai"];
    if (text.includes("上海") || text.includes("shanghai")) return GEO_LOCATIONS.minimax;
    if (text.includes("北京") || text.includes("beijing")) return GEO_LOCATIONS["moonshot-ai"];
    if (text.includes("杭州") || text.includes("hangzhou")) return GEO_LOCATIONS.deepseek;
    if (text.includes("巴黎") || text.includes("paris")) return GEO_LOCATIONS["mistral-ai"];
    if (text.includes("多伦多") || text.includes("toronto")) return GEO_LOCATIONS.cohere;
    return null;
  }

  function handlePointerMove(event) {
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
  }

  function updateChronicle() {
    dom.chronicleYear.textContent = String(state.selectedYear);
    const events = state.chronology.filter((event) => Number(event.year) <= state.selectedYear);
    const latest = events[events.length - 1];
    dom.chronicleEvent.textContent = latest
      ? `${latest.year} · ${latest.title}：${latest.summary}`
      : "拖动时间，查看概念、公司和人物如何逐步出现。";
  }

  function handleSearchInput() {
    const query = dom.search.value.trim().toLowerCase();
    if (!query) {
      state.searchHitId = null;
      applyFilters();
      return;
    }
    const exact = state.items.find((item) => item.name.toLowerCase() === query || item.id.toLowerCase() === query || (item.aliases || []).some((alias) => String(alias).toLowerCase() === query));
    const fuzzy = state.items.find((item) => searchableText(item).includes(query) || (item.aliases || []).some((alias) => query.includes(String(alias).toLowerCase())));
    const item = exact || fuzzy;
    if (!item) return;
    if (item.year > state.selectedYear) {
      state.selectedYear = item.year;
      dom.timeline.value = String(item.year);
    }
    state.activeTypes.add(item.kind);
    if (item.kind === "concept") state.activeCategories.add(item.category);
    buildControls();
    state.searchHitId = item.id;
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
    applyFilters();
  }

  function closeInfoCard() {
    state.selectedId = null;
    dom.infoCard.hidden = true;
    applyFilters();
  }

  function renderArchiveNotes(item) {
    if (!dynamicDom.archiveSection) return;
    dynamicDom.archiveSection.hidden = false;
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
      rows.push(["星体类型", "关键AI成就恒星"]);
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
    openInfoCard(item);
    focusOnItem(item);
    applyFilters();
  }

  function renderReferences(item) {
    const references = item.references || [];
    dom.cardLinks.innerHTML = references
      .map((reference) => `<a href="${reference.url}" target="_blank" rel="noreferrer">${escapeHtml(reference.label)}</a>`)
      .join("");
  }

  function focusOnItem(item) {
    if (state.viewMode === "atlas") {
      focusAtlasOnItem(item);
      return;
    }
    const position = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
    const direction = position.clone().normalize().multiplyScalar(115);
    const targetCamera = position.clone().add(new THREE.Vector3(direction.x || 95, 76, direction.z || 160));
    animateCamera(targetCamera, position, 850);
  }

  function focusAtlasOnItem(item) {
    ensureAtlasGlobe();
    const location = geoLocationFor(item);
    if (!location || !state.atlasControls) return;
    state.atlasControls.focusLocation(location);
    updateAtlasLabels(true);
  }

  function resetView() {
    state.searchHitId = null;
    state.constellationId = null;
    state.atlasFocusCity = null;
    stopChroniclePlay();
    dom.search.value = "";
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
    state.renderer.setSize(state.width, state.height);
    resizeAtlasGlobe();
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

  function createAtlasGlobeControls(element, group, camera) {
    const goal = {
      x: group.rotation.x,
      y: group.rotation.y,
      distance: camera.position.z,
    };
    const current = { ...goal };
    const pointerStart = { x: 0, y: 0 };
    let dragging = false;
    let moved = false;
    let ignoreClickUntil = 0;
    const controls = {
      update,
      focusLocation,
      shouldIgnoreClick: () => performance.now() < ignoreClickUntil,
      isDragging: () => dragging,
    };

    element.addEventListener("pointerdown", (event) => {
      if (event.target.closest("[data-target], [data-city], .atlas-meta, .atlas-city-rail")) return;
      dragging = true;
      moved = false;
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
      element.setPointerCapture?.(event.pointerId);
    });

    element.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      goal.y += dx * 0.0062;
      goal.x = clampNumber(goal.x + dy * 0.0048, -0.72, 0.72);
      state.atlasNeedsLabelUpdate = true;
      state.atlasNeedsRender = true;
    });

    element.addEventListener("pointerup", (event) => {
      dragging = false;
      if (moved) ignoreClickUntil = performance.now() + 180;
      element.releasePointerCapture?.(event.pointerId);
    });

    element.addEventListener("pointercancel", () => {
      dragging = false;
    });

    element.addEventListener("wheel", (event) => {
      if (state.viewMode !== "atlas") return;
      event.preventDefault();
      goal.distance = clampNumber(goal.distance * Math.exp(event.deltaY * 0.001), 255, 620);
      state.atlasNeedsLabelUpdate = true;
      state.atlasNeedsRender = true;
    }, { passive: false });

    function update() {
      const beforeX = current.x;
      const beforeY = current.y;
      const beforeDistance = current.distance;
      current.x += (goal.x - current.x) * 0.085;
      current.y += (goal.y - current.y) * 0.085;
      current.distance += (goal.distance - current.distance) * 0.085;
      group.rotation.x = current.x;
      group.rotation.y = current.y;
      camera.position.z = current.distance;
      camera.lookAt(0, 0, 0);
      return Math.abs(current.x - beforeX) > 0.0002 || Math.abs(current.y - beforeY) > 0.0002 || Math.abs(current.distance - beforeDistance) > 0.02;
    }

    function focusLocation(location) {
      const point = globePosition(location, GLOBE_RADIUS);
      let nextY = Math.atan2(-point.x, point.z);
      while (nextY - goal.y > Math.PI) nextY -= Math.PI * 2;
      while (nextY - goal.y < -Math.PI) nextY += Math.PI * 2;
      goal.y = nextY;
      goal.x = clampNumber(THREE.MathUtils.degToRad(location.lat * 0.34), -0.58, 0.58);
      goal.distance = 360;
      state.atlasNeedsLabelUpdate = true;
      state.atlasNeedsRender = true;
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

  function animate() {
    requestAnimationFrame(animate);
    if (state.viewMode === "atlas") {
      animateAtlasGlobe();
      return;
    }
    state.galaxy.rotation.y += 0.00058;
    state.controls.update();
    state.galaxy.children.forEach((child) => {
      if (child.userData?.follows) {
        child.position.copy(child.userData.follows.position);
        if (child.geometry?.type === "RingGeometry") child.lookAt(state.camera.position);
        if (child.userData.starburst && child.material) child.material.rotation += 0.0016;
      }
      if (child.userData?.coreRing) {
        child.rotation.z += 0.00035;
      }
      if (child.userData?.mist) {
        child.rotation.y += 0.00012;
      }
    });
    updateLabels();
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

  function clearGroup(group) {
    while (group.children.length) {
      const child = group.children.pop();
      child.geometry?.dispose?.();
      child.material?.dispose?.();
    }
    dom.labelLayer.innerHTML = "";
  }

  function clearThreeGroup(group) {
    if (!group) return;
    while (group.children.length) {
      const child = group.children.pop();
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose?.());
      } else {
        child.material?.dispose?.();
      }
    }
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

  let cachedGeneratedEarth = null;
  function generatedEarthTexture() {
    if (cachedGeneratedEarth) return cachedGeneratedEarth;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
    ocean.addColorStop(0, "#102845");
    ocean.addColorStop(0.48, "#0c1d35");
    ocean.addColorStop(1, "#061222");
    context.fillStyle = ocean;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(121, 223, 193, 0.42)";
    [
      [170, 164, 210, 86],
      [250, 292, 118, 176],
      [492, 162, 130, 78],
      [548, 264, 112, 170],
      [730, 178, 250, 96],
      [850, 360, 94, 54],
    ].forEach(([x, y, w, h]) => {
      context.beginPath();
      context.ellipse(x, y, w, h, 0.1, 0, Math.PI * 2);
      context.fill();
    });
    context.strokeStyle = "rgba(214, 226, 255, 0.16)";
    context.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 64) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
    cachedGeneratedEarth = new THREE.CanvasTexture(canvas);
    cachedGeneratedEarth.colorSpace = THREE.SRGBColorSpace;
    return cachedGeneratedEarth;
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
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(760, Math.floor(window.innerWidth / 2.2)) }, (_, index) => {
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
      dust = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 7)) }, (_, index) => {
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
      meteors = Array.from({ length: 9 }, (_, index) => {
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
      ships = Array.from({ length: 4 }, (_, index) => {
        const hash = stableHash(`ship-${index}-${window.innerWidth}`);
        return {
          x: (hash % window.innerWidth),
          y: ((hash >>> 8) % window.innerHeight),
          scale: 0.72 + ((hash >>> 15) % 70) / 100,
          drift: 0.006 + ((hash >>> 22) % 15) / 1000,
          phase: (hash % 628) / 100,
        };
      });
    }
    function draw(time) {
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
        const alpha = (star.bright ? 0.34 : 0.16) + Math.sin(time * star.speed * 0.01 + star.phase) * (star.bright ? 0.18 : 0.09);
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
        const alpha = 0.05 + Math.sin(time * 0.0008 + ship.phase) * 0.025;
        context.save();
        context.translate(ship.x + driftX, ship.y + driftY);
        context.rotate(Math.sin(ship.phase) * 0.9);
        context.scale(ship.scale, ship.scale);
        context.globalAlpha = Math.max(0.02, alpha);
        context.fillStyle = "rgba(220,235,255,0.75)";
        context.strokeStyle = "rgba(116,192,252,0.68)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, -7);
        context.lineTo(18, 0);
        context.lineTo(0, 7);
        context.lineTo(4, 0);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
      }
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
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
