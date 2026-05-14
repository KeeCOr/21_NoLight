class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x111111);

    this.add.text(width / 2, height / 2 - 80, '묵철 (墨鐵)', {
      fontSize: '48px', color: '#cccccc', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, '수묵화 액션 플랫포머', {
      fontSize: '20px', color: '#888888'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, '[ SPACE ] 시작', {
      fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
