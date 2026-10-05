import manifest from "../assets.json";

const SHEET_KEYS = new Set([
  "BAO_LOCOMOTION", "BAO_AIR", "BAO_STAFF", "BAO_REACTIONS", "BAO_SLAM",
  "BAO_SWING", "BAO_VAULT_NAP", "BAO_UTILITY", "CATERPILLAR_CORE", "BEE_CORE",
  "GUARDIAN_CORE", "BAT_CORE", "SPIDER_CORE", "MACAQUE_CORE", "PANGOLIN_CORE",
  "FOX_CORE", "FOREST_ENEMY_REACTIONS", "GROTTO_ENEMY_REACTIONS",
  "VILLAGE_ENEMY_REACTIONS", "MOUNTAIN_ENEMY_REACTIONS", "BOSS_CORE", "BOSS_PHASES",
  "TILES_FOREST_SHRINE", "TILES_GROTTO_CLIFF", "TILES_VILLAGE_GOLDEN",
  "TILES_LATE_GAME", "TRAVERSAL_PROPS", "HAZARD_REWARD_PROPS", "HUD_ICONS",
  "COMBAT_EFFECTS", "WORLD_EFFECTS",
  "BAO_PUZZLE_ACTIONS", "BAO_WORLD_ACTIONS", "WONDER_PUZZLE_PROPS", "SKY_PUZZLE_PROPS",
  "TILES_PAPER_KITE", "TILES_LIBRARY_TEA", "TILES_BELL_FIREFLY", "TILES_CITY_SKY",
  "WONDER_PUZZLE_EFFECTS", "SKY_PUZZLE_EFFECTS", "PAPER_MANTIS_CORE", "KITE_VULTURE_CORE",
  "CLOCK_TERMITE_CORE", "TEA_BEETLE_CORE", "BELL_TOAD_CORE", "FIREFLY_DRAKE_CORE",
  "BAMBOO_AUTOMATON_CORE", "CLOUD_PUFFER_CORE", "SHADOW_HARE_CORE", "ECLIPSE_CRANE_CORE",
  "ECLIPSE_CRANE_PHASES", "PAPER_WIND_REACTIONS", "LIBRARY_TEA_REACTIONS",
  "BELL_FIREFLY_REACTIONS", "CITY_CLOUD_REACTIONS", "MOON_CROWN_REACTIONS",
  "EXPANSION_PROPS_ALPHA", "EXPANSION_PROPS_BETA", "EXPANSION_PROPS_GAMMA",
  "EXPANSION_EFFECTS_ALPHA", "EXPANSION_EFFECTS_BETA", "EXPANSION_EFFECTS_GAMMA",
]);

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Gagal memuat ${url}`));
    image.src = url;
  });
}

function frameUrl(url) {
  return url.replace(/\.(webp|png|jpe?g)$/i, ".frames.json");
}

const SKIN_ANIMATIONS = {
  LOCOMOTION: ["idle", "walk", "run", "turn"], AIR: ["jump_rise", "fall", "land", "double_jump"],
  STAFF: ["combo_1", "combo_2", "combo_3", "charge"], REACTIONS: ["charged_strike", "hurt", "knockback", "defeated"],
  SLAM: ["slam_windup", "slam_dive", "slam_impact", "pogo_strike"], SWING: ["swing_grab", "swing_arc", "swing_release", "pole_plant"],
  VAULT_NAP: ["pole_bend", "pole_launch", "sugar_rush", "power_nap"], UTILITY: ["wake", "shockwave", "wall_run", "heal"],
  PUZZLE: ["gravity_flip", "kite_glide", "bell_strike", "carry_light"], WORLD: ["push", "pull", "shadow_step", "root_climb"],
};

function syntheticSkinFrames(key, image) {
  const suffix = Object.keys(SKIN_ANIMATIONS).find((name) => key.endsWith(`_${name}`));
  const names = SKIN_ANIMATIONS[suffix] || SKIN_ANIMATIONS.LOCOMOTION;
  const cellWidth = image.width / 5;
  const cellHeight = image.height / 4;
  const frames = [];
  const animations = names.map((name, row) => ({
    name,
    frames: Array.from({ length: 5 }, (_, column) => {
      const source = { x: column * cellWidth, y: row * cellHeight, w: cellWidth, h: cellHeight };
      const frame = { name: `${name}_${column + 1}`, source, content: source, anchor: { x: source.x + source.w / 2, y: source.y + source.h } };
      frames.push(frame);
      return frame;
    }),
  }));
  return { frames, animations };
}

function placeholderEntry(key) {
  return { key, image: null, data: null, frames: new Map(), animations: new Map() };
}

async function loadEntry(key, url) {
  let image;
  try {
    image = await loadImage(url);
  } catch (error) {
    console.warn(`[assets] gagal memuat gambar "${key}" dari ${url}`, error);
    return placeholderEntry(key);
  }
  const needsFrames = SHEET_KEYS.has(key) || key.startsWith("SKIN_");
  let data = null;
  if (needsFrames) {
    try {
      const response = await fetch(frameUrl(url));
      if (!response.ok) throw new Error("missing frames");
      data = await response.json();
    } catch (error) {
      if (!key.startsWith("SKIN_")) {
        console.warn(`[assets] frame tidak ditemukan untuk "${key}", pakai placeholder`, error);
        return placeholderEntry(key);
      }
      data = syntheticSkinFrames(key, image);
    }
  }
  const frames = new Map((data?.frames ?? []).map((frame) => [frame.name, frame]));
  const animations = new Map((data?.animations ?? []).map((animation) => [animation.name, animation.frames]));
  return { key, image, data, frames, animations };
}

export async function loadGameAssets(assetsHandle, onProgress = () => {}, skinId = "JADE") {
  const entries = Object.entries(manifest).filter(([key]) => !key.startsWith("SKIN_") || key.startsWith(`SKIN_${skinId}_`));
  let complete = 0;
  let failed = 0;
  const loaded = await Promise.all(entries.map(async ([key, fallback]) => {
    const activeUrl = assetsHandle?.get(key) || fallback;
    let entry;
    try {
      entry = await loadEntry(key, activeUrl);
    } catch (error) {
      console.warn(`[assets] "${key}" gagal dimuat, pakai placeholder`, error);
      entry = placeholderEntry(key);
      failed += 1;
    }
    if (entry.image == null) failed += 1;
    complete += 1;
    onProgress(complete / entries.length);
    return [key, entry];
  }));
  if (failed > 0) console.warn(`[assets] ${failed}/${entries.length} aset tidak termuat — sebagian visual mungkin hilang`);
  return new Map(loaded);
}

export async function loadSkinAssets(library, assetsHandle, skinId) {
  const entries = Object.entries(manifest).filter(([key]) => key.startsWith(`SKIN_${skinId}_`) && !library.has(key));
  const loaded = await Promise.all(entries.map(async ([key, fallback]) => {
    let entry;
    try {
      entry = await loadEntry(key, assetsHandle?.get(key) || fallback);
    } catch (error) {
      console.warn(`[assets] skin "${key}" gagal dimuat, pakai placeholder`, error);
      entry = placeholderEntry(key);
    }
    return [key, entry];
  }));
  loaded.forEach(([key, entry]) => library.set(key, entry));
}

export function getFrame(library, sheetKey, name) {
  return library.get(sheetKey)?.frames.get(name) ?? null;
}
