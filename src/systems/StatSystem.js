class StatSystem {
  constructor() {
    this.maxHp = 100;
    this.hp = 100;
    this.maxStamina = 100;
    this.stamina = 100;
    this.score = 0;
    this.kills = 0;
    this.survivalTime = 0;
    this.sharkPower = 24;
    this.fishEaten = 0;

    this.DECAY_RATE = 2;
    this.DECAY_GROWTH_PER_MINUTE = 0.85;
    this.LOW_HP_THRESHOLD = 30;
    this.KILL_DECAY_GRACE = 3;
    this.STAMINA_REGEN_BASE = 10;
    this.STAMINA_REGEN_LOW_HP = 20;
    this.STAMINA_GUARD_DRAIN = 15;
    this.STAMINA_SKILL_COST = 30;
    this.STAMINA_MECHA_HIT_GAIN = 20;

    this.HEAL_DROP_RESTORE = 18;
    this.lastKillTime = -999;
  }

  isLowHp() {
    return this.hp <= this.LOW_HP_THRESHOLD;
  }

  getAttackMultiplier() {
    return this.isLowHp() ? 1.5 : 1.0;
  }

  getDecayRate() {
    return this.DECAY_RATE + (this.survivalTime / 60) * this.DECAY_GROWTH_PER_MINUTE;
  }

  update(delta, isGuarding) {
    const dt = delta / 1000;
    this.survivalTime += dt;

    const timeSinceKill = this.survivalTime - this.lastKillTime;
    if (timeSinceKill > this.KILL_DECAY_GRACE) {
      this.hp = Math.max(0, this.hp - this.getDecayRate() * dt);
    }

    if (isGuarding) {
      this.stamina = Math.max(0, this.stamina - this.STAMINA_GUARD_DRAIN * dt);
    } else {
      const regen = this.isLowHp() ? this.STAMINA_REGEN_LOW_HP : this.STAMINA_REGEN_BASE;
      this.stamina = Math.min(this.maxStamina, this.stamina + regen * dt);
    }

    this.score = Math.floor(this.survivalTime * 10) + this.kills * 50;
  }

  onKill() {
    this.kills++;
    this.lastKillTime = this.survivalTime;
  }

  restoreHp(amount = this.HEAL_DROP_RESTORE) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
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
