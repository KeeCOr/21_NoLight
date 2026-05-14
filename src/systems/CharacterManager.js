class CharacterManager {
  constructor(characters) {
    if (!characters || characters.length === 0) {
      throw new Error('CharacterManager: 캐릭터 배열이 비어있음');
    }
    this.characters = characters;
    this.activeIndex = 0;
  }

  getActive() {
    return this.characters[this.activeIndex];
  }

  getInactive() {
    return this.characters.filter((_, i) => i !== this.activeIndex);
  }

  swap() {
    this.activeIndex = (this.activeIndex + 1) % this.characters.length;
    this.getActive().onSwapIn();
    return this.getActive();
  }
}

if (typeof module !== 'undefined') module.exports = CharacterManager;
