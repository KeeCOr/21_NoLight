class HUD {
  constructor(scene, stat, characterManager) {
    this.scene = scene;
    this.stat = stat;
    this.cm = characterManager;
    const width = scene.scale?.width || scene.cameras.main.width;
    const height = scene.scale?.height || scene.cameras.main.height;

    this.panel = scene.add.rectangle(18, 16, 340, 76, 0x090805, 0.52)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xb88a3a, 0.92)
      .setScrollFactor(0)
      .setDepth(20);
    this.hpFrame = scene.add.image(8, 8, 'ui_hp_frame')
      .setOrigin(0, 0)
      .setDisplaySize(390, 62)
      .setScrollFactor(0)
      .setDepth(21)
      .setAlpha(0.94);
    this.staminaFrame = scene.add.image(22, 47, 'ui_stamina_frame')
      .setOrigin(0, 0)
      .setDisplaySize(320, 44)
      .setScrollFactor(0)
      .setDepth(21)
      .setAlpha(0.88);
    this.panelCorner = scene.add.image(22, 20, 'ui_gold_corner').setOrigin(0, 0).setScrollFactor(0).setDepth(21).setScale(0.72);
    this.panelCornerMirror = scene.add.image(354, 20, 'ui_gold_corner').setOrigin(1, 0).setScrollFactor(0).setDepth(21).setScale(0.72).setFlipX(true);

    scene.add.text(28, 22, 'VITAL', {
      fontSize: '11px',
      color: '#e8c275',
      fontFamily: 'Arial',
      letterSpacing: 1,
    }).setScrollFactor(0).setDepth(21);

    this.hpBack = scene.add.rectangle(90, 34, 210, 16, 0x1b1117).setOrigin(0, 0).setScrollFactor(0).setDepth(21)
      .setStrokeStyle(1, 0x5d421d, 0.9);
    this.hpBar = scene.add.rectangle(90, 34, 210, 16, 0xff345f).setOrigin(0, 0).setScrollFactor(0).setDepth(22);
    this.hpGlow = scene.add.rectangle(90, 34, 210, 3, 0xffb6c7, 0.7).setOrigin(0, 0).setScrollFactor(0).setDepth(23);

    scene.add.text(308, 32, 'HP', { fontSize: '13px', color: '#ffffff', fontFamily: 'Arial' })
      .setScrollFactor(0)
      .setDepth(22);

    this.stBack = scene.add.rectangle(90, 63, 190, 10, 0x101620).setOrigin(0, 0).setScrollFactor(0).setDepth(21)
      .setStrokeStyle(1, 0x5d421d, 0.78);
    this.stBar = scene.add.rectangle(90, 63, 190, 10, 0x75a947).setOrigin(0, 0).setScrollFactor(0).setDepth(22);
    scene.add.text(292, 58, 'ST', { fontSize: '12px', color: '#d8b667', fontFamily: 'Arial' })
      .setScrollFactor(0)
      .setDepth(22);
    this.powerText = scene.add.text(286, 38, 'PWR 24', {
      fontSize: '16px',
      color: '#ffcf63',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 3,
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(22);

    this.scorePanel = scene.add.rectangle(width / 2, 18, 190, 46, 0x090805, 0.46)
      .setStrokeStyle(2, 0xb88a3a, 0.9)
      .setScrollFactor(0)
      .setDepth(20);
    this.scoreFrame = scene.add.image(width / 2, 45, 'ui_score_frame')
      .setDisplaySize(220, 70)
      .setScrollFactor(0)
      .setDepth(20)
      .setAlpha(0.86);
    this.scoreCornerLeft = scene.add.image(width / 2 - 96, 21, 'ui_gold_corner').setOrigin(0, 0).setScrollFactor(0).setDepth(21).setScale(0.55);
    this.scoreCornerRight = scene.add.image(width / 2 + 96, 21, 'ui_gold_corner').setOrigin(1, 0).setScrollFactor(0).setDepth(21).setScale(0.55).setFlipX(true);
    this.scoreText = scene.add.text(width / 2, 28, 'SCORE 0', {
      fontSize: '20px',
      color: '#f2d48a',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(21);

    this.comboText = scene.add.text(width / 2, 92, '', {
      fontSize: '24px',
      color: '#ffcf63',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 5,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(22).setAlpha(0);

    scene.events.on('comboChanged', ({ step, max }) => this.showCombo(step, max));

    this.helpText = scene.add.text(width / 2, height - 42, TutorialCopy.controls, {
      fontSize: '14px',
      color: '#a9b8c7',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(20);

    this._buildTutorialPanel();
    this.charIcons = [];
    this._buildCharIcons();
    this._buildCommandButtons();
    this._lastActiveIndex = -1;
  }

  _buildTutorialPanel() {
    const scene = this.scene;
    const width = scene.scale?.width || scene.cameras.main.width;
    const inkShadow = scene.add.rectangle(width / 2, 188, 650, 148, 0x05070b, 0.22)
      .setScrollFactor(0)
      .setDepth(23);
    const panel = scene.add.rectangle(width / 2, 174, 620, 144, 0xf2efe3, 0.88)
      .setStrokeStyle(2, 0x101820, 0.88)
      .setScrollFactor(0)
      .setDepth(24);
    const title = scene.add.text(width / 2, 120, TutorialCopy.title, {
      fontSize: '18px',
      color: '#05070b',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(25);
    const goal = scene.add.text(width / 2, 158, '', {
      fontSize: '18px',
      color: '#101820',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 560 },
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(25);

    this.tutorialNodes = [inkShadow, panel, title, goal];
    this.tutorialTitle = title;
    this.tutorialBody = goal;
    this.tutorialStep = -1;
    this._advanceTutorial();
  }

  _advanceTutorial() {
    this.tutorialStep++;
    const step = TutorialCopy.steps[this.tutorialStep];
    if (!step) {
      this.scene.tweens.add({
        targets: this.tutorialNodes.filter(node => node.active),
        alpha: 0,
        duration: 520,
        onComplete: () => this.tutorialNodes.forEach(node => node.destroy()),
      });
      return;
    }

    this.tutorialTitle.setText(step.title);
    this.tutorialBody.setText(step.body);
    this.scene.time.delayedCall(3100, () => this._advanceTutorial());
  }

  showCombo(step, max) {
    this.comboText.setText(`COMBO ${step}/${max}`);
    this.comboText.setAlpha(1);
    this.scene.tweens.killTweensOf(this.comboText);
    this.scene.tweens.add({
      targets: this.comboText,
      y: 82,
      scale: 1.12,
      duration: 70,
      yoyo: true,
      onComplete: () => {
        this.comboText.setY(92).setScale(1);
        this.scene.tweens.add({ targets: this.comboText, alpha: 0, duration: 520, delay: 380 });
      },
    });
  }

  _buildCharIcons() {
    this.charIcons.forEach(icon => icon.destroy());
    this.charIcons = [];
    const keys = ['portrait_electric', 'portrait_mecha'];

    this.cm.characters.forEach((_, i) => {
      const isActive = i === this.cm.activeIndex;
      const x = (this.scene.scale?.width || this.scene.cameras.main.width) - 112 + i * 62;
      const generatedFrame = this.scene.add.image(x, 54, 'ui_portrait_frame')
        .setDisplaySize(66, 66)
        .setScrollFactor(0)
        .setDepth(20)
        .setAlpha(isActive ? 0.96 : 0.56);
      const portraitFrame = this.scene.add.rectangle(x, 54, 58, 58, isActive ? 0x17120a : 0x070603, 0.94)
        .setStrokeStyle(2, isActive ? 0xb88a3a : 0x5d421d, isActive ? 1 : 0.75)
        .setScrollFactor(0)
        .setDepth(20);
      const corner = this.scene.add.image(x - 29, 25, 'ui_gold_corner')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(21)
        .setScale(0.45)
        .setAlpha(isActive ? 1 : 0.5);
      const portrait = this.scene.add.image(x, 54, keys[i] || keys[0])
        .setScrollFactor(0)
        .setDepth(21)
        .setAlpha(isActive ? 1 : 0.45);
      this.charIcons.push(generatedFrame, portraitFrame, corner, portrait);
    });
    this._lastActiveIndex = this.cm.activeIndex;
  }

  _buildCommandButtons() {
    const scene = this.scene;
    const width = scene.scale?.width || scene.cameras.main.width;
    const height = scene.scale?.height || scene.cameras.main.height;
    const commands = [
      { label: 'Z', x: width / 2 - 138 },
      { label: 'X', x: width / 2 - 46 },
      { label: 'C', x: width / 2 + 46 },
      { label: 'TAB', x: width / 2 + 138 },
    ];

    commands.forEach(({ label, x }) => {
      scene.add.image(x, height - 104, 'ui_button_frame')
        .setDisplaySize(72, 72)
        .setScrollFactor(0)
        .setDepth(20)
        .setAlpha(0.78);
      scene.add.text(x, height - 117, label, {
        fontSize: label.length > 1 ? '14px' : '20px',
        color: '#f2d48a',
        fontFamily: 'Arial Black',
        stroke: '#05070b',
        strokeThickness: 4,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
    });
  }

  update() {
    const hpRatio = Math.max(0, this.stat.hp / this.stat.maxHp);
    this.hpBar.setDisplaySize(210 * hpRatio, 16);
    this.hpGlow.setDisplaySize(210 * hpRatio, 3);
    this.hpBar.setFillStyle(hpRatio <= 0.3 ? 0xff8a2a : 0xff345f);

    const stRatio = Math.max(0, this.stat.stamina / this.stat.maxStamina);
    this.stBar.setDisplaySize(190 * stRatio, 10);

    this.scoreText.setText(`SCORE ${this.stat.score}`);
    this.powerText.setText(`PWR ${Math.round(this.stat.sharkPower || 0)}`);

    if (this.cm.activeIndex !== this._lastActiveIndex) {
      this._buildCharIcons();
    }
  }
}
