const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1920,
  backgroundColor: '#1a1a1a',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
