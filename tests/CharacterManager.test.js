const CharacterManager = require('../src/systems/CharacterManager.js');

function makeMock(id) {
  return { id, swapCount: 0, onSwapIn() { this.swapCount++; } };
}

describe('CharacterManager', () => {
  let cm;
  beforeEach(() => {
    cm = new CharacterManager([makeMock('A'), makeMock('B')]);
  });

  test('초기 활성 캐릭터는 인덱스 0', () => {
    expect(cm.getActive().id).toBe('A');
  });

  test('swap: 다음 캐릭터로 교체', () => {
    cm.swap();
    expect(cm.getActive().id).toBe('B');
  });

  test('swap: 마지막에서 첫 번째로 순환', () => {
    cm.swap();
    cm.swap();
    expect(cm.getActive().id).toBe('A');
  });

  test('swap: onSwapIn 호출됨', () => {
    cm.swap();
    expect(cm.getActive().swapCount).toBe(1);
  });

  test('swap: 이전 캐릭터의 onSwapIn은 호출 안됨', () => {
    cm.swap();
    expect(cm.characters[0].swapCount).toBe(0);
  });

  test('getInactive: 활성 외 캐릭터 반환', () => {
    const inactive = cm.getInactive();
    expect(inactive.length).toBe(1);
    expect(inactive[0].id).toBe('B');
  });

  test('3개 캐릭터 순환', () => {
    const cm3 = new CharacterManager([makeMock('A'), makeMock('B'), makeMock('C')]);
    cm3.swap();
    expect(cm3.getActive().id).toBe('B');
    cm3.swap();
    expect(cm3.getActive().id).toBe('C');
    cm3.swap();
    expect(cm3.getActive().id).toBe('A');
  });

  test('빈 배열로 생성 시 오류', () => {
    expect(() => new CharacterManager([])).toThrow();
  });
});
