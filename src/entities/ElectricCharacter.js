class ElectricCharacter extends BaseCharacter {
  constructor(scene, x, y, stat) {
    super(scene, x, y, 'electric_char', stat);
    this.ATTACK_RANGE = 200;
    this.ATTACK_DAMAGE = 20;
    this.SKILL_DAMAGE = 50;
    this.SKILL_RANGE = 300;
    this.SHIELD_RADIUS = 250;
    this.SLOW_FACTOR = 0.3;
    this.shieldGraphic = null;
  }

  // 전방 범위 전기 방출
  attack(enemies) {
    if (!enemies) return;
    const multiplier = this.stat.getAttackMultiplier();
    const facing = this.flipX ? -1 : 1;
    enemies.forEach(enemy => {
      const dx = enemy.x - this.x;
      if (Math.sign(dx) === facing && Math.abs(dx) <= this.ATTACK_RANGE) {
        enemy.onHit(this.ATTACK_DAMAGE * multiplier, this);
        enemy.applyStun(500);
      }
    });
  }

  // 광역 전기 폭발 (스태미나 소모)
  skill(enemies) {
    if (!this.stat.useStamina(this.stat.STAMINA_SKILL_COST)) return;
    if (!enemies) return;
    const multiplier = this.stat.getAttackMultiplier();
    enemies.forEach(enemy => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= this.SKILL_RANGE) {
        enemy.onHit(this.SKILL_DAMAGE * multiplier, this);
        enemy.applyStun(1000);
      }
    });
  }

  // 가드: 역장 전개 → 투사체 슬로우
  startGuard(currentTime) {
    super.startGuard(currentTime);
    if (!this.shieldGraphic) {
      this.shieldGraphic = this.scene.add.circle(this.x, this.y, this.SHIELD_RADIUS, 0x64e7ff, 0.08)
        .setStrokeStyle(2, 0x7ff9ff, 0.7)
        .setDepth(2);
    }
  }

  stopGuard() {
    super.stopGuard();
    if (this.shieldGraphic) {
      this.shieldGraphic.destroy();
      this.shieldGraphic = null;
    }
  }

  // 역장 내 투사체 슬로우 - GameScene에서 투사체 배열 전달하여 호출
  applyShieldSlow(projectiles) {
    if (!this.isGuarding || !projectiles) return;
    projectiles.forEach(p => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
      if (dist <= this.SHIELD_RADIUS && p.setSlowed) {
        p.setSlowed(this.SLOW_FACTOR);
      }
    });
  }

  // 교체 진입: 주변 적 즉시 감전 (이벤트로 GameScene에 위임)
  onSwapIn() {
    this.scene.events.emit('electricSwapIn', this);
  }

  // 가드 피격: super와 동일 (50% 대미지)
  onGuardHit(damage, attacker) {
    super.onGuardHit(damage, attacker);
  }

  update(delta, cursors, keys) {
    super.update(delta, cursors, keys);
    if (this.shieldGraphic) {
      this.shieldGraphic.setPosition(this.x, this.y);
    }
  }
}
