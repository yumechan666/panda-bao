import { loadGameAssets, loadSkinAssets } from "./assets.js";
import { createGameAudio } from "./audio.js";
import { createInput } from "./input.js";
import { createRenderer } from "./renderer.js";
import { updateGame } from "./simulation.js";
import { buildUi } from "./ui.js";
import { AREAS, areaIndexAt, createContinuousWorld, worldXFromLegacyRoom } from "./world.js";

const TWEAK_KEYS = ["playerSpeed", "jumpForce", "gravity", "enemyDamage", "cameraSmoothing", "effectsIntensity"];

function safeSave(raw) {
  if (!raw) return null;
  if (raw.version === 2) {
    const worldX = worldXFromLegacyRoom(raw.roomId);
    return {
      worldX,
      checkpoint: { x: raw.checkpoint?.roomId ? worldXFromLegacyRoom(raw.checkpoint.roomId) + Math.max(0, Number(raw.checkpoint.x) || 0) : worldX },
      abilities: Array.isArray(raw.abilities) ? raw.abilities : [],
      collected: Array.isArray(raw.collected) ? raw.collected : [],
      shards: Number(raw.shards) || 0,
      leaves: Number(raw.leaves) || 0,
      relics: Number(raw.relics) || 0,
      maxHp: Math.max(5, Number(raw.maxHp) || 5),
      maxEnergy: Math.max(100, Number(raw.maxEnergy) || 100),
      elapsed: Number(raw.elapsed) || 0,
      bestTime: Number.isFinite(raw.bestTime) ? raw.bestTime : null,
      skin: "JADE",
    };
  }
  if (raw.version === 3) {
    return {
      worldX: Math.max(150, (Number(raw.worldX) || 150) * 3),
      checkpoint: { x: Math.max(150, (Number(raw.checkpoint?.x) || 150) * 3) },
      abilities: Array.isArray(raw.abilities) ? raw.abilities : [], collected: Array.isArray(raw.collected) ? raw.collected : [],
      shards: Number(raw.shards) || 0, leaves: Number(raw.leaves) || 0, relics: Number(raw.relics) || 0,
      maxHp: Math.max(5, Number(raw.maxHp) || 5), maxEnergy: Math.max(100, Number(raw.maxEnergy) || 100),
      elapsed: Number(raw.elapsed) || 0, bestTime: Number.isFinite(raw.bestTime) ? raw.bestTime : null,
      skin: typeof raw.skin === "string" ? raw.skin : "JADE",
    };
  }
  if (raw.version !== 4) return null;
  return {
    worldX: Number.isFinite(raw.worldX) ? Math.max(150, raw.worldX) : 150,
    checkpoint: raw.checkpoint && Number.isFinite(raw.checkpoint.x) ? raw.checkpoint : { x: 150 },
    abilities: Array.isArray(raw.abilities) ? raw.abilities.filter((value) => typeof value === "string") : [],
    collected: Array.isArray(raw.collected) ? raw.collected.filter((value) => typeof value === "string") : [],
    shards: Number.isFinite(raw.shards) ? Math.max(0, raw.shards) : 0,
    leaves: Number.isFinite(raw.leaves) ? Math.max(0, raw.leaves) : 0,
    relics: Number.isFinite(raw.relics) ? Math.max(0, raw.relics) : 0,
    maxHp: Number.isFinite(raw.maxHp) ? Math.max(5, raw.maxHp) : 5,
    maxEnergy: Number.isFinite(raw.maxEnergy) ? Math.max(100, raw.maxEnergy) : 100,
    elapsed: Number.isFinite(raw.elapsed) ? Math.max(0, raw.elapsed) : 0,
    bestTime: Number.isFinite(raw.bestTime) ? raw.bestTime : null,
    skin: typeof raw.skin === "string" ? raw.skin : "JADE",
  };
}

function createInitialState(saved) {
  const abilities = new Set(saved?.abilities ?? []);
  abilities.add("rush");
  const collected = new Set(saved?.collected ?? []);
  return {
    time: 0,
    elapsed: saved?.elapsed ?? 0,
    room: null,
    paused: false,
    gameOver: false,
    won: false,
    shake: 0,
    effects: [],
    destroyedProps: new Set(),
    lastSafeX: 150,
    checkpoint: saved?.checkpoint ?? { x: 150 },
    bestTime: saved?.bestTime ?? null,
    progress: {
      abilities,
      collected,
      shards: saved?.shards ?? 0,
      leaves: saved?.leaves ?? 0,
      relics: saved?.relics ?? 0,
      visitedAreas: new Set(),
    },
    player: {
      x: saved?.worldX ?? 150,
      y: 650,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: saved?.maxHp ?? 5,
      maxHp: saved?.maxHp ?? 5,
      energy: saved?.maxEnergy ?? 100,
      maxEnergy: saved?.maxEnergy ?? 100,
      onGround: false,
      groundPlatform: null,
      invulnerable: 0,
      attackTimer: 0,
      attackSerial: 0,
      combo: 0,
      chargeHold: 0,
      chargedAttack: false,
      slamming: false,
      slamImpact: 0,
      slamHit: false,
      pogoing: false,
      swinging: null,
      rushTimer: 0,
      doubleUsed: false,
      sleeping: false,
      sleepHold: 0,
      sleepTimer: 0,
      animTime: 0,
      animOverride: null,
      anim: { sheet: "BAO_LOCOMOTION", name: "idle", fps: 6 },
      skin: saved?.skin ?? "JADE",
    },
  };
}

export function createGame({ mount, sdk, tweaks, assets }) {
  let cleanup = () => {};

  return {
    start() {
      const ui = buildUi(mount);
      const input = createInput(ui.shell);
      let renderer = null;
      let audio = null;
      let frameId = 0;
      let destroyed = false;
      let state = null;
      let lastTime = performance.now();
      const config = {};
      const unsubscribers = [];

      for (const key of TWEAK_KEYS) {
        config[key] = Number(tweaks.get(key));
        unsubscribers.push(tweaks.subscribe(key, (value) => { config[key] = Number(value); }));
      }

      const haptic = (duration) => {
        try {
          if (sdk.device.haptics.isSupported()) void sdk.device.haptics.vibrate(duration).catch(() => {});
        } catch {
          // Haptics are optional; the visual hit still lands.
        }
      };

      function serialize() {
        return {
          version: 4,
          worldX: Math.round(state.player.x),
          checkpoint: state.checkpoint,
          abilities: [...state.progress.abilities],
          collected: [...state.progress.collected],
          shards: state.progress.shards,
          leaves: state.progress.leaves,
          relics: state.progress.relics,
          maxHp: state.player.maxHp,
          maxEnergy: state.player.maxEnergy,
          elapsed: state.elapsed,
          bestTime: state.bestTime,
          skin: state.player.skin,
        };
      }

      function saveProgress() {
        void sdk.gameState.save(serialize()).catch(() => {});
      }

      function setMap(open) {
        ui.map.hidden = !open;
        if (state) state.paused = open;
      }

      ui.mapButton.addEventListener("click", () => setMap(ui.map.hidden));
      ui.closeMap.addEventListener("click", () => setMap(false));

      function retry() {
        ui.hideResult();
        if (state.won) {
          state.won = false;
          state.gameOver = false;
          state.player.x = 150;
          state.player.y = 630;
          state.player.hp = state.player.maxHp;
          state.player.energy = state.player.maxEnergy;
        } else {
          state.gameOver = false;
          state.player.hp = state.player.maxHp;
          state.player.energy = state.player.maxEnergy;
          state.player.x = state.checkpoint.x;
          state.player.y = 630;
          state.player.vx = 0;
          state.player.vy = 0;
          ui.toast("Bangun dari Power Nap");
        }
      }
      ui.retry.addEventListener("click", retry);
      let library = null;
      ui.skinButtons.forEach((button) => button.addEventListener("click", async () => {
        if (!state || !library || button.dataset.skin === state.player.skin) return;
        button.disabled = true;
        ui.toast(`Menyiapkan skin ${button.textContent}…`);
        try {
          await loadSkinAssets(library, assets, button.dataset.skin);
          state.player.skin = button.dataset.skin;
          saveProgress();
          ui.toast(`${button.textContent} dipakai`);
        } catch {
          ui.toast("Skin gagal dimuat");
        } finally {
          button.disabled = false;
        }
      }));

      const unlockAudio = () => audio?.unlock();
      ui.shell.addEventListener("pointerdown", unlockAudio, { capture: true });
      window.addEventListener("keydown", unlockAudio, { capture: true });

      function loop(now) {
        if (destroyed) return;
        try {
          const dt = Math.min(0.033, Math.max(0.001, (now - lastTime) / 1000));
          lastTime = now;
          if (input.consume("map")) setMap(ui.map.hidden);
          updateGame(state, input, dt, {
            config,
            audio,
            haptic,
            toast: (message) => ui.toast(message),
            transition() {},
            onCheckpoint() {
              state.checkpoint = { x: Math.round(state.player.x) };
              saveProgress();
            },
            onProgressSave() {
              state.checkpoint = { x: Math.round(state.player.x) };
              saveProgress();
            },
            onAreaChange() { saveProgress(); },
            onDefeat() {
              if (state.gameOver) return;
              state.gameOver = true;
              ui.showResult({ win: false, elapsed: state.elapsed, score: 0, relics: state.progress.relics });
            },
            onWin() {
              if (state.won) return;
              state.won = true;
              const score = Math.max(1, Math.floor(1_000_000 - state.elapsed * 100));
              state.bestTime = state.bestTime == null ? state.elapsed : Math.min(state.bestTime, state.elapsed);
              state.progress.collected.add("boss-defeated");
              ui.showResult({ win: true, elapsed: state.elapsed, score, relics: state.progress.relics });
              saveProgress();
              void sdk.leaderboard.submit(score).catch(() => {});
            },
          });
          renderer.render(state, dt);
          ui.update(state, dt);
        } catch (error) {
          console.error("Game loop error:", error);
          ui.toast(`Error: ${error?.message ?? error}`, 6);
        }
        frameId = requestAnimationFrame(loop);
      }

      async function boot() {
        try {
          const savedRaw = await sdk.gameState.load().catch(() => null);
          const saved = safeSave(savedRaw);
          const [loadedLibrary, gameAudio] = await Promise.all([
            loadGameAssets(assets, (progress) => ui.setLoading(progress), saved?.skin ?? "JADE"),
            createGameAudio(sdk),
          ]);
          if (destroyed) return;
          library = loadedLibrary;
          audio = gameAudio;
          state = createInitialState(saved);
          state.room = createContinuousWorld(state.progress.collected);
          state.room.areaIndex = areaIndexAt(state.player.x);
          state.room.area = AREAS[state.room.areaIndex];
          state.room.icy = state.room.areaIndex === 8;
          state.room.windy = state.room.areaIndex === 4 || state.room.areaIndex === 11;
          state.room.poisonous = state.room.areaIndex === 7;
          for (let index = 0; index <= state.room.areaIndex; index += 1) state.progress.visitedAreas.add(index);
          state.puzzleSwitches = new Set();
          renderer = createRenderer(ui.canvas, library, config);
          ui.ready();
          ui.toast("Bergerak, lompat, lalu coba tongkat bambu", 3.2);
          lastTime = performance.now();
          frameId = requestAnimationFrame(loop);
        } catch (error) {
          console.error("Boot gagal:", error);
          ui.loadCopy.textContent = "Jalur tinta gagal terbuka.";
          const detail = document.createElement("p");
          detail.className = "load-copy";
          detail.style.opacity = "0.7";
          detail.style.fontSize = "13px";
          detail.textContent = error?.message ?? String(error);
          ui.loading.querySelector(".compact-panel").append(detail);
          const retryButton = document.createElement("button");
          retryButton.className = "ink-button";
          retryButton.innerHTML = '<span class="control-label">Coba Muat Lagi</span>';
          retryButton.addEventListener("click", () => window.location.reload());
          ui.loading.querySelector(".compact-panel").append(retryButton);
        }
      }

      void boot();

      cleanup = () => {
        destroyed = true;
        cancelAnimationFrame(frameId);
        renderer?.destroy();
        input.destroy();
        audio?.destroy();
        unsubscribers.forEach((unsubscribe) => unsubscribe());
        ui.mapButton.replaceWith(ui.mapButton.cloneNode(true));
        ui.closeMap.replaceWith(ui.closeMap.cloneNode(true));
        ui.retry.replaceWith(ui.retry.cloneNode(true));
        ui.shell.removeEventListener("pointerdown", unlockAudio, { capture: true });
        window.removeEventListener("keydown", unlockAudio, { capture: true });
        mount.replaceChildren();
      };
    },
    destroy() {
      cleanup();
      cleanup = () => {};
    },
  };
}
