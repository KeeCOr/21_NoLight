const fs = require('fs');
const path = require('path');

describe('MechaArmCharacter combo movement', () => {
  test('basic attacks lunge forward with increasing combo distances', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'entities', 'MechaArmCharacter.js'), 'utf8');

    expect(source).toContain('this.COMBO_LUNGE_DISTANCES = [34, 52, 76]');
    expect(source).toContain('_comboLunge(currentStep)');
    expect(source).toContain('this.scene.tweens.add({');
  });
});
