class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data) {
    const { width, height } = this.cameras.main;
    const score = data?.score ?? 0;
    const totalSec = Math.floor(data?.time ?? 0);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

    this.add.text(width / 2, height / 2 - 120, '게임 오버', {
      fontSize: '52px', color: '#ff4444', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, `생존 시간: ${min}:${sec}`, {
      fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 40, `점수: ${score}`, {
      fontSize: '32px', color: '#ffdd00'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 120, '[ SPACE ] 다시 시작    [ ESC ] 메인 메뉴', {
      fontSize: '18px', color: '#aaaaaa'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown-ESC',   () => this.scene.start('MainMenuScene'));
  }
}
