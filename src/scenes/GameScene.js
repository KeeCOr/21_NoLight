class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.worldWidth = this.scale?.width || this.cameras.main.width;
    this.worldHeight = this.scale?.height || this.cameras.main.height;
    this._createBackground();
    this._createLightGuides();

    this.physics.world.setBounds(-50000, -50000, 100000, 100000);
    this.cameras.main.setBounds(-50000, -50000, 100000, 100000);

    this.stat = new StatSystem();
    this.mapGen = new MapGenerator(this);

    const startX = this.worldWidth / 2;
    const electric = new ElectricCharacter(this, startX, 300, this.stat);
    const mecha = new MechaArmCharacter(this, startX, 300, this.stat);
    mecha.setVisible(false);

    this.charManager = new CharacterManager([electric, mecha]);
    this.pursuer = new Pursuer(this, startX, 860);
    this.hud = new HUD(this, this.stat, this.charManager);
    this._createBoundaryMarkers();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      attack: Phaser.Input.Keyboard.KeyCodes.Z,
      skill: Phaser.Input.Keyboard.KeyCodes.X,
      guard: Phaser.Input.Keyboard.KeyCodes.C,
      swap: Phaser.Input.Keyboard.KeyCodes.TAB,
    });

    this.cameras.main.startFollow(this.charManager.getActive(), true, 0.1, 0.1);
    this.projectiles = [];
    this.healthDrops = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(electric, this.mapGen.getPlatformGroup(), null, this._platformCollisionProcess, this);
    this.physics.add.collider(mecha, this.mapGen.getPlatformGroup(), null, this._platformCollisionProcess, this);
    this.physics.add.overlap(electric, this.healthDrops, (player, drop) => this._collectHealthDrop(player, drop));
    this.physics.add.overlap(mecha, this.healthDrops, (player, drop) => this._collectHealthDrop(player, drop));

    this.events.on('enemyKilled', (enemy) => {
      this.stat.onKill();
      this._impactInkBurst(enemy.x, enemy.y, 'kill', 1.25);
      this._impactBurst(enemy.x, enemy.y, 0x05070b, 12);
      this._inkSplatter(enemy.x, enemy.y, 'blood_ink', 1.15);
      this._spawnHealthDrop(enemy.x, enemy.y);
      this._cameraPunch('kill', 1.25);
    });
    this.events.on('enemyHit', (enemy) => {
      this._impactInkBurst(enemy.x, enemy.y, 'hit', 0.82);
      this._impactBurst(enemy.x, enemy.y, 0x05070b, 8);
      this._inkSplatter(enemy.x, enemy.y, 'ink_splatter', 0.85);
      this._hitStop(42);
      this._cameraPunch('hit', 1);
    });
    this.events.on('mechaDashStart', (char) => this._dashTrail(char, 0x05070b));

    this.events.on('electricSwapIn', (char) => {
      this._skillBurst(char.x, char.y, 0x05070b, 230);
      this.mapGen.getAllEnemies().forEach(e => {
        const dist = Phaser.Math.Distance.Between(char.x, char.y, e.x, e.y);
        if (dist <= 200) e.applyStun(800);
      });
    });

    this.events.on('pursuerAttack', ({ pursuer, type, player }) => {
      this._handlePursuerAttack(pursuer, type, player);
    });
  }

  _createBackground() {
    const cx = this.worldWidth / 2;
    const cy = this.worldHeight / 2;
    this.bgFar = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_far').setScrollFactor(0).setDepth(-30);
    this.bgMid = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_mid').setScrollFactor(0).setDepth(-20).setAlpha(0.54);
    this.bgFog = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_fog').setScrollFactor(0).setDepth(-10).setAlpha(0.56);
    this._createInkLandscape();
    this.paperWash = this.add.rectangle(cx, cy, this.worldWidth, this.worldHeight, 0xf7f1e4, 0.28)
      .setScrollFactor(0)
      .setDepth(-7);
    this.inkGrade = this.add.rectangle(cx, cy, this.worldWidth, this.worldHeight, 0x05070b, 0.16)
      .setScrollFactor(0)
      .setDepth(-5);
    this.edgeVignetteTop = this.add.rectangle(cx, 28, this.worldWidth, 92, 0x05070b, 0.18)
      .setScrollFactor(0)
      .setDepth(18);
    this.edgeVignetteBottom = this.add.rectangle(cx, this.worldHeight - 28, this.worldWidth, 92, 0x05070b, 0.18)
      .setScrollFactor(0)
      .setDepth(18);
    this.scanlines = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_scanline')
      .setScrollFactor(0)
      .setDepth(19)
      .setAlpha(0.07)
      .setTint(0x05070b);
    this._applyMonochromeTint(this.bgFar, 0xefe6d0, 0.96);
    this._applyMonochromeTint(this.bgMid, 0x2c2a25, 0.54);
    this._applyMonochromeTint(this.bgFog, 0xf5f0e4, 0.5);
  }

  _createInkLandscape() {
    const mountainY = this.worldHeight * 0.34;
    this.mountainFar = this.add.image(this.worldWidth / 2, mountainY, 'bg_mountain_generated')
      .setDisplaySize(this.worldWidth * 1.12, 280)
      .setScrollFactor(0)
      .setDepth(-18)
      .setAlpha(0.44)
      .setTint(0x28251f);
    this.mountainNear = this.add.image(this.worldWidth / 2 + 70, this.worldHeight * 0.48, 'bg_mountain_generated')
      .setDisplaySize(this.worldWidth * 1.28, 360)
      .setScrollFactor(0)
      .setDepth(-16)
      .setAlpha(0.3)
      .setTint(0x0f0e0c);
    this.inkWallLeft = this.add.tileSprite(22, this.worldHeight / 2, 96, this.worldHeight, 'ink_wall')
      .setScrollFactor(0)
      .setDepth(-4)
      .setAlpha(0.16)
      .setTint(0x05070b);
    this.inkWallRight = this.add.tileSprite(this.worldWidth - 22, this.worldHeight / 2, 96, this.worldHeight, 'ink_wall')
      .setScrollFactor(0)
      .setDepth(-4)
      .setAlpha(0.16)
      .setTint(0x05070b)
      .setFlipX(true);
    this.inkForeground = this.add.tileSprite(this.worldWidth / 2, this.worldHeight - 54, this.worldWidth, 128, 'ink_wall')
      .setScrollFactor(0)
      .setDepth(0)
      .setAlpha(0.24)
      .setTint(0x05070b);
  }

  _applyMonochromeTint(target, tint, alpha) {
    target.setTint(tint);
    target.setAlpha(alpha);
  }

  _createLightGuides() {
    const cx = this.worldWidth / 2;
    this.topLightGuide = this.add.image(cx, 102, 'light_shard_top')
      .setDisplaySize(210, 420)
      .setScrollFactor(0)
      .setDepth(-2)
      .setAlpha(0.26)
      .setTint(0xf4efe3);
    this.bottomLightGuide = this.add.image(cx, this.worldHeight - 120, 'light_shard_bottom')
      .setDisplaySize(220, 430)
      .setScrollFactor(0)
      .setDepth(-2)
      .setAlpha(0.22)
      .setTint(0xf4efe3);
    this.lightGuidePulse = 0;
  }

  _syncLightGuides(delta) {
    if (!this.topLightGuide || !this.bottomLightGuide) return;
    this.lightGuidePulse += delta;
    const pulse = Math.sin(this.lightGuidePulse * 0.0022);
    const active = this.charManager?.getActive?.();
    const targetX = active ? Phaser.Math.Clamp(active.x, this.worldWidth * 0.28, this.worldWidth * 0.72) : this.worldWidth / 2;
    this.topLightGuide.x += (targetX - this.topLightGuide.x) * 0.018;
    this.bottomLightGuide.x += (targetX - this.bottomLightGuide.x) * 0.014;
    this.topLightGuide.setAlpha(0.22 + pulse * 0.05);
    this.bottomLightGuide.setAlpha(0.2 - pulse * 0.04);
    this.topLightGuide.setAngle(pulse * 1.2);
    this.bottomLightGuide.setAngle(-pulse * 1.4);
  }

  _syncBackground() {
    const cam = this.cameras.main;
    this.bgFar.tilePositionY = cam.scrollY * 0.08;
    this.bgMid.tilePositionY = cam.scrollY * 0.24;
    this.bgFog.tilePositionY = cam.scrollY * 0.42;
    this.bgFog.tilePositionX += 0.12;
    if (this.mountainFar) this.mountainFar.y = this.worldHeight * 0.34 - cam.scrollY * 0.04;
    if (this.mountainNear) this.mountainNear.y = this.worldHeight * 0.48 - cam.scrollY * 0.08;
    if (this.inkWallLeft) this.inkWallLeft.tilePositionY = cam.scrollY * 0.18;
    if (this.inkWallRight) this.inkWallRight.tilePositionY = cam.scrollY * 0.22;
    if (this.inkForeground) this.inkForeground.tilePositionY = cam.scrollY * 0.12;
    this.scanlines.tilePositionY += 0.08;
  }

  _createBoundaryMarkers() {
    const margin = this.charManager?.getActive()?.PLAY_AREA_MARGIN || 120;
    const leftX = margin - 34;
    const rightX = this.worldWidth - margin + 34;
    this.leftBoundaryMarker = this.add.tileSprite(leftX, this.worldHeight / 2, 54, this.worldHeight, 'ink_splatter')
      .setScrollFactor(0)
      .setDepth(1)
      .setAlpha(0.24)
      .setTint(0x05070b);
    this.rightBoundaryMarker = this.add.tileSprite(rightX, this.worldHeight / 2, 54, this.worldHeight, 'ink_splatter')
      .setScrollFactor(0)
      .setDepth(1)
      .setAlpha(0.24)
      .setTint(0x05070b)
      .setFlipX(true);
    this.add.rectangle(leftX + 28, this.worldHeight / 2, 3, this.worldHeight, 0xb88a3a, 0.32)
      .setScrollFactor(0)
      .setDepth(2);
    this.add.rectangle(rightX - 28, this.worldHeight / 2, 3, this.worldHeight, 0xb88a3a, 0.32)
      .setScrollFactor(0)
      .setDepth(2);
  }

  _platformCollisionProcess(player, platform) {
    if (!platform.isOneWayPlatform) return true;
    if (player.dropThroughTimer > 0) return false;
    if (!player.body || !platform.body) return true;
    return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 14;
  }

  _handlePursuerAttack(pursuer, type, player) {
    if (type === 'projectile') {
      const proj = this.physics.add.sprite(pursuer.x, pursuer.y, 'projectile').setDepth(4);
      proj.body.allowGravity = false;
      proj.body.setCircle(9, 3, 3);
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      proj.body.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
      proj.damage = 15;
      this.tweens.add({ targets: proj, angle: 360, duration: 700, repeat: -1 });

      proj.reflect = () => {
        const backAngle = Phaser.Math.Angle.Between(proj.x, proj.y, pursuer.x, pursuer.y);
        proj.body.setVelocity(Math.cos(backAngle) * 350, Math.sin(backAngle) * 350);
        proj.damage = 30;
        proj.setTint(0xf4efe3);
        this.physics.add.overlap(proj, pursuer, () => {
          if (!proj.active) return;
          pursuer.onHit(proj.damage, proj);
          this._impactInkBurst(proj.x, proj.y, 'hit', 0.9);
          this._impactBurst(proj.x, proj.y, 0x05070b, 10);
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        });
      };
      proj.setSlowed = (factor) => {
        proj.body.setVelocity(proj.body.velocity.x * factor, proj.body.velocity.y * factor);
      };

      this.physics.add.overlap(proj, player, () => {
        player.onHit(proj.damage, proj);
        this._impactInkBurst(proj.x, proj.y, 'hit', 0.75);
        this._impactBurst(proj.x, proj.y, 0x05070b, 9);
        proj.destroy();
        this.projectiles = this.projectiles.filter(p => p !== proj);
      });

      this.projectiles.push(proj);
      this.time.delayedCall(5000, () => {
        if (proj.active) {
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        }
      });
    } else if (type === 'shockwave') {
      const warn = this.add.circle(pursuer.x, pursuer.y, 200, 0x05070b, 0.08)
        .setStrokeStyle(3, 0x05070b, 0.65)
        .setDepth(2);
      this.tweens.add({ targets: warn, scale: 1.12, alpha: 0.35, duration: 760, yoyo: true });
      this.time.delayedCall(800, () => {
        warn.destroy();
        this._skillBurst(pursuer.x, pursuer.y, 0x05070b, 205);
        const dist = Phaser.Math.Distance.Between(pursuer.x, pursuer.y, player.x, player.y);
        if (dist <= 200) player.onHit(20, pursuer);
      });
    } else if (type === 'dash') {
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      pursuer.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
      this._dashTrail(pursuer, 0x05070b);
      this.time.delayedCall(400, () => pursuer.setVelocity(0, 0));
    } else if (type === 'rush') {
      this._showAlert('THE HUNTER SURGES');
      this._cameraPunch('rush', 1.35);
    }
  }

  _cameraPunch(kind, power = 1) {
    const cam = this.cameras.main;
    const profiles = {
      hit: { duration: 95, intensity: 0.004, zoom: 1.018, flash: 35, color: 0xffffff },
      kill: { duration: 150, intensity: 0.006, zoom: 1.035, flash: 65, color: 0x05070b },
      combo: { duration: 105, intensity: 0.0045, zoom: 1.024, flash: 42, color: 0xf4efe3 },
      skill: { duration: 190, intensity: 0.0065, zoom: 1.04, flash: 75, color: 0xffffff },
      rush: { duration: 320, intensity: 0.009, zoom: 1.055, flash: 95, color: 0x05070b },
    };
    const p = profiles[kind] || profiles.hit;
    cam.shake(Math.round(p.duration * power), p.intensity * power);
    cam.flash(Math.round(p.flash * power), (p.color >> 16) & 255, (p.color >> 8) & 255, p.color & 255, false);
    this.tweens.killTweensOf(cam);
    cam.setZoom(p.zoom);
    this.tweens.add({
      targets: cam,
      zoom: 1,
      duration: Math.round((p.duration + 80) * power),
      ease: 'Cubic.easeOut',
    });
  }

  _showAlert(text) {
    const alert = this.add.text(this.worldWidth / 2, 260, text, {
      fontSize: '30px',
      color: '#f4efe3',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30);
    this.tweens.add({
      targets: alert,
      alpha: 0,
      y: 232,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => alert.destroy(),
    });
  }

  _spawnHealthDrop(x, y, lifetime = 8500) {
    const drop = this.healthDrops.create(x, y - 14, 'life_orb')
      .setDepth(5)
      .setScale(1.35);
    drop.body.allowGravity = false;
    drop.healAmount = this.stat.HEAL_DROP_RESTORE;
    this.tweens.add({ targets: drop, y: y - 34, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.time.delayedCall(lifetime, () => {
      if (drop.active) drop.destroy();
    });
    return drop;
  }

  _collectHealthDrop(player, drop) {
    if (!player.visible) return;
    if (!drop || !drop.active) return;
    this.stat.restoreHp(drop.healAmount);
    SharkCombat.eatFish(this.stat);
    this._absorbLightFeedback(player);
    this._impactBurst(drop.x, drop.y, 0x05070b, 10);
    this._skillBurst(drop.x, drop.y, 0x05070b, 44);
    drop.destroy();
  }

  _hitStop(duration) {
    if (this._hitStopActive) return;
    this._hitStopActive = true;
    this.physics.world.timeScale = 0.18;
    this.time.delayedCall(duration, () => {
      this.physics.world.timeScale = 1;
      this._hitStopActive = false;
    });
  }

  _slashArc(char, color, comboStep = 0) {
    const facing = char.flipX ? -1 : 1;
    const width = 82 + comboStep * 28;
    const height = 42 + comboStep * 16;
    const offset = 36 + comboStep * 10;
    const slash = this.add.image(char.x + facing * (offset + 28), char.y - 6, 'brush_slash')
      .setDepth(6)
      .setAlpha(0.76)
      .setScale((0.74 + comboStep * 0.16) * facing, 0.68 + comboStep * 0.13)
      .setAngle(facing * (-10 - comboStep * 6))
      .setTint(comboStep >= 2 ? 0xf4efe3 : color);
    if (comboStep > 0) this._comboBrushSmear(char, comboStep);
    const arc = this.add.ellipse(char.x + facing * offset, char.y, width, height)
      .setStrokeStyle(4 + comboStep, color, 0.85)
      .setDepth(5);
    if (comboStep === 1) {
      arc.setAngle(facing * -12);
    } else if (comboStep >= 2) {
      arc.setStrokeStyle(7, 0xffffff, 0.75);
      this._impactBurst(char.x + facing * 58, char.y, color, 9);
      this._cameraPunch('combo', 1.1);
    }
    this.tweens.add({
      targets: arc,
      alpha: 0,
      scaleX: 1.3 + comboStep * 0.12,
      scaleY: 1.16 + comboStep * 0.08,
      duration: 135 + comboStep * 35,
      onComplete: () => arc.destroy(),
    });
    this.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: slash.scaleX * 1.28,
      scaleY: slash.scaleY * 1.12,
      duration: 150 + comboStep * 34,
      ease: 'Cubic.easeOut',
      onComplete: () => slash.destroy(),
    });
  }

  _electricDischarge(char, comboStep) {
    const facing = char.flipX ? -1 : 1;
    const boltCount = comboStep + 1;
    const baseLength = 130 + comboStep * 22;
    const spread = 18 + comboStep * 9;
    for (let i = 0; i < boltCount; i++) {
      const lane = i - (boltCount - 1) / 2;
      const startX = char.x + facing * 24;
      const startY = char.y - 4 + lane * 8;
      const endX = startX + facing * baseLength;
      const endY = startY + lane * spread;
      const midX = (startX + endX) / 2 + facing * Phaser.Math.Between(-10, 14);
      const midY = (startY + endY) / 2 + Phaser.Math.Between(-18, 18);
      const bolt = this.add.graphics().setDepth(6);
      bolt.lineStyle(8 - Math.min(comboStep, 2), 0x05070b, 0.46).beginPath()
        .moveTo(startX, startY)
        .lineTo(midX, midY)
        .lineTo(endX, endY)
        .strokePath();
      bolt.lineStyle(2 + comboStep, 0xf4efe3, 0.86).beginPath()
        .moveTo(startX, startY)
        .lineTo(midX + facing * 8, midY - lane * 5)
        .lineTo(endX, endY)
        .strokePath();
      this.tweens.add({
        targets: bolt,
        alpha: 0,
        duration: 105 + comboStep * 28,
        onComplete: () => bolt.destroy(),
          });
      if (comboStep > 0) this._comboBrushSmear(char, comboStep);
      this._impactBurst(endX, endY, 0x05070b, 2 + comboStep);
    }
    if (comboStep >= 2) {
      this._cameraPunch('combo', 1.05);
    }
  }

  _skillBurst(x, y, color, radius) {
    const ring = this.add.circle(x, y, radius, color, 0.06).setStrokeStyle(3, color, 0.74).setDepth(5);
    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 1.25,
      duration: 360,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
    this._impactInkBurst(x, y, 'skill', radius >= 180 ? 1.12 : 0.72);
    this._impactBurst(x, y, color, 14);
    this._cameraPunch('skill', radius >= 180 ? 1.15 : 0.85);
  }

  _absorbLightFeedback(player) {
    const facing = player.flipX ? -1 : 1;
    const aura = this.add.image(player.x, player.y, 'absorb_aura')
      .setDepth(8)
      .setAlpha(0.72)
      .setScale(0.42)
      .setTint(0xf4efe3);
    const trail = this.add.image(player.x - facing * 42, player.y + 6, 'absorb_trail')
      .setDepth(7)
      .setAlpha(0.68)
      .setScale(-0.52 * facing, 0.46)
      .setAngle(facing * -9)
      .setTint(0x05070b);
    this.tweens.add({
      targets: aura,
      alpha: 0,
      scale: 0.84,
      angle: 38,
      duration: 360,
      ease: 'Cubic.easeOut',
      onComplete: () => aura.destroy(),
    });
    this.tweens.add({
      targets: trail,
      alpha: 0,
      x: player.x,
      scaleX: trail.scaleX * 0.45,
      scaleY: trail.scaleY * 0.72,
      duration: 320,
      ease: 'Cubic.easeIn',
      onComplete: () => trail.destroy(),
    });
  }

  _impactInkBurst(x, y, kind = 'hit', power = 1) {
    const isHeavy = kind === 'kill' || kind === 'skill';
    const burstScale = (isHeavy ? 1.15 : 0.78) * power;
    const ringScale = (isHeavy ? 1.1 : 0.74) * power;
    const flashScale = (isHeavy ? 0.9 : 0.52) * power;

    const burst = this.add.image(x, y, 'impact_ink_burst')
      .setDepth(7)
      .setAlpha(isHeavy ? 0.86 : 0.66)
      .setScale(burstScale * 0.55)
      .setAngle(Phaser.Math.Between(-35, 35))
      .setTint(0x05070b);
    const ring = this.add.image(x, y, 'impact_brush_ring')
      .setDepth(6)
      .setAlpha(isHeavy ? 0.72 : 0.48)
      .setScale(ringScale * 0.42)
      .setAngle(Phaser.Math.Between(-18, 18))
      .setTint(0x05070b);
    const flash = this.add.image(x, y, 'heavy_hit_flash')
      .setDepth(8)
      .setAlpha(isHeavy ? 0.72 : 0.38)
      .setScale(flashScale * 0.36)
      .setAngle(Phaser.Math.Between(-20, 20))
      .setTint(0xf4efe3);

    this.tweens.add({
      targets: burst,
      alpha: 0,
      scale: burstScale,
      duration: isHeavy ? 260 : 190,
      ease: 'Cubic.easeOut',
      onComplete: () => burst.destroy(),
    });
    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: ringScale,
      duration: isHeavy ? 310 : 220,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: flashScale,
      duration: isHeavy ? 110 : 70,
      ease: 'Cubic.easeOut',
      onComplete: () => flash.destroy(),
    });
  }

  _comboBrushSmear(char, comboStep) {
    const facing = char.flipX ? -1 : 1;
    const smear = this.add.image(char.x + facing * (70 + comboStep * 18), char.y + 5, 'combo_brush_smear')
      .setDepth(5)
      .setAlpha(0.58 + comboStep * 0.1)
      .setScale((0.55 + comboStep * 0.15) * facing, 0.44 + comboStep * 0.08)
      .setAngle(facing * (-8 - comboStep * 8))
      .setTint(comboStep >= 2 ? 0x05070b : 0x1a1714);
    this.tweens.add({
      targets: smear,
      alpha: 0,
      x: smear.x + facing * (24 + comboStep * 8),
      scaleX: smear.scaleX * 1.2,
      scaleY: smear.scaleY * 1.08,
      duration: 150 + comboStep * 38,
      ease: 'Cubic.easeOut',
      onComplete: () => smear.destroy(),
    });
  }

  _inkSplatter(x, y, texture = 'ink_splatter', scale = 1) {
    const splatter = this.add.image(x, y, texture)
      .setDepth(4)
      .setAlpha(0.72)
      .setScale(scale)
      .setAngle(Phaser.Math.Between(-35, 35));
    this.tweens.add({
      targets: splatter,
      alpha: 0,
      scaleX: scale * 1.32,
      scaleY: scale * 1.12,
      duration: 420,
      ease: 'Cubic.easeOut',
      onComplete: () => splatter.destroy(),
    });
  }

  _dashTrail(target, color) {
    const ghost = this.add.image(target.x, target.y, target.texture.key)
      .setAlpha(0.35)
      .setTint(color)
      .setFlipX(target.flipX)
      .setDepth(1);
    const glow = this.add.image(target.x, target.y, 'afterimage_glow')
      .setTint(color)
      .setAlpha(0.24)
      .setDepth(0);
    this.tweens.add({
      targets: ghost,
      alpha: 0,
      scaleX: 1.35,
      scaleY: 1.12,
      duration: 240,
      onComplete: () => ghost.destroy(),
    });
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 1.8,
      duration: 300,
      onComplete: () => glow.destroy(),
    });
  }

  _impactBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const spark = this.add.image(x, y, 'spark').setTint(color).setDepth(6).setScale(0.35);
      const angle = (Math.PI * 2 * i) / count + Phaser.Math.FloatBetween(-0.2, 0.2);
      const distance = Phaser.Math.Between(18, 58);
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.05,
        duration: Phaser.Math.Between(180, 330),
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }

  update(time, delta) {
    this._syncBackground();
    this._syncLightGuides(delta);

    if (this.stat.isDead()) {
      this.scene.start('GameOverScene', { score: this.stat.score, time: this.stat.survivalTime });
      return;
    }

    const active = this.charManager.getActive();

    if (Phaser.Input.Keyboard.JustDown(this.keys.swap)) {
      const prev = active;
      prev.setVisible(false);
      this.charManager.swap();
      const next = this.charManager.getActive();
      next.setPosition(prev.x, prev.y);
      next.setVisible(true);
      this.cameras.main.startFollow(next, true, 0.1, 0.1);
    }

    const current = this.charManager.getActive();

    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
      const comboStep = current.attack(this.mapGen.getAllEnemies());
      if (comboStep !== null && comboStep !== undefined) {
        if (current instanceof ElectricCharacter) {
          this._electricDischarge(current, comboStep);
        } else {
          this._slashArc(current, 0x05070b, comboStep);
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) {
      const staminaBefore = this.stat.stamina;
      current.skill(this.mapGen.getAllEnemies());
      if (this.stat.stamina < staminaBefore) {
        this._skillBurst(current.x, current.y, 0x05070b, 120);
      }
    }

    if (this.keys.guard.isDown) {
      current.guard(time);
      if (current instanceof ElectricCharacter) {
        current.applyShieldSlow(this.projectiles);
      }
    } else {
      current.stopGuard();
    }

    this.stat.update(delta, current.isGuarding);
    current.update(delta, this.cursors, this.keys);

    this.mapGen.update(
      current,
      (x, y) => {
        const e = new Enemy(this, x, y);
        this.physics.add.collider(e, this.mapGen.getPlatformGroup());
        return e;
      },
      (x, y) => this._spawnHealthDrop(x, y, 24000)
    );

    this.pursuer.update(delta, current);
    this.mapGen.getAllEnemies().forEach(e => e.update(delta, current));
    this.hud.update();
  }
}
