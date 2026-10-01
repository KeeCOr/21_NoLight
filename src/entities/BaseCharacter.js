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

    // ?⑤쭅
    this.PARRY_WINDOW = 100; // ms
    this.isGuarding = false;
    this.isParrying = false;

    // 臾댁쟻
    this.isInvincible = false;
    this.invincibleDuration = 0;
    this.invincibleTimer = 0;
    this.PLAY_AREA_MARGIN = 120;
    this.dropThroughTimer = 0;

    this.setDisplaySize(58, 74);
    this.setTint(0x2a2823);
  }

  // 媛???쒖옉
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

  // ?쇨꺽 泥섎━. ?⑤쭅/媛??臾댁쟻?대㈃ false 諛섑솚
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

  // ?⑤쭅 ?깃났: ?ъ궗泥?諛섏궗, ?쇰컲 怨듦꺽 罹붿뒳
  onParry(attacker) {
    if (attacker && attacker.reflect) attacker.reflect(this);
    if (attacker && attacker.cancelAttack) attacker.cancelAttack();
  }

  // 媛???쇨꺽 湲곕낯 泥섎━ (?쒕툕?대옒?ㅼ뿉???ㅻ쾭?쇱씠??
  onGuardHit(damage, attacker) {
    this.stat.takeDamage(damage * 0.5);
  }

  setInvincible(duration) {
    this.isInvincible = true;
    this.invincibleDuration = duration;
    this.invincibleTimer = 0;
    this.setAlpha(0.5);
  }

  // ?쒕툕?대옒?ㅼ뿉??援ы쁽
  attack(enemies) {}
  skill(enemies) {}
  guard(currentTime) { this.startGuard(currentTime); }
  onSwapIn() {}

  update(delta, cursors, keys) {
    this.dropThroughTimer = Math.max(0, this.dropThroughTimer - delta);

    // 臾댁쟻 ??대㉧
    if (this.isInvincible) {
      this.invincibleTimer += delta;
      if (this.invincibleTimer >= this.invincibleDuration) {
        this.isInvincible = false;
        this.setAlpha(1);
        this.setTint(0x2a2823);
      }
    }

    // ?대룞
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

    // ?먰봽
    if (cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(-430);
    }

    if (cursors.down.isDown && this.body.blocked.down) {
      this.dropThroughTimer = 260;
      this.setVelocityY(90);
    }

    // 醫뚯슦 寃쎄퀎 ?쒗븳
    const worldWidth = this.scene.scale?.width || this.scene.cameras.main.width;
    const minX = this.PLAY_AREA_MARGIN;
    const maxX = worldWidth - this.PLAY_AREA_MARGIN;
    const bounds = getPlayAreaBounds({
      width: worldWidth,
      margin: minX,
    });
    if (this.x < bounds.minX) {
      this.x = bounds.minX;
      this.setVelocityX(0);
    } else if (this.x > bounds.maxX) {
      this.x = bounds.maxX;
      this.setVelocityX(0);
    }
  }
}
