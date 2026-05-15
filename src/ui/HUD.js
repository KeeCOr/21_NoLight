class HUD {
  constructor(scene, stat, characterManager) {
    this.scene = scene;
    this.stat = stat;
    this.cm = characterManager;

    this.panel = scene.add.rectangle(18, 16, 286, 76, 0x050912, 0.72)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x26465a, 0.9)
      .setScrollFactor(0)
      .setDepth(20);

    scene.add.text(28, 22, 'VITAL', {
      fontSize: '11px',
      color: '#8fdfff',
      fontFamily: 'Arial',
      letterSpacing: 1,
    }).setScrollFactor(0).setDepth(21);

    this.hpBack = scene.add.rectangle(28, 40, 210, 16, 0x1b1117).setOrigin(0, 0).setScrollFactor(0).setDepth(21);
    this.hpBar = scene.add.rectangle(28, 40, 210, 16, 0xff345f).setOrigin(0, 0).setScrollFactor(0).setDepth(22);
    this.hpGlow = scene.add.rectangle(28, 40, 210, 3, 0xffb6c7, 0.7).setOrigin(0, 0).setScrollFactor(0).setDepth(23);

    scene.add.text(246, 38, 'HP', { fontSize: '13px', color: '#ffffff', fontFamily: 'Arial' })
      .setScrollFactor(0)
      .setDepth(22);

    this.stBack = scene.add.rectangle(28, 64, 210, 10, 0x101620).setOrigin(0, 0).setScrollFactor(0).setDepth(21);
    this.stBar = scene.add.rectangle(28, 64, 210, 10, 0x49d9ff).setOrigin(0, 0).setScrollFactor(0).setDepth(22);
    scene.add.text(246, 59, 'ST', { fontSize: '12px', color: '#a9ecff', fontFamily: 'Arial' })
      .setScrollFactor(0)
      .setDepth(22);

    this.scorePanel = scene.add.rectangle(640, 18, 260, 46, 0x050912, 0.68)
      .setStrokeStyle(1, 0x26465a, 0.9)
      .setScrollFactor(0)
      .setDepth(20);
    this.scoreText = scene.add.text(640, 28, '00:00   SCORE 0', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(21);

    this.helpText = scene.add.text(640, 684, '← → MOVE   ↑ JUMP   Z ATTACK   X SKILL   C GUARD   TAB SWAP', {
      fontSize: '14px',
      color: '#a9b8c7',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(20);

    this.charIcons = [];
    this._buildCharIcons();
    this._lastActiveIndex = -1;
  }

  _buildCharIcons() {
    this.charIcons.forEach(icon => icon.destroy());
    this.charIcons = [];
    const keys = ['portrait_electric', 'portrait_mecha'];

    this.cm.characters.forEach((_, i) => {
      const isActive = i === this.cm.activeIndex;
      const x = 1185 + i * 62;
      const frame = this.scene.add.rectangle(x, 54, 58, 58, isActive ? 0x102a36 : 0x070910, 0.92)
        .setStrokeStyle(2, isActive ? 0x7ff9ff : 0x4b5867, isActive ? 1 : 0.75)
        .setScrollFactor(0)
        .setDepth(20);
      const portrait = this.scene.add.image(x, 54, keys[i] || keys[0])
        .setScrollFactor(0)
        .setDepth(21)
        .setAlpha(isActive ? 1 : 0.45);
      this.charIcons.push(frame, portrait);
    });
    this._lastActiveIndex = this.cm.activeIndex;
  }

  update() {
    const hpRatio = Math.max(0, this.stat.hp / this.stat.maxHp);
    this.hpBar.setDisplaySize(210 * hpRatio, 16);
    this.hpGlow.setDisplaySize(210 * hpRatio, 3);
    this.hpBar.setFillStyle(hpRatio <= 0.3 ? 0xff8a2a : 0xff345f);

    const stRatio = Math.max(0, this.stat.stamina / this.stat.maxStamina);
    this.stBar.setDisplaySize(210 * stRatio, 10);

    const totalSec = Math.floor(this.stat.survivalTime);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    this.scoreText.setText(`${min}:${sec}   SCORE ${this.stat.score}`);

    if (this.cm.activeIndex !== this._lastActiveIndex) {
      this._buildCharIcons();
    }
  }
}
