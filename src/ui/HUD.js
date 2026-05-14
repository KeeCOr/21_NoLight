class HUD {
  constructor(scene, stat, characterManager) {
    this.scene = scene;
    this.stat = stat;
    this.cm = characterManager;

    // HP 바 (좌측 상단, 카메라 고정)
    scene.add.rectangle(20, 20, 200, 18, 0x333333).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    this.hpBar  = scene.add.rectangle(20, 20, 200, 18, 0xff4444).setOrigin(0, 0).setScrollFactor(0).setDepth(11);
    scene.add.text(225, 18, 'HP', { fontSize: '14px', color: '#fff' }).setScrollFactor(0).setDepth(11);

    // 스태미나 바 (HP 하단)
    scene.add.rectangle(20, 44, 200, 12, 0x333333).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    this.stBar  = scene.add.rectangle(20, 44, 200, 12, 0x44aaff).setOrigin(0, 0).setScrollFactor(0).setDepth(11);
    scene.add.text(225, 43, 'ST', { fontSize: '12px', color: '#fff' }).setScrollFactor(0).setDepth(11);

    // 생존 시간 + 점수 (상단 중앙)
    this.scoreText = scene.add.text(640, 16, '00:00  0점', {
      fontSize: '20px', color: '#fff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);

    // 캐릭터 아이콘 (우측 하단)
    this.charIcons = [];
    this._buildCharIcons();
    this._lastActiveIndex = -1;
  }

  _buildCharIcons() {
    this.charIcons.forEach(ic => ic.destroy());
    this.charIcons = [];
    this.cm.characters.forEach((_, i) => {
      const isActive = i === this.cm.activeIndex;
      const x = 1260 - (this.cm.characters.length - 1 - i) * 70;
      const icon = this.scene.add.rectangle(x, 690, 50, 50, isActive ? 0xffffff : 0x555555)
        .setScrollFactor(0).setDepth(10);
      this.charIcons.push(icon);
    });
    this._lastActiveIndex = this.cm.activeIndex;
  }

  update() {
    const hpRatio = Math.max(0, this.stat.hp / this.stat.maxHp);
    this.hpBar.setDisplaySize(200 * hpRatio, 18);
    this.hpBar.setFillStyle(hpRatio <= 0.3 ? 0xff8800 : 0xff4444);

    const stRatio = Math.max(0, this.stat.stamina / this.stat.maxStamina);
    this.stBar.setDisplaySize(200 * stRatio, 12);

    const totalSec = Math.floor(this.stat.survivalTime);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    this.scoreText.setText(`${min}:${sec}  ${this.stat.score}점`);

    if (this.cm.activeIndex !== this._lastActiveIndex) {
      this._buildCharIcons();
    }
  }
}
