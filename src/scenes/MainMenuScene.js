class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }
  create() {
    this.add.text(640, 360, '21_NL\n[SPACE] 시작', { fontSize: '32px', color: '#fff', align: 'center' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
