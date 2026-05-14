class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  create() {
    this.add.text(640, 360, 'Game Over', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}
