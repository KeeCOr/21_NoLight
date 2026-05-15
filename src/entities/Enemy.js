class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = 50;
    this.hp = 50;
    this.speed = 80;
    this.ATTACK_DAMAGE = 10;
    this.attackRange = 60;
    this.attackCooldown = 1500;
    this.attackTimer = 0;
    this.stunTimer = 0;
    this.isStunned = false;

    this.setCollideWorldBounds(false);
    this.setDepth(3);
    this.body.setSize(28, 34);
    this.body.setOffset(9, 12);
  }

  onHit(damage, attacker) {
    this.hp -= damage;
    this.scene.events.emit('enemyHit', this);
    this.setTint(0xffd1e6);
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
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
    this.scene.events.emit('enemyKilled', this);
    this.destroy();
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
        player.onHit(this.ATTACK_DAMAGE, this);
      }
    }
  }
}
