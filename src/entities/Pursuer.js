class Pursuer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pursuer');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.ai = new PursuerAI();
    this.BASE_SPEED = 120;
    this.CONTACT_DAMAGE = 5;
    this.contactTimer = 0;
    this.CONTACT_INTERVAL = 500;

    this.setImmovable(true);
    this.body.allowGravity = false;
  }

  // 플레이어 공격에 의한 피격
  onHit(damage, attacker) {
    this.ai.onDamage(damage);
    if (this.ai.isStunned()) this.setTint(0x888888);
  }

  // 패링으로 반사된 투사체가 추격자에 닿을 때
  reflect(reflector) {
    this.onHit(30, reflector);
  }

  update(delta, player) {
    if (!player) return;

    const attackAction = this.ai.update(delta);

    if (this.ai.isStunned()) {
      this.setVelocity(0, 0);
      this.setTint(0x888888);
      return;
    }

    this.clearTint();

    // 플레이어 추격
    const speed = this.ai.getSpeed(this.BASE_SPEED);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // 접촉 대미지
    this.contactTimer += delta;
    if (this.contactTimer >= this.CONTACT_INTERVAL) {
      this.contactTimer = 0;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (dist < 60) player.onHit(this.CONTACT_DAMAGE, this);
    }

    // 공격 패턴 이벤트
    if (attackAction) {
      this.scene.events.emit('pursuerAttack', { pursuer: this, type: attackAction, player });
    }
  }
}
