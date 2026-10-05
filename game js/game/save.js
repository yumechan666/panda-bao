export function defaultSave() {
  return {
    version: 1,
    currentWorld: 1,
    unlockedWorld: 1,
    currentX: 260,
    coins: 12,
    worlds: {},
    letters: [],
    selectedSkin: "forest",
    cosmetics: { owned: ["classic"], equipped: "classic" },
    settings: { music: true, ambience: true, sfx: true, reducedMotion: false, textSpeed: "normal" },
  };
}

function validNumber(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
}

export function sanitizeSave(raw) {
  const base = defaultSave();
  if (!raw || raw.version !== 1) return base;
  const worlds = {};
  if (raw.worlds && typeof raw.worlds === "object") {
    for (const [key, world] of Object.entries(raw.worlds)) {
      const id = validNumber(Number(key), 0, 1, 25);
      if (!id || !world || typeof world !== "object") continue;
      worlds[id] = {
        delivered: Array.isArray(world.delivered) ? world.delivered.filter((value) => typeof value === "string").slice(0, 8) : [],
        stars: validNumber(world.stars, 0, 0, 3),
        hints: validNumber(world.hints, 0, 0, 99),
        wrong: validNumber(world.wrong, 0, 0, 999),
        completed: Boolean(world.completed),
      };
    }
  }
  return {
    ...base,
    currentWorld: validNumber(raw.currentWorld, 1, 1, 25),
    unlockedWorld: validNumber(raw.unlockedWorld, 1, 1, 25),
    currentX: validNumber(raw.currentX, 260, 0, 4820),
    coins: validNumber(raw.coins, 12, 0),
    worlds,
    letters: Array.isArray(raw.letters) ? raw.letters.filter((entry) => entry && typeof entry.id === "string").slice(0, 200) : [],
    selectedSkin: ["forest", "wizard", "pirate", "royal", "winter", "autumn", "sakura", "moon", "rainbow", "halloween", "robot", "galaxy"].includes(raw.selectedSkin) ? raw.selectedSkin : "forest",
    cosmetics: {
      owned: Array.isArray(raw.cosmetics?.owned) ? raw.cosmetics.owned.filter((item) => typeof item === "string") : ["classic"],
      equipped: typeof raw.cosmetics?.equipped === "string" ? raw.cosmetics.equipped : "classic",
    },
    settings: { ...base.settings, ...(raw.settings || {}) },
  };
}

export async function loadSave(sdk) {
  try {
    return sanitizeSave(await sdk.gameState.load());
  } catch {
    return defaultSave();
  }
}

export function saveProgress(sdk, save) {
  void sdk.gameState.save(save).catch(() => {});
}
