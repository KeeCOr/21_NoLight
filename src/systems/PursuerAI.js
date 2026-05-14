const PURSUER_STATE = {
  CHASING: 'CHASING',
  STUNNED: 'STUNNED',
};

class PursuerAI {
  constructor() {
    this.state = PURSUER_STATE.CHASING;
    this.stunTimer = 0;
    this.STUN_DURATION = 4000;

    // 저지 메커니즘
    this.damageAccumulated = 0;
    this.stunThreshold = 200;
    this.THRESHOLD_INCREASE = 50;

    // 공격 패턴 순환
    this.attackTimer = 0;
    this.attackQueue = [
      { type: 'projectile', interval: 3000 },
      { type: 'shockwave',  interval: 6000 },
      { type: 'dash',       interval: 8000 },
    ];
    this.attackIndex = 0;

    // 난이도
    this.survivalTime = 0;
    this.speedMultiplier = 1.0;
  }

  onDamage(amount) {
    if (this.state === PURSUER_STATE.STUNNED) return;
    this.damageAccumulated += amount;
    if (this.damageAccumulated >= this.stunThreshold) {
      this.damageAccumulated = 0;
      this.stunThreshold += this.THRESHOLD_INCREASE;
      this.state = PURSUER_STATE.STUNNED;
      this.stunTimer = this.STUN_DURATION;
    }
  }

  getSpeed(baseSpeed) {
    return baseSpeed * this.speedMultiplier;
  }

  isStunned() {
    return this.state === PURSUER_STATE.STUNNED;
  }

  // returns attack type string or null
  update(delta) {
    this.survivalTime += delta;
    // 30초마다 속도 5% 증가
    this.speedMultiplier = 1.0 + Math.floor(this.survivalTime / 30000) * 0.05;

    if (this.state === PURSUER_STATE.STUNNED) {
      this.stunTimer -= delta;
      if (this.stunTimer <= 0) this.state = PURSUER_STATE.CHASING;
      return null;
    }

    const current = this.attackQueue[this.attackIndex];
    this.attackTimer += delta;
    if (this.attackTimer >= current.interval) {
      this.attackTimer = 0;
      const type = current.type;
      this.attackIndex = (this.attackIndex + 1) % this.attackQueue.length;
      return type;
    }

    return null;
  }
}

if (typeof module !== 'undefined') module.exports = { PursuerAI, PURSUER_STATE };
