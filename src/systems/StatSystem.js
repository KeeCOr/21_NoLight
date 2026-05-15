class StatSystem {
  constructor() {
    this.maxHp = 100;
    this.hp = 100;
    this.maxStamina = 100;
    this.stamina = 100;
    this.score = 0;
    this.kills = 0;
    this.survivalTime = 0;

    // 밸런스 상수
    this.DECAY_RATE = 2;            // HP/초 감소
    this.LOW_HP_THRESHOLD = 30;     // 이 이하 = 저체력
    this.KILL_DECAY_GRACE = 3;      // 킬 후 HP 감소 유예 (초)
    this.STAMINA_REGEN_BASE = 10;   // 스태미나 초당 회복
    this.STAMINA_REGEN_LOW_HP = 20; // 저체력 시 초당 회복
    this.STAMINA_GUARD_DRAIN = 15;  // 가드 중 초당 소모
    this.STAMINA_SKILL_COST = 30;   // 스킬 발동 소모
    this.STAMINA_MECHA_HIT_GAIN = 20; // 메카 팔 가드 피격 시 획득

    this.KILL_HP_RESTORE = 12;
    this.lastKillTime = -999;
  }

  isLowHp() {
    return this.hp <= this.LOW_HP_THRESHOLD;
  }

  getAttackMultiplier() {
    return this.isLowHp() ? 1.5 : 1.0;
  }

  update(delta, isGuarding) {
    const dt = delta / 1000;
    this.survivalTime += dt;

    // HP 감소 (킬 유예 후)
    const timeSinceKill = this.survivalTime - this.lastKillTime;
    if (timeSinceKill > this.KILL_DECAY_GRACE) {
      this.hp = Math.max(0, this.hp - this.DECAY_RATE * dt);
    }

    // 스태미나
    if (isGuarding) {
      this.stamina = Math.max(0, this.stamina - this.STAMINA_GUARD_DRAIN * dt);
    } else {
      const regen = this.isLowHp() ? this.STAMINA_REGEN_LOW_HP : this.STAMINA_REGEN_BASE;
      this.stamina = Math.min(this.maxStamina, this.stamina + regen * dt);
    }

    // 점수
    this.score = Math.floor(this.survivalTime * 10) + this.kills * 50;
  }

  onKill() {
    this.kills++;
    this.lastKillTime = this.survivalTime;
    this.hp = Math.min(this.maxHp, this.hp + this.KILL_HP_RESTORE);
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  useStamina(amount) {
    if (this.stamina < amount) return false;
    this.stamina -= amount;
    return true;
  }

  addStamina(amount) {
    this.stamina = Math.min(this.maxStamina, this.stamina + amount);
  }

  isDead() {
    return this.hp <= 0;
  }
}

if (typeof module !== 'undefined') module.exports = StatSystem;
