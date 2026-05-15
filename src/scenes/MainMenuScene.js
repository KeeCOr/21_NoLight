class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_far').setDepth(-30);
    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_mid').setAlpha(0.85).setDepth(-20);
    this.add.rectangle(width / 2, height / 2, width, height, 0x050912, 0.42).setDepth(-10);

    this.add.image(width / 2 - 210, height / 2 + 22, 'electric_char').setScale(2.2).setAlpha(0.95);
    this.add.image(width / 2 + 210, height / 2 + 22, 'mecha_char').setScale(2.05).setAlpha(0.95);
    this.add.image(width / 2, height / 2 + 42, 'pursuer').setScale(1.55).setAlpha(0.38).setTint(0xff263e);

    this.add.text(width / 2, 154, '21 NL', {
      fontSize: '86px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#06111c',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(width / 2, 236, '네온 루프 생존 액션', {
      fontSize: '25px',
      color: '#8fdfff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const start = this.add.text(width / 2, height - 150, '[ SPACE ] START', {
      fontSize: '30px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.tweens.add({ targets: start, alpha: 0.45, duration: 720, yoyo: true, repeat: -1 });

    this.add.text(width / 2, height - 92, 'Z 공격   X 스킬   C 가드   TAB 캐릭터 교체', {
      fontSize: '16px',
      color: '#a9b8c7',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
