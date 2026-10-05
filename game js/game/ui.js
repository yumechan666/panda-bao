import { AREAS, SEGMENTS_PER_AREA, SKINS } from "./world.js";

export function buildUi(mount) {
  const shell = document.createElement("section");
  shell.className = "game-shell";
  shell.innerHTML = `
    <canvas class="game-surface" aria-label="Bao: Akar Giok"></canvas>
    <div class="hud-layer" aria-live="polite">
      <div class="hud-row ink-hud">
        <div class="health-cluster">
          <div class="portrait-stamp" aria-hidden="true"><span>熊</span></div>
          <div class="pip-row health-pips" aria-label="Kesehatan"></div>
        </div>
        <div class="area-badge"><span class="area-name">Hutan Rebung</span><span class="room-mark">I</span></div>
        <div class="hud-tools">
          <span class="badge collectible-count">◆ 0/18</span>
          <button class="icon-btn map-btn" type="button" aria-label="Buka peta">⌘</button>
        </div>
      </div>
      <div class="energy-wrap" aria-label="Energi bambu"><div class="energy-fill"></div><span>ENERGI BAMBU</span></div>
      <div class="boss-wrap" hidden><span>RAJA KELABANG BARA</span><div><i></i></div></div>
    </div>
    <div class="context-prompt" hidden></div>
    <div class="toast" hidden></div>
    <div class="touch-controls" aria-label="Kontrol sentuh">
      <div class="move-pad">
        <button class="touch-btn move left" data-action="left" aria-label="Kiri"><span>◀</span></button>
        <button class="touch-btn move down" data-action="down" aria-label="Bawah"><span>▼</span></button>
        <button class="touch-btn move right" data-action="right" aria-label="Kanan"><span>▶</span></button>
      </div>
      <div class="action-pad">
        <button class="touch-btn rush" data-action="rush"><span class="control-label">RUSH</span></button>
        <button class="touch-btn attack" data-action="attack" aria-label="Serang"><span>棍</span></button>
        <button class="touch-btn jump" data-action="jump" aria-label="Lompat"><span>↑</span></button>
      </div>
    </div>
    <div class="overlay loading-overlay">
      <div class="overlay-panel compact-panel">
        <div class="ink-seal">宝</div>
        <h1>Menyiapkan Akar Giok</h1>
        <div class="load-track"><i></i></div>
        <p class="load-copy">Merangkai gerakan tinta…</p>
      </div>
    </div>
    <div class="overlay map-overlay" hidden>
      <div class="overlay-panel map-panel">
        <div class="overlay-head"><h2>Peta Akar Giok</h2><button class="icon-btn close-map" type="button" aria-label="Tutup peta">×</button></div>
        <div class="map-grid">
          ${AREAS.map((area, index) => `<div class="map-node" data-area="${index}"><b>${index + 1}</b><span>${area.short}</span></div>`).join("")}
        </div>
        <div class="ability-strip" aria-label="Kemampuan"></div>
        <h3 class="skin-heading">Skin Bao</h3>
        <div class="skin-grid">${SKINS.map((skin) => `<button type="button" data-skin="${skin.id}">${skin.name}</button>`).join("")}</div>
      </div>
    </div>
    <div class="overlay result-overlay" hidden>
      <div class="overlay-panel result-panel">
        <div class="result-seal">葉</div>
        <h2 class="result-title">Bao beristirahat</h2>
        <p class="result-copy"></p>
        <div class="result-stats"></div>
        <button class="ink-button retry-btn" type="button"><span class="control-label">Coba Lagi</span></button>
      </div>
    </div>
  `;
  mount.replaceChildren(shell);

  const refs = {
    shell,
    canvas: shell.querySelector("canvas"),
    health: shell.querySelector(".health-pips"),
    area: shell.querySelector(".area-name"),
    roomMark: shell.querySelector(".room-mark"),
    shards: shell.querySelector(".collectible-count"),
    energy: shell.querySelector(".energy-fill"),
    boss: shell.querySelector(".boss-wrap"),
    bossLabel: shell.querySelector(".boss-wrap > span"),
    bossFill: shell.querySelector(".boss-wrap i"),
    prompt: shell.querySelector(".context-prompt"),
    toast: shell.querySelector(".toast"),
    loading: shell.querySelector(".loading-overlay"),
    loadFill: shell.querySelector(".load-track i"),
    loadCopy: shell.querySelector(".load-copy"),
    map: shell.querySelector(".map-overlay"),
    mapButton: shell.querySelector(".map-btn"),
    closeMap: shell.querySelector(".close-map"),
    abilityStrip: shell.querySelector(".ability-strip"),
    skinButtons: [...shell.querySelectorAll("[data-skin]")],
    result: shell.querySelector(".result-overlay"),
    resultTitle: shell.querySelector(".result-title"),
    resultCopy: shell.querySelector(".result-copy"),
    resultStats: shell.querySelector(".result-stats"),
    retry: shell.querySelector(".retry-btn"),
    rushButton: shell.querySelector(".touch-btn.rush"),
  };

  let toastTimer = 0;
  let lastHp = -1;

  return {
    ...refs,
    setLoading(progress) {
      refs.loadFill.style.width = `${Math.round(progress * 100)}%`;
      refs.loadCopy.textContent = progress < 0.5 ? "Merangkai gerakan tinta…" : "Membuka jalur bambu…";
    },
    ready() { refs.loading.hidden = true; },
    toast(message, duration = 2.2) {
      refs.toast.textContent = message;
      refs.toast.hidden = false;
      toastTimer = duration;
    },
    showResult({ win, elapsed, score, relics }) {
      refs.result.hidden = false;
      refs.resultTitle.textContent = win ? "Pohon Induk Pulih" : "Bao Terbangun";
      refs.resultCopy.textContent = win ? "Korupsi belerang surut dan jalur bambu kembali bernapas." : "Kembali ke Power Nap terakhir dan coba rute yang berbeda.";
      refs.resultStats.innerHTML = win
        ? `<span>Waktu <b>${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, "0")}</b></span><span>Skor Akar <b>${score}</b></span><span>Relik <b>${relics}/5</b></span>`
        : "";
      refs.retry.querySelector("span").textContent = win ? "Jelajahi Lagi" : "Bangun Lagi";
    },
    hideResult() { refs.result.hidden = true; },
    update(state, dt) {
      if (toastTimer > 0) {
        toastTimer -= dt;
        if (toastTimer <= 0) refs.toast.hidden = true;
      }
      if (state.player.hp !== lastHp || refs.health.children.length !== state.player.maxHp) {
        refs.health.replaceChildren(...Array.from({ length: state.player.maxHp }, (_, index) => {
          const pip = document.createElement("span");
          pip.className = `pip leaf-pip${index < state.player.hp ? " full" : ""}`;
          return pip;
        }));
        lastHp = state.player.hp;
      }
      refs.area.textContent = state.room.area.short;
      refs.roomMark.textContent = `${state.room.variant + 1}/${SEGMENTS_PER_AREA}`;
      refs.shards.textContent = `◆ ${state.progress.shards}/120`;
      refs.energy.style.width = `${Math.max(0, Math.min(100, state.player.energy / state.player.maxEnergy * 100))}%`;
      const rushUnlocked = state.progress.abilities.has("rush");
      refs.rushButton.classList.toggle("locked", !rushUnlocked);
      refs.rushButton.querySelector("span").textContent = rushUnlocked ? "RUSH" : "RUSH 🔒";
      const boss = state.room.enemies.find((enemy) => enemy.type === "boss");
      const eclipse = state.room.enemies.find((enemy) => enemy.type === "eclipse_crane");
      const activeBoss = state.room.areaIndex === 19 ? eclipse : state.room.areaIndex === 9 ? boss : null;
      refs.boss.hidden = !activeBoss || activeBoss.dead;
      if (activeBoss) {
        refs.bossLabel.textContent = activeBoss.type === "eclipse_crane" ? "BANGAU GERHANA" : "RAJA KELABANG BARA";
        refs.bossFill.style.width = `${Math.max(0, activeBoss.hp / activeBoss.maxHp * 100)}%`;
      }
      const nearbyDoor = state.room.doors.find((door) => Math.abs(door.x - state.player.x) < 90 && Math.abs(door.y - state.player.y) < 130);
      const nearbySafe = state.room.props.find((prop) => (prop.type === "safe_moss" || prop.safe) && Math.abs(prop.x - state.player.x) < 115);
      const nearbySwing = state.room.props.find((prop) => prop.swing && Math.abs(prop.x - state.player.x) < 145);
      let prompt = "";
      if (nearbyDoor) prompt = "▼ Masuk";
      else if (nearbySafe && state.player.onGround) prompt = "▼ Power Nap aman";
      else if (nearbySwing && state.progress.abilities.has("swing")) prompt = "Tahan Lompat untuk mengayun";
      refs.prompt.hidden = !prompt;
      refs.prompt.textContent = prompt;
      refs.shell.querySelectorAll(".map-node").forEach((node) => node.classList.toggle("visited", state.progress.visitedAreas.has(Number(node.dataset.area))));
      refs.abilityStrip.textContent = [...state.progress.abilities].map((ability) => ({ swing: "Ayun", shockwave: "Gelombang", pogo: "Pogo", pole: "Vault", charge: "Charge", rush: "Rush", armor: "Zirah", frost: "Beku" }[ability])).filter(Boolean).join(" · ");
      refs.skinButtons.forEach((button) => button.classList.toggle("selected", button.dataset.skin === state.player.skin));
    },
  };
}
