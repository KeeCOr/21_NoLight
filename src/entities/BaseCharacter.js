class BaseCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, stat) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stat = stat;
    this.setCollideWorldBounds(false);
    this.setDepth(3);
    this.body.setSize(28, 52);
    this.body.setOffset((this.width - 28) / 2, this.height - 54);

    // 패링
    this.PARRY_WINDOW = 100; // ms
    this.isGuarding = false;
    this.isParrying = false;

    // 무적
    this.isInvincible = false;
    this.invincibleDuration = 0;
    this.invincibleTimer = 0;
  }

  // 가드 시작
  startGuard(currentTime) {
    if (this.isGuarding) return;
    if (this.stat.stamina <= 0) return;
    this.isGuarding = true;
    this.isParrying = true;
    this.scene.time.delayedCall(this.PARRY_WINDOW, () => {
      this.isParrying = false;
    });
  }

  stopGuard() {
    this.isGuarding = false;
    this.isParrying = false;
  }

  // 피격 처리. 패링/가드/무적이면 false 반환
  onHit(damage, attacker) {
    if (this.isInvincible) return false;

    if (this.isParrying) {
      this.onParry(attacker);
      return false;
    }

    if (this.isGuarding) {
      this.onGuardHit(damage, attacker);
      return false;
    }

    this.stat.takeDamage(damage);
    this.setInvincible(500);
    this.scene.tweens.add({
      targets: this,
      y: this.y - 6,
      duration: 60,
      yoyo: true,
    });
    return true;
  }

  // 패링 성공: 투사체 반사, 일반 공격 캔슬
  onParry(attacker) {
    if (attacker && attacker.reflect) attacker.reflect(this);
    if (attacker && attacker.cancelAttack) attacker.cancelAttack();
  }

  // 가드 피격 기본 처리 (서브클래스에서 오버라이드)
  onGuardHit(damage, attacker) {
    this.stat.takeDamage(damage * 0.5);
  }

  setInvincible(duration) {
    this.isInvincible = true;
    this.invincibleDuration = duration;
    this.invincibleTimer = 0;
    this.setAlpha(0.5);
  }

  // 서브클래스에서 구현
  attack(enemies) {}
  skill(enemies) {}
  guard(currentTime) { this.startGuard(currentTime); }
  onSwapIn() {}

  update(delta, cursors, keys) {
    // 무적 타이머
    if (this.isInvincible) {
      this.invincibleTimer += delta;
      if (this.invincibleTimer >= this.invincibleDuration) {
        this.isInvincible = false;
        this.setAlpha(1);
      }
    }

    // 이동
    const speed = (this.speedBoost || 1.0) * 220;
    if (cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // 점프
    if (cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(-550);
    }

    // 좌우 경계 제한
    if (this.x < this.width / 2) {
      this.x = this.width / 2;
      this.setVelocityX(0);
    } else if (this.x > 1280 - this.width / 2) {
      this.x = 1280 - this.width / 2;
      this.setVelocityX(0);
    }
  }
}
