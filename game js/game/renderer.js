import { AREAS, AREA_WIDTH } from "./world.js";

const ENEMY_ART = {
  caterpillar: { core: "CATERPILLAR_CORE", move: "crawl", attack: "bite", reaction: "FOREST_ENEMY_REACTIONS" },
  bee: { core: "BEE_CORE", move: "hover", attack: "dive", reaction: "FOREST_ENEMY_REACTIONS" },
  guardian: { core: "GUARDIAN_CORE", move: "walk", attack: "smash", reaction: "GROTTO_ENEMY_REACTIONS" },
  bat: { core: "BAT_CORE", move: "fly", attack: "dive", reaction: "GROTTO_ENEMY_REACTIONS" },
  spider: { core: "SPIDER_CORE", move: "crawl", attack: "spit", reaction: "VILLAGE_ENEMY_REACTIONS" },
  macaque: { core: "MACAQUE_CORE", move: "run", attack: "throw", reaction: "VILLAGE_ENEMY_REACTIONS" },
  pangolin: { core: "PANGOLIN_CORE", move: "walk", attack: "roll", reaction: "MOUNTAIN_ENEMY_REACTIONS" },
  fox: { core: "FOX_CORE", move: "slide", attack: "pounce", reaction: "MOUNTAIN_ENEMY_REACTIONS" },
  paper_mantis: { core: "PAPER_MANTIS_CORE", move: "skitter", attack: "paper_slash", reaction: "PAPER_WIND_REACTIONS" },
  kite_vulture: { core: "KITE_VULTURE_CORE", move: "soar", attack: "gust_dive", reaction: "PAPER_WIND_REACTIONS" },
  clock_termite: { core: "CLOCK_TERMITE_CORE", move: "march", attack: "time_bite", reaction: "LIBRARY_TEA_REACTIONS" },
  tea_beetle: { core: "TEA_BEETLE_CORE", move: "roll", attack: "steam_charge", reaction: "LIBRARY_TEA_REACTIONS" },
  bell_toad: { core: "BELL_TOAD_CORE", move: "hop", attack: "sonic_croak", reaction: "BELL_FIREFLY_REACTIONS" },
  firefly_drake: { core: "FIREFLY_DRAKE_CORE", move: "swarm_fly", attack: "light_burst", reaction: "BELL_FIREFLY_REACTIONS" },
  bamboo_automaton: { core: "BAMBOO_AUTOMATON_CORE", move: "stride", attack: "gear_punch", reaction: "CITY_CLOUD_REACTIONS" },
  cloud_puffer: { core: "CLOUD_PUFFER_CORE", move: "drift", attack: "thunder_puff", reaction: "CITY_CLOUD_REACTIONS" },
  shadow_hare: { core: "SHADOW_HARE_CORE", move: "prowl", attack: "shadow_dash", reaction: "MOON_CROWN_REACTIONS" },
};

const PROP_ASSET = {
  cracked_floor: "TRAVERSAL_PROPS", lotus_leaf: "TRAVERSAL_PROPS", swing_bamboo: "TRAVERSAL_PROPS",
  bounce_mushroom: "TRAVERSAL_PROPS", safe_moss: "TRAVERSAL_PROPS", floor_switch: "TRAVERSAL_PROPS",
  stone_gate: "TRAVERSAL_PROPS", soft_ground: "TRAVERSAL_PROPS", golden_sprout: "HAZARD_REWARD_PROPS",
  crumble_bridge: "HAZARD_REWARD_PROPS", spike_root: "HAZARD_REWARD_PROPS", gear: "HAZARD_REWARD_PROPS",
  flame_vent: "HAZARD_REWARD_PROPS", ice_block: "HAZARD_REWARD_PROPS", hot_spring: "HAZARD_REWARD_PROPS",
  jade_shard: "HAZARD_REWARD_PROPS", leaf_emblem: "HAZARD_REWARD_PROPS", bamboo_relic: "HAZARD_REWARD_PROPS",
  gravity_drum: "WONDER_PUZZLE_PROPS", paper_bridge: "WONDER_PUZZLE_PROPS", kite_anchor: "WONDER_PUZZLE_PROPS",
  wind_gate: "WONDER_PUZZLE_PROPS", clock_page: "WONDER_PUZZLE_PROPS", hourglass_switch: "WONDER_PUZZLE_PROPS",
  tea_lid: "WONDER_PUZZLE_PROPS", steam_jet: "WONDER_PUZZLE_PROPS", rain_bell: "WONDER_PUZZLE_PROPS",
  resonance_door: "WONDER_PUZZLE_PROPS", light_seed: "SKY_PUZZLE_PROPS", dark_reed: "SKY_PUZZLE_PROPS",
  bamboo_conveyor: "SKY_PUZZLE_PROPS", crane_hook: "SKY_PUZZLE_PROPS", cloud_scale: "SKY_PUZZLE_PROPS",
  koi_fin_platform: "SKY_PUZZLE_PROPS", moon_mirror: "SKY_PUZZLE_PROPS", shadow_gate: "SKY_PUZZLE_PROPS",
  skyroot_seal: "SKY_PUZZLE_PROPS", eclipse_orb: "SKY_PUZZLE_PROPS",
  fold_lantern: "EXPANSION_PROPS_ALPHA", ink_ceiling_hook: "EXPANSION_PROPS_ALPHA", paper_press: "EXPANSION_PROPS_ALPHA",
  storm_kite_sail: "EXPANSION_PROPS_ALPHA", wind_harp: "EXPANSION_PROPS_ALPHA", cliff_vane: "EXPANSION_PROPS_ALPHA",
  time_spool: "EXPANSION_PROPS_ALPHA", bookworm_rail: "EXPANSION_PROPS_ALPHA", pendulum_bridge: "EXPANSION_PROPS_ALPHA",
  tea_leaf_fan: "EXPANSION_PROPS_BETA", porcelain_valve: "EXPANSION_PROPS_BETA", rolling_cup: "EXPANSION_PROPS_BETA",
  rain_chime: "EXPANSION_PROPS_BETA", flood_seal: "EXPANSION_PROPS_BETA", echo_gong: "EXPANSION_PROPS_BETA",
  firefly_prism: "EXPANSION_PROPS_BETA", reed_cradle: "EXPANSION_PROPS_BETA", dragon_egg_lamp: "EXPANSION_PROPS_BETA",
  bamboo_piston: "EXPANSION_PROPS_GAMMA", waterwheel_lift: "EXPANSION_PROPS_GAMMA", gear_lock: "EXPANSION_PROPS_GAMMA",
  cloud_bubble: "EXPANSION_PROPS_GAMMA", koi_whisker_rope: "EXPANSION_PROPS_GAMMA", thunder_pearl: "EXPANSION_PROPS_GAMMA",
  moon_prism: "EXPANSION_PROPS_GAMMA", shadow_clone_seal: "EXPANSION_PROPS_GAMMA", root_ladder: "EXPANSION_PROPS_GAMMA",
  eclipse_feather: "EXPANSION_PROPS_GAMMA",
};

const HERO_SKIN_SUFFIX = {
  BAO_LOCOMOTION: "LOCOMOTION", BAO_AIR: "AIR", BAO_STAFF: "STAFF", BAO_REACTIONS: "REACTIONS",
  BAO_SLAM: "SLAM", BAO_SWING: "SWING", BAO_VAULT_NAP: "VAULT_NAP", BAO_UTILITY: "UTILITY",
  BAO_PUZZLE_ACTIONS: "PUZZLE", BAO_WORLD_ACTIONS: "WORLD",
};

const SKIN_VISUAL_SOURCE = { CLOCK: "JADE", STORM: "SNOW", FIREFLY: "JADE", MOON: "EMBER", TEA: "LOTUS", SKYROOT: "SNOW" };
const SKIN_AURA = { CLOCK: "#d3a85e", STORM: "#5e9fd7", FIREFLY: "#65e1a8", MOON: "#8c7bd5", TEA: "#7eb26a", SKYROOT: "#e6d08a" };

function containFrame(ctx, entry, frameName, x, y, width, height, alpha = 1) {
  const frame = entry?.frames.get(frameName);
  if (!frame || frame.empty) return;
  const crop = frame.content || frame.source;
  const scale = Math.min(width / crop.w, height / crop.h);
  const drawWidth = crop.w * scale;
  const drawHeight = crop.h * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(entry.image, crop.x, crop.y, crop.w, crop.h, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  ctx.restore();
}

function animatedFrame(entry, animationName, time, fps = 10) {
  const frames = entry?.animations.get(animationName);
  if (!frames?.length) return null;
  return frames[Math.floor(time * fps) % frames.length];
}

function drawAnchored(ctx, entry, animationName, x, y, targetHeight, time, flip = false, alpha = 1, fps = 10) {
  const frame = animatedFrame(entry, animationName, time, fps);
  if (!frame) return;
  const crop = frame.content || frame.source;
  const scale = targetHeight / Math.max(1, crop.h);
  const anchor = frame.anchor || { x: crop.x + crop.w / 2, y: crop.y + crop.h };
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(
    entry.image,
    crop.x, crop.y, crop.w, crop.h,
    -(anchor.x - crop.x) * scale,
    -(anchor.y - crop.y) * scale,
    crop.w * scale,
    crop.h * scale,
  );
  ctx.restore();
}

function drawBackground(ctx, entry, width, height, cameraX, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (!entry?.image) {
    ctx.fillStyle = "#e7e0ce";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    return;
  }
  const image = entry.image;
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drift = (cameraX * 0.05) % drawWidth;
  const y = (height - drawHeight) / 2;
  for (let x = -drawWidth - drift; x < width + drawWidth; x += drawWidth) {
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  }
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "rgba(246,241,225,.08)");
  wash.addColorStop(0.72, "rgba(20,28,26,.04)");
  wash.addColorStop(1, "rgba(10,17,16,.3)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function createRenderer(canvas, library, config) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let cssWidth = 1;
  let cssHeight = 1;
  let cameraX = 0;
  let observer = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cssWidth = rect.width;
    cssHeight = rect.height;
  }

  observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  function drawPlatform(platform, room) {
    const area = AREAS[platform.areaIndex] || room.area;
    const sheet = library.get(area.tiles);
    const frame = sheet?.frames.get("center");
    const y = platform.y + (platform.sink || 0);
    ctx.fillStyle = platform.areaIndex >= 7 ? "rgba(20,28,29,.92)" : "rgba(25,36,31,.9)";
    ctx.fillRect(platform.x, y + 12, platform.w, platform.h);
    if (!frame) return;
    const source = frame.source;
    ctx.drawImage(sheet.image, source.x, source.y, source.w, source.h, platform.x - 5, y - 22, platform.w + 10, Math.min(118, platform.h + 38));
  }

  function drawProp(prop, state) {
    if (state.destroyedProps.has(prop.id)) return;
    const key = PROP_ASSET[prop.type];
    const entry = library.get(key);
    containFrame(ctx, entry, prop.type, prop.x - prop.w / 2, prop.y - prop.h, prop.w, prop.h);
    if (prop.type === "gear") {
      ctx.save();
      ctx.translate(prop.x, prop.y - prop.h / 2);
      ctx.rotate(state.time * 1.2);
      ctx.restore();
    }
  }

  function drawCollectible(item, state) {
    const bob = Math.sin(state.time * 3 + item.x) * 8;
    if (item.type === "ability") {
      const pulse = 28 + Math.sin(state.time * 4) * 5;
      const glow = ctx.createRadialGradient(item.x, item.y + bob, 2, item.x, item.y + bob, 70);
      glow.addColorStop(0, "rgba(78,238,173,.82)");
      glow.addColorStop(1, "rgba(78,238,173,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(item.x - 72, item.y + bob - 72, 144, 144);
      ctx.strokeStyle = "#57dca8";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(item.x, item.y + bob, pulse, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    const size = item.type === "jade_shard" ? 58 : 68;
    containFrame(ctx, library.get("HAZARD_REWARD_PROPS"), item.type, item.x - size / 2, item.y + bob - size, size, size);
  }

  function drawDoor(door, state) {
    containFrame(ctx, library.get("TRAVERSAL_PROPS"), "stone_gate", door.x - door.w / 2, door.y - door.h, door.w, door.h);
    const locked = door.requires?.some((ability) => !state.progress.abilities.has(ability));
    ctx.fillStyle = locked ? "rgba(79,38,31,.75)" : "rgba(43,143,105,.76)";
    ctx.strokeStyle = locked ? "#a85945" : "#75e0b4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(door.x - 66, door.y - door.h - 34, 132, 28, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f5f0df";
    ctx.font = "600 17px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(locked ? "Terkunci" : door.label, door.x, door.y - door.h - 14);
  }

  function drawEnemy(enemy, state) {
    if (enemy.dead && enemy.stateTimer > 0.8) return;
    if (enemy.type === "boss") {
      const phases = enemy.state === "weak" || enemy.state === "stagger" || enemy.state === "defeat";
      const entry = library.get(phases ? "BOSS_PHASES" : "BOSS_CORE");
      const animation = enemy.state === "weak" ? "weak_point" : enemy.state === "stagger" ? "stagger" : enemy.state === "defeat" ? "defeat" : enemy.state === "attack" ? (enemy.phase === 1 ? "root_sweep" : enemy.phase === 2 ? "energy_burst" : "burrow") : "stalk";
      drawAnchored(ctx, entry, animation, enemy.x, enemy.y, 300, enemy.stateTimer || state.time, enemy.dir < 0, enemy.hitFlash > 0 ? 0.62 : 1, 8);
      return;
    }
    if (enemy.type === "eclipse_crane") {
      const reaction = enemy.state === "hit" || enemy.state === "stagger";
      const phases = enemy.state === "weak" || enemy.state === "defeat";
      const entry = library.get(reaction ? "MOON_CROWN_REACTIONS" : phases ? "ECLIPSE_CRANE_PHASES" : "ECLIPSE_CRANE_CORE");
      const animation = enemy.state === "hit" ? "eclipse_crane_hit" : enemy.state === "stagger" ? "eclipse_crane_stagger" : enemy.state === "weak" ? "halo_open" : enemy.state === "defeat" ? "defeat" : enemy.state === "attack" ? (enemy.phase === 1 ? "wing_scythe" : enemy.phase === 2 ? "eclipse_beam" : "root_dive") : "stalk";
      drawAnchored(ctx, entry, animation, enemy.x, enemy.y, 325, enemy.stateTimer || state.time, enemy.dir < 0, enemy.hitFlash > 0 ? 0.62 : 1, 8);
      return;
    }
    const art = ENEMY_ART[enemy.type];
    if (!art) return;
    let entry = library.get(art.core);
    let animation = art.move;
    if (enemy.state === "telegraph") animation = "telegraph";
    if (enemy.state === "attack") animation = art.attack;
    if (enemy.state === "hit" || enemy.state === "stagger") {
      entry = library.get(art.reaction);
      animation = `${enemy.type}_${enemy.state}`;
    }
    if (enemy.state === "defeat") animation = "defeat";
    const height = ["guardian", "pangolin", "clock_termite", "bamboo_automaton", "paper_mantis"].includes(enemy.type) ? 116 : enemy.type === "macaque" ? 108 : 92;
    drawAnchored(ctx, entry, animation, enemy.x, enemy.y, height, enemy.stateTimer || state.time, enemy.dir < 0, enemy.hitFlash > 0 ? 0.55 : 1, 10);
    if (!enemy.dead && enemy.hp < enemy.maxHp) {
      ctx.fillStyle = "rgba(18,22,20,.8)";
      ctx.fillRect(enemy.x - 34, enemy.y - height - 16, 68, 7);
      ctx.fillStyle = "#cf5b48";
      ctx.fillRect(enemy.x - 33, enemy.y - height - 15, 66 * (enemy.hp / enemy.maxHp), 5);
    }
  }

  function drawPlayer(player, state) {
    const suffix = HERO_SKIN_SUFFIX[player.anim.sheet];
    const visualSkin = SKIN_VISUAL_SOURCE[player.skin] || player.skin;
    const entry = library.get(suffix ? `SKIN_${visualSkin}_${suffix}` : player.anim.sheet) || library.get(player.anim.sheet);
    const alpha = player.invulnerable > 0 && Math.floor(player.invulnerable * 14) % 2 ? 0.35 : 1;
    const targetHeight = player.anim.name === "slam_dive" ? 112 : 104;
    if (SKIN_AURA[player.skin]) {
      const aura = ctx.createRadialGradient(player.x, player.y - 45, 5, player.x, player.y - 45, 68);
      aura.addColorStop(0, `${SKIN_AURA[player.skin]}55`);
      aura.addColorStop(1, `${SKIN_AURA[player.skin]}00`);
      ctx.fillStyle = aura;
      ctx.fillRect(player.x - 70, player.y - 120, 140, 135);
    }
    drawAnchored(ctx, entry, player.anim.name, player.x, player.y, targetHeight, player.animTime, player.facing < 0, alpha, player.anim.fps || 10);
    if (player.rushTimer > 0) {
      ctx.strokeStyle = "rgba(72,225,165,.66)";
      ctx.lineWidth = 6;
      for (let index = 0; index < 3; index += 1) {
        const offset = (state.time * 230 + index * 35) % 120;
        ctx.beginPath();
        ctx.moveTo(player.x - player.facing * offset, player.y - 30 - index * 12);
        ctx.lineTo(player.x - player.facing * (offset + 50), player.y - 30 - index * 12);
        ctx.stroke();
      }
    }
  }

  function drawEffects(state) {
    for (const effect of state.effects) {
      const entry = library.get(effect.sheet);
      const frames = entry?.animations.get(effect.animation);
      if (!frames?.length) continue;
      const ratio = Math.min(0.999, effect.age / effect.duration);
      const frame = frames[Math.floor(ratio * frames.length)];
      const crop = frame.content || frame.source;
      const size = effect.size || 150;
      const scale = size / Math.max(crop.w, crop.h);
      ctx.save();
      ctx.globalAlpha = Math.min(1, (1 - ratio) * 1.6) * config.effectsIntensity;
      ctx.drawImage(entry.image, crop.x, crop.y, crop.w, crop.h, effect.x - crop.w * scale / 2, effect.y - crop.h * scale / 2, crop.w * scale, crop.h * scale);
      ctx.restore();
    }
  }

  function render(state, dt) {
    if (!cssWidth || !cssHeight || !state.room) return;
    const aspect = cssWidth / cssHeight;
    const viewWidth = Math.max(590, Math.min(1200, 900 * aspect));
    const scale = cssWidth / viewWidth;
    const viewHeight = cssHeight / scale;
    const targetX = Math.max(0, Math.min(state.room.width - viewWidth, state.player.x - viewWidth * 0.48));
    cameraX += (targetX - cameraX) * Math.min(1, dt * config.cameraSmoothing);
    const cameraY = Math.min(0, 920 - viewHeight);
    const shakeX = state.shake > 0 ? (Math.random() - 0.5) * 14 * state.shake : 0;
    const shakeY = state.shake > 0 ? (Math.random() - 0.5) * 9 * state.shake : 0;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0);
    const currentArea = state.room.area;
    drawBackground(ctx, library.get(currentArea.bg), cssWidth, cssHeight, cameraX);
    const localX = state.player.x - state.room.areaIndex * AREA_WIDTH;
    if (localX > AREA_WIDTH - 520 && state.room.areaIndex < AREAS.length - 1) {
      const mix = (localX - (AREA_WIDTH - 520)) / 520;
      drawBackground(ctx, library.get(AREAS[state.room.areaIndex + 1].bg), cssWidth, cssHeight, cameraX, Math.min(1, mix));
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.scale(scale, scale);
    ctx.translate(-cameraX, -cameraY);

    const areaStart = state.room.areaIndex * AREA_WIDTH;
    if (state.room.areaIndex === 1) {
      ctx.fillStyle = "rgba(32,130,137,.42)";
      ctx.fillRect(areaStart, 760, AREA_WIDTH, 180);
    }
    if (state.room.areaIndex === 7) {
      ctx.fillStyle = "rgba(180,141,47,.13)";
      ctx.fillRect(areaStart, 360, AREA_WIDTH, 540);
    }

    const leftCull = cameraX - 260;
    const rightCull = cameraX + viewWidth + 260;
    state.room.platforms.filter((platform) => platform.x + platform.w > leftCull && platform.x < rightCull).forEach((platform) => drawPlatform(platform, state.room));
    state.room.props.filter((prop) => prop.x + prop.w > leftCull && prop.x - prop.w < rightCull).forEach((prop) => drawProp(prop, state));
    state.room.doors.filter((door) => door.x > leftCull && door.x < rightCull).forEach((door) => drawDoor(door, state));
    state.room.collectibles.filter((item) => item.x > leftCull && item.x < rightCull).forEach((item) => drawCollectible(item, state));
    state.room.enemies.filter((enemy) => enemy.x > leftCull && enemy.x < rightCull).forEach((enemy) => drawEnemy(enemy, state));
    drawPlayer(state.player, state);
    drawEffects(state);
    ctx.restore();
  }

  return {
    render,
    resize,
    destroy() { observer?.disconnect(); },
  };
}
