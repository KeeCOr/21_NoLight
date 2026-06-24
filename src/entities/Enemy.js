class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = 120;
    this.hp = 120;
    this.sharkPower = 18 + (Math.abs(Math.floor(x / 120)) % 4) * 3;
    this.speed = 96;
    this.ATTACK_DAMAGE = this.sharkPower;
    this.attackRange = 60;
    this.attackCooldown = 1500;
    this.attackTimer = 0;
    this.stunTimer = 0;
    this.isStunned = false;

    this.setCollideWorldBounds(false);
    this.setDepth(3);
    this.setDisplaySize(52, 52);
    this.setTint(0x1d1b18);
    this.body.setSize(28, 34);
    this.body.setOffset(9, 12);
    this.statLabel = scene.add.text(x, y - 42, '', {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(6);
  }

  onHit(damage, attacker) {
    this.hp -= damage;
    this.lastHitFacing = attacker?.flipX ? -1 : 1;
    this.lastHitComboStep = attacker?.comboStep || 1;
    this.scene.events.emit('enemyHit', this, { damage, comboStep: this.lastHitComboStep, facing: this.lastHitFacing });
    this.setTint(0xf4efe3);
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.setTint(0x1d1b18);
    });
    if (this.hp <= 0) this.onDeath();
  }

  applyStun(duration) {
    this.isStunned = true;
    this.stunTimer = duration;
  }

  cancelAttack() {
    this.attackTimer = 0;
  }

  onDeath() {
    if (this.statLabel) this.statLabel.destroy();
    this.scene.events.emit('enemyKilled', this, { facing: this.lastHitFacing || 1, comboStep: this.lastHitComboStep || 1 });
    this.destroy();
  }

  destroy(fromScene) {
    if (this.statLabel && this.statLabel.active) this.statLabel.destroy();
    super.destroy(fromScene);
  }

  update(delta, player) {
    if (!player || !this.active) return;

    if (this.isStunned) {
      this.stunTimer -= delta;
      if (this.stunTimer <= 0) this.isStunned = false;
      this.setVelocityX(0);
      return;
    }

    const dx = player.x - this.x;
    this.setVelocityX(Math.sign(dx) * this.speed);
    this.setFlipX(dx < 0);

    this.attackTimer += delta;
    if (this.attackTimer >= this.attackCooldown) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (dist <= this.attackRange) {
        this.attackTimer = 0;
        SharkCombat.resolveFrontContest(this, player);
      }
    }

    if (this.statLabel && this.statLabel.active) {
      this.statLabel.setPosition(this.x, this.y - 42);
      this.statLabel.setText(`${this.sharkPower}/${Math.ceil(this.hp)}`);
    }
  }
}
