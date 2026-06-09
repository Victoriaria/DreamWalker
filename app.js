"use strict";

const STORAGE_PREFIX = "dreamwalker:data:";
const CURRENT_TRAVELER_KEY = "dreamwalker:currentTraveler";
const MAX_FRAGMENT_LENGTH = 1200;
const MAX_AFTERWORD_LENGTH = 600;
const MOCK_SPEECH_TEXT = "我梦见自己站在海边，天空是红色的，远处有人一直没有回头。";

const EMOTIONS = [
  { id: "安静", color: "#182b55", tone: "深夜蓝" },
  { id: "温暖", color: "#e9bf74", tone: "暖金" },
  { id: "不安", color: "#7d2634", tone: "暗红" },
  { id: "漂浮", color: "#2d4f84", tone: "深夜蓝" },
  { id: "思念", color: "#8b6eb4", tone: "雾紫" },
  { id: "清醒", color: "#54a8c7", tone: "青蓝" },
  { id: "迷路", color: "#6e5aa8", tone: "雾紫" },
  { id: "释然", color: "#d5a65d", tone: "暖金" },
  { id: "治愈", color: "#4c9b84", tone: "海绿" },
  { id: "恐惧", color: "#6d1f2f", tone: "暗红" },
  { id: "荒诞", color: "#9a8f9f", tone: "银灰" },
  { id: "孤独", color: "#8c96a3", tone: "银灰" },
  { id: "亲密", color: "#d58aa8", tone: "玫瑰粉" },
  { id: "自由", color: "#58a5b8", tone: "青蓝" },
];

const BODY_FEELINGS = ["胸口发紧", "身体很轻", "手心发热", "喉咙堵住", "脚步沉", "像在下坠", "被风托着", "眼眶酸"];

const ATMOSPHERES = [
  { id: "深夜蓝", color: "#081120", emotions: ["安静", "漂浮"] },
  { id: "雾紫", color: "#6e5aa8", emotions: ["迷茫", "思念", "迷路"] },
  { id: "暖金", color: "#e9bf74", emotions: ["温暖", "释然"] },
  { id: "暗红", color: "#7d2634", emotions: ["不安", "恐惧"] },
  { id: "海绿", color: "#4c9b84", emotions: ["治愈", "流动", "靠近自然"] },
  { id: "青蓝", color: "#54a8c7", emotions: ["清醒", "雨", "水", "海"] },
  { id: "玫瑰粉", color: "#d58aa8", emotions: ["亲密", "柔软", "怀念"] },
  { id: "银灰", color: "#9a8f9f", emotions: ["空白", "失真", "雾", "忘记", "孤独", "荒诞"] },
  { id: "森林绿", color: "#3f7d58", emotions: ["森林", "草地", "生命感"] },
  { id: "橙光", color: "#e28a45", emotions: ["日出", "希望", "被照亮"] },
];

const SYMBOLS = ["海", "月亮", "门", "桥", "云", "雾", "星", "河", "灯", "房间", "森林", "列车", "雨", "镜子", "楼梯", "花", "船", "窗", "红伞", "钟", "鱼", "白鸟", "信", "影子", "纸片", "图书馆", "书", "书架", "未来"];
const PEOPLE = ["妈妈", "父亲", "爸爸", "朋友", "同学", "老师", "恋人", "孩子", "陌生人", "自己", "她", "他", "他们"];
const PLACES = ["家", "学校", "车站", "海边", "城市", "走廊", "房间", "山", "桥", "街道", "医院", "机场", "电梯", "森林", "旧楼", "站台", "天台", "码头", "沙滩", "图书馆", "云层", "书架"];
const PRESET_DREAMS = {
  记忆鲸落: {
    key: "记忆鲸落",
    title: "记忆鲸落",
    fragments: [
      "整个世界是倒过来的，海洋悬挂在天空，天空沉在脚下。",
      "一头透明鲸鱼从天空中的海缓慢坠落。",
      "它的身体由老照片、信件、童年玩具和泛黄车票组成。",
      "每掉落一块鳞片，就变成一段回忆散进宇宙。",
      "海边站着一个很小的人影，试图接住那些正在消失的记忆。",
      "最后，鲸鱼化成漫天光尘，像一场没来得及说完的告别。",
    ],
    emotion: "思念",
    intensity: 9,
    body: ["胸口发紧", "脚步沉", "喉咙堵住"],
    customBody: "未完成的告别",
    atmosphere: "暗红",
    feedback: "有些人离开了现实，却一直住在梦里。",
    afterwordTitle: "把没说完的话留在这里",
    afterwordQuestion: "如果还有一句没来得及说的话，你愿意把它留在这里吗？",
    imageCount: 4,
  },
  月亮图书馆: {
    key: "月亮图书馆",
    title: "月亮图书馆",
    fragments: [
      "我走进一座藏在月亮内部的图书馆，拱门后透出安静的月光。",
      "每一本书都记录着某一天。",
      "当我翻开一本旧书，小时候的自己从书页里跑出来。",
      "他拉着我的手，带我穿过无数发光的书架。",
      "最后他把一本空白的梦之书交给我，封面写着：未来。",
    ],
    emotion: "治愈",
    intensity: 7,
    body: ["身体很轻", "被风托着"],
    customBody: "像被云层托住",
    atmosphere: "青蓝",
    feedback: "你怀念的过去，其实一直在等你回来看看。",
    afterwordTitle: "写给过去的自己",
    afterwordQuestion: "今天的你，想对小时候的自己说什么？",
    imageCount: 6,
  },
};
const PRESET_DREAM = PRESET_DREAMS.记忆鲸落;
const PRESET_ASSETS = {
  记忆鲸落: Array.from({ length: 6 }, (_, index) => `./product-assets/memory-whale-${String(index + 1).padStart(2, "0")}.png`),
  月亮图书馆: Array.from({ length: 6 }, (_, index) => `./product-assets/moon-library-${String(index + 1).padStart(2, "0")}.png`),
};
const DREAM_WORLD_META = {
  记忆鲸落: {
    afterwordTitle: "把没说完的话留在这里",
    afterwordQuestion: "如果还有一句没来得及说的话，你愿意把它留在这里吗？",
    feedback: "有些人离开了现实，却一直住在梦里。",
    atmosphere: "暗红",
  },
  月亮图书馆: {
    afterwordTitle: "写给过去的自己",
    afterwordQuestion: "今天的你，想对过去的自己说什么？",
    feedback: "你怀念的过去，其实一直在等你回来看看。",
    atmosphere: "青蓝",
  },
  时间列车: {
    afterwordTitle: "写给错过的站台",
    afterwordQuestion: "如果能在某一站停下，你想把哪句话交给那时的自己？",
    feedback: "时间没有真的把你丢下，它只是把一些答案放在下一站。",
    atmosphere: "银灰",
  },
  遗忘花园: {
    afterwordTitle: "把旧事种回花园",
    afterwordQuestion: "有什么终于可以轻轻放下，留给这座花园替你保存？",
    feedback: "有些旧事会淡去，不是消失，而是变成不再刺痛的花。",
    atmosphere: "海绿",
  },
};

const app = document.querySelector("#app");
const travelerSwitch = document.querySelector("#travelerSwitch");
const ambientCanvas = document.querySelector("#ambientCanvas");

let state = {
  traveler: localStorage.getItem(CURRENT_TRAVELER_KEY) || "",
  dreams: [],
  draft: null,
  selectedDate: formatDate(new Date()),
  calendarCursor: new Date(),
  playback: { index: 0, playing: false, timer: null },
  soundscape: { enabled: false, context: null, nodes: [], timer: null, dreamId: "" },
  recognition: null,
  listeningFragmentId: null,
  lastSavedDreamId: "",
  galleryFilter: "全部",
};

boot();

function boot() {
  drawAmbient();
  window.addEventListener("resize", drawAmbient);
  travelerSwitch.addEventListener("click", () => renderHome(true));
  document.body.addEventListener("click", handleGlobalClick);
  window.addEventListener("hashchange", renderRoute);
  if (state.traveler) loadDreams();
  renderRoute();
}

function handleGlobalClick(event) {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    go(routeButton.dataset.route);
  }
}

function renderRoute() {
  const raw = location.hash.replace("#", "") || "home";
  const [route, id] = raw.split(":");
  stopPlayback();
  if (route !== "playback") stopSoundscape(true);
  updateNav(route);

  if (!state.traveler && route !== "home") {
    renderHome();
    return;
  }

  if (route === "capture") renderCapture();
  else if (route === "result") renderResult();
  else if (route === "playback") renderPlayback(id || state.draft?.id);
  else if (route === "calendar") renderCalendar();
  else if (route === "detail") renderDetail(id);
  else if (route === "gallery") renderGallery();
  else renderHome();
}

function updateNav(route) {
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === route);
  });
  travelerSwitch.innerHTML = `${icon("user")}<span>${state.traveler ? `旅人：${escapeHtml(state.traveler)}` : "设置旅人名"}</span>`;
}

function go(route) {
  location.hash = route;
}

function renderHome(forcePrompt = false) {
  const hasTraveler = Boolean(state.traveler) && !forcePrompt;
  const recentDreams = hasTraveler ? sortedDreams().slice(0, 3) : [];
  app.innerHTML = `
    <section class="home-hero">
      <div class="hero-copy">
        <h1><span class="hero-title-cn">巡梦舱</span><span class="hero-title-en">DreamWalker</span></h1>
        <p class="hero-slogan">每个梦，都值得被再次走过。</p>
        <p class="hero-subcopy">所有梦，都会在月亮深处变成一本书。</p>
        <div class="hero-actions">
          ${hasTraveler ? `<button class="primary-button" id="startCapture">${icon("sparkles")}<span>写下一页梦</span></button>` : ""}
        </div>
        ${hasTraveler ? "" : travelerForm()}
      </div>
      <div class="dream-orb">
        <canvas id="homeDreamCanvas" aria-hidden="true"></canvas>
        <div class="orb-caption">${hasTraveler ? `欢迎回来，${escapeHtml(state.traveler)}。月亮图书馆正在为你留灯。` : "月亮深处的馆门已经亮起。留下一个名字，就能拥有自己的梦之书架。"}</div>
      </div>
    </section>
    ${hasTraveler ? `
      <section class="home-entrances" aria-label="巡梦舱入口">
        ${entranceCards()}
        <div class="ability-pills" aria-label="巡梦舱能力">
          ${abilityPill("mic", "语音捕捉")}
          ${abilityPill("wand", "生成梦之书")}
          ${abilityPill("palette", "情绪安放")}
          ${abilityPill("calendar", "月相回看")}
        </div>
      </section>
    ` : ""}
    <section class="home-memory">
      ${recentDreams.length ? recentDreamsSection(recentDreams) : emptyHomeMemory(hasTraveler)}
    </section>
    <section class="guide-dock">
      <details>
        <summary>${icon("sparkles")}<span>使用指引</span></summary>
        <ol>
          <li>输入旅人名</li>
          <li>选择一本推荐梦之书</li>
          <li>生成梦之书</li>
          <li>进入回放</li>
          <li>把话留在最后一页</li>
        </ol>
      </details>
    </section>
  `;

  requestAnimationFrame(() => {
    drawDreamVisual(document.querySelector("#homeDreamCanvas"), {
      color: "#9b88d2",
      mood: "漂浮",
      symbols: ["月亮", "海", "门", "桥", "云"],
      elements: ["moonStars", "doorRoom", "water", "bridgePath", "person"],
      sceneRole: "cover",
    });
    document.querySelectorAll(".recent-book-card").forEach((card) => {
      const dream = getDream(card.dataset.id);
      const canvas = card.querySelector("canvas");
      if (dream && canvas && !canvas.hidden) drawDreamVisual(canvas, coverVisualForDream(dream));
    });
  });

  document.querySelector("#travelerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#travelerName");
    const name = input.value.trim().slice(0, 28);
    if (!name) {
      showInlineError("travelerError", "请先留下一个梦境旅人名。");
      return;
    }
    state.traveler = name;
    try {
      localStorage.setItem(CURRENT_TRAVELER_KEY, name);
    } catch {
      showInlineError("travelerError", "当前浏览器无法写入本地存储，梦境可能无法在刷新后保留。");
      return;
    }
    loadDreams();
    go("capture");
  });

  document.querySelector("#startCapture")?.addEventListener("click", () => go("capture"));
  document.querySelectorAll(".preset-fill").forEach((button) => button.addEventListener("click", () => {
    applyPresetDraft(button.dataset.presetKey);
    go("capture");
  }));
  document.querySelector(".home-memory")?.addEventListener("click", (event) => {
    const card = event.target.closest(".recent-book-card");
    if (!card) return;
    const dream = getDream(card.dataset.id);
    if (!dream) return;
    if (event.target.closest(".home-replay-card")) {
      state.playback.index = 0;
      go(`playback:${dream.id}`);
      return;
    }
    go(`detail:${dream.id}`);
  });
  document.querySelectorAll(".recent-book-card img").forEach((img) => {
    img.addEventListener("error", (event) => {
      const card = event.currentTarget.closest(".recent-book-card");
      const dream = getDream(card?.dataset.id);
      const canvas = card?.querySelector("canvas");
      event.currentTarget.hidden = true;
      if (canvas && dream) {
        canvas.hidden = false;
        drawDreamVisual(canvas, coverVisualForDream(dream));
      }
    });
  });
}

function abilityPill(iconName, title) {
  return `
    <span class="ability-pill">${icon(iconName)}<span>${title}</span></span>
  `;
}

function entranceCards() {
  return `
    <div class="entrance-cards">
      ${entranceCard("waves", "记忆鲸落", "思念、失去、告别", "进入此梦", "记忆鲸落")}
      ${entranceCard("book", "月亮图书馆", "治愈、怀念、成长", "进入此梦", "月亮图书馆")}
      <article class="entrance-card">
        <span class="entrance-symbol">${icon("gallery")}</span>
        <div>
          <h3>梦之书架</h3>
          <p>回看已保存的梦</p>
        </div>
        <button class="ghost-button" data-route="gallery" type="button">${icon("gallery")}<span>打开书架</span></button>
      </article>
    </div>
  `;
}

function entranceCard(iconName, title, body, buttonText, key) {
  return `
    <article class="entrance-card">
      <span class="entrance-symbol">${icon(iconName)}</span>
      <div>
        <h3>${title}</h3>
        <p>${body}</p>
      </div>
      <button class="ghost-button preset-fill" data-preset-key="${escapeAttr(key)}" type="button">${icon("sparkles")}<span>${buttonText}</span></button>
    </article>
  `;
}

function recentDreamsSection(dreams) {
  const coverUrls = coverImagesForDreamList(dreams);
  return `
    <div class="home-memory-head">
      <div>
        <p class="scene-kicker library-kicker">${icon("moonBook")}<span>月亮图书馆</span></p>
        <h2>最近亮起的梦之书</h2>
      </div>
      <button class="ghost-button" data-route="gallery" type="button">${icon("gallery")}<span>查看梦之书</span></button>
    </div>
    <div class="recent-books-row">
      ${dreams.map((dream, index) => recentBookCard(dream, coverUrls[index])).join("")}
    </div>
  `;
}

function recentBookCard(dream, assignedCoverUrl = "") {
  const coverUrl = assignedCoverUrl || coverImageForDream(dream);
  const remoteCover = Boolean(coverUrl);
  const afterword = dream.afterword ? dream.afterword.slice(0, 34) : "最后一页还在等一句话。";
  return `
    <article class="recent-book-card" data-id="${escapeAttr(dream.id)}" tabindex="0" role="button">
      <div class="recent-visual">
        <img src="${escapeAttr(coverUrl)}" alt="梦之书封面" ${remoteCover ? "" : "hidden"} />
        <canvas aria-hidden="true" ${remoteCover ? "hidden" : ""}></canvas>
      </div>
      <div class="recent-copy">
        <p class="scene-kicker">${escapeHtml(dream.dreamWorld || dream.presetKey || "月亮图书馆")}</p>
        <h2>${escapeHtml(dream.title)}</h2>
        <p>${formatDateTime(dream.createdAt)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(dream.analysis.coreEmotion)}</span>
          <span class="tag">${dream.intensity}/10</span>
        </div>
        <p class="afterword-excerpt">${escapeHtml(afterword)}</p>
      </div>
      <button class="primary-button home-replay-card" type="button">${icon("play")}<span>重新打开</span></button>
    </article>
  `;
}

function emptyHomeMemory(hasTraveler) {
  return `
    <article class="home-empty-dream">
      <div class="empty-icon">${icon("planet")}</div>
      <p>这里还没有梦之书。先写下一页梦，让它在月亮图书馆里亮起来。</p>
      ${hasTraveler ? `<button class="primary-button" data-route="capture">${icon("feather")}<span>写下一页梦</span></button>` : ""}
    </article>
  `;
}

function legacyRecentDreamCard(dream, assignedCoverUrl = "") {
  const coverUrl = assignedCoverUrl || coverImageForDream(dream);
  return `
    <article class="recent-dream-card">
      <div class="recent-visual">
        <img src="${escapeAttr(coverUrl)}" alt="梦境主视觉" ${coverUrl ? "" : "hidden"} />
        <canvas aria-hidden="true" ${coverUrl ? "hidden" : ""}></canvas>
      </div>
      <div class="recent-copy">
        <p class="scene-kicker">最近亮起的梦之书</p>
        <h2>${escapeHtml(dream.title)}</h2>
        <p>${formatDateTime(dream.createdAt)} · ${escapeHtml(dream.analysis.coreEmotion)} · ${dream.intensity}/10</p>
        <div class="tag-row">
          ${(dream.analysis.symbols || []).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <button class="primary-button" type="button">${icon("play")}<span>重新打开</span></button>
    </article>
  `;
}

function travelerForm() {
  return `
    <section class="traveler-entry panel">
      <form id="travelerForm" class="stack">
        <div class="identity-header">
          <p class="scene-kicker">${icon("user")}<span>旅人身份 / 梦境舱身份</span></p>
          <h2>今晚，以谁的名字入梦？</h2>
        </div>
        <div class="field">
          <label for="travelerName">旅人名</label>
          <input id="travelerName" maxlength="28" placeholder="例如：夜航者、Wendy、小月亮" autocomplete="off" />
        </div>
        <p id="travelerError" class="error-box" hidden></p>
        <button class="primary-button" type="submit">${icon("sparkles")}<span>进入月亮图书馆</span></button>
        <p class="field-note">不同旅人名会保存到独立梦境空间。</p>
      </form>
    </section>
  `;
}

function renderCapture() {
  const speechSupported = getSpeechCtor() !== null;
  const draft = state.draft || createEmptyDraft();
  if (!Array.isArray(draft.fragments) || !draft.fragments.length) {
    draft.fragments = [{ id: cryptoId(), text: "" }];
  }
  state.draft = draft;

  app.innerHTML = `
    <div class="page-title">
      <div>
        <h2>写下一页梦</h2>
        <p>放下昨夜还发亮的碎片，标记醒来后残留的感觉。</p>
      </div>
      <button class="ghost-button" id="clearDraft">${icon("trash")}<span>清空本次</span></button>
    </div>
    <section class="capture-ritual">
      <span>1 写下梦境碎片</span>
      <span>2 标记情绪</span>
      <span>3 生成梦之书</span>
    </section>
    <div class="capture-grid">
      <section class="stack">
        <div class="field">
          <label for="dreamTitle">梦境名</label>
          <input id="dreamTitle" maxlength="40" value="${escapeAttr(draft.title)}" placeholder="留空也可以，巡梦会替你取名" />
        </div>
        <div class="fragment-section-head">
          <p class="group-label">${icon("feather")}<span>梦境碎片</span></p>
          <span>${draft.fragments.length} 个碎片</span>
        </div>
        <div class="stack" id="fragments"></div>
        <div class="toolbar">
          <button class="ghost-button" id="addFragment" type="button">${icon("plus")}<span>添加碎片</span></button>
          <button class="ghost-button" id="speechHelp" type="button">${icon("mic")}<span>${speechSupported ? "语音可用" : "语音不可用"}</span></button>
        </div>
        <p id="captureError" class="error-box" hidden></p>
      </section>
      <section class="stack">
        <div class="preset-samples">
          <p class="group-label">${icon("sparkles")}<span>梦之书入口</span></p>
          <div class="sample-buttons">
            <article class="sample-card">
              <strong>记忆鲸落</strong>
              <span>适合思念、失去、告别的梦。</span>
              <button class="ghost-button preset-fill" data-preset-key="记忆鲸落" type="button">${icon("waves")}<span>进入记忆鲸落</span></button>
            </article>
            <article class="sample-card">
              <strong>月亮图书馆</strong>
              <span>适合治愈、怀念、成长的梦。</span>
              <button class="ghost-button preset-fill" data-preset-key="月亮图书馆" type="button">${icon("book")}<span>进入月亮图书馆</span></button>
            </article>
            <article class="sample-card">
              <strong>查看梦之书</strong>
              <span>查看已经保存的梦，重新打开最后一页。</span>
              <button class="ghost-button" data-route="gallery" type="button">${icon("gallery")}<span>查看梦之书</span></button>
            </article>
          </div>
        </div>
        <div>
          <p class="group-label">${icon("heart")}<span>核心情绪</span></p>
          <div class="chip-row" id="emotionChips">
            ${EMOTIONS.map((emotion) => `<button class="chip ${draft.emotion === emotion.id ? "selected" : ""}" style="--chip:${emotion.color}" data-emotion="${emotion.id}" type="button">${emotion.id}</button>`).join("")}
          </div>
        </div>
        <div class="field">
          <label for="intensity">情绪强度 <span id="intensityValue">${draft.intensity}</span></label>
          <div class="range-line">
            <input id="intensity" type="range" min="1" max="10" value="${draft.intensity}" />
            <span>/10</span>
          </div>
        </div>
        <div>
          <p class="group-label">${icon("waves")}<span>身体感受</span></p>
          <div class="chip-row" id="bodyChips">
            ${BODY_FEELINGS.map((feeling) => `<button class="chip ${draft.body.includes(feeling) ? "selected" : ""}" data-body="${feeling}" type="button">${feeling}</button>`).join("")}
          </div>
        </div>
        <div class="field">
          <label for="customBody">其他身体感受</label>
          <input id="customBody" maxlength="42" value="${escapeAttr(draft.customBody)}" placeholder="例如：肩膀像被雨淋过" />
        </div>
        <div>
          <p class="group-label">${icon("palette")}<span>氛围色</span></p>
          <div class="swatch-row" id="atmosphereSwatches">
            ${ATMOSPHERES.map((item) => `<button class="swatch ${draft.atmosphere === item.id ? "selected" : ""}" style="--swatch:${item.color}" data-atmosphere="${item.id}" type="button">${item.id}</button>`).join("")}
          </div>
        </div>
        <div class="notice">${speechSupported ? "点击某个碎片旁的麦克风，可以把语音结果放进对应碎片。" : "这个浏览器暂时不支持 Web Speech API，你仍然可以手动输入梦境碎片。"}</div>
        <div class="notice">浏览器限制提示：如果浏览器限制麦克风权限，可点击碎片旁的“快捷语音”，仍会进入正常生成流程。</div>
        <label class="optional-cover">
          <input id="generateCoverToggle" type="checkbox" ${draft.generateCover ? "checked" : ""} />
          <span>Flux 插画增强（可选）</span>
        </label>
        <p class="muted">当前会自动生成本地梦境插画；未配置 Flux 时不影响使用。</p>
        <div class="form-actions">
          <button class="primary-button" id="generateDream" type="button">${icon("wand")}<span>生成梦之书</span></button>
          <button class="ghost-button" data-route="gallery" type="button">${icon("gallery")}<span>查看梦之书</span></button>
        </div>
      </section>
    </div>
  `;

  renderFragments();
  bindCaptureEvents();
}

function renderFragments() {
  const list = document.querySelector("#fragments");
  if (!list) return;
  if (!Array.isArray(state.draft.fragments) || !state.draft.fragments.length) {
    state.draft.fragments = [{ id: cryptoId(), text: "" }];
  }
  list.innerHTML = state.draft.fragments
    .map(
      (fragment, index) => `
        <div class="fragment" data-fragment-id="${fragment.id}">
          <div class="fragment-head">
            <strong>碎片 ${index + 1}</strong>
            <div class="toolbar">
              <button class="icon-button listen-button ${state.listeningFragmentId === fragment.id ? "is-listening" : ""}" type="button" title="语音输入" aria-label="语音输入">${icon("mic")}</button>
              <button class="ghost-button mock-speech-button" type="button" title="填入语音片段">${icon("waves")}<span>快捷语音</span></button>
              <button class="icon-button remove-fragment" type="button" title="删除碎片" aria-label="删除碎片">${icon("trash")}</button>
            </div>
          </div>
          <textarea maxlength="${MAX_FRAGMENT_LENGTH}" placeholder="例如：我站在一座很长的桥上，桥下是发光的海。">${escapeHtml(fragment.text)}</textarea>
          <p class="char-hint ${fragment.text.length >= MAX_FRAGMENT_LENGTH ? "warn" : ""}">${fragment.text.length}/${MAX_FRAGMENT_LENGTH}${fragment.text.length >= MAX_FRAGMENT_LENGTH ? "，已到上限，巡梦会保留前面的内容。" : ""}</p>
        </div>
      `,
    )
    .join("");
}

function bindCaptureEvents() {
  document.querySelector("#dreamTitle").addEventListener("input", (event) => {
    state.draft.title = event.target.value.slice(0, 40);
  });
  document.querySelector("#addFragment").addEventListener("click", () => {
    const nextFragment = { id: cryptoId(), text: "" };
    state.draft.fragments.push(nextFragment);
    renderFragments();
    updateFragmentCount();
    focusFragment(nextFragment.id);
    showInlineError("captureError", "新的梦境碎片已经放好，可以继续写。", "notice");
  });
  document.querySelectorAll(".preset-fill").forEach((button) => button.addEventListener("click", () => {
    const preset = applyPresetDraft(button.dataset.presetKey, state.draft.id);
    renderCapture();
    showInlineError("captureError", `《${preset.title}》已填入。它仍会走正常生成流程，请点击“生成梦之书”。`, "notice");
  }));
  document.querySelector("#clearDraft").addEventListener("click", () => {
    state.draft = createEmptyDraft();
    renderCapture();
  });
  document.querySelector("#speechHelp").addEventListener("click", () => {
    const message = getSpeechCtor()
      ? "语音输入已准备好。点击麦克风时，浏览器可能会请求麦克风权限。"
      : "当前浏览器不支持语音输入，可继续文字记录。";
    showInlineError("captureError", message, getSpeechCtor() ? "notice" : "error-box");
  });
  document.querySelector("#fragments").addEventListener("input", (event) => {
    if (event.target.tagName !== "TEXTAREA") return;
    const item = event.target.closest(".fragment");
    const fragment = state.draft.fragments.find((entry) => entry.id === item.dataset.fragmentId);
    const nextText = event.target.value.slice(0, MAX_FRAGMENT_LENGTH);
    fragment.text = nextText;
    if (event.target.value.length >= MAX_FRAGMENT_LENGTH) {
      showInlineError("captureError", `单个碎片最多保留 ${MAX_FRAGMENT_LENGTH} 字，超出的部分会被截断。`, "notice");
    }
    const hint = item.querySelector(".char-hint");
    if (hint) {
      hint.textContent = `${nextText.length}/${MAX_FRAGMENT_LENGTH}${nextText.length >= MAX_FRAGMENT_LENGTH ? "，已到上限，巡梦会保留前面的内容。" : ""}`;
      hint.classList.toggle("warn", nextText.length >= MAX_FRAGMENT_LENGTH);
    }
  });
  document.querySelector("#fragments").addEventListener("click", (event) => {
    const item = event.target.closest(".fragment");
    if (!item) return;
    if (event.target.closest(".remove-fragment")) {
      if (state.draft.fragments.length === 1) {
        state.draft.fragments[0].text = "";
      } else {
        state.draft.fragments = state.draft.fragments.filter((entry) => entry.id !== item.dataset.fragmentId);
      }
      renderFragments();
      updateFragmentCount();
      showInlineError("captureError", "这个碎片已移开。", "notice");
    }
    if (event.target.closest(".listen-button")) startSpeechForFragment(item.dataset.fragmentId);
    if (event.target.closest(".mock-speech-button")) mockSpeechForFragment(item.dataset.fragmentId);
  });
  document.querySelector("#emotionChips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-emotion]");
    if (!button) return;
    state.draft.emotion = button.dataset.emotion;
    const emotion = EMOTIONS.find((item) => item.id === state.draft.emotion);
    if (emotion?.tone) state.draft.atmosphere = emotion.tone;
    renderCapture();
  });
  document.querySelector("#bodyChips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-body]");
    if (!button) return;
    const value = button.dataset.body;
    state.draft.body = state.draft.body.includes(value)
      ? state.draft.body.filter((item) => item !== value)
      : [...state.draft.body, value];
    renderCapture();
  });
  document.querySelector("#intensity").addEventListener("input", (event) => {
    state.draft.intensity = Number(event.target.value);
    document.querySelector("#intensityValue").textContent = state.draft.intensity;
  });
  document.querySelector("#customBody").addEventListener("input", (event) => {
    state.draft.customBody = event.target.value.slice(0, 42);
  });
  document.querySelector("#generateCoverToggle").addEventListener("change", (event) => {
    state.draft.generateCover = event.target.checked;
  });
  document.querySelector("#atmosphereSwatches").addEventListener("click", (event) => {
    const button = event.target.closest("[data-atmosphere]");
    if (!button) return;
    state.draft.atmosphere = button.dataset.atmosphere;
    renderCapture();
  });
  document.querySelector("#generateDream").addEventListener("click", generateDreamFromDraft);
}

function updateFragmentCount() {
  const count = document.querySelector(".fragment-section-head span");
  if (count) count.textContent = `${state.draft.fragments.length} 个碎片`;
}

function focusFragment(fragmentId) {
  window.setTimeout(() => {
    const selector = `[data-fragment-id="${escapeCss(fragmentId)}"]`;
    const node = document.querySelector(`${selector} textarea`);
    node?.focus();
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 0);
}

function pulseFragment(fragmentId) {
  const selector = `[data-fragment-id="${escapeCss(fragmentId)}"]`;
  const node = document.querySelector(selector);
  if (!node) return;
  node.classList.remove("just-updated");
  void node.offsetWidth;
  node.classList.add("just-updated");
}

function escapeCss(value = "") {
  return window.CSS?.escape ? CSS.escape(value) : String(value).replaceAll('"', '\\"');
}

function applyPresetDraft(key = "记忆鲸落", id = cryptoId()) {
  const preset = PRESET_DREAMS[key] || PRESET_DREAMS.记忆鲸落;
  state.draft = {
    ...createEmptyDraft(),
    id,
    title: preset.title,
    fragments: preset.fragments.map((text) => ({ id: cryptoId(), text })),
    emotion: preset.emotion,
    intensity: preset.intensity,
    body: [...preset.body],
    customBody: preset.customBody,
    atmosphere: preset.atmosphere,
    presetKey: preset.key,
    presetFeedback: preset.feedback,
    afterwordTitle: preset.afterwordTitle,
    afterwordQuestion: preset.afterwordQuestion,
    presetAssetImages: presetImagesFor(preset.key),
  };
  return preset;
}

function startSpeechForFragment(fragmentId) {
  const SpeechCtor = getSpeechCtor();
  if (!SpeechCtor) {
    showInlineError("captureError", "当前浏览器不支持语音输入，可继续文字记录，也可以使用快捷语音。");
    pulseFragment(fragmentId);
    return;
  }

  if (state.recognition) {
    state.recognition.stop();
    state.recognition = null;
  }

  const recognition = new SpeechCtor();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  recognition.continuous = false;
  state.recognition = recognition;
  state.listeningFragmentId = fragmentId;
  renderFragments();
  focusFragment(fragmentId);
  showInlineError("captureError", "浏览器可能会请求麦克风权限。若拒绝权限，也可以继续文字记录或使用快捷语音。", "notice");

  recognition.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("")
      .trim();
    const fragment = state.draft.fragments.find((entry) => entry.id === fragmentId);
    if (fragment && text) {
      const prefix = fragment.text ? `${fragment.text.trim()} ` : "";
      fragment.text = `${prefix}${text}`.slice(0, MAX_FRAGMENT_LENGTH);
      renderFragments();
      focusFragment(fragmentId);
      pulseFragment(fragmentId);
    }
  };
  recognition.onerror = () => {
    state.recognition = null;
    state.listeningFragmentId = null;
    renderFragments();
    showInlineError("captureError", "语音有些模糊，你可以重试，或使用快捷语音/文字继续。");
  };
  recognition.onend = () => {
    state.recognition = null;
    state.listeningFragmentId = null;
    renderFragments();
  };
  try {
    recognition.start();
    showInlineError("captureError", "正在听你说梦。结束后文字会进入这个碎片。", "notice");
  } catch {
    state.recognition = null;
    state.listeningFragmentId = null;
    renderFragments();
    showInlineError("captureError", "语音有些模糊，你可以重试，或使用快捷语音/文字继续。");
  }
}

function mockSpeechForFragment(fragmentId) {
  const fragment = state.draft.fragments.find((entry) => entry.id === fragmentId);
  if (!fragment) return;
  const prefix = fragment.text ? `${fragment.text.trim()} ` : "";
  fragment.text = `${prefix}${MOCK_SPEECH_TEXT}`.slice(0, MAX_FRAGMENT_LENGTH);
  renderFragments();
  focusFragment(fragmentId);
  pulseFragment(fragmentId);
  showInlineError("captureError", "已填入快捷语音识别结果。它会和真实输入一样进入正常生成流程。", "notice");
}

function generateDreamFromDraft() {
  try {
    hideInlineError("captureError");
    const hasTooLong = state.draft.fragments.some((fragment) => fragment.text.length >= MAX_FRAGMENT_LENGTH);
    const fragments = state.draft.fragments
      .map((fragment) => fragment.text.trim())
      .filter(Boolean)
      .map((text) => text.slice(0, MAX_FRAGMENT_LENGTH));

    if (!fragments.length) {
      showInlineError("captureError", "请至少留下一个梦境碎片。");
      return;
    }
    if (hasTooLong) {
      showInlineError("captureError", `有碎片达到 ${MAX_FRAGMENT_LENGTH} 字上限，巡梦会使用已保留的内容生成。`, "notice");
    }

    const button = document.querySelector("#generateDream");
    button.disabled = true;
    button.innerHTML = `<span class="loader"></span> 正在生成`;

    window.setTimeout(() => {
      try {
        const dream = buildDream(fragments, state.draft);
        const saved = saveDream(dream);
        if (!saved) {
          button.disabled = false;
          button.textContent = "重试保存";
          showInlineError("captureError", "本地空间不足，请删除旧梦后重试。");
          return;
        }
        state.draft = dream;
        state.playback.index = 0;
        state.lastSavedDreamId = dream.id;
        go(`playback:${dream.id}`);
        maybeGenerateCoverImage(dream);
      } catch (error) {
        button.disabled = false;
        button.textContent = "重试生成";
        showInlineError("captureError", "梦境有些迷雾，已为你保留可重试入口。");
      }
    }, 520);
  } catch (error) {
    showInlineError("captureError", "梦境有些迷雾，已为你保留可重试入口。");
  }
}

function buildDream(fragments, draft) {
  const allText = fragments.join("。");
  const analysis = analyzeDream(allText, draft);
  const dreamWorld = draft.presetKey || inferDreamWorld(allText, draft, analysis);
  const worldMeta = DREAM_WORLD_META[dreamWorld] || DREAM_WORLD_META.月亮图书馆;
  const worldImages = presetImagesFor(dreamWorld);
  const sceneCount = Math.min(6, Math.max(4, fragments.length + 2));
  const sceneSymbols = analysis.symbols.length ? analysis.symbols : ["月亮", "海", "门", "桥"];
  const sceneDetails = fragments.map((fragment) => analyzeFragment(fragment, analysis));
  const scenes = Array.from({ length: sceneCount }, (_, index) => {
    const fragment = fragments[index % fragments.length];
    const detail = sceneDetails[index % sceneDetails.length];
    const symbol = detail.symbols[0] || sceneSymbols[index % sceneSymbols.length];
    const next = pickDifferent(detail.symbols[1] || sceneSymbols[(index + 1) % sceneSymbols.length], symbol, sceneSymbols);
    const person = pickDifferent(detail.people[0] || analysis.people[index % analysis.people.length], symbol, analysis.people);
    const place = pickDifferent(detail.places[0] || analysis.places[index % analysis.places.length], symbol, analysis.places);
    const body = detail.body[0] || analysis.body[index % analysis.body.length];
    const sceneRole = sceneRoleForIndex(index);
    const elements = visualElementsFor(fragment, detail, analysis, sceneRole);
    return {
      id: cryptoId(),
      title: makeSceneTitle(index, symbol, place, analysis.coreEmotion),
      narrative: makeNarrative(fragment, index, analysis, { symbol, next, person, place, body }),
      tags: unique([symbol, next, person, place, body, analysis.coreEmotion, analysis.colors[0]]).slice(0, 5),
      atmosphere: {
        color: colorForAtmosphere(draft.atmosphere, draft.emotion),
        mood: draft.emotion,
        symbols: unique([symbol, next, ...sceneSymbols]).slice(0, 5),
        elements,
        anchors: buildSceneAnchors({ symbol, next, person, place, body, emotion: analysis.coreEmotion }),
        sceneRole,
      },
    };
  });

  const title = draft.title.trim() || makeDreamTitle(analysis);
  const dream = {
    id: draft.id && draft.createdAt ? draft.id : cryptoId(),
    traveler: state.traveler,
    title,
    createdAt: draft.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fragments,
    emotion: draft.emotion,
    intensity: draft.intensity,
    body: unique([...draft.body, draft.customBody].filter(Boolean)),
    atmosphere: draft.atmosphere,
    analysis,
    scenes,
    feedback: makeFeedback(analysis, draft),
    afterword: draft.afterword || "",
    dreamWorld,
    presetKey: draft.presetKey || "",
    presetAssetImages: worldImages,
    afterwordTitle: draft.afterwordTitle || worldMeta.afterwordTitle,
    afterwordQuestion: draft.afterwordQuestion || worldMeta.afterwordQuestion,
    coverImageUrl: "",
    coverType: "local",
    coverVisual: null,
    coverPrompt: "",
    coverStatus: "success",
    coverEnhanceRequested: Boolean(draft.generateCover),
  };
  const localCover = buildLocalCover(dream);
  dream.feedback = draft.presetFeedback || worldMeta.feedback || dream.feedback;
  const presetCover = dream.presetAssetImages?.[0]
    ? {
        coverImageUrl: dream.presetAssetImages[0],
        coverType: "preset",
        coverStatus: "success",
        coverPrompt: buildPresetCoverPrompt(dream),
      }
    : {};
  return {
    ...dream,
    ...localCover,
    ...presetCover,
    scenes: dream.scenes.map((scene, index) => ({
      ...scene,
      imageUrl: dream.presetAssetImages?.[index] || "",
    })),
  };
}

function analyzeDream(text, draft) {
  const lower = text.toLowerCase();
  const extracted = extractLooseKeywords(text);
  const symbols = collectMatches(text, SYMBOLS, extracted.symbols.length ? extracted.symbols : ["光", "水", "夜"]);
  const people = collectMatches(text, PEOPLE, extracted.people.length ? extracted.people : ["某个人"]);
  const places = collectMatches(text, PLACES, extracted.places.length ? extracted.places : ["梦里的远处"]);
  const body = unique([...draft.body, draft.customBody, ...collectMatches(text, BODY_FEELINGS, [])].filter(Boolean));
  const coreEmotion = draft.emotion || inferEmotion(lower);
  const colors = unique([draft.atmosphere, EMOTIONS.find((item) => item.id === coreEmotion)?.tone, "月白"].filter(Boolean));

  return {
    symbols,
    people,
    places,
    body: body.length ? body : ["身体仍在记得这个梦"],
    coreEmotion,
    intensity: draft.intensity,
    colors,
  };
}

function collectMatches(text, list, fallback) {
  const found = list.filter((item) => text.includes(item));
  return unique(found.length ? found : fallback).slice(0, 7);
}

function extractLooseKeywords(text) {
  const phrases = unique((text.match(/[\u4e00-\u9fa5]{2,6}/g) || []).filter((item) => !/一个|一直|突然|最后|时候|没有|自己|里面|开始|可以|这个|那个/.test(item)));
  return {
    symbols: phrases.filter((item) => /光|门|桥|海|月|夜|雾|雨|云|星|灯|窗|鱼|鸟|伞|信|影|水|河|花|镜|楼|船|钟|火|红色|追逐|树|草地|路|街/.test(item)).slice(0, 5),
    people: phrases.filter((item) => /妈|爸|父|友|同学|老师|恋人|孩子|陌生人|她|他/.test(item)).slice(0, 5),
    places: phrases.filter((item) => /家|站|校|楼|房|城|街|桥|海边|医院|机场|电梯|森林|走廊|天台|码头/.test(item)).slice(0, 5),
  };
}

function analyzeFragment(fragment, analysis) {
  const loose = extractLooseKeywords(fragment);
  return {
    symbols: collectMatches(fragment, SYMBOLS, loose.symbols.length ? loose.symbols : analysis.symbols),
    people: collectMatches(fragment, PEOPLE, loose.people.length ? loose.people : analysis.people),
    places: collectMatches(fragment, PLACES, loose.places.length ? loose.places : analysis.places),
    body: unique([...collectMatches(fragment, BODY_FEELINGS, []), ...analysis.body]).slice(0, 4),
  };
}

function sceneRoleForIndex(index) {
  return ["entrance", "place", "figure", "disorder", "echo", "settle"][index] || "echo";
}

function visualElementsFor(fragment, detail, analysis, sceneRole) {
  const text = `${fragment} ${detail.symbols.join(" ")} ${detail.people.join(" ")} ${detail.places.join(" ")} ${analysis.body.join(" ")} ${analysis.coreEmotion}`;
  const elements = [];
  if (/海|水|雨|河|湿|流动|青蓝/.test(text)) elements.push("water");
  if (/雨/.test(text)) elements.push("rain");
  if (/月亮|月|夜晚|夜|星|白鸟/.test(text)) elements.push("moonStars");
  if (/门|房间|走廊|窗户|旧楼|家/.test(text)) elements.push("doorRoom");
  if (/桥|路|街道|站台|走/.test(text)) elements.push("bridgePath");
  if (/森林|树|草地|枝|绿色|生命/.test(text)) elements.push("forest");
  if (/飞|漂浮|坠落|下坠|被风托着|身体很轻|电梯/.test(text)) elements.push("floatFall");
  if (/妈妈|父亲|爸爸|朋友|同学|老师|恋人|孩子|陌生人|自己|她|他|人/.test(text)) elements.push("person");
  if (/列车|车站|站台|机场|广播|轨道/.test(text)) elements.push("transit");
  if (/镜子|窗|玻璃|反光/.test(text)) elements.push("mirrorWindow");
  if (/火|红色|追逐|逃|怕|恐惧|不安|暗红/.test(text)) elements.push("tension");
  if (sceneRole === "entrance") elements.push("doorRoom", "moonStars");
  if (sceneRole === "place" && !elements.some((item) => ["water", "forest", "doorRoom"].includes(item))) elements.push("water");
  if (sceneRole === "figure") elements.push("person");
  if (sceneRole === "disorder") elements.push("floatFall", "tension");
  if (sceneRole === "echo") elements.push("water", "moonStars");
  if (sceneRole === "settle") elements.push("moonStars", "doorRoom");
  return unique(elements).slice(0, 7);
}

function pickDifferent(value, avoid, fallback = []) {
  const normalized = value || "";
  if (normalized && normalized !== avoid) return normalized;
  return fallback.find((item) => item && item !== avoid) || normalized || "梦里的远处";
}

function buildSceneAnchors({ symbol, next, person, place, body, emotion }) {
  return [
    { type: "象", text: symbol },
    { type: "象", text: next },
    { type: "人", text: person },
    { type: "地", text: place },
    { type: "身", text: body },
    { type: "绪", text: emotion },
  ].filter((item) => item.text && !/某个人|梦里的远处/.test(item.text));
}

function inferEmotion(text) {
  if (/怕|逃|追|暗|找不到|坠|哭|恐惧/.test(text)) return "恐惧";
  if (/孤独|一个人|没人/.test(text)) return "孤独";
  if (/亲密|拥抱|靠近|柔软/.test(text)) return "亲密";
  if (/森林|草地|树|治愈/.test(text)) return "治愈";
  if (/想|等|回去|以前|旧|怀念/.test(text)) return "思念";
  if (/飞|轻|云|漂/.test(text)) return "漂浮";
  if (/亮|暖|抱|笑/.test(text)) return "温暖";
  if (/自由|奔跑|风/.test(text)) return "自由";
  if (/荒诞|变形|失真/.test(text)) return "荒诞";
  return "安静";
}

function makeSceneTitle(index, symbol, place, emotion) {
  const safePlace = place === symbol ? "梦的边缘" : place;
  const titleShapes = [
    `${safePlace}的${symbol}`,
    `${symbol}没有说完`,
    `${safePlace}向后退去`,
    `${emotion}经过${symbol}`,
    `${safePlace}还亮着`,
    "醒前的光",
  ];
  return titleShapes[index] || `${symbol}与${place}`;
}

function makeNarrative(fragment, index, analysis, detail) {
  const { symbol, next, person, place, body } = detail;
  const safePlace = place === symbol ? "梦的边缘" : place;
  const safeNext = next === symbol ? "另一束光" : next;
  const safePerson = person === symbol ? "那个身影" : person;
  const glimpse = fragmentGlimpse(fragment, [symbol, safeNext, safePerson, safePlace, body]);
  const lines = [
    `${safePlace}先亮了一下。${symbol}贴在边缘，${safePerson}像刚刚离开。${glimpse}，梦没有急着解释。`,
    `${safeNext}忽然靠近。${body}从身体里浮上来，${safePlace}退到很远，只剩${analysis.coreEmotion}还在。`,
    `${safePerson}经过${safePlace}，没有回头。${symbol}和${safeNext}互相照着，中间空出一小段夜。`,
    `路断了一次。${body}变得清楚，${symbol}在前面漂着。你记起：${glimpse}。`,
    `${analysis.coreEmotion}涨起，又安静落下。${safeNext}替${safePerson}停了一秒，${safePlace}的光没有熄。`,
    `醒前，${symbol}慢慢收拢。${safePerson}留在雾里，${body}被放轻，梦替你守住那一点光。`,
  ];
  return lines[index] || `${glimpse}。${symbol}把${analysis.coreEmotion}轻轻托住。`;
}

function fragmentGlimpse(fragment, anchors) {
  const clean = fragment
    .replace(/\s+/g, "")
    .replace(/[，,。！？；;：:]+$/g, "");
  const anchor = anchors.find((item) => item && clean.includes(item));
  if (anchor) {
    const index = clean.indexOf(anchor);
    const snippet = clean.slice(Math.max(0, index - 8), Math.min(clean.length, index + anchor.length + 12));
    return snippet.replace(/^[，,。！？；;：:]+|[，,。！？；;：:]+$/g, "");
  }
  return clean.slice(0, 22) || "有一束不知从哪里来的光";
}

function makeDreamTitle(analysis) {
  const symbol = analysis.symbols[0] || "月亮";
  const place = analysis.places[0] || "夜色";
  return `${place}里的${symbol}`;
}

function makeFeedback(analysis, draft) {
  if (draft.presetFeedback) return draft.presetFeedback;
  const body = analysis.body[0] || "身体里残留的感觉";
  return `${makeHoldingLine(analysis)} ${body}也被看见了。你可以把它留在这里，像把一盏小灯放回夜里。`;
}

function inferDreamWorld(text, draft, analysis) {
  const source = `${text} ${draft.emotion || ""} ${(draft.body || []).join(" ")} ${draft.customBody || ""} ${(analysis.symbols || []).join(" ")} ${(analysis.people || []).join(" ")} ${(analysis.places || []).join(" ")}`;
  if (/思念|失去|告别|妈妈|父亲|爸爸|她|他|离开|追不上|海|旧照片|照片|信|车票|回忆/.test(source)) return "记忆鲸落";
  if (/人生|年龄|过去|未来|车站|列车|时间|错过|长大/.test(source)) return "时间列车";
  if (/忘记|淡去|花|花园|温室|遗忘|释然|旧事/.test(source)) return "遗忘花园";
  if (/治愈|怀念|成长|小时候|未来|书|图书馆|月亮|云|飞鸟|自己/.test(source)) return "月亮图书馆";
  return "月亮图书馆";
}

function makeHoldingLine(analysis) {
  const emotion = analysis.coreEmotion;
  const person = analysis.people.find((item) => item !== "某个人") || "一个重要的人";
  const place = analysis.places[0] || "那片夜色";
  const symbol = analysis.symbols[0] || "微光";
  if (["思念", "亲密", "孤独"].includes(emotion)) return `你似乎还在寻找${person}，也在寻找${place}里没有说完的话。`;
  if (["不安", "恐惧", "迷路"].includes(emotion)) return `这场梦把你的${emotion}轻轻放在了夜里，没有催你立刻走出去。`;
  if (["治愈", "释然", "温暖"].includes(emotion)) return `${symbol}像一只很小的手，把这场梦慢慢扶稳。`;
  if (["清醒", "自由", "漂浮"].includes(emotion)) return `你像是在${place}和${symbol}之间重新找回一点呼吸。`;
  return `这场梦把${emotion}放得很轻，轻到可以被慢慢记住。`;
}

function renderResult() {
  const dream = state.draft?.scenes ? state.draft : newestDream();
  if (!dream) {
    renderEmpty("还没有可以生成的梦境", "先去捕捉一个梦境碎片。", "capture");
    return;
  }

  app.innerHTML = `
    <div class="page-title">
      <div>
        <h2>${escapeHtml(dream.title)}</h2>
        <p>${formatDateTime(dream.createdAt)} · ${escapeHtml(dream.analysis.coreEmotion)} · ${dream.intensity}/10</p>
      </div>
      <div class="toolbar">
        <button class="primary-button" id="enterPlayback">${icon("play")}<span>进入沉浸式回放</span></button>
        <button class="ghost-button" data-route="capture">${icon("feather")}<span>继续捕捉</span></button>
      </div>
    </div>
    ${renderEmotionHolding(dream)}
    <section class="section stack">
      <h2>梦境理解</h2>
      ${renderAnalysisOverview(dream)}
    </section>
    <section class="section stack" style="margin-top: 18px;">
      <h2>梦境分镜</h2>
      <div class="scene-grid" id="sceneGrid"></div>
    </section>
  `;

  document.querySelector("#enterPlayback").addEventListener("click", () => go(`playback:${dream.id}`));
  renderSceneCards(dream, "#sceneGrid");
}

function analysisItem(title, items) {
  return `
    <div class="analysis-item">
      <h3>${title}</h3>
      <div class="tag-row">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
    </div>
  `;
}

function renderAnalysisOverview(dream) {
  return `
    <div class="analysis-grid">
      ${analysisItem("关键意象", dream.analysis.symbols)}
      ${analysisItem("人物", dream.analysis.people)}
      ${analysisItem("地点", dream.analysis.places)}
      ${analysisItem("身体感受", dream.analysis.body)}
      ${analysisItem("核心情绪", [dream.analysis.coreEmotion, `强度 ${dream.intensity}/10`])}
      ${analysisItem("梦境色彩", dream.analysis.colors)}
    </div>
  `;
}

function renderEmotionHolding(dream, compact = false) {
  return `
    <section class="emotion-holding ${compact ? "emotion-holding-compact" : "section"}">
      <div>
        <p class="scene-kicker">这场梦的情绪</p>
        <h2>${escapeHtml(dream.analysis.coreEmotion)} <span>${dream.intensity}/10</span></h2>
      </div>
      <p>${escapeHtml(dream.feedback || makeHoldingLine(dream.analysis))}</p>
    </section>
  `;
}

function renderSceneCards(dream, selector) {
  const grid = document.querySelector(selector);
  const template = document.querySelector("#sceneTemplate");
  grid.innerHTML = "";
  dream.scenes.forEach((scene, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".scene-kicker").textContent = `第 ${index + 1} 幕`;
    node.querySelector("h3").textContent = scene.title;
    node.querySelector(".scene-text").textContent = scene.narrative;
    node.querySelector(".tag-row").innerHTML = scene.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const sceneImage = visualImageForDream(dream, index);
    if (sceneImage) {
      node.classList.add("has-preset-image");
      node.insertAdjacentHTML("afterbegin", `<img class="scene-image" src="${escapeAttr(sceneImage)}" alt="${escapeAttr(scene.title)}" />`);
      node.querySelector(".scene-image").addEventListener("error", (event) => {
        event.currentTarget.hidden = true;
        node.classList.remove("has-preset-image");
      });
    }
    grid.appendChild(node);
    requestAnimationFrame(() => drawDreamVisual(node.querySelector("canvas"), sceneAtmosphereFor(scene, dream, index)));
  });
}

function renderPlayback(id) {
  const dream = getDream(id);
  if (!dream) {
    renderEmpty("没有找到这本梦之书", "它可能属于另一个梦境旅人。", "gallery");
    return;
  }

  state.playback.index = Math.min(state.playback.index, dream.scenes.length - 1);
  const scene = dream.scenes[state.playback.index];
  const sceneImage = visualImageForDream(dream, state.playback.index);
  const isLast = state.playback.index === dream.scenes.length - 1;
  const progress = ((state.playback.index + 1) / dream.scenes.length) * 100;

  app.innerHTML = `
    <section class="playback-view ${isLast ? "is-final" : ""}">
      <div class="playback-intro">
        <span class="tag playback-mode">巡梦回放</span>
        <strong>${escapeHtml(dream.title)}</strong>
        <span class="playback-status ${state.playback.playing ? "playing" : ""}">${state.playback.playing ? "巡梦中…" : "停在这一幕"} · ${escapeHtml(dream.analysis.coreEmotion)} ${dream.intensity}/10</span>
      </div>
      ${state.lastSavedDreamId === dream.id ? `<p class="save-success notice">${icon("bookmark")}<span>这本梦之书已保存，刷新后仍可在日历和梦之书架中找到。</span></p>` : ""}
      <div class="playback-stage ${isLast ? "final-scene" : ""}">
        ${sceneImage ? `<img id="playbackSceneImage" class="playback-image" src="${escapeAttr(sceneImage)}" alt="${escapeAttr(scene.title)}" />` : ""}
        <canvas id="playbackCanvas" aria-hidden="true"></canvas>
        <div class="dream-haze" aria-hidden="true"></div>
        ${renderSceneAnchors(scene, dream)}
        <div class="playback-copy">
          <p class="scene-kicker">第 ${state.playback.index + 1} 幕 / 共 ${dream.scenes.length} 幕</p>
          <h2>${escapeHtml(isLast ? finalSceneTitle(scene.title) : scene.title)}</h2>
          <div class="narrative-lines">${renderNarrativeLines(scene.narrative)}</div>
          <div class="tag-row scene-tags">${renderSceneTags(scene.tags)}</div>
          ${isLast ? `<div class="feedback-callout"><strong>${escapeHtml(dream.afterwordTitle || "梦被安放的地方")}</strong><p>${escapeHtml(dream.feedback)}</p><p class="remember-line">把没说完的话留在最后一幕。</p></div>` : ""}
        </div>
      </div>
      ${isLast ? feedbackForm(dream) : ""}
      <div class="playback-controls">
        <div class="playback-progress" aria-label="分镜进度">
          <div class="progress-track"><span style="width:${progress}%"></span></div>
          <div class="progress-dots">
            ${dream.scenes.map((_, index) => `<button class="${index === state.playback.index ? "active" : ""}" data-scene-index="${index}" aria-label="跳到第 ${index + 1} 幕"><span>${index + 1}</span></button>`).join("")}
          </div>
        </div>
        <div class="toolbar playback-actions">
          <button class="ghost-button" id="prevScene">${icon("prev")}<span>上一幕</span></button>
          <button class="primary-button" id="togglePlay">${icon(state.playback.playing ? "pause" : "play")}<span>${state.playback.playing ? "暂停" : "自动播放"}</span></button>
          <button class="ghost-button" id="nextScene">${icon("next")}<span>下一幕</span></button>
          <button class="ghost-button" id="replay">${icon("replay")}<span>重播</span></button>
          <button class="ghost-button" id="toggleSoundscape">${icon(state.soundscape.enabled ? "volumeOff" : "volume")}<span>${state.soundscape.enabled ? "关闭声景" : "开启声景"}</span></button>
        </div>
        <p id="soundscapeStatus" class="soundscape-status muted">${soundscapeStatusText(dream)}</p>
      </div>
    </section>
  `;

  requestAnimationFrame(() => drawDreamVisual(document.querySelector("#playbackCanvas"), sceneAtmosphereFor(scene, dream, state.playback.index)));
  document.querySelector("#playbackSceneImage")?.addEventListener("error", (event) => {
    event.currentTarget.hidden = true;
  });
  document.querySelector("#prevScene").disabled = state.playback.index === 0;
  document.querySelector("#nextScene").disabled = isLast;
  document.querySelector("#prevScene").addEventListener("click", () => setScene(dream, state.playback.index - 1));
  document.querySelector("#nextScene").addEventListener("click", () => setScene(dream, state.playback.index + 1));
  document.querySelector("#togglePlay").addEventListener("click", () => togglePlayback(dream));
  document.querySelector("#replay").addEventListener("click", () => {
    state.playback.index = 0;
    state.playback.playing = true;
    schedulePlayback(dream);
    renderPlayback(dream.id);
  });
  document.querySelector("#toggleSoundscape").addEventListener("click", () => toggleSoundscape(dream));
  document.querySelector(".progress-dots").addEventListener("click", (event) => {
    const dot = event.target.closest("[data-scene-index]");
    if (dot) setScene(dream, Number(dot.dataset.sceneIndex));
  });
  document.querySelector("#saveAfterword")?.addEventListener("click", () => {
    const text = document.querySelector("#afterword").value.trim().slice(0, MAX_AFTERWORD_LENGTH);
    dream.afterword = text;
    dream.updatedAt = new Date().toISOString();
    if (!saveDream(dream)) return;
    const notice = document.querySelector("#afterwordNotice");
    if (notice) {
      notice.hidden = false;
      notice.textContent = "这句话已经被安放在梦的最后一幕。";
    }
  });

  if (state.playback.playing) schedulePlayback(dream);
  if (state.soundscape.enabled) ensureSoundscape(dream);
}

function feedbackForm(dream) {
  const title = dream.afterwordTitle || "留下梦后留言";
  const question = dream.afterwordQuestion || "醒来以后，你想把哪句话留给这场梦？";
  return `
    <section class="feedback-panel section stack emotion-settle-card">
      <h2>${escapeHtml(title)}</h2>
      <p class="muted">${escapeHtml(question)}</p>
      <div class="field">
        <label for="afterword">最后一幕留言</label>
        <textarea id="afterword" maxlength="${MAX_AFTERWORD_LENGTH}" placeholder="${escapeAttr(question)}">${escapeHtml(dream.afterword || "")}</textarea>
      </div>
      <p id="afterwordNotice" class="notice" hidden></p>
      <button class="primary-button" id="saveAfterword">${icon("bookmark")}<span>保存留言</span></button>
    </section>
  `;
}

function soundscapeStatusText(dream) {
  if (!supportsAudio()) return "当前浏览器不支持声景播放，不影响巡梦回放。";
  if (state.soundscape.enabled) return `梦境声景开启中 · ${soundscapeLabel(dream)}`;
  return "梦境声景默认静音，可手动开启。";
}

function toggleSoundscape(dream) {
  if (!supportsAudio()) {
    const node = document.querySelector("#soundscapeStatus");
    if (node) node.textContent = "当前浏览器不支持声景播放，不影响巡梦回放。";
    return;
  }
  if (state.soundscape.enabled) {
    stopSoundscape(true);
    renderPlayback(dream.id);
    return;
  }
  state.soundscape.enabled = true;
  ensureSoundscape(dream);
  renderPlayback(dream.id);
}

function supportsAudio() {
  return Boolean(window.AudioContext || window.webkitAudioContext);
}

function ensureSoundscape(dream) {
  if (!state.soundscape.enabled || !supportsAudio()) return;
  if (state.soundscape.dreamId === dream.id && state.soundscape.nodes.length) return;
  stopSoundscape(false);
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  const context = state.soundscape.context || new AudioCtor();
  state.soundscape.context = context;
  context.resume?.();

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 1.2);
  master.connect(context.destination);

  const profile = soundscapeProfile(dream);
  const pad = createTone(context, profile.pad, "sine", profile.padGain);
  const breath = createTone(context, profile.breath, "triangle", profile.breathGain);
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.frequency.value = profile.pulse;
  lfoGain.gain.value = profile.pulseDepth;
  lfo.connect(lfoGain);
  lfoGain.connect(pad.gain.gain);
  pad.output.connect(master);
  breath.output.connect(master);
  pad.osc.start();
  breath.osc.start();
  lfo.start();

  state.soundscape.nodes = [master, pad.osc, breath.osc, lfo, pad.output, breath.output, pad.gain, breath.gain];
  state.soundscape.dreamId = dream.id;
  scheduleSoundDots(context, master, profile);
}

function createTone(context, frequency, type, gainValue) {
  const osc = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  filter.type = "lowpass";
  filter.frequency.value = 900;
  gain.gain.value = gainValue;
  osc.connect(filter);
  filter.connect(gain);
  return { osc, gain, output: gain };
}

function scheduleSoundDots(context, master, profile) {
  window.clearTimeout(state.soundscape.timer);
  if (!state.soundscape.enabled) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.value = profile.sparkle + seeded(now * 10) * 90;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(profile.sparkleGain, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 1.25);
  state.soundscape.nodes.push(osc, gain);
  state.soundscape.timer = window.setTimeout(() => scheduleSoundDots(context, master, profile), profile.interval);
}

function stopSoundscape(disable = false) {
  window.clearTimeout(state.soundscape.timer);
  state.soundscape.timer = null;
  state.soundscape.nodes.forEach((node) => {
    try {
      if (node.gain) node.gain.exponentialRampToValueAtTime(0.0001, state.soundscape.context.currentTime + 0.2);
      if (node.stop) node.stop(state.soundscape.context.currentTime + 0.24);
      if (node.disconnect) window.setTimeout(() => node.disconnect(), 300);
    } catch {
      // Soundscape is optional; audio cleanup should never interrupt the experience.
    }
  });
  state.soundscape.nodes = [];
  state.soundscape.dreamId = "";
  if (disable) state.soundscape.enabled = false;
}

function soundscapeProfile(dream) {
  if (dream.presetKey === "记忆鲸落") return { pad: 52, breath: 104, sparkle: 278, padGain: 0.03, breathGain: 0.014, pulse: 0.42, pulseDepth: 0.01, sparkleGain: 0.014, interval: 1900 };
  if (dream.presetKey === "月亮图书馆") return { pad: 132, breath: 264, sparkle: 560, padGain: 0.018, breathGain: 0.012, pulse: 0.16, pulseDepth: 0.006, sparkleGain: 0.02, interval: 2300 };
  const emotion = dream.analysis?.coreEmotion || dream.emotion || "安静";
  if (["不安", "恐惧", "迷路"].includes(emotion)) return { pad: 58, breath: 116, sparkle: 240, padGain: 0.028, breathGain: 0.012, pulse: 0.8, pulseDepth: 0.012, sparkleGain: 0.018, interval: 1500 };
  if (["温暖", "释然"].includes(emotion)) return { pad: 164, breath: 246, sparkle: 520, padGain: 0.018, breathGain: 0.012, pulse: 0.18, pulseDepth: 0.006, sparkleGain: 0.022, interval: 2200 };
  if (["思念", "亲密", "孤独"].includes(emotion)) return { pad: 110, breath: 165, sparkle: 330, padGain: 0.022, breathGain: 0.014, pulse: 0.24, pulseDepth: 0.007, sparkleGain: 0.016, interval: 2600 };
  if (["治愈", "自由", "清醒"].includes(emotion)) return { pad: 98, breath: 196, sparkle: 420, padGain: 0.018, breathGain: 0.015, pulse: 0.32, pulseDepth: 0.007, sparkleGain: 0.018, interval: 1800 };
  return { pad: 82, breath: 164, sparkle: 390, padGain: 0.018, breathGain: 0.01, pulse: 0.2, pulseDepth: 0.006, sparkleGain: 0.016, interval: 2400 };
}

function soundscapeLabel(dream) {
  if (dream.presetKey === "记忆鲸落") return "鲸落低频与回忆光尘";
  if (dream.presetKey === "月亮图书馆") return "月光高音与书页回声";
  const emotion = dream.analysis?.coreEmotion || dream.emotion || "安静";
  if (["不安", "恐惧", "迷路"].includes(emotion)) return "低频脉冲与轻微风声";
  if (["温暖", "释然"].includes(emotion)) return "轻柔高音与暖光氛围";
  if (["思念", "亲密", "孤独"].includes(emotion)) return "缓慢和弦与远处回声";
  if (["治愈", "自由", "清醒"].includes(emotion)) return "水波感与轻柔流动音";
  return "低频柔和 Pad 与星点音";
}

function renderSceneTags(tags) {
  return tags.map((tag) => `<span class="tag scene-tag"><span>${tagIcon(tag)}</span>${escapeHtml(tag)}</span>`).join("");
}

function renderSceneAnchors(scene, dream) {
  const anchors = scene.atmosphere?.anchors?.length
    ? scene.atmosphere.anchors
    : buildSceneAnchors({
        symbol: scene.tags?.[0],
        next: scene.tags?.[1],
        person: dream.analysis?.people?.[0],
        place: dream.analysis?.places?.[0],
        body: dream.analysis?.body?.[0],
        emotion: dream.analysis?.coreEmotion || dream.emotion,
      });
  const visibleAnchors = uniqueByText(anchors).slice(0, 5);
  if (!visibleAnchors.length) return "";
  return `
    <div class="scene-anchor-field" aria-label="本幕由梦境碎片生成的线索">
      ${visibleAnchors.map((item, index) => `
        <span class="scene-anchor scene-anchor-${index + 1}">
          <b>${escapeHtml(item.type)}</b>${escapeHtml(item.text)}
        </span>
      `).join("")}
    </div>
  `;
}

function uniqueByText(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const text = item?.text || "";
    if (!text || seen.has(text)) return false;
    seen.add(text);
    return true;
  });
}

function tagIcon(tag) {
  if (/妈|爸|父|友|同学|老师|恋人|孩子|陌生人|自己|她|他|人/.test(tag)) return "人";
  if (/家|站|校|楼|房|城|街|桥|海边|医院|机场|电梯|森林|走廊|天台|码头|远处/.test(tag)) return "地";
  if (/胸|身体|手心|喉咙|脚步|下坠|风|眼眶|水里/.test(tag)) return "身";
  if (/安静|温暖|不安|漂浮|思念|清醒|迷路|释然/.test(tag)) return "绪";
  return "象";
}

function icon(name) {
  const icons = {
    prev: `<path d="m15 18-6-6 6-6"></path>`,
    next: `<path d="m9 18 6-6-6-6"></path>`,
    play: `<path d="m8 5 11 7-11 7z"></path>`,
    pause: `<path d="M9 5v14"></path><path d="M15 5v14"></path>`,
    replay: `<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path>`,
    user: `<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M4 21a8 8 0 0 1 16 0"></path><path d="M19 5.5h.01"></path>`,
    sparkles: `<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"></path><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"></path><path d="M5 14l.7 1.8L7.5 16.5l-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7L5 14Z"></path>`,
    gallery: `<path d="M4 6h16v12H4z"></path><path d="M8 10h.01"></path><path d="m10 16 3-3 2 2 2-3 3 4"></path>`,
    trash: `<path d="M4 7h16"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M6 7l1 14h10l1-14"></path><path d="M9 7V4h6v3"></path>`,
    plus: `<path d="M12 5v14"></path><path d="M5 12h14"></path>`,
    mic: `<path d="M12 3v10"></path><path d="M8 7a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0V7Z"></path><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path>`,
    heart: `<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6Z"></path>`,
    waves: `<path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"></path><path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"></path><path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"></path>`,
    book: `<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z"></path><path d="M4 19a3 3 0 0 1 3-3h13"></path><path d="M8 7h7"></path>`,
    moonBook: `<path d="M4.5 6.2c2.2-.9 4.4-.7 6.7.6v11.6c-2.3-1.2-4.5-1.4-6.7-.5V6.2Z"></path><path d="M11.2 6.8c2.3-1.3 4.5-1.5 6.7-.6v11.7c-2.2-.9-4.4-.7-6.7.5"></path><path d="M7 9.6h1.8"></path><path d="M14 9.6h1.8"></path><path d="M18.6 3.4a4.5 4.5 0 0 1-3.9 6.4 4.7 4.7 0 0 0 5.9-4.5 4.6 4.6 0 0 0-2-1.9Z"></path>`,
    palette: `<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.4 1.4 0 0 1 1-2.4H18a6 6 0 0 0 0-12h-6Z"></path><path d="M7.5 10h.01"></path><path d="M10 6.8h.01"></path><path d="M14 6.8h.01"></path><path d="M16.5 10h.01"></path>`,
    wand: `<path d="m15 4 5 5"></path><path d="m14 10 6-6"></path><path d="M4 20 14 10"></path><path d="m5 5 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"></path>`,
    bookmark: `<path d="M6 4h12v17l-6-4-6 4V4Z"></path><path d="M9 8h6"></path>`,
    feather: `<path d="M20 4c-5.5 0-10 3.8-10 9.2V20"></path><path d="M20 4c0 6.6-4 10-10 10H6"></path><path d="M10 14 4 20"></path>`,
    moon: `<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"></path>`,
    calendar: `<path d="M7 3v4"></path><path d="M17 3v4"></path><path d="M4 8h16"></path><path d="M5 5h14v16H5z"></path><path d="M8 12h.01"></path><path d="M12 12h.01"></path><path d="M16 12h.01"></path><path d="M8 16h.01"></path><path d="M12 16h.01"></path>`,
    planet: `<path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path><path d="M3 14c4 3 12 4 18-4"></path><path d="M5 9c5-3 11-3 14 1"></path>`,
    volume: `<path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16 9.5a4 4 0 0 1 0 5"></path><path d="M18.5 7a7 7 0 0 1 0 10"></path>`,
    volumeOff: `<path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="m19 9-4 4"></path><path d="m15 9 4 4"></path>`,
  };
  return `<span class="button-icon" aria-hidden="true"><svg class="svg-icon" viewBox="0 0 24 24">${icons[name] || icons.sparkles}</svg></span>`;
}

function finalSceneTitle(title) {
  return title.includes("醒前") ? title : "梦被安放的地方";
}

function renderNarrativeLines(text) {
  return splitNarrative(text)
    .map((line, index) => `<p style="animation-delay:${index * 180}ms">${escapeHtml(line)}</p>`)
    .join("");
}

function splitNarrative(text) {
  const parts = text
    .split(/(?<=[。？！])/) 
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts.slice(0, 4) : [text];
}

function setScene(dream, index) {
  state.playback.index = Math.max(0, Math.min(dream.scenes.length - 1, index));
  renderPlayback(dream.id);
}

function togglePlayback(dream) {
  state.playback.playing = !state.playback.playing;
  if (state.playback.playing) schedulePlayback(dream);
  else stopPlayback(false);
  renderPlayback(dream.id);
}

function schedulePlayback(dream) {
  window.clearTimeout(state.playback.timer);
  if (!state.playback.playing) return;
  state.playback.timer = window.setTimeout(() => {
    if (state.playback.index >= dream.scenes.length - 1) {
      state.playback.playing = false;
    } else {
      state.playback.index += 1;
    }
    renderPlayback(dream.id);
  }, 3600);
}

function stopPlayback(resetPlaying = true) {
  window.clearTimeout(state.playback.timer);
  state.playback.timer = null;
  if (resetPlaying) state.playback.playing = false;
}

function renderGallery() {
  if (!state.dreams.length) {
    app.innerHTML = `
      <div class="page-title">
        <div>
          <h2>梦之书架</h2>
          <p>这里会保存每一本梦之书。你也可以先打开一段推荐梦境，感受巡梦舱的完整体验。</p>
        </div>
        <button class="primary-button" data-route="capture">${icon("feather")}<span>写下一页梦</span></button>
      </div>
      ${emptyGalleryStarter()}
    `;
    document.querySelectorAll(".preset-fill").forEach((button) => button.addEventListener("click", () => {
      applyPresetDraft(button.dataset.presetKey);
      go("capture");
    }));
    return;
  }
  const dreams = filteredGalleryDreams();
  const coverUrls = coverImagesForDreamList(dreams);
  app.innerHTML = `
    <div class="page-title">
      <div>
        <h2>梦之书架</h2>
        <p>${escapeHtml(state.traveler)} 的 ${state.dreams.length} 本梦之书，按最近保存排列。</p>
      </div>
      <button class="primary-button" data-route="capture">${icon("feather")}<span>写下一页梦</span></button>
    </div>
    <section class="gallery-filter-bar" id="galleryFilters" aria-label="梦之书筛选">
      ${["全部", "记忆鲸落", "月亮图书馆", "有留言"].map((filter) => `<button class="${state.galleryFilter === filter ? "active" : ""}" data-filter="${escapeAttr(filter)}" type="button">${filter}</button>`).join("")}
    </section>
    <section class="gallery-grid">
      ${dreams.length ? dreams.map((dream, index) => dreamCard(dream, coverUrls[index])).join("") : galleryFilterEmpty()}
    </section>
  `;
  document.querySelector("#galleryFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.galleryFilter = button.dataset.filter;
    renderGallery();
  });
  document.querySelectorAll(".dream-card").forEach((card) => {
    const dream = getDream(card.dataset.id);
    const canvas = card.querySelector("canvas");
    const img = card.querySelector("img");
    if (hasRemoteCover(dream)) {
      img.addEventListener("error", () => {
        img.hidden = true;
        canvas.hidden = false;
        drawDreamVisual(canvas, coverVisualForDream(dream));
        markCoverImageFailed(dream.id, card.querySelector(".cover-status"));
      });
      img.hidden = false;
      canvas.hidden = true;
    } else {
      drawDreamVisual(canvas, coverVisualForDream(dream));
    }
    card.addEventListener("click", (event) => {
      if (event.target.closest(".replay-card")) {
        state.playback.index = 0;
        go(`playback:${dream.id}`);
        return;
      }
      go(`detail:${dream.id}`);
    });
  });
}

function emptyGalleryStarter() {
  return `
    <section class="empty-gallery-starter">
      <article class="starter-book-card">
        <img src="${escapeAttr(PRESET_ASSETS.记忆鲸落[0])}" alt="记忆鲸落封面" />
        <div>
          <p class="scene-kicker">推荐梦之书</p>
          <h3>记忆鲸落</h3>
          <p>适合思念、失去、告别的梦。</p>
          <button class="primary-button preset-fill" data-preset-key="记忆鲸落" type="button">${icon("waves")}<span>进入记忆鲸落</span></button>
        </div>
      </article>
      <article class="starter-book-card">
        <img src="${escapeAttr(PRESET_ASSETS.月亮图书馆[0])}" alt="月亮图书馆封面" />
        <div>
          <p class="scene-kicker">推荐梦之书</p>
          <h3>月亮图书馆</h3>
          <p>适合治愈、怀念、成长的梦。</p>
          <button class="primary-button preset-fill" data-preset-key="月亮图书馆" type="button">${icon("book")}<span>进入月亮图书馆</span></button>
        </div>
      </article>
    </section>
  `;
}

function filteredGalleryDreams() {
  const dreams = sortedDreams();
  if (state.galleryFilter === "记忆鲸落") return dreams.filter((dream) => dream.dreamWorld === "记忆鲸落" || dream.presetKey === "记忆鲸落");
  if (state.galleryFilter === "月亮图书馆") return dreams.filter((dream) => dream.dreamWorld === "月亮图书馆" || dream.presetKey === "月亮图书馆");
  if (state.galleryFilter === "有留言") return dreams.filter((dream) => Boolean((dream.afterword || "").trim()));
  return dreams;
}

function galleryFilterEmpty() {
  return `
    <article class="gallery-empty-card">
      <div class="empty-icon">${icon("moon")}</div>
      <h3>这个筛选下还没有梦之书</h3>
      <p>换一个筛选，或写下一页新的梦。</p>
      <button class="primary-button" data-route="capture" type="button">${icon("feather")}<span>写下一页梦</span></button>
    </article>
  `;
}

function dreamCard(dream, assignedCoverUrl = "") {
  const coverUrl = assignedCoverUrl || coverImageForDream(dream);
  const remoteCover = Boolean(coverUrl);
  const afterword = dream.afterword ? dream.afterword.slice(0, 46) : "还没有留下最后一幕留言。";
  return `
    <article class="dream-card" data-id="${dream.id}" tabindex="0" role="button">
      <div class="card-visual">
        <img src="${escapeAttr(coverUrl)}" alt="梦之书封面" ${remoteCover ? "" : "hidden"} />
        <canvas aria-hidden="true" ${remoteCover ? "hidden" : ""}></canvas>
        <span class="cover-status ${escapeAttr(coverStatusClass(dream))}">${coverStatusText(dream)}</span>
      </div>
      <div class="dream-card-body">
        <h3>${escapeHtml(dream.title)}</h3>
        <p>${formatDateTime(dream.createdAt)}</p>
        <p class="afterword-excerpt">${escapeHtml(afterword)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(dream.dreamWorld || dream.presetKey || "月亮图书馆")}</span>
          <span class="tag">${escapeHtml(dream.analysis.coreEmotion)}</span>
          <span class="tag">${escapeHtml(dream.atmosphere)}</span>
          <span class="tag">${dream.scenes.length} 幕</span>
        </div>
        <button class="ghost-button replay-card" type="button">${icon("replay")}<span>重新打开</span></button>
      </div>
    </article>
  `;
}

function renderCalendar() {
  const cursor = state.calendarCursor;
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
  const dreamsByDate = groupByDate(state.dreams);
  const selectedDreams = dreamsByDate[state.selectedDate] || [];

  app.innerHTML = `
    <div class="page-title calendar-title">
      <div>
        <h2>梦境月相记录</h2>
        <p>按日期重新打开梦之书，也能看到哪些夜晚曾经亮起。</p>
      </div>
    </div>
    <div class="calendar-wrap">
      <section class="section calendar-panel">
        <div class="calendar-panel-head">
          <div>
            <p class="scene-kicker">${icon("moon")}<span>月相</span></p>
            <h2>${year} 年 ${month + 1} 月</h2>
          </div>
          <div class="toolbar month-toolbar">
            <button class="ghost-button" id="prevMonth" type="button">${icon("prev")}<span>上个月</span></button>
            <button class="ghost-button" id="nextMonth" type="button">${icon("next")}<span>下个月</span></button>
          </div>
        </div>
        <div class="calendar-grid">
          ${["日", "一", "二", "三", "四", "五", "六"].map((day) => `<div class="weekday">${day}</div>`).join("")}
          ${days
            .map((date) => {
              const key = formatDate(date);
              const count = dreamsByDate[key]?.length || 0;
              const dotColor = count ? dreamColor(dreamsByDate[key][0]) : "";
              return `<button class="day-cell ${date.getMonth() !== month ? "outside" : ""} ${key === state.selectedDate ? "active" : ""}" data-date="${key}">
                <strong>${date.getDate()}</strong>
                ${count ? `<span class="moon-dot" style="--dream-dot:${escapeAttr(dotColor)}">${icon("moon")}</span><p class="muted">${count} 本梦之书</p>` : ""}
              </button>`;
            })
            .join("")}
        </div>
      </section>
      <aside class="section stack selected-date-card">
        <div class="selected-date-head">
          <p class="scene-kicker">${icon("book")}<span>已选日期</span></p>
          <h2>${state.selectedDate}</h2>
          <p class="muted">${selectedDreams.length ? `${selectedDreams.length} 本梦之书` : "这一天还没有记录"}</p>
        </div>
        <div class="list calendar-dream-list">
          ${
            selectedDreams.length
              ? selectedDreams.map(calendarDreamItem).join("")
              : `<p class="muted">这一天还没有梦之书。</p><button class="primary-button" data-route="capture">${icon("feather")}<span>写下一页梦</span></button>`
          }
        </div>
      </aside>
    </div>
  `;

  document.querySelector("#prevMonth").addEventListener("click", () => {
    state.calendarCursor = new Date(year, month - 1, 1);
    renderCalendar();
  });
  document.querySelector("#nextMonth").addEventListener("click", () => {
    state.calendarCursor = new Date(year, month + 1, 1);
    renderCalendar();
  });
  document.querySelector(".calendar-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    state.selectedDate = button.dataset.date;
    renderCalendar();
  });
  document.querySelector(".list").addEventListener("click", (event) => {
    const replayButton = event.target.closest("[data-playback]");
    if (replayButton) {
      state.playback.index = 0;
      go(`playback:${replayButton.dataset.playback}`);
      return;
    }
    const detailButton = event.target.closest("[data-detail]");
    if (detailButton) go(`detail:${detailButton.dataset.detail}`);
  });
}

function calendarDreamItem(dream) {
  return `
    <article class="calendar-dream-item">
      <div>
        <h3>${escapeHtml(dream.title)}</h3>
        <p class="muted">${escapeHtml(dream.dreamWorld || dream.presetKey || "月亮图书馆")} · ${escapeHtml(dream.analysis.coreEmotion)} · ${formatTime(dream.createdAt)}</p>
      </div>
      <div class="calendar-actions">
        <button class="ghost-button" data-detail="${escapeAttr(dream.id)}" type="button">${icon("book")}<span>打开</span></button>
        <button class="primary-button" data-playback="${escapeAttr(dream.id)}" type="button">${icon("replay")}<span>重新走过</span></button>
      </div>
    </article>
  `;
}

function coverAtmosphereForDream(dream) {
  const text = `${dream.fragments?.join(" ") || ""} ${dream.analysis?.symbols?.join(" ") || ""} ${dream.analysis?.places?.join(" ") || ""} ${dream.analysis?.people?.join(" ") || ""}`;
  const detail = {
    symbols: dream.analysis?.symbols || [],
    people: dream.analysis?.people || [],
    places: dream.analysis?.places || [],
    body: dream.analysis?.body || [],
  };
  return {
    ...(dream.scenes?.[0]?.atmosphere || {}),
    color: dreamColor(dream),
    mood: dream.emotion || dream.analysis?.coreEmotion || "安静",
    symbols: unique([...(dream.analysis?.symbols || []), ...(dream.scenes?.[0]?.atmosphere?.symbols || [])]).slice(0, 6),
    elements: visualElementsFor(text, detail, dream.analysis || { body: [], coreEmotion: dream.emotion || "安静" }, "entrance"),
    sceneRole: "cover",
  };
}

function buildLocalCover(dream) {
  return {
    coverType: "local",
    coverVisual: coverAtmosphereForDream(dream),
    coverPrompt: buildLocalCoverPrompt(dream),
    coverStatus: "success",
  };
}

function buildLocalCoverPrompt(dream) {
  const symbols = (dream.analysis?.symbols || []).slice(0, 5).join("、") || "月光、雾、远处的门";
  const people = (dream.analysis?.people || []).filter((item) => item !== "某个人").slice(0, 3).join("、") || "远处的人影";
  const places = (dream.analysis?.places || []).slice(0, 3).join("、") || "梦里的远处";
  const body = (dream.analysis?.body || []).slice(0, 3).join("、") || "身体仍在记得这个梦";
  const colors = (dream.analysis?.colors || [dream.atmosphere]).filter(Boolean).join("、") || "深夜蓝、雾紫";
  return `这张本地梦境插画由核心情绪「${dream.analysis?.coreEmotion || dream.emotion || "安静"}」、强度 ${dream.intensity || 5}/10、氛围色「${colors}」、意象「${symbols}」、人物「${people}」、地点「${places}」和身体感受「${body}」生成。`;
}

function buildPresetCoverPrompt(dream) {
  return `这张梦境主视觉来自「${dream.title}」产品视觉素材，并叠加本地 Canvas 动态氛围；图片不可用时会回到本地梦境视觉。`;
}

function presetImagesFor(key) {
  return PRESET_ASSETS[key] || [];
}

function coverVisualForDream(dream) {
  if (dream.coverType === "local" && dream.coverVisual) {
    return {
      ...dream.coverVisual,
      color: dream.coverVisual.color || dreamColor(dream),
      sceneRole: dream.coverVisual.sceneRole || "cover",
    };
  }
  return coverAtmosphereForDream(dream);
}

function hasRemoteCover(dream) {
  return Boolean(coverImageForDream(dream));
}

function coverImageForDream(dream, sequenceIndex = 0) {
  const normalized = normalizedCoverImageUrl(dream);
  if (normalized && !isPresetAssetUrl(normalized)) return normalized;
  const images = imagesForDreamWorld(dream);
  const index = (stableImageIndex(dream, images.length, "cover") + sequenceIndex) % images.length;
  return images[index] || images[0] || "";
}

function coverImagesForDreamList(dreams) {
  const usedByWorld = {};
  return dreams.map((dream) => {
    const normalized = normalizedCoverImageUrl(dream);
    if (normalized && !isPresetAssetUrl(normalized)) return normalized;
    const world = dreamWorldForVisual(dream);
    const images = imagesForDreamWorld(dream);
    const used = usedByWorld[world] || new Set();
    usedByWorld[world] = used;
    let imageIndex = stableImageIndex(dream, images.length, "cover");
    if (used.has(images[imageIndex]) && used.size < images.length) {
      for (let step = 1; step < images.length; step += 1) {
        const nextIndex = (imageIndex + step) % images.length;
        if (!used.has(images[nextIndex])) {
          imageIndex = nextIndex;
          break;
        }
      }
    }
    const image = images[imageIndex] || images[0] || "";
    if (image) used.add(image);
    return image;
  });
}

function visualImageForDream(dream, index = 0) {
  const images = imagesForDreamWorld(dream);
  const offset = stableImageIndex(dream, images.length, "scene");
  return images[(offset + index) % images.length] || images[0] || "";
}

function imagesForDreamWorld(dream) {
  const world = dreamWorldForVisual(dream);
  return PRESET_ASSETS[world] || PRESET_ASSETS.月亮图书馆;
}

function dreamWorldForVisual(dream) {
  const world = dream?.dreamWorld || dream?.presetKey || inferWorldFromDreamTitle(dream);
  if (PRESET_ASSETS[world]) return world;
  const emotion = dream?.analysis?.coreEmotion || dream?.emotion || "";
  if (["思念", "孤独", "不安", "恐惧"].includes(emotion)) return "记忆鲸落";
  return "月亮图书馆";
}

function stableImageIndex(dream, length, salt = "") {
  if (!length) return 0;
  const seed = `${salt}|${dream?.id || ""}|${dream?.createdAt || ""}|${dream?.title || ""}|${dream?.afterword || ""}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % length;
}

function isPresetAssetUrl(url) {
  return /product-assets\/(memory-whale|moon-library)-\d{2}\./.test(url);
}

function inferWorldFromDreamTitle(dream) {
  const text = `${dream?.title || ""} ${dream?.fragments?.join(" ") || ""}`;
  if (/鲸|海|告别|妈妈|思念|失去|追不上|回忆/.test(text)) return "记忆鲸落";
  if (/月亮|图书馆|书|未来|小时候|治愈|云/.test(text)) return "月亮图书馆";
  return "";
}

function normalizedCoverImageUrl(dream) {
  const raw = dream?.coverImageUrl || "";
  if (!raw) return "";
  return normalizeAssetPath(raw);
}

function normalizeAssetPath(path) {
  const legacyAssetDir = `${"de"}${"mo"}-assets`;
  return path.replace(`./${legacyAssetDir}/`, "./product-assets/").replace(`${legacyAssetDir}/`, "product-assets/");
}

function normalizeStoredDream(dream) {
  const next = { ...dream };
  next.coverImageUrl = normalizedCoverImageUrl(next);
  next.scenes = (next.scenes || []).map((scene) => ({
    ...scene,
    imageUrl: normalizeAssetPath(scene.imageUrl || ""),
  }));
  const world = next.dreamWorld || next.presetKey;
  if ((!next.coverImageUrl || next.coverStatus === "failed") && PRESET_ASSETS[world]?.[0]) {
    next.coverImageUrl = coverImageForDream(next);
    next.coverType = "preset";
    next.coverStatus = "success";
  }
  if ((!next.scenes || !next.scenes.some((scene) => scene.imageUrl)) && PRESET_ASSETS[world]?.length) {
    next.scenes = (next.scenes || []).map((scene, index) => ({
      ...scene,
      imageUrl: PRESET_ASSETS[world][index] || "",
    }));
  }
  return next;
}

function sceneAtmosphereFor(scene, dream, index = 0) {
  if (scene.atmosphere?.elements?.length) return scene.atmosphere;
  const text = `${scene.tags?.join(" ") || ""} ${scene.narrative || ""} ${dream.analysis?.symbols?.join(" ") || ""} ${dream.analysis?.places?.join(" ") || ""} ${dream.analysis?.people?.join(" ") || ""}`;
  const detail = {
    symbols: unique([...(scene.tags || []), ...(dream.analysis?.symbols || [])]),
    people: dream.analysis?.people || [],
    places: dream.analysis?.places || [],
    body: dream.analysis?.body || [],
  };
  const role = scene.atmosphere?.sceneRole || sceneRoleForIndex(index);
  return {
    ...(scene.atmosphere || {}),
    color: scene.atmosphere?.color || dreamColor(dream),
    mood: scene.atmosphere?.mood || dream.emotion || dream.analysis?.coreEmotion || "安静",
    symbols: detail.symbols.slice(0, 6),
    elements: visualElementsFor(text, detail, dream.analysis || { body: [], coreEmotion: dream.emotion || "安静" }, role),
    sceneRole: role,
  };
}

function dreamColor(dream) {
  return colorForAtmosphere(dream.atmosphere, dream.emotion || dream.analysis?.coreEmotion);
}

function coverStatusText(dream) {
  const status = dream.coverStatus || "idle";
  if (status === "generating") return "梦境插画生成中";
  if (hasRemoteCover(dream)) return "梦境插画已生成";
  if (status === "failed") return "已为你保留本地梦境视觉";
  return "当前使用本地梦境插画";
}

function coverStatusClass(dream) {
  if (dream.coverStatus === "generating") return "generating";
  if (hasRemoteCover(dream)) return "success";
  if (dream.coverStatus === "failed") return "failed";
  return "success local";
}

function maybeGenerateCoverImage(dream) {
  if (!dream.coverEnhanceRequested || !isFluxConfigured()) return;
  window.setTimeout(async () => {
    const prompt = buildCoverPrompt(dream);
    updateDreamCover(dream.id, { coverPrompt: prompt, coverStatus: "generating" });
    try {
      const imageUrl = await generateCoverImage(prompt);
      if (!imageUrl) throw new Error("No image returned");
      updateDreamCover(dream.id, {
        coverType: "flux",
        coverImageUrl: imageUrl,
        coverPrompt: prompt,
        coverStatus: "success",
      });
    } catch {
      updateDreamCover(dream.id, {
        coverImageUrl: "",
        ...buildLocalCover(dream),
        coverPrompt: prompt,
        coverStatus: "failed",
      });
    }
  }, 0);
}

function isFluxConfigured() {
  const config = window.DREAMWALKER_FLUX_CONFIG || {};
  const endpoint = config.endpoint || window.DREAMWALKER_FLUX_ENDPOINT;
  const apiKey = config.apiKey || window.DREAMWALKER_FLUX_API_KEY;
  return Boolean(endpoint && apiKey);
}

function buildCoverPrompt(dream) {
  const place = dream.analysis?.places?.[0] || "一处安静而不可能的梦境空间";
  const symbols = (dream.analysis?.symbols || []).slice(0, 5).join("、") || "月光、雾、远处的门";
  const people = (dream.analysis?.people || []).filter((item) => item !== "某个人").slice(0, 2).join("、") || "远处模糊的人物剪影";
  const body = (dream.analysis?.body || []).slice(0, 3).join("、") || "身体仍记得梦里的轻微感受";
  const emotion = dream.analysis?.coreEmotion || dream.emotion || "安静";
  const colorTheme = (dream.analysis?.colors || [dream.atmosphere]).filter(Boolean).join("、") || "深夜蓝、雾紫、暖金";
  return `一幅梦境感的超现实插画，场景是${place}，关键意象包括${symbols}，远处有${people}，身体感受是${body}，核心情绪是${emotion}，情绪色彩为${colorTheme}，柔和电影光，诗意，温柔，沉浸，无文字，无水印。`;
}

async function generateCoverImage(prompt) {
  const config = window.DREAMWALKER_FLUX_CONFIG || {};
  const endpoint = config.endpoint || window.DREAMWALKER_FLUX_ENDPOINT;
  const apiKey = config.apiKey || window.DREAMWALKER_FLUX_API_KEY;
  if (!endpoint || !apiKey) {
    throw new Error("Flux is not configured");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        width: 1024,
        height: 768,
        output_format: "jpeg",
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Flux request unavailable");
    const data = await response.json();
    return parseImageUrlFromFluxResponse(data);
  } finally {
    window.clearTimeout(timeout);
  }
}

function parseImageUrlFromFluxResponse(data) {
  const direct =
    data?.coverImageUrl ||
    data?.imageUrl ||
    data?.url ||
    data?.image_url ||
    data?.output?.[0] ||
    data?.images?.[0]?.url ||
    data?.data?.[0]?.url;
  if (typeof direct === "string") return direct;
  const b64 = data?.b64_json || data?.images?.[0]?.b64_json || data?.data?.[0]?.b64_json;
  if (b64) return `data:image/jpeg;base64,${b64}`;
  return "";
}

function updateDreamCover(id, patch) {
  const dream = getDream(id);
  if (!dream) return;
  const next = {
    ...dream,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveDream(next);
}

function renderDetail(id) {
  const dream = getDream(id);
  if (!dream) {
    renderEmpty("没有找到这本梦之书", "可以去梦之书架看看其他梦。", "gallery");
    return;
  }
  const coverUrl = coverImageForDream(dream);

  app.innerHTML = `
    <div class="page-title">
      <div>
        <h2>${escapeHtml(dream.title)}</h2>
        <p>${formatDateTime(dream.createdAt)} · 旅人 ${escapeHtml(dream.traveler)}</p>
      </div>
      <div class="toolbar">
        <button class="primary-button" id="replayDream">${icon("replay")}<span>播放回看</span></button>
        <button class="ghost-button" id="deleteDream">${icon("trash")}<span>删除</span></button>
      </div>
    </div>
    <section class="detail-hero">
      <div class="detail-block stack">
        <div class="detail-cover">
          <img src="${escapeAttr(coverUrl)}" alt="梦境插画封面" ${coverUrl ? "" : "hidden"} />
          <canvas id="detailCoverCanvas" aria-hidden="true" ${coverUrl ? "hidden" : ""}></canvas>
          <span class="cover-status ${escapeAttr(coverStatusClass(dream))}">${coverStatusText(dream)}</span>
        </div>
        <p class="cover-prompt muted">${escapeHtml(dream.coverPrompt || buildLocalCoverPrompt(dream))}</p>
        <h2>梦境碎片</h2>
        ${dream.fragments.map((fragment, index) => `<p><strong>碎片 ${index + 1}</strong><br>${escapeHtml(fragment)}</p>`).join("")}
      </div>
      <aside class="detail-block stack">
        ${renderEmotionHolding(dream, true)}
        <h2>梦境理解</h2>
        ${renderAnalysisOverview(dream)}
        <p>${escapeHtml(dream.feedback)}</p>
        ${dream.afterword ? `<p><strong>梦后留言</strong><br>${escapeHtml(dream.afterword)}</p>` : `<p class="muted">还没有梦后留言。</p>`}
      </aside>
    </section>
    <section class="section stack" style="margin-top: 18px;">
      <h2>分镜</h2>
      <div class="scene-grid" id="sceneGrid"></div>
    </section>
  `;
  document.querySelector("#replayDream").addEventListener("click", () => {
    state.playback.index = 0;
    go(`playback:${dream.id}`);
  });
  document.querySelector("#deleteDream").addEventListener("click", () => {
    const ok = window.confirm("确定删除这本梦之书吗？");
    if (!ok) return;
    state.dreams = state.dreams.filter((item) => item.id !== dream.id);
    persistDreams();
    go("gallery");
  });
  renderSceneCards(dream, "#sceneGrid");
  const detailCanvas = document.querySelector("#detailCoverCanvas");
  const detailImg = document.querySelector(".detail-cover img");
  if (detailImg) {
    detailImg.addEventListener("error", () => {
      detailImg.hidden = true;
      if (detailCanvas) {
        detailCanvas.hidden = false;
        drawDreamVisual(detailCanvas, coverVisualForDream(dream));
      }
      markCoverImageFailed(dream.id, document.querySelector(".detail-cover .cover-status"));
    });
  }
  if (detailCanvas && !detailCanvas.hidden) requestAnimationFrame(() => drawDreamVisual(detailCanvas, coverVisualForDream(dream)));
}

function markCoverImageFailed(id, statusNode) {
  const dream = getDream(id);
  updateDreamCover(id, {
    coverImageUrl: "",
    ...(dream ? buildLocalCover(dream) : { coverType: "local", coverStatus: "success" }),
    coverStatus: "failed",
  });
  if (!statusNode) return;
  statusNode.classList.remove("generating", "idle", "failed");
  statusNode.classList.add("failed");
  statusNode.textContent = "已为你保留本地梦境视觉";
}

function renderEmpty(title, body, route) {
  app.innerHTML = `
    <section class="empty panel">
      <div>
        <h2>${title}</h2>
        <p>${body}</p>
        <div class="empty-icon">${icon("planet")}</div>
        <button class="primary-button" data-route="${route}">${icon("sparkles")}<span>前往</span></button>
      </div>
    </section>
  `;
}

function createEmptyDraft() {
  return {
    id: cryptoId(),
    title: "",
    fragments: [{ id: cryptoId(), text: "" }],
    emotion: "安静",
    intensity: 5,
    body: [],
    customBody: "",
    atmosphere: "雾紫",
    generateCover: false,
    presetKey: "",
    presetFeedback: "",
    afterwordTitle: "",
    afterwordQuestion: "",
    presetAssetImages: [],
  };
}

function saveDream(dream) {
  const nextDreams = [...state.dreams];
  const existing = state.dreams.findIndex((item) => item.id === dream.id);
  if (existing >= 0) nextDreams[existing] = dream;
  else nextDreams.push(dream);
  if (!persistDreams(nextDreams)) return false;
  state.dreams = nextDreams;
  return true;
}

function loadDreams() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    state.dreams = stored.map(normalizeStoredDream);
    if (JSON.stringify(stored) !== JSON.stringify(state.dreams)) persistDreams(state.dreams);
  } catch {
    state.dreams = [];
  }
}

function persistDreams(nextDreams = state.dreams) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(nextDreams));
    return true;
  } catch {
    window.alert("本地存储空间不足，梦境没有保存成功。可以删除一些旧梦后再试。");
    return false;
  }
}

function storageKey() {
  return `${STORAGE_PREFIX}${state.traveler.trim().toLowerCase()}`;
}

function getDream(id) {
  return state.dreams.find((dream) => dream.id === id);
}

function newestDream() {
  return sortedDreams()[0];
}

function sortedDreams() {
  return [...state.dreams].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function groupByDate(dreams) {
  return dreams.reduce((acc, dream) => {
    const key = formatDate(new Date(dream.createdAt));
    acc[key] = acc[key] || [];
    acc[key].push(dream);
    return acc;
  }, {});
}

function drawAmbient() {
  const canvas = ambientCanvas;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
  gradient.addColorStop(0, "rgba(155,136,210,0.18)");
  gradient.addColorStop(0.55, "rgba(8,17,32,0.08)");
  gradient.addColorStop(1, "rgba(233,191,116,0.1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < 90; i += 1) {
    const x = seeded(i * 9.2) * window.innerWidth;
    const y = seeded(i * 3.7) * window.innerHeight;
    const r = 0.5 + seeded(i * 1.7) * 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 246, 210, ${0.15 + seeded(i) * 0.45})`;
    ctx.fill();
  }
}

function drawDreamVisual(canvas, config) {
  if (!canvas) return;
  const safeConfig = config || {};
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || canvas.parentElement?.clientWidth || 640);
  const height = Math.max(240, rect.height || canvas.parentElement?.clientHeight || 420);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const base = safeConfig.color || colorForAtmosphere(null, safeConfig.mood) || "#6e5aa8";
  const symbols = safeConfig.symbols || [];
  const elements = safeConfig.elements?.length ? safeConfig.elements : visualElementsFromSymbols(symbols, safeConfig.mood, safeConfig.sceneRole);
  const sceneRole = safeConfig.sceneRole || "default";
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, shade(base, -40));
  bg.addColorStop(0.48, "#07101f");
  bg.addColorStop(1, shade(base, 18));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawNebula(ctx, width, height, base);
  drawMist(ctx, width, height);
  if (!elements.length || elements.includes("moonStars")) drawStars(ctx, width, height);
  drawParticles(ctx, width, height, base);
  if (elements.includes("water")) drawSea(ctx, width, height, base);
  if (elements.includes("rain")) drawRain(ctx, width, height, base);
  if (elements.includes("forest")) drawForest(ctx, width, height, base);
  if (elements.includes("moonStars")) drawMoon(ctx, width, height, base);
  if (elements.includes("doorRoom")) drawDistantThreshold(ctx, width, height, base);
  if (elements.includes("bridgePath")) drawPathLines(ctx, width, height, base);
  if (elements.includes("floatFall")) drawFloatFall(ctx, width, height, base);
  if (elements.includes("person")) drawSilhouette(ctx, width, height, sceneRole);
  if (elements.includes("transit")) drawTransitLines(ctx, width, height, base);
  if (elements.includes("mirrorWindow")) drawMirrorWindow(ctx, width, height, base);
  if (elements.includes("tension")) drawTensionLines(ctx, width, height);
  drawSceneRoleOverlay(ctx, width, height, base, sceneRole);
  drawSymbolShapes(ctx, width, height, symbols, elements);
}

function visualElementsFromSymbols(symbols = [], mood = "", sceneRole = "") {
  const text = `${symbols.join(" ")} ${mood} ${sceneRole}`;
  const elements = [];
  if (/海|水|雨|河|流动|青蓝/.test(text)) elements.push("water");
  if (/雨/.test(text)) elements.push("rain");
  if (/月|夜|星|漂浮|深夜/.test(text)) elements.push("moonStars");
  if (/门|房间|走廊|入口|settle|cover/.test(text)) elements.push("doorRoom");
  if (/桥|路|街|站台/.test(text)) elements.push("bridgePath");
  if (/森林|树|草/.test(text)) elements.push("forest");
  if (/坠|漂|飞|disorder/.test(text)) elements.push("floatFall");
  if (/人|妈妈|父亲|爸爸|朋友|她|他|figure/.test(text)) elements.push("person");
  if (/列车|车站|机场/.test(text)) elements.push("transit");
  if (/镜|窗/.test(text)) elements.push("mirrorWindow");
  if (/火|红|追|恐惧|不安/.test(text)) elements.push("tension");
  return unique(elements);
}

function drawNebula(ctx, width, height, color) {
  for (let i = 0; i < 8; i += 1) {
    const x = width * seeded(i + color.length);
    const y = height * seeded(i * 4.3);
    const radius = Math.max(width, height) * (0.18 + seeded(i * 2.1) * 0.18);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `${hexToRgba(color, 0.26)}`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMist(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#f4edff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    const y = height * (0.18 + i * 0.055);
    ctx.moveTo(-40, y);
    for (let x = 0; x <= width + 60; x += 36) {
      ctx.lineTo(x, y + Math.sin(x * 0.014 + i) * 14);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawRain(ctx, width, height, color) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(color, 0.34);
  ctx.lineWidth = 1;
  for (let i = 0; i < 54; i += 1) {
    const x = seeded(i * 4.8) * width;
    const y = seeded(i * 11.2) * height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10, y + 38 + seeded(i) * 22);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStars(ctx, width, height) {
  for (let i = 0; i < 130; i += 1) {
    const x = seeded(i * 13.1) * width;
    const y = seeded(i * 5.9) * height * 0.72;
    const r = 0.45 + seeded(i * 2.4) * 1.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,246,220,${0.18 + seeded(i * 7.2) * 0.62})`;
    ctx.fill();
  }
}

function drawParticles(ctx, width, height, color) {
  ctx.save();
  for (let i = 0; i < 42; i += 1) {
    const x = seeded(i * 17.3) * width;
    const y = height * (0.12 + seeded(i * 8.1) * 0.64);
    const r = 1.2 + seeded(i * 5.4) * 3.8;
    const alpha = 0.05 + seeded(i * 2.9) * 0.13;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
    gradient.addColorStop(0, hexToRgba(color, alpha + 0.08));
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMoon(ctx, width, height, color) {
  const x = width * 0.76;
  const y = height * 0.2;
  const r = Math.min(width, height) * 0.085;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff1bd";
  ctx.shadowColor = hexToRgba(color, 0.9);
  ctx.shadowBlur = 34;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x + r * 0.36, y - r * 0.1, r * 0.92, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba("#081120", 0.58);
  ctx.fill();
}

function drawForest(ctx, width, height, color) {
  ctx.save();
  const ground = height * 0.76;
  ctx.strokeStyle = hexToRgba(color, 0.38);
  ctx.fillStyle = hexToRgba("#03120b", 0.42);
  for (let i = 0; i < 14; i += 1) {
    const x = width * (0.04 + i * 0.075 + seeded(i) * 0.025);
    const h = height * (0.16 + seeded(i * 2.2) * 0.22);
    ctx.beginPath();
    ctx.moveTo(x, ground);
    ctx.lineTo(x, ground - h);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, ground - h, 24 + seeded(i) * 28, 40 + seeded(i * 3) * 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const fog = ctx.createLinearGradient(0, height * 0.45, 0, height);
  fog.addColorStop(0, hexToRgba(color, 0));
  fog.addColorStop(1, hexToRgba(color, 0.18));
  ctx.fillStyle = fog;
  ctx.fillRect(0, height * 0.42, width, height * 0.58);
  ctx.restore();
}

function drawSea(ctx, width, height, color) {
  const horizon = height * 0.68;
  const gradient = ctx.createLinearGradient(0, horizon, 0, height);
  gradient.addColorStop(0, hexToRgba(color, 0.12));
  gradient.addColorStop(1, "rgba(3,8,18,0.84)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, horizon, width, height - horizon);
  ctx.strokeStyle = "rgba(255, 237, 202, 0.24)";
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    const y = horizon + i * 18;
    ctx.moveTo(0, y);
    for (let x = 0; x <= width; x += 26) {
      ctx.lineTo(x, y + Math.sin(x * 0.018 + i) * 5);
    }
    ctx.stroke();
  }
}

function drawPathLines(ctx, width, height, color) {
  ctx.save();
  const vanishingX = width * 0.58;
  const vanishingY = height * 0.48;
  ctx.strokeStyle = hexToRgba(color, 0.42);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i += 1) {
    const startX = width * (0.08 + i * 0.12);
    ctx.beginPath();
    ctx.moveTo(startX, height);
    ctx.lineTo(vanishingX, vanishingY);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 238, 205, 0.22)";
  for (let i = 0; i < 5; i += 1) {
    const y = height * (0.6 + i * 0.075);
    ctx.beginPath();
    ctx.moveTo(width * 0.18, y);
    ctx.quadraticCurveTo(width * 0.48, y - 28, width * 0.82, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFloatFall(ctx, width, height, color) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(color, 0.36);
  ctx.fillStyle = "rgba(255, 246, 225, 0.24)";
  for (let i = 0; i < 28; i += 1) {
    const x = width * (0.1 + seeded(i * 8.3) * 0.8);
    const y = height * (0.12 + seeded(i * 2.7) * 0.7);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 20, y + 30, x - 12, y + 72, x + 8, y + 104);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 1.4 + seeded(i) * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSilhouette(ctx, width, height, sceneRole = "") {
  ctx.save();
  const scale = sceneRole === "figure" ? 1.18 : 0.88;
  const x = width * (sceneRole === "figure" ? 0.62 : 0.5);
  const y = height * 0.68;
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.arc(x, y - 52 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y, 19 * scale, 48 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTransitLines(ctx, width, height, color) {
  ctx.save();
  const horizon = height * 0.54;
  ctx.strokeStyle = hexToRgba(color, 0.42);
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width * (0.26 + i * 0.08), height);
    ctx.lineTo(width * 0.52, horizon);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 238, 205, 0.2)";
  for (let i = 0; i < 8; i += 1) {
    const y = height * (0.58 + i * 0.05);
    ctx.beginPath();
    ctx.moveTo(width * 0.12, y);
    ctx.lineTo(width * 0.86, y - 12);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 226, 160, 0.2)";
  ctx.fillRect(width * 0.72, horizon - 18, width * 0.08, 12);
  ctx.restore();
}

function drawMirrorWindow(ctx, width, height, color) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 246, 225, 0.34)";
  ctx.fillStyle = hexToRgba(color, 0.1);
  const frames = [
    [width * 0.16, height * 0.24, width * 0.18, height * 0.28],
    [width * 0.64, height * 0.28, width * 0.16, height * 0.24],
  ];
  frames.forEach(([x, y, w, h]) => {
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + h * 0.16);
    ctx.lineTo(x + w * 0.82, y + h * 0.72);
    ctx.stroke();
  });
  ctx.restore();
}

function drawTensionLines(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 80, 96, 0.24)";
  ctx.fillStyle = "rgba(125, 38, 52, 0.24)";
  const glow = ctx.createRadialGradient(width * 0.28, height * 0.62, 0, width * 0.28, height * 0.62, width * 0.42);
  glow.addColorStop(0, "rgba(125, 38, 52, 0.36)");
  glow.addColorStop(1, "rgba(125, 38, 52, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 18; i += 1) {
    const y = height * (0.16 + seeded(i * 2.1) * 0.72);
    ctx.beginPath();
    ctx.moveTo(width * seeded(i), y);
    ctx.lineTo(width * (0.55 + seeded(i * 3.4) * 0.48), y + (seeded(i * 4) - 0.5) * 80);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSceneRoleOverlay(ctx, width, height, color, sceneRole) {
  ctx.save();
  if (sceneRole === "entrance" || sceneRole === "cover") {
    drawDistantThreshold(ctx, width, height, color);
  }
  if (sceneRole === "echo") {
    drawSea(ctx, width, height, color);
  }
  if (sceneRole === "settle") {
    const glow = ctx.createRadialGradient(width * 0.7, height * 0.22, 0, width * 0.7, height * 0.22, width * 0.34);
    glow.addColorStop(0, "rgba(255, 226, 160, 0.24)");
    glow.addColorStop(1, "rgba(255, 226, 160, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

function drawDistantThreshold(ctx, width, height, color) {
  ctx.save();
  const horizon = height * 0.61;
  const doorW = Math.max(34, width * 0.07);
  const doorH = Math.max(82, height * 0.24);
  const x = width * 0.78;
  const y = horizon - doorH * 0.72;
  const glow = ctx.createRadialGradient(x + doorW / 2, y + doorH / 2, 0, x + doorW / 2, y + doorH / 2, doorH * 1.2);
  glow.addColorStop(0, "rgba(255, 226, 160, 0.18)");
  glow.addColorStop(1, "rgba(255, 226, 160, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - doorW * 2, y - doorH, doorW * 5, doorH * 3);
  ctx.strokeStyle = "rgba(255, 238, 205, 0.34)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, doorW, doorH);
  ctx.beginPath();
  ctx.moveTo(width * 0.18, height * 0.75);
  ctx.quadraticCurveTo(width * 0.48, height * 0.58, x + doorW / 2, y + doorH);
  ctx.strokeStyle = hexToRgba(color, 0.32);
  ctx.stroke();
  ctx.restore();
}

function drawSymbolShapes(ctx, width, height, symbols, elements = []) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,246,225,0.43)";
  ctx.fillStyle = "rgba(255,246,225,0.13)";
  ctx.lineWidth = 2;
  if (symbols.includes("门")) {
    const w = width * 0.12;
    const h = height * 0.22;
    const x = width * 0.16;
    const y = height * 0.48;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.arc(x + w * 0.78, y + h * 0.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (symbols.includes("桥")) {
    ctx.beginPath();
    ctx.arc(width * 0.48, height * 0.72, width * 0.26, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.72);
    ctx.lineTo(width * 0.74, height * 0.72);
    ctx.stroke();
  }
  if (symbols.includes("云")) {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(width * (0.28 + i * 0.08), height * 0.3, 42, 15 + i * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (elements.includes("person") || symbols.some((item) => /人|妈妈|父亲|爸爸|朋友|她|他/.test(item))) {
    ctx.beginPath();
    ctx.ellipse(width * 0.52, height * 0.68, width * 0.035, height * 0.09, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fill();
  }
  ctx.restore();
}

function colorForAtmosphere(atmosphere, emotion) {
  const byAtmosphere = ATMOSPHERES.find((item) => item.id === atmosphere);
  const byEmotion = EMOTIONS.find((item) => item.id === emotion);
  const byTone = ATMOSPHERES.find((item) => item.id === byEmotion?.tone || item.emotions?.includes(emotion));
  return byAtmosphere?.color || byTone?.color || byEmotion?.color || "#6e5aa8";
}

function shade(hex, amount) {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (num & 255) + amount));
  return `rgb(${r},${g},${b})`;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  return `rgba(${num >> 16},${(num >> 8) & 255},${num & 255},${alpha})`;
}

function seeded(n) {
  return Math.abs(Math.sin(n * 999.91) * 10000) % 1;
}

function getSpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  return `${formatDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatTime(value) {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function showInlineError(id, message, className = "error-box") {
  const node = document.querySelector(`#${id}`);
  if (!node) return;
  node.className = className;
  node.textContent = message;
  node.hidden = false;
}

function hideInlineError(id) {
  const node = document.querySelector(`#${id}`);
  if (node) node.hidden = true;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value);
}
