export const AREA_WIDTH = 19200;
export const SEGMENTS_PER_AREA = 24;

export const SKINS = [
  { id: "JADE", name: "Kurir Giok" }, { id: "EMBER", name: "Biksu Bara" },
  { id: "SNOW", name: "Peziarah Salju" }, { id: "LOTUS", name: "Akrobat Teratai" },
  { id: "CLOCK", name: "Sarjana Jam" }, { id: "STORM", name: "Layang Badai" },
  { id: "FIREFLY", name: "Penjaga Kunang" }, { id: "MOON", name: "Bayangan Bulan" },
  { id: "TEA", name: "Guru Teh" }, { id: "SKYROOT", name: "Penjaga Akar Langit" },
];

export const AREAS = [
  { id: "thicket", name: "Hutan Rebung Pemula", short: "Hutan Rebung", bg: "BG_THICKET", tiles: "TILES_FOREST_SHRINE", enemy: "caterpillar", accent: "#56a978", puzzle: "Lantai retak dan rebung tersembunyi" },
  { id: "lotus", name: "Rawa Teratai Mengapung", short: "Rawa Teratai", bg: "BG_LOTUS", tiles: "TILES_FOREST_SHRINE", enemy: "bee", accent: "#3eb8a4", puzzle: "Teratai tenggelam dan ayunan bambu" },
  { id: "shrine", name: "Reruntuhan Kuil Bambu Hitam", short: "Kuil Bambu Hitam", bg: "BG_SHRINE", tiles: "TILES_FOREST_SHRINE", enemy: "guardian", accent: "#46b58d", puzzle: "Saklar gelombang dan gerbang batu" },
  { id: "grotto", name: "Gua Jamur Menyala", short: "Gua Jamur", bg: "BG_GROTTO", tiles: "TILES_GROTTO_CLIFF", enemy: "bat", accent: "#8e72d6", puzzle: "Jamur pantul dan lorong kristal" },
  { id: "cliffs", name: "Tebing Angin Beliung", short: "Tebing Angin", bg: "BG_CLIFFS", tiles: "TILES_GROTTO_CLIFF", enemy: "bee", accent: "#65bfa0", puzzle: "Pole Vault melawan arus angin" },
  { id: "village", name: "Desa Kanopi Kera", short: "Desa Kanopi", bg: "BG_VILLAGE", tiles: "TILES_VILLAGE_GOLDEN", enemy: "macaque", accent: "#bd7454", puzzle: "Jembatan rapuh dan buah pantul" },
  { id: "golden", name: "Jalur Rebung Emas", short: "Jalur Emas", bg: "BG_GOLDEN", tiles: "TILES_VILLAGE_GOLDEN", enemy: "spider", accent: "#d8a73d", puzzle: "Lintasan Rush dan lantai runtuh" },
  { id: "mines", name: "Tambang Belerang Trenggiling", short: "Tambang Belerang", bg: "BG_MINES", tiles: "TILES_LATE_GAME", enemy: "pangolin", accent: "#c5913e", puzzle: "Roda gigi, uap, dan zirah bijih" },
  { id: "snow", name: "Puncak Salju Abadi", short: "Puncak Salju", bg: "BG_SNOW", tiles: "TILES_LATE_GAME", enemy: "fox", accent: "#7cc9d8", puzzle: "Es licin dan mata air panas" },
  { id: "core", name: "Akar Pohon Induk", short: "Akar Pohon Induk", bg: "BG_CORE", tiles: "TILES_LATE_GAME", enemy: "boss", accent: "#53d49c", puzzle: "Raja Kelabang Bara menjaga jalan langit" },
  { id: "paper", name: "Hutan Kertas Terbalik", short: "Hutan Kertas", bg: "BG_PAPER_FOREST", tiles: "TILES_PAPER_KITE", enemy: "paper_mantis", accent: "#76c9a2", puzzle: "Pukul genderang untuk membalik gravitasi platform" },
  { id: "kite", name: "Ngarai Layang-Layang", short: "Ngarai Layang", bg: "BG_KITE_CANYON", tiles: "TILES_PAPER_KITE", enemy: "kite_vulture", accent: "#d28c5d", puzzle: "Tahan Lompat pada jangkar untuk meluncur" },
  { id: "library", name: "Perpustakaan Rayap Waktu", short: "Pustaka Waktu", bg: "BG_CLOCK_LIBRARY", tiles: "TILES_LIBRARY_TEA", enemy: "clock_termite", accent: "#a18b63", puzzle: "Bekukan halaman jam pada posisi yang tepat" },
  { id: "tea", name: "Kebun Teh Raksasa", short: "Kebun Teh", bg: "BG_TEA_GARDEN", tiles: "TILES_LIBRARY_TEA", enemy: "tea_beetle", accent: "#6fa768", puzzle: "Gunakan semburan uap dan tutup teko" },
  { id: "bells", name: "Makam Lonceng Hujan", short: "Makam Lonceng", bg: "BG_RAIN_BELLS", tiles: "TILES_BELL_FIREFLY", enemy: "bell_toad", accent: "#638aa0", puzzle: "Bunyikan tiga lonceng untuk membuka resonansi" },
  { id: "firefly", name: "Sarang Kunang Naga", short: "Sarang Kunang", bg: "BG_FIREFLY_NEST", tiles: "TILES_BELL_FIREFLY", enemy: "firefly_drake", accent: "#56dba5", puzzle: "Bawa benih cahaya menembus alang gelap" },
  { id: "city", name: "Kota Bambu Mekanis", short: "Kota Mekanis", bg: "BG_BAMBOO_CITY", tiles: "TILES_CITY_SKY", enemy: "bamboo_automaton", accent: "#b89456", puzzle: "Konveyor, kait derek, dan mesin pukul" },
  { id: "cloud", name: "Lautan Awan Ikan", short: "Lautan Awan", bg: "BG_CLOUD_KOI", tiles: "TILES_CITY_SKY", enemy: "cloud_puffer", accent: "#8eced2", puzzle: "Naiki sisik awan dan sirip koi bergerak" },
  { id: "moon", name: "Kebun Bayangan Bulan", short: "Kebun Bayangan", bg: "BG_MOON_GARDEN", tiles: "TILES_CITY_SKY", enemy: "shadow_hare", accent: "#7775a8", puzzle: "Sejajarkan dua cermin untuk membelah bayangan" },
  { id: "crown", name: "Mahkota Akar Langit", short: "Mahkota Langit", bg: "BG_SKYROOT_CROWN", tiles: "TILES_CITY_SKY", enemy: "eclipse_crane", accent: "#8de2b7", puzzle: "Bangau Gerhana menunggu di ujung dunia" },
];

export const WORLD_WIDTH = AREAS.length * AREA_WIDTH;

const FLYING = new Set(["bee", "bat", "kite_vulture", "firefly_drake", "cloud_puffer"]);

const PROP_SIZES = {
  cracked_floor: [190, 70], lotus_leaf: [180, 82], swing_bamboo: [90, 260], bounce_mushroom: [150, 140],
  safe_moss: [180, 90], floor_switch: [120, 50], stone_gate: [180, 220], soft_ground: [150, 80],
  golden_sprout: [72, 92], crumble_bridge: [190, 70], spike_root: [150, 90], gear: [120, 120],
  flame_vent: [100, 115], ice_block: [130, 130], hot_spring: [190, 90], gravity_drum: [130, 130],
  paper_bridge: [210, 75], kite_anchor: [110, 145], wind_gate: [140, 210], clock_page: [190, 150],
  hourglass_switch: [100, 90], tea_lid: [190, 80], steam_jet: [100, 150], rain_bell: [110, 170],
  resonance_door: [170, 220], light_seed: [80, 80], dark_reed: [160, 220], bamboo_conveyor: [220, 70],
  crane_hook: [100, 190], cloud_scale: [190, 85], koi_fin_platform: [210, 95], moon_mirror: [130, 190],
  shadow_gate: [170, 220], skyroot_seal: [170, 190], eclipse_orb: [120, 120],
  fold_lantern: [110, 150], ink_ceiling_hook: [100, 190], paper_press: [180, 170], storm_kite_sail: [210, 120],
  wind_harp: [145, 180], cliff_vane: [130, 180], time_spool: [130, 130], bookworm_rail: [220, 85],
  pendulum_bridge: [210, 100], tea_leaf_fan: [170, 170], porcelain_valve: [120, 120], rolling_cup: [165, 150],
  rain_chime: [110, 180], flood_seal: [150, 160], echo_gong: [170, 170], firefly_prism: [120, 160],
  reed_cradle: [170, 130], dragon_egg_lamp: [120, 165], bamboo_piston: [210, 100], waterwheel_lift: [170, 170],
  gear_lock: [145, 145], cloud_bubble: [150, 150], koi_whisker_rope: [100, 210], thunder_pearl: [120, 120],
  moon_prism: [120, 170], shadow_clone_seal: [150, 170], root_ladder: [130, 220], eclipse_feather: [120, 210],
};

const EXPANSION_SETS = [
  ["fold_lantern", "ink_ceiling_hook", "paper_press"], ["storm_kite_sail", "wind_harp", "cliff_vane"],
  ["time_spool", "bookworm_rail", "pendulum_bridge"], ["tea_leaf_fan", "porcelain_valve", "rolling_cup"],
  ["rain_chime", "flood_seal", "echo_gong"], ["firefly_prism", "reed_cradle", "dragon_egg_lamp"],
  ["bamboo_piston", "waterwheel_lift", "gear_lock"], ["cloud_bubble", "koi_whisker_rope", "thunder_pearl"],
  ["moon_prism", "shadow_clone_seal", "moon_prism"], ["root_ladder", "eclipse_feather", "root_ladder"],
];

const OLD_PROPS = [
  ["cracked_floor", "safe_moss", "golden_sprout"],
  ["lotus_leaf", "swing_bamboo", "safe_moss"],
  ["floor_switch", "stone_gate", "safe_moss"],
  ["bounce_mushroom", "cracked_floor", "safe_moss"],
  ["swing_bamboo", "soft_ground", "spike_root"],
  ["crumble_bridge", "swing_bamboo", "safe_moss"],
  ["golden_sprout", "spike_root", "crumble_bridge"],
  ["gear", "flame_vent", "cracked_floor"],
  ["ice_block", "hot_spring", "spike_root"],
  ["swing_bamboo", "spike_root", "safe_moss"],
];

const NEW_PROPS = [
  ["gravity_drum", "paper_bridge", "gravity_drum"],
  ["kite_anchor", "wind_gate", "kite_anchor"],
  ["clock_page", "hourglass_switch", "clock_page"],
  ["tea_lid", "steam_jet", "tea_lid"],
  ["rain_bell", "rain_bell", "rain_bell", "resonance_door"],
  ["light_seed", "dark_reed", "light_seed"],
  ["bamboo_conveyor", "crane_hook", "bamboo_conveyor"],
  ["cloud_scale", "koi_fin_platform", "cloud_scale"],
  ["moon_mirror", "moon_mirror", "shadow_gate"],
  ["skyroot_seal", "eclipse_orb", "skyroot_seal"],
];

function addPlatform(platforms, areaIndex, x, y, w, h = 140, type = "normal") {
  platforms.push({ id: `platform-${platforms.length}`, areaIndex, x, y, w, h, type, sink: 0 });
}

function buildChunk(platforms, areaIndex, chunkIndex, start) {
  const pattern = (areaIndex * 3 + chunkIndex) % 5;
  if (pattern === 0) {
    addPlatform(platforms, areaIndex, start, 760, 480);
    addPlatform(platforms, areaIndex, start + 570, 700, 230, 200);
    addPlatform(platforms, areaIndex, start + 260, 585, 190, 55);
  } else if (pattern === 1) {
    addPlatform(platforms, areaIndex, start, 760, 270);
    addPlatform(platforms, areaIndex, start + 350, 680, 230, 220, areaIndex === 1 ? "lotus" : "normal");
    addPlatform(platforms, areaIndex, start + 660, 760, 140);
    addPlatform(platforms, areaIndex, start + 510, 520, 170, 55);
  } else if (pattern === 2) {
    addPlatform(platforms, areaIndex, start, 760, 210);
    addPlatform(platforms, areaIndex, start + 280, 640, 190, 260);
    addPlatform(platforms, areaIndex, start + 550, 540, 180, 360);
    addPlatform(platforms, areaIndex, start + 730, 760, 70);
  } else if (pattern === 3) {
    addPlatform(platforms, areaIndex, start, 720, 340, 180);
    addPlatform(platforms, areaIndex, start + 420, 760, 380);
    addPlatform(platforms, areaIndex, start + 550, 600, 170, 55);
  } else {
    addPlatform(platforms, areaIndex, start, 760, 360);
    addPlatform(platforms, areaIndex, start + 440, 610, 210, 290);
    addPlatform(platforms, areaIndex, start + 720, 760, 80);
  }
}

function makeProp(type, x, y, areaIndex, index) {
  const [w, h] = PROP_SIZES[type] || [100, 100];
  const prop = { id: `area-${areaIndex}-prop-${index}`, type, x, y, w, h, areaIndex };
  if (["cracked_floor", "crumble_bridge", "ice_block", "skyroot_seal"].includes(type)) prop.breakable = true;
  if (["spike_root", "gear", "flame_vent", "wind_gate"].includes(type)) prop.hazard = true;
  if (["swing_bamboo", "kite_anchor", "crane_hook", "ink_ceiling_hook", "koi_whisker_rope"].includes(type)) prop.swing = true;
  if (type === "soft_ground") prop.vault = true;
  if (["bounce_mushroom", "steam_jet", "tea_leaf_fan", "waterwheel_lift", "cloud_bubble"].includes(type)) prop.bounce = true;
  if (type === "safe_moss" || type === "hot_spring") prop.safe = true;
  if (["gravity_drum", "hourglass_switch", "rain_bell", "moon_mirror", "fold_lantern", "paper_press", "wind_harp", "cliff_vane", "time_spool", "porcelain_valve", "rain_chime", "flood_seal", "echo_gong", "firefly_prism", "gear_lock", "thunder_pearl", "moon_prism", "shadow_clone_seal", "eclipse_feather"].includes(type)) prop.puzzleSwitch = true;
  return prop;
}

function buildProps(areaIndex, areaStart) {
  const baseTypes = areaIndex < 10 ? OLD_PROPS[areaIndex] : NEW_PROPS[areaIndex - 10];
  const props = [];
  for (let act = 0; act < 3; act += 1) {
    const actStart = areaStart + act * 6400;
    const types = areaIndex >= 10 && act > 0 ? EXPANSION_SETS[areaIndex - 10] : act === 2 ? [...baseTypes].reverse() : baseTypes;
    props.push(makeProp(areaIndex === 8 ? "hot_spring" : "safe_moss", actStart + 180, 758, areaIndex, act * 20));
    types.forEach((type, index) => {
      let y = 758;
      if (["swing_bamboo", "kite_anchor", "crane_hook", "ink_ceiling_hook", "koi_whisker_rope"].includes(type)) y = 650;
      if (["clock_page", "moon_mirror", "wind_harp", "pendulum_bridge", "root_ladder"].includes(type)) y = 650;
      props.push(makeProp(type, actStart + [1050, 2450, 3650, 4450][index], y, areaIndex, act * 20 + index + 1));
    });
  }
  return props;
}

function buildEnemies(areaIndex, areaStart) {
  if (areaIndex === 9) return [{ id: "rootfire-king", type: "boss", x: areaStart + AREA_WIDTH - 850, homeX: areaStart + AREA_WIDTH - 850, y: 760, hp: 24, maxHp: 24, dir: -1, state: "move", stateTimer: 0, cooldown: 0, dead: false }];
  if (areaIndex === 19) return [{ id: "eclipse-crane", type: "eclipse_crane", x: areaStart + AREA_WIDTH - 800, homeX: areaStart + AREA_WIDTH - 800, y: 760, hp: 34, maxHp: 34, dir: -1, state: "move", stateTimer: 0, cooldown: 0, dead: false }];
  const type = AREAS[areaIndex].enemy;
  return Array.from({ length: 3 }, (_, act) => [1200, 2850, 4550, 5650].map((offset, index) => ({
    id: `area-${areaIndex}-enemy-${act}-${index}`,
    type,
    x: areaStart + act * 6400 + offset,
    homeX: areaStart + act * 6400 + offset,
    y: FLYING.has(type) ? 520 + (index % 2) * 55 : 720,
    hp: areaIndex > 9 ? 4 : areaIndex > 6 ? 4 : 3,
    maxHp: areaIndex > 9 ? 4 : areaIndex > 6 ? 4 : 3,
    dir: index % 2 ? 1 : -1,
    state: "move",
    stateTimer: 0,
    cooldown: index * 0.3,
    dead: false,
  }))).flat();
}

export function createContinuousWorld(collected = new Set()) {
  const platforms = [];
  const props = [];
  const enemies = [];
  const collectibles = [];
  AREAS.forEach((area, areaIndex) => {
    const start = areaIndex * AREA_WIDTH;
    for (let chunk = 0; chunk < SEGMENTS_PER_AREA; chunk += 1) buildChunk(platforms, areaIndex, chunk, start + chunk * 800);
    props.push(...buildProps(areaIndex, start));
    enemies.push(...buildEnemies(areaIndex, start));
    for (let index = 0; index < 6; index += 1) {
      const id = `${area.id}-jade-${index}`;
      if (!collected.has(id)) collectibles.push({ id, type: "jade_shard", x: start + 1700 + index * 2800, y: index % 2 ? 470 : 520, areaIndex });
    }
    for (let act = 0; act < 3; act += 1) {
      const leafId = `${area.id}-leaf-${act}`;
      if (!collected.has(leafId)) collectibles.push({ id: leafId, type: "leaf_emblem", x: start + act * 6400 + 3300, y: 420, areaIndex });
    }
    if (areaIndex % 4 === 3) {
      const relicId = `${area.id}-relic`;
      if (!collected.has(relicId)) collectibles.push({ id: relicId, type: "bamboo_relic", x: start + AREA_WIDTH - 1350, y: 490, areaIndex });
    }
    const upgrades = { 1: "swing", 2: "shockwave", 3: "pogo", 4: "pole", 5: "charge", 7: "armor", 8: "frost" };
    if (upgrades[areaIndex] && !collected.has(`ability-${upgrades[areaIndex]}`)) collectibles.push({ id: `ability-${upgrades[areaIndex]}`, type: "ability", ability: upgrades[areaIndex], x: start + 6000, y: 610, areaIndex });
  });
  return {
    id: "continuous-world",
    width: WORLD_WIDTH,
    height: 900,
    areaIndex: 0,
    area: AREAS[0],
    variant: 0,
    platforms,
    props,
    enemies,
    collectibles,
    doors: [],
    exits: { left: null, right: null },
    boss: false,
    icy: false,
    windy: false,
    poisonous: false,
  };
}

export function areaIndexAt(x) {
  return Math.max(0, Math.min(AREAS.length - 1, Math.floor(x / AREA_WIDTH)));
}

export function worldXFromLegacyRoom(roomId) {
  const order = ["thicket", "lotus", "shrine", "grotto", "cliffs", "village", "golden", "mines", "snow", "core"];
  const index = Math.max(0, order.findIndex((prefix) => String(roomId || "").startsWith(prefix)));
  const second = /_2$|depth$/.test(String(roomId || ""));
  return index * AREA_WIDTH + (second ? AREA_WIDTH * 0.55 : 180);
}

export function abilityLabel(ability) {
  return {
    swing: "Bamboo Swing", shockwave: "Gelombang Belly Slam", pogo: "Pogo-Strike",
    pole: "Pole Vault", charge: "Charged Strike", rush: "Sugar Rush",
    armor: "Tongkat Pemecah Zirah", frost: "Belly Slam Beku",
  }[ability] ?? ability;
}
