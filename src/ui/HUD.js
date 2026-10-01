class HUD {
  constructor(scene, stat, characterManager) {
    this.scene = scene;
    this.stat = stat;
    this.cm = characterManager;
    this.width = scene.scale?.width || scene.cameras.main.width;
    this.height = scene.scale?.height || scene.cameras.main.height;

    this._buildTopInkHud();
    this._buildBottomInkControls();
    this._buildCombatObjective();
    this._buildTutorialPanel();

    this.comboText = scene.add.text(this.width / 2, 142, '', {
      fontSize: '24px',
      color: '#f4dfb2',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 5,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(32).setAlpha(0);

    scene.events.on('comboChanged', ({ step, max }) => this.showCombo(step, max));
    scene.events.on('enemyHit', () => this._recordObjectiveEvent('hits'));
    scene.events.on('enemyKilled', (enemy, payload = {}) => this._recordObjectiveKill(Boolean(payload.isTrialElite || enemy?.isTrialElite)));
    scene.events.on('mechaDashStart', () => this._recordObjectiveEvent('dodges'));
  }

  _buildCombatObjective() {
    const scene = this.scene;
    this.objectiveStats = { hits: 0, dodges: 0, kills: 0, eliteKills: 0, elapsedMs: 0, durationMs: 60000 };
    this.objectiveActive = false;
    this.objectiveComplete = false;
    this.objectiveEliteUnlocked = false;
    this.objectiveLastSecond = null;
    this.objectivePanel = scene.add.image(this.width / 2, 188, 'hud_score_box')
      .setDisplaySize(660, 166)
      .setScrollFactor(0)
      .setDepth(28)
      .setAlpha(0);
    this.objectiveTitle = scene.add.text(this.width / 2, 126, '60초 수묵 수련', {
      fontSize: '18px', color: '#05070b', fontFamily: 'Arial Black',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveTime = scene.add.text(this.width / 2 - 270, 151, '', {
      fontSize: '16px', color: '#8d2418', fontFamily: 'Arial Black',
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveCurrent = scene.add.text(this.width / 2 - 270, 182, '', {
      fontSize: '15px', color: '#8d2418', fontFamily: 'Arial Black',
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveNext = scene.add.text(this.width / 2 + 270, 182, '', {
      fontSize: '15px', color: '#101820', fontFamily: 'Arial Black',
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveTrail = scene.add.text(this.width / 2, 216, '', {
      fontSize: '15px', color: '#101820', fontFamily: 'Arial',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveStatus = scene.add.text(this.width / 2, 244, '', {
      fontSize: '13px', color: '#3f3a32', fontFamily: 'Arial',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(29).setAlpha(0);
    this.objectiveNodes = [this.objectivePanel, this.objectiveTitle, this.objectiveTime, this.objectiveCurrent, this.objectiveNext, this.objectiveTrail, this.objectiveStatus];
    this._renderCombatObjective();
  }

  _recordObjectiveEvent(key) {
    if (!this.objectiveActive || this.objectiveComplete) return;
    this.objectiveStats[key] += 1;
    this._renderCombatObjective();
  }

  _recordObjectiveKill(isTrialElite) {
    if (!this.objectiveActive || this.objectiveComplete) return;
    this.objectiveStats.kills += 1;
    if (isTrialElite) this.objectiveStats.eliteKills += 1;
    this._renderCombatObjective();
  }

  _renderCombatObjective() {
    const progress = buildCombatObjectiveProgress(this.objectiveStats);
    this.objectiveTime.setText(progress.timeLabel);
    this.objectiveCurrent.setText(progress.current);
    this.objectiveNext.setText(progress.next);
    this.objectiveTrail.setText(progress.trail);
    this.objectiveStatus.setText(progress.status);
    this.objectiveCurrent.setColor(progress.complete ? '#435f25' : '#8d2418');
    this.objectiveTime.setColor(progress.onTime ? '#8d2418' : '#7a351c');

    if (progress.eliteUnlocked && !this.objectiveEliteUnlocked) {
      this.objectiveEliteUnlocked = true;
      this.scene.events.emit('combatTrialEliteUnlocked', progress);
    }
    if (progress.complete && !this.objectiveComplete) {
      this.objectiveComplete = true;
      this.scene.events.emit('combatTrialCompleted', progress);
    }
  }

  _buildTopInkHud() {
    const scene = this.scene;

    scene.add.image(124, 74, 'hud_logo_panel')
      .setDisplaySize(232, 106)
      .setScrollFactor(0)
      .setDepth(26);
    scene.add.text(104, 72, '21NL', {
      fontSize: '54px',
      color: '#ead8ad',
      fontFamily: 'Arial Black',
      fontStyle: 'italic',
      stroke: '#05070b',
      strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(27);

    this.hpBrush = scene.add.image(486, 48, 'hud_brush_bar')
      .setDisplaySize(420, 48)
      .setScrollFactor(0)
      .setDepth(25);
    this.hpFill = scene.add.rectangle(358, 49, 248, 16, 0x8d2418, 0.92)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(26);
    scene.add.text(264, 48, 'HP', {
      fontSize: '22px',
      color: '#ead8ad',
      fontFamily: 'Arial Black',
      fontStyle: 'italic',
      stroke: '#05070b',
      strokeThickness: 4,
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(27);
    this.hpValueText = scene.add.text(662, 48, '100 / 100', {
      fontSize: '18px',
      color: '#f7ebcf',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 3,
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(27);

    this.staminaBrush = scene.add.image(486, 94, 'hud_brush_bar')
      .setDisplaySize(420, 44)
      .setScrollFactor(0)
      .setDepth(25)
      .setAlpha(0.96);
    this.stBar = scene.add.rectangle(358, 95, 248, 14, 0x435f25, 0.94)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(26);
    scene.add.text(264, 94, 'STAMINA', {
      fontSize: '20px',
      color: '#ead8ad',
      fontFamily: 'Arial Black',
      fontStyle: 'italic',
      stroke: '#05070b',
      strokeThickness: 4,
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(27);
    this.staminaValueText = scene.add.text(662, 94, '100 / 100', {
      fontSize: '17px',
      color: '#f7ebcf',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 3,
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(27);

    scene.add.image(this.width - 88, 68, 'hud_score_box')
      .setDisplaySize(150, 100)
      .setScrollFactor(0)
      .setDepth(25);
    scene.add.text(this.width - 88, 43, 'SCORE', {
      fontSize: '20px',
      color: '#05070b',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(27);
    this.scoreText = scene.add.text(this.width - 88, 86, '0', {
      fontSize: '32px',
      color: '#05070b',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(27);
  }

  _buildBottomInkControls() {
    const scene = this.scene;
    const baseY = this.height - 145;

    scene.add.image(126, baseY, 'hud_joystick_ring')
      .setDisplaySize(154, 154)
      .setScrollFactor(0)
      .setDepth(24)
      .setAlpha(0.78);
    [['▲', 126, baseY - 56], ['▼', 126, baseY + 56], ['◀', 70, baseY], ['▶', 182, baseY]].forEach(([label, x, y]) => {
      scene.add.text(x, y, label, {
        fontSize: '18px',
        color: '#05070b',
        fontFamily: 'Arial Black',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(25).setAlpha(0.78);
    });

    const skills = [
      { label: '참격', key: 'Z', x: this.width / 2 - 122 },
      { label: '대시', key: 'X', x: this.width / 2 },
      { label: '필살', key: 'C', x: this.width / 2 + 122, glow: true },
    ];
    skills.forEach(({ label, key, x, glow }) => {
      const button = scene.add.image(x, baseY, 'hud_skill_button')
        .setDisplaySize(glow ? 128 : 116, glow ? 128 : 116)
        .setScrollFactor(0)
        .setDepth(24)
        .setAlpha(glow ? 0.96 : 0.84);
      if (glow) button.setTint(0xf4efe3);
      scene.add.text(x, baseY - 2, key, {
        fontSize: '24px',
        color: glow ? '#2a1205' : '#05070b',
        fontFamily: 'Arial Black',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(25);
      scene.add.text(x, baseY + 84, label, {
        fontSize: '20px',
        color: '#ead8ad',
        fontFamily: 'Arial Black',
        stroke: '#05070b',
        strokeThickness: 5,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(25);
    });

    const itemX = this.width - 64;
    [
      { y: this.height - 520, label: '검' },
      { y: this.height - 394, label: 'TAB' },
      { y: this.height - 268, label: '3' },
    ].forEach(({ y, label }) => {
      scene.add.image(itemX, y, 'hud_item_slot')
        .setDisplaySize(74, 104)
        .setScrollFactor(0)
        .setDepth(24)
        .setAlpha(0.86);
      scene.add.text(itemX, y + 22, label, {
        fontSize: label === 'TAB' ? '18px' : (label === '3' ? '24px' : '22px'),
        color: '#05070b',
        fontFamily: 'Arial Black',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(25);
    });
  }

  _buildTutorialPanel() {
    const scene = this.scene;
    const inkShadow = scene.add.rectangle(this.width / 2, 190, 650, 138, 0x05070b, 0.18)
      .setScrollFactor(0)
      .setDepth(28);
    const panel = scene.add.rectangle(this.width / 2, 178, 620, 130, 0xf2efe3, 0.82)
      .setStrokeStyle(2, 0x101820, 0.84)
      .setScrollFactor(0)
      .setDepth(29);
    const title = scene.add.text(this.width / 2, 130, TutorialCopy.title, {
      fontSize: '18px',
      color: '#05070b',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30);
    const body = scene.add.text(this.width / 2, 164, '', {
      fontSize: '17px',
      color: '#101820',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 560 },
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(30);

    this.tutorialNodes = [inkShadow, panel, title, body];
    this.tutorialTitle = title;
    this.tutorialBody = body;
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
        onComplete: () => {
          this.tutorialNodes.forEach(node => node.destroy());
          this.objectiveActive = true;
          this.scene.events.emit('tutorialCompleted');
          this.scene.tweens.add({ targets: this.objectiveNodes, alpha: 1, duration: 320, ease: 'Cubic.easeOut' });
        },
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
      y: 132,
      scale: 1.12,
      duration: 70,
      yoyo: true,
      onComplete: () => {
        this.comboText.setY(142).setScale(1);
        this.scene.tweens.add({ targets: this.comboText, alpha: 0, duration: 520, delay: 380 });
      },
    });
  }

  update(delta = 0) {
    if (this.objectiveActive && !this.objectiveComplete) {
      this.objectiveStats.elapsedMs += Math.max(0, delta);
      const currentSecond = Math.floor(this.objectiveStats.elapsedMs / 1000);
      if (currentSecond !== this.objectiveLastSecond) {
        this.objectiveLastSecond = currentSecond;
        this._renderCombatObjective();
      }
    }
    const hpRatio = Math.max(0, this.stat.hp / this.stat.maxHp);
    this.hpFill.setDisplaySize(248 * hpRatio, 16);
    this.hpFill.setFillStyle(hpRatio <= 0.3 ? 0xc85f24 : 0x8d2418);

    const stRatio = Math.max(0, this.stat.stamina / this.stat.maxStamina);
    this.stBar.setDisplaySize(248 * stRatio, 14);

    this.hpValueText.setText(`${Math.ceil(this.stat.hp)} / ${this.stat.maxHp}`);
    this.staminaValueText.setText(`${Math.ceil(this.stat.stamina)} / ${this.stat.maxStamina}`);
    this.scoreText.setText(`${this.stat.score}`);
  }
}
