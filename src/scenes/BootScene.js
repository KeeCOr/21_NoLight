class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {}

  create() {
    // 실제 에셋 없이 색상 사각형으로 플레이스홀더 텍스처 생성
    this._makeRect('electric_char', 0x4488ff, 30, 50);
    this._makeRect('mecha_char',    0xaa4422, 30, 50);
    this._makeRect('enemy',         0x884400, 25, 40);
    this._makeRect('pursuer',       0xff2222, 60, 80);
    this._makeRect('platform',      0x555555, 100, 20);
    this.scene.start('MainMenuScene');
  }

  _makeRect(key, color, w, h) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
