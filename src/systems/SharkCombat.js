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

  getHp(actor) {
    if (!actor) return 0;
    if (actor.stat && typeof actor.stat.hp === 'number') return actor.stat.hp;
    if (typeof actor.hp === 'number') return actor.hp;
    return 0;
  },

  runSmokeEncounter(player, enemy, options = {}) {
    const openingDamage = Math.max(0, Math.round(options.openingDamage || this.getPower(player)));
    const retaliationDamage = Math.max(0, Math.round(options.retaliationDamage || this.getPower(enemy)));
    const finisherDamage = Math.max(0, Math.round(options.finisherDamage || openingDamage));
    const steps = [{ phase: 'enter', attacker: player, defender: enemy, damage: 0, defenderHp: this.getHp(enemy), ended: false }];

    this.applyDamage(enemy, openingDamage, player);
    steps.push({ phase: 'player-hit', attacker: player, defender: enemy, damage: openingDamage, defenderHp: this.getHp(enemy), ended: this.getHp(enemy) <= 0 });

    this.applyDamage(player, retaliationDamage, enemy);
    steps.push({ phase: 'enemy-hit', attacker: enemy, defender: player, damage: retaliationDamage, defenderHp: this.getHp(player), ended: this.getHp(enemy) <= 0 || this.getHp(player) <= 0 });

    this.applyDamage(enemy, finisherDamage, player);
    steps.push({ phase: 'encounter-end', attacker: player, defender: enemy, damage: finisherDamage, defenderHp: this.getHp(enemy), ended: true });

    return steps;
  },
};

if (typeof window !== 'undefined') window.SharkCombat = SharkCombat;
if (typeof module !== 'undefined') module.exports = SharkCombat;
