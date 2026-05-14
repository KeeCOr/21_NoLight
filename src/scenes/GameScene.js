class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  create() {
    this.add.text(640, 360, 'GameScene - WIP', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
  }
  update() {}
}
