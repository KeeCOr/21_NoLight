class MechaArmCharacter extends BaseCharacter {
  constructor(scene, x, y, stat) {
    super(scene, x, y, 'mecha_char', stat);
    this.ATTACK_DAMAGE = 15;
    this.COMBO_COUNT = 3;
    this.comboStep = 0;
    this.comboResetTimer = 0;
    this.COMBO_RESET_TIME = 600; // ms

    this.DASH_SPEED = 800;
    this.DASH_DURATION = 200; // ms
    this.isDashing = false;
    this.dashTimer = 0;

    this.speedBoost = 1.0;
  }

  // 빠른 3단 콤보
  attack(enemies) {
    if (!enemies || this.isDashing) return;
    const multiplier = this.stat.getAttackMultiplier();
    const comboMult = [1.0, 1.2, 1.5][this.comboStep] || 1.0;
    const range = 80 + this.comboStep * 20;

    enemies.forEach(enemy => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= range) {
        const result = SharkCombat.resolveAttack(this, enemy, { apply: false });
        const comboDamage = Math.max(result.damage, Math.round(this.ATTACK_DAMAGE * multiplier * comboMult));
        if (result.winner === this) {
          enemy.onHit(comboDamage, this);
        } else {
          this.onHit(result.damage, enemy);
        }
      }
    });

    this.scene.events.emit('comboChanged', { step: this.comboStep + 1, max: this.COMBO_COUNT, source: this });
    this.comboStep = (this.comboStep + 1) % this.COMBO_COUNT;
    this.comboResetTimer = 0;
  }

  // 메카 팔 대시 돌진 (스태미나 소모)
  skill(enemies) {
    if (this.isDashing) return;
    if (!this.stat.useStamina(this.stat.STAMINA_SKILL_COST)) return;
    const facing = this.flipX ? -1 : 1;
    this.isDashing = true;
    this.dashTimer = 0;
    this.setVelocityX(this.DASH_SPEED * facing);
    this.setInvincible(this.DASH_DURATION);
    this.scene.events.emit('mechaDashStart', this);
  }

  // 가드: 풀 대미지 받되 스태미나 충전
  onGuardHit(damage, attacker) {
    this.stat.takeDamage(damage);
    this.stat.addStamina(this.stat.STAMINA_MECHA_HIT_GAIN);
  }

  // 교체 진입: 짧은 무적 + 속도 부스트
  onSwapIn() {
    this.setInvincible(800);
    this.speedBoost = 1.5;
    this.scene.time.delayedCall(1000, () => { this.speedBoost = 1.0; });
  }

  update(delta, cursors, keys) {
    // 콤보 리셋
    this.comboResetTimer += delta;
    if (this.comboResetTimer > this.COMBO_RESET_TIME) {
      this.comboStep = 0;
    }

    // 대시 처리
    if (this.isDashing) {
      this.dashTimer += delta;
      if (this.dashTimer >= this.DASH_DURATION) {
        this.isDashing = false;
        this.setVelocityX(0);
        this.scene.events.emit('mechaDashEnd', this);
      }
      return;
    }

    super.update(delta, cursors, keys);
  }
}
