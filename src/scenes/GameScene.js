class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    // 물리 경계 매우 크게 설정 (무한 스크롤 허용)
    this.physics.world.setBounds(-50000, -50000, 100000, 100000);
    this.cameras.main.setBounds(-50000, -50000, 100000, 100000);

    // 시스템 초기화
    this.stat = new StatSystem();
    this.mapGen = new MapGenerator(this);

    // 캐릭터 생성
    const electric = new ElectricCharacter(this, 640, 300, this.stat);
    const mecha    = new MechaArmCharacter(this, 640, 300, this.stat);
    mecha.setVisible(false);

    this.charManager = new CharacterManager([electric, mecha]);

    // 추격자 (플레이어보다 400px 아래에서 시작)
    this.pursuer = new Pursuer(this, 640, 700);

    // HUD
    this.hud = new HUD(this, this.stat, this.charManager);

    // 입력
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      attack: Phaser.Input.Keyboard.KeyCodes.Z,
      skill:  Phaser.Input.Keyboard.KeyCodes.X,
      guard:  Phaser.Input.Keyboard.KeyCodes.C,
      swap:   Phaser.Input.Keyboard.KeyCodes.TAB,
    });

    // 카메라
    this.cameras.main.startFollow(this.charManager.getActive(), true, 0.1, 0.1);

    // 투사체 추적 배열
    this.projectiles = [];

    // 플랫폼 충돌
    this.physics.add.collider(electric, this.mapGen.getPlatformGroup());
    this.physics.add.collider(mecha,    this.mapGen.getPlatformGroup());

    // 이벤트
    this.events.on('enemyKilled', () => this.stat.onKill());

    this.events.on('electricSwapIn', (char) => {
      this.mapGen.getAllEnemies().forEach(e => {
        const dist = Phaser.Math.Distance.Between(char.x, char.y, e.x, e.y);
        if (dist <= 200) e.applyStun(800);
      });
    });

    this.events.on('pursuerAttack', ({ pursuer, type, player }) => {
      this._handlePursuerAttack(pursuer, type, player);
    });
  }

  _handlePursuerAttack(pursuer, type, player) {
    if (type === 'projectile') {
      const proj = this.add.rectangle(pursuer.x, pursuer.y, 12, 12, 0xff6600);
      this.physics.add.existing(proj);
      proj.body.allowGravity = false;
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      proj.body.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
      proj.damage = 15;

      // 패링/가드용 메서드 부착
      proj.reflect = (reflector) => {
        const ba = Phaser.Math.Angle.Between(proj.x, proj.y, pursuer.x, pursuer.y);
        proj.body.setVelocity(Math.cos(ba) * 350, Math.sin(ba) * 350);
        proj.damage = 30;
        // 반사 후 추격자에 닿으면 대미지
        this.physics.add.overlap(proj, pursuer, () => {
          if (!proj.active) return;
          pursuer.onHit(proj.damage, proj);
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        });
      };
      proj.setSlowed = (factor) => {
        proj.body.setVelocity(proj.body.velocity.x * factor, proj.body.velocity.y * factor);
      };

      // 플레이어 충돌
      this.physics.add.overlap(proj, player, () => {
        player.onHit(proj.damage, proj);
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
      const warn = this.add.circle(pursuer.x, pursuer.y, 200, 0xff0000, 0.2);
      this.time.delayedCall(800, () => {
        warn.destroy();
        const dist = Phaser.Math.Distance.Between(pursuer.x, pursuer.y, player.x, player.y);
        if (dist <= 200) player.onHit(20, pursuer);
      });

    } else if (type === 'dash') {
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      pursuer.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
      this.time.delayedCall(400, () => pursuer.setVelocity(0, 0));
    }
  }

  update(time, delta) {
    if (this.stat.isDead()) {
      this.scene.start('GameOverScene', { score: this.stat.score, time: this.stat.survivalTime });
      return;
    }

    const active = this.charManager.getActive();

    // 캐릭터 교체
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

    // 공격
    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
      current.attack(this.mapGen.getAllEnemies());
    }

    // 스킬
    if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) {
      current.skill(this.mapGen.getAllEnemies());
    }

    // 가드
    if (this.keys.guard.isDown) {
      current.guard(time);
      if (current instanceof ElectricCharacter) {
        current.applyShieldSlow(this.projectiles);
      }
    } else {
      current.stopGuard();
    }

    // StatSystem 업데이트
    this.stat.update(delta, current.isGuarding);

    // 캐릭터 업데이트
    current.update(delta, this.cursors, this.keys);

    // 맵 업데이트
    this.mapGen.update(current, (x, y) => {
      const e = new Enemy(this, x, y);
      this.physics.add.collider(e, this.mapGen.getPlatformGroup());
      return e;
    });

    // 추격자 업데이트
    this.pursuer.update(delta, current);

    // 적 업데이트
    this.mapGen.getAllEnemies().forEach(e => e.update(delta, current));

    // HUD 업데이트
    this.hud.update();
  }
}
