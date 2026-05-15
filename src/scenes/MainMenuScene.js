class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_far').setDepth(-30);
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_mid').setAlpha(0.7).setDepth(-20);
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_fog').setAlpha(0.92).setDepth(-15);
    this.add.rectangle(width / 2, height / 2, width, height, 0xf2efe3, 0.16).setDepth(-12);
    this.add.rectangle(width / 2, height / 2, width, height, 0x05070b, 0.24).setDepth(-10);

    this.add.image(width / 2 - 210, height / 2 + 22, 'electric_char').setScale(2.2).setAlpha(0.95).setDepth(1);
    this.add.image(width / 2 + 210, height / 2 + 22, 'mecha_char').setScale(2.05).setAlpha(0.95).setDepth(1);
    this.add.image(width / 2, height / 2 + 42, 'pursuer').setScale(1.55).setAlpha(0.38).setTint(0xff263e).setDepth(0);

    this.add.text(width / 2, 142, '21 NL', {
      fontSize: '86px',
      color: '#f2efe3',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 8,
    }).setOrigin(0.5).setDepth(2);

    this.add.text(width / 2, 218, TutorialCopy.goal, {
      fontSize: '24px',
      color: '#9dfbff',
      fontFamily: 'Arial',
      stroke: '#05070b',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(2);

    const inkShadow = this.add.rectangle(width / 2, height - 120, 680, 130, 0x05070b, 0.24);
    inkShadow.setDepth(3);
    const tutorialPanel = this.add.rectangle(width / 2, height - 132, 650, 126, 0xf2efe3, 0.82)
      .setStrokeStyle(2, 0x101820, 0.9)
      .setDepth(4);

    this.add.text(width / 2, height - 178, TutorialCopy.title, {
      fontSize: '18px',
      color: '#05070b',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(width / 2, height - 146, TutorialCopy.heal, {
      fontSize: '16px',
      color: '#172431',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(width / 2, height - 118, TutorialCopy.controls, {
      fontSize: '14px',
      color: '#05070b',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(5);

    const start = this.add.text(width / 2, height - 70, TutorialCopy.start, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#05070b',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(5);

    this.tweens.add({ targets: start, alpha: 0.45, duration: 720, yoyo: true, repeat: -1 });
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
