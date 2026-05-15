class ArtFactory {
  static build(scene) {
    this._buildCharacters(scene);
    this._buildEnemies(scene);
    this._buildWorld(scene);
    this._buildEffects(scene);
    this._buildUi(scene);
  }

  static _texture(scene, key, width, height, draw) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    draw(g, width, height);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  static _buildCharacters(scene) {
    this._texture(scene, 'electric_char', 52, 68, (g) => {
      g.fillStyle(0x57e8ff, 0.16).fillCircle(26, 38, 23);
      g.fillStyle(0x07131f, 1).fillRoundedRect(13, 12, 26, 50, 8);
      g.fillStyle(0x16395f, 1).fillRoundedRect(16, 15, 20, 42, 6);
      g.fillStyle(0x64e7ff, 1).fillRoundedRect(18, 19, 16, 8, 3);
      g.fillStyle(0xd9fbff, 1).fillCircle(22, 23, 2).fillCircle(30, 23, 2);
      g.fillStyle(0x0b2035, 1).fillRoundedRect(10, 34, 32, 15, 5);
      g.fillStyle(0x67f7ff, 0.9).fillRect(15, 36, 22, 2).fillRect(24, 28, 4, 21);
      g.lineStyle(2, 0x7ff9ff, 0.85).beginPath().moveTo(7, 42).lineTo(16, 36).lineTo(12, 48).lineTo(22, 43).strokePath();
      g.lineStyle(2, 0xffffff, 0.5).beginPath().moveTo(45, 25).lineTo(35, 35).lineTo(43, 35).lineTo(32, 50).strokePath();
      g.fillStyle(0x06101a, 1).fillRoundedRect(15, 56, 8, 10, 3).fillRoundedRect(29, 56, 8, 10, 3);
    });

    this._texture(scene, 'mecha_char', 56, 70, (g) => {
      g.fillStyle(0x161211, 1).fillRoundedRect(15, 12, 26, 52, 7);
      g.fillStyle(0x4b5867, 1).fillRoundedRect(17, 16, 22, 42, 5);
      g.fillStyle(0xff8a2a, 1).fillRoundedRect(17, 21, 22, 8, 2);
      g.fillStyle(0x101820, 1).fillRect(20, 23, 16, 3);
      g.fillStyle(0xc9d2dc, 1).fillRoundedRect(9, 31, 13, 25, 4);
      g.fillStyle(0xff6b2b, 1).fillRoundedRect(34, 28, 15, 31, 5);
      g.fillStyle(0x2b323b, 1).fillRect(37, 32, 8, 21);
      g.fillStyle(0xffc247, 1).fillCircle(41, 56, 5);
      g.fillStyle(0x0d1014, 1).fillRoundedRect(16, 58, 9, 10, 3).fillRoundedRect(31, 58, 9, 10, 3);
      g.lineStyle(2, 0xffb15d, 0.8).strokeRoundedRect(13, 13, 30, 51, 8);
    });
  }

  static _buildEnemies(scene) {
    this._texture(scene, 'enemy', 46, 48, (g) => {
      g.fillStyle(0x170b19, 1).fillRoundedRect(8, 14, 30, 28, 10);
      g.fillStyle(0x5e244e, 1).fillRoundedRect(11, 16, 24, 22, 8);
      g.fillStyle(0xff4f9a, 1).fillCircle(19, 25, 3).fillCircle(29, 25, 3);
      g.fillStyle(0x120612, 1).fillRect(18, 33, 12, 3);
      g.lineStyle(3, 0x271129, 1).beginPath().moveTo(9, 33).lineTo(1, 41).moveTo(37, 33).lineTo(45, 41).moveTo(14, 40).lineTo(8, 47).moveTo(32, 40).lineTo(38, 47).strokePath();
      g.lineStyle(2, 0xff7fbd, 0.5).strokeRoundedRect(10, 15, 26, 25, 9);
    });

    this._texture(scene, 'pursuer', 96, 112, (g) => {
      g.fillStyle(0x090409, 1).fillRoundedRect(18, 14, 60, 84, 18);
      g.fillStyle(0x3b0611, 1).fillRoundedRect(24, 20, 48, 72, 15);
      g.fillStyle(0x8f1224, 1).fillRoundedRect(31, 28, 34, 45, 12);
      g.fillStyle(0xff263e, 1).fillCircle(48, 41, 14);
      g.fillStyle(0xffd0d0, 1).fillCircle(48, 41, 6);
      g.fillStyle(0x1b0205, 1).fillCircle(48, 41, 3);
      g.lineStyle(5, 0x210309, 1).beginPath().moveTo(22, 25).lineTo(5, 9).moveTo(74, 25).lineTo(91, 9).moveTo(22, 77).lineTo(5, 101).moveTo(74, 77).lineTo(91, 101).strokePath();
      g.lineStyle(3, 0xff3a4f, 0.75).strokeRoundedRect(20, 16, 56, 80, 17);
      g.fillStyle(0xff4c00, 0.8).fillTriangle(36, 88, 48, 108, 60, 88);
    });
  }

  static _buildWorld(scene) {
    this._texture(scene, 'platform', 180, 32, (g, w, h) => {
      g.fillStyle(0x111922, 1).fillRoundedRect(0, 4, w, h - 4, 5);
      g.fillStyle(0x34404b, 1).fillRoundedRect(0, 0, w, 18, 4);
      g.fillStyle(0x758493, 1).fillRect(0, 0, w, 3);
      g.fillStyle(0x1b242e, 1);
      for (let x = 12; x < w; x += 28) g.fillRect(x, 18, 12, 7);
      g.fillStyle(0x76f0ff, 0.45);
      for (let x = 8; x < w; x += 46) g.fillRect(x, 6, 16, 2);
    });

    this._texture(scene, 'bg_far', 512, 512, (g, w, h) => {
      g.fillGradientStyle(0x070b16, 0x070b16, 0x182033, 0x182033, 1);
      g.fillRect(0, 0, w, h);
      g.fillStyle(0x9fc6ff, 0.45);
      for (let i = 0; i < 95; i++) g.fillCircle((i * 83) % w, (i * 47) % h, (i % 3) + 0.8);
    });

    this._texture(scene, 'bg_mid', 512, 512, (g, w, h) => {
      g.fillStyle(0x000000, 0);
      g.fillRect(0, 0, w, h);
      for (let x = -20; x < w; x += 72) {
        const bh = 150 + ((x * 13) % 120);
        g.fillStyle(0x111827, 0.78).fillRect(x, h - bh, 52, bh);
        g.fillStyle(0x2af2ff, 0.22);
        for (let y = h - bh + 18; y < h - 16; y += 34) g.fillRect(x + 9, y, 7, 3).fillRect(x + 30, y + 10, 9, 3);
      }
    });

    this._texture(scene, 'bg_fog', 512, 256, (g, w, h) => {
      g.fillStyle(0x000000, 0).fillRect(0, 0, w, h);
      g.fillStyle(0x61f5ff, 0.06);
      for (let i = 0; i < 16; i++) g.fillEllipse((i * 73) % w, 50 + ((i * 31) % 150), 150, 34);
    });

    this._texture(scene, 'bg_scanline', 8, 8, (g, w) => {
      g.fillStyle(0x000000, 0).fillRect(0, 0, w, 8);
      g.fillStyle(0x9ff7ff, 0.16).fillRect(0, 0, w, 1);
      g.fillStyle(0x000000, 0.18).fillRect(0, 5, w, 1);
    });
  }

  static _buildEffects(scene) {
    this._texture(scene, 'projectile', 24, 24, (g) => {
      g.fillStyle(0xff6b18, 0.28).fillCircle(12, 12, 12);
      g.fillStyle(0xffb347, 0.75).fillCircle(12, 12, 8);
      g.fillStyle(0xffffff, 1).fillCircle(9, 9, 3);
    });

    this._texture(scene, 'spark', 20, 20, (g) => {
      g.lineStyle(2, 0x92fbff, 1).beginPath().moveTo(10, 0).lineTo(10, 20).moveTo(0, 10).lineTo(20, 10).moveTo(3, 3).lineTo(17, 17).moveTo(17, 3).lineTo(3, 17).strokePath();
    });

    this._texture(scene, 'afterimage_glow', 64, 64, (g) => {
      g.fillStyle(0xffffff, 0.12).fillCircle(32, 32, 30);
      g.fillStyle(0xffffff, 0.18).fillCircle(32, 32, 18);
      g.fillStyle(0xffffff, 0.35).fillCircle(32, 32, 6);
    });
  }

  static _buildUi(scene) {
    this._texture(scene, 'portrait_electric', 54, 54, (g) => {
      g.fillStyle(0x07131f, 1).fillRoundedRect(0, 0, 54, 54, 8);
      g.fillStyle(0x64e7ff, 1).fillRoundedRect(13, 12, 28, 22, 6);
      g.fillStyle(0xd9fbff, 1).fillCircle(22, 23, 3).fillCircle(32, 23, 3);
      g.lineStyle(2, 0x7ff9ff, 1).strokeRoundedRect(3, 3, 48, 48, 6);
    });
    this._texture(scene, 'portrait_mecha', 54, 54, (g) => {
      g.fillStyle(0x161211, 1).fillRoundedRect(0, 0, 54, 54, 8);
      g.fillStyle(0x4b5867, 1).fillRoundedRect(14, 10, 27, 30, 5);
      g.fillStyle(0xff8a2a, 1).fillRect(17, 18, 21, 5);
      g.lineStyle(2, 0xffb15d, 1).strokeRoundedRect(3, 3, 48, 48, 6);
    });
  }
}
