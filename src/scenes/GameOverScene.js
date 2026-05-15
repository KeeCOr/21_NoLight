class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const { width, height } = this.cameras.main;
    const score = data?.score ?? 0;
    const totalSec = Math.floor(data?.time ?? 0);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');

    this.add.tileSprite(width / 2, height / 2, width, height, 'bg_far').setTint(0x7a1020);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.68);
    this.add.image(width / 2, 190, 'pursuer').setScale(1.4).setTint(0xff263e).setAlpha(0.85);

    this.add.text(width / 2, height / 2 - 92, 'LOOP ENDED', {
      fontSize: '58px',
      color: '#ff4c64',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 8, `SURVIVAL  ${min}:${sec}`, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 46, `SCORE  ${score}`, {
      fontSize: '34px',
      color: '#ffd76a',
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
