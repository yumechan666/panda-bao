import { AREAS, AREA_WIDTH, SEGMENTS_PER_AREA, abilityLabel, areaIndexAt } from "./world.js";

const ENEMY_BOX = {
  caterpillar: [72, 48], bee: [60, 54], guardian: [76, 92], bat: [72, 54],
  spider: [66, 52], macaque: [58, 86], pangolin: [82, 66], fox: [72, 50], boss: [250, 190],
  paper_mantis: [66, 94], kite_vulture: [76, 58], clock_termite: [78, 84], tea_beetle: [74, 58],
  bell_toad: [72, 55], firefly_drake: [78, 60], bamboo_automaton: [68, 94], cloud_puffer: [76, 60],
  shadow_hare: [72, 62], eclipse_crane: [260, 210],
};

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function playerBox(player) {
  return { left: player.x - 24, right: player.x + 24, top: player.y - 78, bottom: player.y };
}

function enemyBox(enemy) {
  const [width, height] = ENEMY_BOX[enemy.type] || [64, 64];
  return { left: enemy.x - width / 2, right: enemy.x + width / 2, top: enemy.y - height, bottom: enemy.y };
}

function addEffect(state, animation, x, y, size = 150, sheet = "COMBAT_EFFECTS") {
  state.effects.push({ animation, sheet, x, y, size, age: 0, duration: 0.42 });
}

function hurtPlayer(state, env, sourceX, amount = 1) {
  const player = state.player;
  if (player.invulnerable > 0 || player.sleeping) return;
  player.hp = Math.max(0, player.hp - amount);
  player.invulnerable = 1.05;
  player.vx = player.x < sourceX ? -330 : 330;
  player.vy = -360;
  player.animOverride = { sheet: "BAO_REACTIONS", name: "hurt", timer: 0.36 };
  player.sleepHold = 0;
  env.audio.play("hurt");
  env.haptic(35);
  state.shake = 0.7;
  if (player.hp <= 0) env.onDefeat();
}

function hitEnemy(state, env, enemy, damage, knockback = 90) {
  if (enemy.dead || enemy.hitCooldown > 0) return;
  enemy.hp -= damage;
  enemy.hitCooldown = 0.13;
  enemy.hitFlash = 0.14;
  enemy.x += state.player.facing * knockback;
  enemy.state = enemy.hp <= 0 ? "defeat" : damage > 1 ? "stagger" : "hit";
  enemy.stateTimer = 0;
  addEffect(state, "staff_hit", enemy.x, enemy.y - 45, damage > 1 ? 170 : 110);
  env.audio.play("staff");
  env.haptic(damage > 1 ? 28 : 12);
  if (enemy.hp <= 0) {
    enemy.dead = true;
    state.player.energy = Math.min(state.player.maxEnergy, state.player.energy + 9);
    if (enemy.type === "eclipse_crane") env.onWin();
  }
}

function nearestProp(room, player, predicate, distance = 100) {
  return room.props.find((prop) => predicate(prop) && Math.abs(prop.x - player.x) < distance && Math.abs(prop.y - player.y) < 150);
}

function beginAttack(state, charged = false) {
  const player = state.player;
  player.attackSerial += 1;
  player.attackTimer = charged ? 0.55 : 0.34;
  player.chargedAttack = charged;
  player.combo = charged ? player.combo : (player.combo % 3) + 1;
  player.animOverride = {
    sheet: charged ? "BAO_REACTIONS" : "BAO_STAFF",
    name: charged ? "charged_strike" : `combo_${player.combo}`,
    timer: charged ? 0.55 : 0.34,
  };
}

function collectItems(state, env) {
  const box = playerBox(state.player);
  state.room.collectibles = state.room.collectibles.filter((item) => {
    const itemBox = { left: item.x - 42, right: item.x + 42, top: item.y - 70, bottom: item.y + 22 };
    if (!overlaps(box, itemBox)) return true;
    state.progress.collected.add(item.id);
    addEffect(state, "jade_pickup", item.x, item.y, 150);
    env.audio.play("pickup");
    env.haptic(18);
    if (item.type === "jade_shard") {
      state.progress.shards += 1;
      state.player.maxEnergy = 100 + Math.floor(state.progress.shards / 3) * 10;
      state.player.energy = Math.min(state.player.maxEnergy, state.player.energy + 24);
      env.toast(`Serpihan Giok ${state.progress.shards}/18`);
    } else if (item.type === "leaf_emblem") {
      state.progress.leaves += 1;
      state.player.maxHp += 1;
      state.player.hp = state.player.maxHp;
      env.toast("Lambang Daun: kesehatan bertambah");
    } else if (item.type === "bamboo_relic") {
      state.progress.relics += 1;
      env.toast(`Relik Bambu ${state.progress.relics}/5`);
    } else if (item.type === "ability") {
      state.progress.abilities.add(item.ability);
      env.toast(`${abilityLabel(item.ability)} dikuasai`);
      env.onProgressSave();
    }
    return false;
  });
}

function updateEnemies(state, env, dt) {
  const player = state.player;
  for (const enemy of state.room.enemies) {
    enemy.stateTimer += dt;
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.hitCooldown = Math.max(0, (enemy.hitCooldown || 0) - dt);
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    if (enemy.dead) continue;

    if (enemy.type === "boss" || enemy.type === "eclipse_crane") {
      const high = enemy.type === "eclipse_crane" ? 22 : 16;
      const low = enemy.type === "eclipse_crane" ? 11 : 8;
      enemy.phase = enemy.hp > high ? 1 : enemy.hp > low ? 2 : 3;
      if (enemy.state === "hit" || enemy.state === "stagger") {
        if (enemy.stateTimer > 0.45) { enemy.state = "move"; enemy.stateTimer = 0; }
      } else if (enemy.state === "weak") {
        if (enemy.stateTimer > 1.45) { enemy.state = "move"; enemy.stateTimer = 0; enemy.cooldown = 1.2; }
      } else if (enemy.state === "attack") {
        if (enemy.stateTimer > 0.38 && enemy.stateTimer < 0.72 && Math.abs(player.x - enemy.x) < 260) hurtPlayer(state, env, enemy.x, env.config.enemyDamage);
        if (enemy.stateTimer > 0.9) { enemy.state = "weak"; enemy.stateTimer = 0; }
      } else if (enemy.cooldown <= 0) {
        enemy.state = "telegraph";
        enemy.stateTimer = 0;
        enemy.cooldown = 2.5 - enemy.phase * 0.28;
      } else if (enemy.state === "telegraph" && enemy.stateTimer > 0.6) {
        enemy.state = "attack";
        enemy.stateTimer = 0;
        state.shake = 0.45;
      }
      continue;
    }

    const distance = player.x - enemy.x;
    if (Math.abs(enemy.x - player.x) > 1450) continue;
    const flying = ["bee", "bat", "kite_vulture", "firefly_drake", "cloud_puffer"].includes(enemy.type);
    if (enemy.state === "hit" && enemy.stateTimer > 0.22) { enemy.state = "move"; enemy.stateTimer = 0; }
    if (enemy.state === "stagger" && enemy.stateTimer > 0.6) { enemy.state = "move"; enemy.stateTimer = 0; }
    if (enemy.state === "telegraph" && enemy.stateTimer > 0.52) { enemy.state = "attack"; enemy.stateTimer = 0; }
    if (enemy.state === "attack") {
      const attackReach = enemy.type === "macaque" || enemy.type === "spider" ? 310 : 120;
      if (enemy.stateTimer > 0.16 && enemy.stateTimer < 0.42 && Math.abs(distance) < attackReach) hurtPlayer(state, env, enemy.x, env.config.enemyDamage);
      if (enemy.stateTimer > 0.55) { enemy.state = "move"; enemy.stateTimer = 0; enemy.cooldown = 1.25; }
    } else if (enemy.state === "move") {
      enemy.dir = distance < 0 ? -1 : 1;
      if (Math.abs(distance) < 210 && enemy.cooldown <= 0) {
        enemy.state = "telegraph";
        enemy.stateTimer = 0;
      } else {
        const speed = ["fox", "macaque", "shadow_hare", "paper_mantis"].includes(enemy.type) ? 85 : 48;
        enemy.x += enemy.dir * speed * dt;
        const home = enemy.homeX ?? enemy.x;
        enemy.x = Math.max(home - 280, Math.min(home + 280, enemy.x));
        if (flying) enemy.y += Math.sin(state.time * 4 + enemy.x * 0.01) * 22 * dt;
      }
    }
    if (overlaps(playerBox(player), enemyBox(enemy)) && enemy.state !== "hit" && enemy.state !== "stagger") hurtPlayer(state, env, enemy.x, env.config.enemyDamage);
  }
}

function resolveGround(state, previousY) {
  const player = state.player;
  let landing = null;
  if (player.vy >= 0) {
    for (const platform of state.room.platforms) {
      const top = platform.y + (platform.sink || 0);
      if (player.x + 22 < platform.x || player.x - 22 > platform.x + platform.w) continue;
      if (previousY <= top + 5 && player.y >= top) {
        if (!landing || top < landing.top) landing = { platform, top };
      }
    }
  }
  if (!landing) {
    player.onGround = false;
    return;
  }
  player.y = landing.top;
  if (player.slamming) {
    player.slamming = false;
    player.slamImpact = 0.28;
  }
  player.vy = 0;
  player.onGround = true;
  player.doubleUsed = false;
  player.groundPlatform = landing.platform.id;
}

function handleSlamImpact(state, env) {
  const player = state.player;
  if (player.slamImpact <= 0 || player.slamHit) return;
  player.slamHit = true;
  state.shake = 1;
  addEffect(state, "slam_shockwave", player.x, player.y - 18, state.progress.abilities.has("shockwave") ? 300 : 210);
  env.audio.play("slam");
  env.haptic(55);
  if (state.progress.abilities.has("shockwave")) player.animOverride = { sheet: "BAO_UTILITY", name: "shockwave", timer: 0.34 };
  for (const prop of state.room.props) {
    if (prop.breakable && Math.abs(prop.x - player.x) < (state.progress.abilities.has("shockwave") ? 210 : 105)) {
      state.destroyedProps.add(prop.id);
      addEffect(state, "floor_break", prop.x, prop.y - 30, 190);
    }
  }
  for (const enemy of state.room.enemies) {
    if (Math.abs(enemy.x - player.x) < (state.progress.abilities.has("shockwave") ? 220 : 130)) hitEnemy(state, env, enemy, state.progress.abilities.has("frost") ? 3 : 2, 40);
  }
}

function updateAnimation(player, dt) {
  player.animTime += dt;
  if (player.animOverride) {
    player.animOverride.timer -= dt;
    player.anim = { sheet: player.animOverride.sheet, name: player.animOverride.name, fps: 11 };
    if (player.animOverride.timer <= 0) player.animOverride = null;
    return;
  }
  if (player.sleeping) player.anim = { sheet: "BAO_VAULT_NAP", name: "power_nap", fps: 6 };
  else if (player.swinging?.prop?.type === "kite_anchor") player.anim = { sheet: "BAO_PUZZLE_ACTIONS", name: "kite_glide", fps: 8 };
  else if (player.swinging) player.anim = { sheet: "BAO_SWING", name: "swing_arc", fps: 8 };
  else if (player.slamming) player.anim = { sheet: "BAO_SLAM", name: "slam_dive", fps: 11 };
  else if (player.pogoing) player.anim = { sheet: "BAO_SLAM", name: "pogo_strike", fps: 12 };
  else if (player.slamImpact > 0) player.anim = { sheet: "BAO_SLAM", name: "slam_impact", fps: 12 };
  else if (player.rushTimer > 0 && player.onGround && Math.abs(player.vx) > 40 && player.worldArea === 18) player.anim = { sheet: "BAO_WORLD_ACTIONS", name: "shadow_step", fps: 14 };
  else if (player.carryLight > 0 && player.onGround && Math.abs(player.vx) > 18) player.anim = { sheet: "BAO_PUZZLE_ACTIONS", name: "carry_light", fps: 9 };
  else if (player.rushTimer > 0 && player.onGround && Math.abs(player.vx) > 40) player.anim = { sheet: "BAO_VAULT_NAP", name: "sugar_rush", fps: 14 };
  else if (!player.onGround) player.anim = { sheet: "BAO_AIR", name: player.vy < 0 ? "jump_rise" : "fall", fps: 10 };
  else if (Math.abs(player.vx) > 210) player.anim = { sheet: "BAO_LOCOMOTION", name: "run", fps: 13 };
  else if (Math.abs(player.vx) > 18) player.anim = { sheet: "BAO_LOCOMOTION", name: "walk", fps: 10 };
  else player.anim = { sheet: "BAO_LOCOMOTION", name: "idle", fps: 6 };
}

export function updateGame(state, input, dt, env) {
  if (state.paused || state.gameOver || state.won || !state.room) return;
  state.time += dt;
  state.elapsed += dt;
  state.shake = Math.max(0, state.shake - dt * 4);
  state.effects.forEach((effect) => { effect.age += dt; });
  state.effects = state.effects.filter((effect) => effect.age < effect.duration);
  const player = state.player;
  const nextAreaIndex = areaIndexAt(player.x);
  if (nextAreaIndex !== state.room.areaIndex) {
    state.room.areaIndex = nextAreaIndex;
    state.room.area = AREAS[nextAreaIndex];
    state.room.icy = nextAreaIndex === 8;
    state.room.windy = nextAreaIndex === 4 || nextAreaIndex === 11;
    state.room.poisonous = nextAreaIndex === 7;
    state.room.boss = nextAreaIndex === 9 || nextAreaIndex === 19;
    state.progress.visitedAreas.add(nextAreaIndex);
    env.toast(`${AREAS[nextAreaIndex].name} — ${AREAS[nextAreaIndex].puzzle}`);
    env.onAreaChange?.(nextAreaIndex);
  }
  state.room.variant = Math.min(SEGMENTS_PER_AREA - 1, Math.floor((player.x - nextAreaIndex * AREA_WIDTH) / 800));
  player.worldArea = nextAreaIndex;
  player.carryLight = Math.max(0, (player.carryLight || 0) - dt);
  const activeDoor = state.room.doors.find((door) => Math.abs(door.x - player.x) < 85 && Math.abs(door.y - player.y) < 120);
  const safeProp = nearestProp(state.room, player, (prop) => prop.type === "safe_moss" || prop.safe, 110);
  const downPressed = input.consume("down");
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.slamImpact = Math.max(0, player.slamImpact - dt);
  if (player.slamImpact <= 0) player.slamHit = false;
  player.rushTimer = Math.max(0, player.rushTimer - dt);
  if (player.rushTimer > 0) player.energy = Math.max(0, player.energy - dt * 8);
  if (player.energy <= 0) player.rushTimer = 0;

  const direction = (input.held("right") ? 1 : 0) - (input.held("left") ? 1 : 0);
  if (direction) player.facing = direction;
  const speed = env.config.playerSpeed * (player.rushTimer > 0 ? 1.55 : 1);
  const acceleration = state.room.icy ? 2.4 : player.onGround ? 11 : 5.5;
  player.vx += (direction * speed - player.vx) * Math.min(1, acceleration * dt);
  if (!direction && !state.room.icy) player.vx *= Math.max(0, 1 - dt * 7);
  if (state.room.windy && Math.sin(state.time * 1.7) > 0.4) player.vx -= 110 * dt;

  const nearbyRoot = nearestProp(state.room, player, (prop) => prop.type === "root_ladder", 110);
  if (nearbyRoot && input.held("jump")) {
    player.y -= 210 * dt;
    player.vy = -80;
    player.onGround = false;
    player.animOverride = { sheet: "BAO_WORLD_ACTIONS", name: "root_climb", timer: 0.14 };
  } else if (!player.onGround && input.held("jump") && [9, 19].includes(state.room.areaIndex) && Math.abs(player.vx) > 140) {
    player.vy -= env.config.gravity * dt * 0.55;
    player.animOverride = { sheet: "BAO_UTILITY", name: "wall_run", timer: 0.12 };
  }

  const heavyProp = nearestProp(state.room, player, (prop) => ["paper_press", "rolling_cup", "bamboo_piston", "thunder_pearl"].includes(prop.type), 105);
  if (heavyProp && player.onGround && direction) {
    const toward = Math.sign(heavyProp.x - player.x) === direction;
    heavyProp.x += direction * 72 * dt;
    player.animOverride = { sheet: "BAO_WORLD_ACTIONS", name: toward ? "push" : "pull", timer: 0.14 };
  }

  const swingProp = nearestProp(state.room, player, (prop) => prop.swing, 135);
  if (!player.swinging && swingProp && state.progress.abilities.has("swing") && input.consume("jump")) {
    player.swinging = { prop: swingProp, angle: Math.atan2(player.x - swingProp.x, player.y - (swingProp.y - swingProp.h)), angular: player.facing * 1.5 };
    player.vx = 0;
    player.vy = 0;
    env.audio.play("swing");
  }

  if (downPressed && !player.onGround && !player.swinging) {
    player.slamming = true;
    player.pogoing = false;
    player.vy = 1050;
    player.vx *= 0.25;
    player.animOverride = { sheet: "BAO_SLAM", name: "slam_windup", timer: 0.16 };
  }

  if (player.swinging) {
    const swing = player.swinging;
    const anchorX = swing.prop.x;
    const anchorY = swing.prop.y - swing.prop.h + 14;
    swing.angular += (direction * 2.4 - Math.sin(swing.angle) * 2.2) * dt;
    swing.angular *= 0.996;
    swing.angle += swing.angular * dt;
    const length = 175;
    player.x = anchorX + Math.sin(swing.angle) * length;
    player.y = anchorY + Math.cos(swing.angle) * length;
    if (input.consumeRelease("jump") || input.consume("attack")) {
      player.vx = Math.cos(swing.angle) * swing.angular * length * 1.15;
      player.vy = -Math.sin(swing.angle) * swing.angular * length - 170;
      player.swinging = null;
      player.onGround = false;
      player.animOverride = { sheet: "BAO_SWING", name: "swing_release", timer: 0.3 };
    }
  } else {
    if (input.consume("jump")) {
      const vaultProp = nearestProp(state.room, player, (prop) => prop.vault, 120);
      if (input.held("down") && vaultProp && state.progress.abilities.has("pole") && player.onGround) {
        player.vy = -900;
        player.vx = player.facing * 390;
        player.onGround = false;
        player.animOverride = { sheet: "BAO_VAULT_NAP", name: "pole_launch", timer: 0.45 };
        env.audio.play("swing");
      } else if (input.held("down") && !player.onGround) {
        player.slamming = true;
        player.pogoing = false;
        player.vy = 1050;
        player.vx *= 0.25;
        player.animOverride = { sheet: "BAO_SLAM", name: "slam_windup", timer: 0.16 };
      } else if (player.onGround) {
        player.vy = -env.config.jumpForce;
        player.onGround = false;
        env.audio.play("jump");
      } else if (player.rushTimer > 0 && !player.doubleUsed) {
        player.vy = -env.config.jumpForce * 0.9;
        player.doubleUsed = true;
        player.animOverride = { sheet: "BAO_AIR", name: "double_jump", timer: 0.32 };
        env.audio.play("jump");
      }
    }

    if (input.consume("attack")) {
      if (input.held("down") && !player.onGround && state.progress.abilities.has("pogo")) {
        player.pogoing = true;
        player.slamming = false;
        player.vy = 650;
      } else {
        player.chargeHold = 0;
        beginAttack(state, false);
      }
    }
    if (input.held("attack") && state.progress.abilities.has("charge")) player.chargeHold += dt;
    if (input.consumeRelease("attack") && player.chargeHold > 0.68 && state.progress.abilities.has("charge")) beginAttack(state, true);

    if (input.consume("rush")) {
      if (!state.progress.abilities.has("rush")) env.toast("Sugar Rush ditemukan di Jalur Rebung Emas");
      else if (player.energy < 28) env.toast("Energi bambu belum cukup");
      else {
        player.rushTimer = 5;
        player.energy -= 20;
        env.toast("Sugar Rush!");
        env.haptic(24);
      }
    }

    const previousY = player.y;
    player.x += player.vx * dt;
    player.vy += env.config.gravity * dt;
    player.y += player.vy * dt;
    resolveGround(state, previousY);
  }

  for (const platform of state.room.platforms) {
    if (platform.type !== "lotus") continue;
    if (player.groundPlatform === platform.id && player.onGround) platform.sink = Math.min(56, (platform.sink || 0) + dt * 25);
    else platform.sink = Math.max(0, (platform.sink || 0) - dt * 17);
  }

  const mushroom = nearestProp(state.room, player, (prop) => prop.bounce && !state.destroyedProps.has(prop.id), 90);
  if (mushroom && player.vy > 0 && player.y > mushroom.y - mushroom.h * 0.65 && player.y < mushroom.y + 20) {
    player.vy = player.slamming ? -970 : -790;
    player.slamming = false;
    player.onGround = false;
    state.shake = 0.35;
  }

  if (player.pogoing) {
    for (const enemy of state.room.enemies) {
      if (!enemy.dead && overlaps(playerBox(player), enemyBox(enemy))) {
        hitEnemy(state, env, enemy, 2, 20);
        player.vy = -720;
        player.pogoing = false;
        env.audio.play("swing");
        break;
      }
    }
    if (player.onGround) { player.vy = -620; player.onGround = false; player.pogoing = false; }
  }

  handleSlamImpact(state, env);

  if (player.attackTimer > 0) {
    const active = player.chargedAttack ? player.attackTimer < 0.42 && player.attackTimer > 0.16 : player.attackTimer < 0.24 && player.attackTimer > 0.08;
    if (active) {
      const reach = player.chargedAttack ? 155 : 105;
      const attackBox = { left: player.facing > 0 ? player.x : player.x - reach, right: player.facing > 0 ? player.x + reach : player.x, top: player.y - 92, bottom: player.y + 8 };
      for (const enemy of state.room.enemies) {
        if (enemy.lastAttackSerial === player.attackSerial || !overlaps(attackBox, enemyBox(enemy))) continue;
        enemy.lastAttackSerial = player.attackSerial;
        let damage = player.chargedAttack ? 3 : 1;
        if (enemy.type === "pangolin" && !player.chargedAttack && !state.progress.abilities.has("armor")) damage = 0;
        if ((enemy.type === "boss" || enemy.type === "eclipse_crane") && enemy.state !== "weak") damage = Math.min(1, damage);
        if (damage) hitEnemy(state, env, enemy, damage, player.chargedAttack ? 160 : 75);
        else env.toast("Zirahnya terlalu keras");
      }
      for (const prop of state.room.props) {
        if (prop.breakable && player.chargedAttack && !state.destroyedProps.has(prop.id) && Math.abs(prop.x - player.x) < reach + prop.w * 0.45) {
          state.destroyedProps.add(prop.id);
          addEffect(state, "floor_break", prop.x, prop.y - 50, 190);
          env.toast("Segel pecah oleh Charged Strike");
          continue;
        }
        if (!prop.puzzleSwitch || prop.lastAttackSerial === player.attackSerial || state.destroyedProps.has(prop.id)) continue;
        if (Math.abs(prop.x - player.x) > reach + prop.w * 0.45) continue;
        prop.lastAttackSerial = player.attackSerial;
        state.puzzleSwitches.add(prop.id);
        if (prop.type === "gravity_drum") {
          player.animOverride = { sheet: "BAO_PUZZLE_ACTIONS", name: "gravity_flip", timer: 0.42 };
          player.vy = -760;
          player.onGround = false;
          addEffect(state, "gravity_turn", prop.x, prop.y - 80, 210, "WONDER_PUZZLE_EFFECTS");
          env.toast("Gravitasi kertas berputar");
        }
        if (prop.type === "hourglass_switch") {
          state.room.enemies.filter((enemy) => Math.abs(enemy.x - prop.x) < 900).forEach((enemy) => { enemy.cooldown = 4; enemy.state = "stagger"; enemy.stateTimer = 0; });
          addEffect(state, "time_pulse", prop.x, prop.y - 70, 230, "WONDER_PUZZLE_EFFECTS");
          env.toast("Waktu melambat");
        }
        if (prop.type === "rain_bell") {
          player.animOverride = { sheet: "BAO_PUZZLE_ACTIONS", name: "bell_strike", timer: 0.4 };
          addEffect(state, "bell_resonance", prop.x, prop.y - 85, 240, "WONDER_PUZZLE_EFFECTS");
          const bellCount = [...state.puzzleSwitches].filter((id) => id.startsWith("area-14-")).length;
          if (bellCount >= 3) {
            state.room.props.filter((item) => item.areaIndex === 14 && item.type === "resonance_door").forEach((item) => state.destroyedProps.add(item.id));
            env.toast("Gerbang resonansi terbuka");
          } else env.toast(`Nada hujan ${bellCount}/3`);
        }
        if (prop.type === "moon_mirror") {
          addEffect(state, "shadow_portal", prop.x, prop.y - 95, 220, "SKY_PUZZLE_EFFECTS");
          const mirrorCount = [...state.puzzleSwitches].filter((id) => id.startsWith("area-18-")).length;
          if (mirrorCount >= 2) {
            state.room.props.filter((item) => item.areaIndex === 18 && item.type === "shadow_gate").forEach((item) => state.destroyedProps.add(item.id));
            env.toast("Bayangan bulan terbelah");
          } else env.toast("Satu cermin lagi");
        }
        if (["fold_lantern", "paper_press"].includes(prop.type)) {
          addEffect(state, "paper_fold", prop.x, prop.y - 80, 210, "EXPANSION_EFFECTS_ALPHA");
          env.toast(prop.type === "fold_lantern" ? "Lentera melipat menjadi tangga" : "Dinding kertas dipipihkan");
        }
        if (["wind_harp", "cliff_vane"].includes(prop.type)) {
          addEffect(state, "wind_harp_wave", prop.x, prop.y - 90, 230, "EXPANSION_EFFECTS_ALPHA");
          player.vx += player.facing * 260;
          env.toast("Arus angin berubah arah");
        }
        if (prop.type === "time_spool") {
          addEffect(state, "time_rewind", prop.x, prop.y - 70, 220, "EXPANSION_EFFECTS_ALPHA");
          state.room.enemies.filter((enemy) => Math.abs(enemy.x - prop.x) < 1000).forEach((enemy) => { enemy.cooldown = 5; });
          env.toast("Benang waktu digulung kembali");
        }
        if (prop.type === "porcelain_valve") {
          addEffect(state, "tea_cyclone", prop.x, prop.y - 90, 220, "EXPANSION_EFFECTS_ALPHA");
          player.vy = -720;
          player.onGround = false;
          env.toast("Katup teh membuka pusaran uap");
        }
        if (["rain_chime", "flood_seal", "echo_gong"].includes(prop.type)) {
          addEffect(state, "flood_release", prop.x, prop.y - 80, 230, "EXPANSION_EFFECTS_BETA");
          env.toast("Air hujan mengikuti gema baru");
        }
        if (prop.type === "firefly_prism") {
          addEffect(state, "prism_light", prop.x, prop.y - 80, 230, "EXPANSION_EFFECTS_BETA");
          player.carryLight = 14;
          env.toast("Prisma membagi cahaya naga");
        }
        if (prop.type === "gear_lock") {
          addEffect(state, "piston_burst", prop.x, prop.y - 60, 210, "EXPANSION_EFFECTS_BETA");
          env.toast("Kunci roda menggerakkan seluruh jalur");
        }
        if (prop.type === "thunder_pearl") {
          addEffect(state, "koi_cloud_leap", prop.x, prop.y - 70, 220, "EXPANSION_EFFECTS_BETA");
          player.vy = -760;
          player.onGround = false;
        }
        if (["moon_prism", "shadow_clone_seal"].includes(prop.type)) {
          addEffect(state, prop.type === "moon_prism" ? "moon_clone" : "shadow_merge", prop.x, prop.y - 80, 220, "EXPANSION_EFFECTS_GAMMA");
          player.animOverride = { sheet: "BAO_WORLD_ACTIONS", name: "shadow_step", timer: 0.35 };
          env.toast("Bayangan Bao menahan saklar kedua");
        }
        if (prop.type === "eclipse_feather") {
          addEffect(state, "eclipse_feather_cut", prop.x, prop.y - 100, 240, "EXPANSION_EFFECTS_GAMMA");
          env.toast("Bulu gerhana memotong segel akar");
        }
      }
    }
  }

  collectItems(state, env);
  updateEnemies(state, env, dt);

  for (const prop of state.room.props) {
    if (state.destroyedProps.has(prop.id) || Math.abs(prop.x - player.x) > 130) continue;
    if (prop.type === "light_seed" && Math.abs(prop.y - player.y) < 150) {
      state.destroyedProps.add(prop.id);
      player.carryLight = 10;
      addEffect(state, "firefly_path", prop.x, prop.y - 40, 180, "SKY_PUZZLE_EFFECTS");
      env.toast("Benih kunang mengikuti Bao");
    }
    if (prop.type === "dark_reed" && player.carryLight > 0) {
      state.destroyedProps.add(prop.id);
      addEffect(state, "firefly_path", prop.x, prop.y - 100, 240, "SKY_PUZZLE_EFFECTS");
      env.toast("Alang gelap membuka jalur");
    }
    if (prop.type === "bamboo_conveyor" && player.onGround) player.x += 85 * dt;
    if (["cloud_scale", "koi_fin_platform"].includes(prop.type) && player.vy > 0 && player.y > prop.y - prop.h && player.y < prop.y + 30) {
      player.vy = -560;
      player.onGround = false;
      addEffect(state, "cloud_splash", prop.x, prop.y - 35, 180, "SKY_PUZZLE_EFFECTS");
    }
  }

  if (downPressed && activeDoor) {
    const missing = activeDoor.requires?.filter((ability) => !state.progress.abilities.has(ability)) ?? [];
    if (missing.length) env.toast(`Perlu ${missing.map(abilityLabel).join(", ")}`);
    else { env.audio.play("gate"); env.transition(activeDoor.target, 120); }
  }

  if (downPressed && player.onGround && !activeDoor && !player.sleeping) {
    player.sleeping = true;
    player.sleepTimer = safeProp ? 1.1 : 1.8;
    player.vx = 0;
    if (player.hp < player.maxHp) player.animOverride = { sheet: "BAO_UTILITY", name: "heal", timer: 0.5 };
    env.audio.play("nap");
  } else if (player.onGround && input.held("down") && !activeDoor) {
    player.sleepHold += dt;
    if (player.sleepHold > (safeProp ? 0.85 : 1.5) && !player.sleeping) {
      player.sleeping = true;
      player.sleepTimer = safeProp ? 1.1 : 1.8;
      player.vx = 0;
      env.audio.play("nap");
    }
  } else if (!player.sleeping) player.sleepHold = 0;

  if (player.sleeping) {
    player.sleepTimer -= dt;
    const threat = state.room.enemies.some((enemy) => !enemy.dead && Math.abs(enemy.x - player.x) < 210);
    if (threat && !safeProp) {
      player.sleeping = false;
      hurtPlayer(state, env, player.x + 1, 1);
      env.toast("Tidur dibatalkan oleh musuh");
    } else if (player.sleepTimer <= 0) {
      player.sleeping = false;
      player.hp = player.maxHp;
      player.energy = player.maxEnergy;
      player.sleepHold = 0;
      player.animOverride = { sheet: "BAO_UTILITY", name: "wake", timer: 0.42 };
      if (safeProp) env.onCheckpoint();
      env.toast(safeProp ? "Power Nap aman — progres tersimpan" : "Tenaga pulih");
    }
  }

  for (const prop of state.room.props) {
    if (!prop.hazard || state.destroyedProps.has(prop.id)) continue;
    const hazardBox = { left: prop.x - prop.w * 0.42, right: prop.x + prop.w * 0.42, top: prop.y - prop.h * 0.7, bottom: prop.y };
    if (overlaps(playerBox(player), hazardBox)) hurtPlayer(state, env, prop.x, 1);
  }

  if (state.room.poisonous && Math.sin(state.time * 0.85) > 0.93 && !safeProp) player.energy = Math.max(0, player.energy - dt * 20);

  const barrier = state.room.props.find((prop) => !state.destroyedProps.has(prop.id) && ["resonance_door", "dark_reed", "shadow_gate", "skyroot_seal"].includes(prop.type) && Math.abs(prop.x - player.x) < prop.w * 0.45 + 24);
  if (barrier) {
    if (player.vx >= 0) player.x = barrier.x - barrier.w * 0.45 - 25;
    else player.x = barrier.x + barrier.w * 0.45 + 25;
    player.vx = 0;
    if (barrier.type === "dark_reed") env.toast("Cari benih kunang");
    if (barrier.type === "skyroot_seal") env.toast("Charged Strike atau Belly Slam dapat memecah segel");
  }
  const rootfire = state.room.enemies.find((enemy) => enemy.type === "boss");
  if (rootfire && !rootfire.dead && player.x > rootfire.x + 220 && player.x < (10 * AREA_WIDTH)) {
    player.x = rootfire.x + 220;
    player.vx = 0;
    env.toast("Raja Kelabang mengunci jalan ke dunia atas");
  }
  player.x = Math.max(25, Math.min(state.room.width - 25, player.x));

  if (player.y > 960) {
    hurtPlayer(state, env, player.x + 1, 1);
    player.x = state.lastSafeX;
    player.y = 650;
    player.vx = 0;
    player.vy = 0;
  } else if (player.onGround) state.lastSafeX = player.x;

  updateAnimation(player, dt);
}
