const SharkCombat = {
  BASE_PLAYER_POWER: 24,
  FISH_POWER_GAIN: 3,
  AMBUSH_MULTIPLIER: 1.5,

  getPower(actor) {
    if (!actor) return 0;
    if (typeof actor.sharkPower === 'number') return actor.sharkPower;
    if (actor.stat && typeof actor.stat.sharkPower === 'number') return actor.stat.sharkPower;
    return this.BASE_PLAYER_POWER;
  },

  isBehind(attacker, defender) {
    if (!attacker || !defender || attacker.x === defender.x) return false;
    const defenderFacing = defender.flipX ? -1 : 1;
    const attackerSide = attacker.x < defender.x ? -1 : 1;
    return attackerSide === -defenderFacing;
  },

  applyDamage(target, damage, source) {
    if (!target || damage <= 0) return false;
    if (typeof target.onHit === 'function') return target.onHit(damage, source) !== false;
    if (target.stat && typeof target.stat.takeDamage === 'function') {
      target.stat.takeDamage(damage);
      return true;
    }
    if (typeof target.hp === 'number') {
      target.hp = Math.max(0, target.hp - damage);
      return true;
    }
    return false;
  },

  resolveFrontContest(a, b, options = {}) {
    const powerA = this.getPower(a);
    const powerB = this.getPower(b);
    const winner = powerA >= powerB ? a : b;
    const loser = winner === a ? b : a;
    const damage = Math.abs(powerA - powerB);
    const result = { type: 'front', winner, loser, damage, powerA, powerB };

    if (options.apply !== false && damage > 0) {
      this.applyDamage(loser, damage, winner);
    }
    return result;
  },

  resolveAttack(attacker, defender, options = {}) {
    const isBehind = this.isBehind(attacker, defender);
    if (!isBehind) return this.resolveFrontContest(attacker, defender, options);

    const power = this.getPower(attacker);
    const damage = Math.round(power * this.AMBUSH_MULTIPLIER);
    const result = {
      type: 'ambush',
      isBehind,
      winner: attacker,
      loser: defender,
      damage,
      powerA: power,
      powerB: this.getPower(defender),
    };

    if (options.apply !== false) this.applyDamage(defender, damage, attacker);
    return result;
  },

  eatFish(shark, fishValue = 1) {
    if (!shark) return 0;
    shark.fishEaten = (shark.fishEaten || 0) + fishValue;
    shark.sharkPower = this.getPower(shark) + fishValue * this.FISH_POWER_GAIN;
    return shark.sharkPower;
  },
};

if (typeof window !== 'undefined') window.SharkCombat = SharkCombat;
if (typeof module !== 'undefined') module.exports = SharkCombat;
