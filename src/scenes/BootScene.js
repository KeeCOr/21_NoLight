class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {}

  create() {
    ArtFactory.build(this);
    this.scene.start('MainMenuScene');
  }
}
