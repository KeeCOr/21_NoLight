const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('basic attack stamina cost', () => {
  test('stat system defines a basic attack stamina cost', () => {
    const source = read('src/systems/StatSystem.js');
    expect(source).toContain('this.STAMINA_ATTACK_COST = 8');
  });

  test('both playable characters spend stamina before basic attacks resolve', () => {
    const electric = read('src/entities/ElectricCharacter.js');
    const mecha = read('src/entities/MechaArmCharacter.js');

    expect(electric).toContain('this.stat.useStamina(this.stat.STAMINA_ATTACK_COST)');
    expect(mecha).toContain('this.stat.useStamina(this.stat.STAMINA_ATTACK_COST)');
  });
});
