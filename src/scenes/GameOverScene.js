class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const { width, height } = this.cameras.main;
    const score = data?.score ?? 0;

    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_far').setTint(0x2c2922);
    this.add.image(width / 2, height / 2 - 70, 'bg_mountain_generated')
      .setDisplaySize(width * 1.18, 420)
      .setTint(0x05070b)
      .setAlpha(0.28);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.62);
    this.add.image(width / 2, 190, 'pursuer').setScale(1.4).setTint(0x1a1714).setAlpha(0.85);

    this.add.text(width / 2, height / 2 - 92, 'LOOP ENDED', {
      fontSize: '58px',
      color: '#f4efe3',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 16, `SCORE  ${score}`, {
      fontSize: '34px',
      color: '#ead8ad',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 126, '[ SPACE ] RETRY      [ ESC ] MAIN MENU', {
      fontSize: '18px',
      color: '#c5d0dc',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
  }
}
