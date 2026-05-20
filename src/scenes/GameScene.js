class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.worldWidth = this.scale?.width || this.cameras.main.width;
    this.worldHeight = this.scale?.height || this.cameras.main.height;
    this._createBackground();

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

    this.physics.add.collider(electric, this.mapGen.getPlatformGroup());
    this.physics.add.collider(mecha, this.mapGen.getPlatformGroup());
    this.physics.add.overlap(electric, this.healthDrops, (player, drop) => this._collectHealthDrop(player, drop));
    this.physics.add.overlap(mecha, this.healthDrops, (player, drop) => this._collectHealthDrop(player, drop));

    this.events.on('enemyKilled', (enemy) => {
      this.stat.onKill();
      this._impactBurst(enemy.x, enemy.y, 0xff4f9a, 12);
      this._spawnHealthDrop(enemy.x, enemy.y);
    });
    this.events.on('enemyHit', (enemy) => {
      this._impactBurst(enemy.x, enemy.y, 0x92fbff, 8);
      this._hitStop(42);
      this.cameras.main.shake(70, 0.0025);
    });
    this.events.on('mechaDashStart', (char) => this._dashTrail(char, 0xff8a2a));

    this.events.on('electricSwapIn', (char) => {
      this._skillBurst(char.x, char.y, 0x64e7ff, 230);
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
    this.bgMid = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_mid').setScrollFactor(0).setDepth(-20).setAlpha(0.72);
    this.bgFog = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_fog').setScrollFactor(0).setDepth(-10).setAlpha(0.95);
    this.add.rectangle(cx, cy, this.worldWidth, this.worldHeight, 0xf2efe3, 0.13).setScrollFactor(0).setDepth(-6);
    this.add.rectangle(cx, cy, this.worldWidth, this.worldHeight, 0x05070b, 0.11).setScrollFactor(0).setDepth(-5);
    this.scanlines = this.add.tileSprite(cx, cy, this.worldWidth, this.worldHeight, 'bg_scanline')
      .setScrollFactor(0)
      .setDepth(19)
      .setAlpha(0.12);
  }

  _syncBackground() {
    const cam = this.cameras.main;
    this.bgFar.tilePositionY = cam.scrollY * 0.08;
    this.bgMid.tilePositionY = cam.scrollY * 0.24;
    this.bgFog.tilePositionY = cam.scrollY * 0.42;
    this.bgFog.tilePositionX += 0.12;
    this.scanlines.tilePositionY += 0.08;
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
        proj.setTint(0x92fbff);
        this.physics.add.overlap(proj, pursuer, () => {
          if (!proj.active) return;
          pursuer.onHit(proj.damage, proj);
          this._impactBurst(proj.x, proj.y, 0x92fbff, 10);
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        });
      };
      proj.setSlowed = (factor) => {
        proj.body.setVelocity(proj.body.velocity.x * factor, proj.body.velocity.y * factor);
      };

      this.physics.add.overlap(proj, player, () => {
        player.onHit(proj.damage, proj);
        this._impactBurst(proj.x, proj.y, 0xff6b18, 9);
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
      const warn = this.add.circle(pursuer.x, pursuer.y, 200, 0xff263e, 0.08)
        .setStrokeStyle(3, 0xff263e, 0.65)
        .setDepth(2);
      this.tweens.add({ targets: warn, scale: 1.12, alpha: 0.35, duration: 760, yoyo: true });
      this.time.delayedCall(800, () => {
        warn.destroy();
        this._skillBurst(pursuer.x, pursuer.y, 0xff263e, 205);
        const dist = Phaser.Math.Distance.Between(pursuer.x, pursuer.y, player.x, player.y);
        if (dist <= 200) player.onHit(20, pursuer);
      });
    } else if (type === 'dash') {
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      pursuer.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
      this._dashTrail(pursuer, 0xff263e);
      this.time.delayedCall(400, () => pursuer.setVelocity(0, 0));
    } else if (type === 'rush') {
      this._showAlert('THE HUNTER SURGES');
      this.cameras.main.shake(260, 0.004);
    }
  }

  _showAlert(text) {
    const alert = this.add.text(this.worldWidth / 2, 260, text, {
      fontSize: '30px',
      color: '#ff273d',
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

  _spawnHealthDrop(x, y) {
    const drop = this.healthDrops.create(x, y - 14, 'life_orb')
      .setDepth(5)
      .setScale(1.35);
    drop.body.allowGravity = false;
    drop.healAmount = this.stat.HEAL_DROP_RESTORE;
    this.tweens.add({ targets: drop, y: y - 34, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.time.delayedCall(8500, () => {
      if (drop.active) drop.destroy();
    });
  }

  _collectHealthDrop(player, drop) {
    if (!player.visible) return;
    if (!drop || !drop.active) return;
    this.stat.restoreHp(drop.healAmount);
    SharkCombat.eatFish(this.stat);
    this._impactBurst(drop.x, drop.y, 0xff4f9a, 10);
    this._skillBurst(drop.x, drop.y, 0xff4f9a, 44);
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
    const arc = this.add.ellipse(char.x + facing * offset, char.y, width, height)
      .setStrokeStyle(4 + comboStep, color, 0.85)
      .setDepth(5);
    if (comboStep === 1) {
      arc.setAngle(facing * -12);
    } else if (comboStep >= 2) {
      arc.setStrokeStyle(7, 0xffffff, 0.75);
      this._impactBurst(char.x + facing * 58, char.y, color, 9);
      this.cameras.main.shake(80, 0.002);
    }
    this.tweens.add({
      targets: arc,
      alpha: 0,
      scaleX: 1.3 + comboStep * 0.12,
      scaleY: 1.16 + comboStep * 0.08,
      duration: 135 + comboStep * 35,
      onComplete: () => arc.destroy(),
    });
  }

  _skillBurst(x, y, color, radius) {
    const ring = this.add.circle(x, y, radius, color, 0.08).setStrokeStyle(3, color, 0.8).setDepth(5);
    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 1.25,
      duration: 360,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
    this._impactBurst(x, y, color, 14);
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
      const comboStep = current.attack(this.mapGen.getAllEnemies()) || 0;
      this._slashArc(current, current instanceof ElectricCharacter ? 0x64e7ff : 0xff8a2a, comboStep);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) {
      const staminaBefore = this.stat.stamina;
      current.skill(this.mapGen.getAllEnemies());
      if (this.stat.stamina < staminaBefore) {
        this._skillBurst(current.x, current.y, current instanceof ElectricCharacter ? 0x64e7ff : 0xff8a2a, 120);
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

    this.mapGen.update(current, (x, y) => {
      const e = new Enemy(this, x, y);
      this.physics.add.collider(e, this.mapGen.getPlatformGroup());
      return e;
    });

    this.pursuer.update(delta, current);
    this.mapGen.getAllEnemies().forEach(e => e.update(delta, current));
    this.hud.update();
  }
}
