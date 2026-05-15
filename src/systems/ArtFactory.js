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
    if (typeof scene.recordTexture === 'function') scene.recordTexture(key);
    g.destroy();
  }

  static _palette() {
    return {
      paper: 0xf2efe3,
      paperShade: 0xd8d0bd,
      ink: 0x05070b,
      inkSoft: 0x101820,
      inkBlue: 0x172431,
      inkPurple: 0x221825,
      cyan: 0x51f6ff,
      cyanSoft: 0x9dfbff,
      orange: 0xff9b3d,
      amber: 0xffcf63,
      magenta: 0xff4f9a,
      red: 0xff273d,
    };
  }

  static _wash(g, w, h, color, alpha, count, seed = 7) {
    g.fillStyle(color, alpha);
    for (let i = 0; i < count; i++) {
      const x = (i * 61 + seed * 17) % w;
      const y = (i * 43 + seed * 29) % h;
      const ew = 42 + ((i * 19 + seed) % 90);
      const eh = 12 + ((i * 11 + seed) % 34);
      g.fillEllipse(x, y, ew, eh);
    }
  }

  static _dryBrush(g, points, color, alpha = 1, width = 3) {
    g.lineStyle(width, color, alpha).beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.strokePath();
  }

  static _jaggedFill(g, points, color, alpha = 1) {
    g.fillStyle(color, alpha).beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.closePath().fillPath();
  }

  static _neonCore(g, x, y, radius, color, alpha = 1) {
    g.fillStyle(color, 0.12 * alpha).fillCircle(x, y, radius * 2.4);
    g.fillStyle(color, 0.28 * alpha).fillCircle(x, y, radius * 1.45);
    g.fillStyle(0xffffff, 0.9 * alpha).fillCircle(x, y, radius * 0.55);
  }

  static _buildCharacters(scene) {
    const p = this._palette();

    this._texture(scene, 'electric_char', 58, 74, (g) => {
      this._wash(g, 58, 74, p.cyan, 0.09, 7, 1);
      this._jaggedFill(g, [[27, 5], [39, 13], [43, 32], [38, 64], [25, 72], [14, 58], [12, 25], [19, 10]], p.ink, 0.96);
      this._jaggedFill(g, [[23, 14], [36, 18], [36, 54], [27, 62], [18, 53], [18, 20]], p.inkBlue, 0.9);
      g.fillStyle(p.paper, 0.82).fillRoundedRect(18, 18, 22, 9, 4);
      g.fillStyle(p.ink, 1).fillRect(21, 21, 16, 2);
      this._neonCore(g, 23, 24, 3, p.cyan, 1);
      this._neonCore(g, 34, 24, 3, p.cyan, 1);
      this._dryBrush(g, [[13, 37], [23, 33], [19, 44], [34, 38], [29, 53], [43, 47]], p.cyan, 0.95, 3);
      this._dryBrush(g, [[7, 50], [19, 44], [13, 61], [25, 55]], p.cyanSoft, 0.55, 2);
      g.lineStyle(2, p.cyan, 0.95).strokeRoundedRect(15, 12, 27, 52, 8);
      g.fillStyle(p.ink, 1).fillRoundedRect(17, 61, 10, 11, 3).fillRoundedRect(31, 61, 10, 11, 3);
      g.fillStyle(p.paper, 0.28).fillRect(20, 65, 5, 2).fillRect(33, 65, 5, 2);
    });

    this._texture(scene, 'mecha_char', 62, 76, (g) => {
      this._wash(g, 62, 76, p.orange, 0.08, 7, 4);
      this._jaggedFill(g, [[28, 6], [44, 15], [45, 54], [37, 70], [22, 70], [13, 55], [14, 17]], p.ink, 0.98);
      this._jaggedFill(g, [[21, 16], [39, 16], [40, 56], [31, 63], [21, 57]], 0x414850, 0.92);
      g.fillStyle(p.orange, 0.96).fillRoundedRect(18, 22, 26, 8, 2);
      g.fillStyle(p.ink, 1).fillRect(22, 24, 17, 3);
      this._dryBrush(g, [[8, 37], [18, 32], [24, 45], [15, 59]], p.paperShade, 0.85, 6);
      this._jaggedFill(g, [[39, 28], [55, 35], [50, 63], [38, 58]], p.orange, 0.92);
      g.fillStyle(p.inkSoft, 1).fillRoundedRect(42, 35, 7, 22, 2);
      this._neonCore(g, 46, 60, 5, p.amber, 1);
      g.lineStyle(2, p.orange, 0.88).strokeRoundedRect(16, 12, 30, 56, 7);
      this._dryBrush(g, [[12, 70], [26, 63], [39, 70], [51, 65]], p.ink, 0.8, 4);
      g.fillStyle(p.ink, 1).fillRoundedRect(18, 64, 11, 10, 3).fillRoundedRect(34, 64, 11, 10, 3);
    });
  }

  static _buildEnemies(scene) {
    const p = this._palette();

    this._texture(scene, 'enemy', 52, 52, (g) => {
      this._wash(g, 52, 52, p.magenta, 0.08, 5, 2);
      this._jaggedFill(g, [[9, 18], [18, 8], [35, 10], [44, 22], [39, 42], [25, 49], [11, 40]], p.ink, 0.96);
      this._jaggedFill(g, [[14, 20], [22, 14], [33, 15], [37, 27], [32, 37], [20, 38], [13, 30]], p.inkPurple, 0.9);
      this._neonCore(g, 20, 25, 4, p.magenta, 1);
      this._neonCore(g, 32, 25, 4, p.magenta, 1);
      g.fillStyle(p.ink, 1).fillRect(19, 35, 15, 3);
      this._dryBrush(g, [[10, 37], [2, 47], [14, 42], [9, 51]], p.ink, 0.95, 3);
      this._dryBrush(g, [[41, 37], [50, 47], [38, 43], [43, 51]], p.ink, 0.95, 3);
      g.lineStyle(2, p.magenta, 0.52).strokeRoundedRect(12, 14, 28, 29, 9);
    });

    this._texture(scene, 'pursuer', 108, 122, (g) => {
      this._wash(g, 108, 122, p.red, 0.1, 14, 8);
      this._jaggedFill(g, [[50, 7], [78, 20], [88, 65], [69, 105], [43, 116], [21, 90], [17, 35]], p.ink, 0.98);
      this._jaggedFill(g, [[50, 19], [70, 28], [75, 65], [62, 91], [45, 96], [31, 75], [31, 33]], 0x340811, 0.94);
      this._jaggedFill(g, [[46, 29], [65, 36], [66, 70], [53, 82], [38, 68], [36, 39]], 0x7f1222, 0.9);
      this._neonCore(g, 53, 47, 14, p.red, 1);
      g.fillStyle(p.ink, 1).fillCircle(53, 47, 4);
      this._dryBrush(g, [[25, 29], [7, 8], [18, 35], [4, 54]], p.ink, 1, 5);
      this._dryBrush(g, [[80, 29], [101, 8], [90, 36], [104, 55]], p.ink, 1, 5);
      this._dryBrush(g, [[29, 83], [8, 113], [35, 95]], p.ink, 1, 6);
      this._dryBrush(g, [[76, 83], [100, 113], [70, 97]], p.ink, 1, 6);
      g.lineStyle(3, p.red, 0.75).strokeRoundedRect(22, 17, 64, 91, 18);
      g.fillStyle(p.orange, 0.84).fillTriangle(40, 98, 54, 121, 68, 98);
      this._dryBrush(g, [[32, 99], [54, 111], [75, 99]], p.paperShade, 0.18, 2);
    });
  }

  static _buildWorld(scene) {
    const p = this._palette();

    this._texture(scene, 'platform', 190, 36, (g, w, h) => {
      g.fillStyle(p.paper, 0.18).fillRoundedRect(0, 4, w, h - 6, 7);
      this._jaggedFill(g, [[0, 10], [22, 3], [58, 7], [92, 0], [139, 5], [190, 1], [190, 28], [163, 34], [119, 29], [74, 36], [32, 31], [0, 35]], p.inkSoft, 0.98);
      this._jaggedFill(g, [[0, 8], [43, 7], [84, 4], [128, 8], [190, 5], [190, 18], [137, 17], [89, 20], [42, 17], [0, 20]], p.paperShade, 0.24);
      this._dryBrush(g, [[5, 6], [50, 8], [96, 4], [143, 8], [186, 5]], p.paper, 0.28, 2);
      this._dryBrush(g, [[11, 17], [33, 21], [58, 18], [85, 23], [111, 18], [139, 22], [176, 18]], p.ink, 0.42, 3);
      g.lineStyle(2, p.cyan, 0.56).beginPath().moveTo(13, 12).lineTo(31, 12).moveTo(73, 10).lineTo(93, 10).moveTo(146, 12).lineTo(169, 12).strokePath();
      g.lineStyle(2, p.orange, 0.42).beginPath().moveTo(108, 27).lineTo(130, 24).moveTo(38, 28).lineTo(58, 25).strokePath();
    });

    this._texture(scene, 'bg_far', 512, 512, (g, w, h) => {
      g.fillGradientStyle(p.paper, p.paper, 0xb8c5c2, 0x33404a, 1);
      g.fillRect(0, 0, w, h);
      this._wash(g, w, h, p.ink, 0.07, 38, 3);
      this._wash(g, w, h, p.inkBlue, 0.08, 22, 12);
      this._dryBrush(g, [[0, 430], [95, 380], [160, 415], [245, 355], [325, 392], [410, 342], [512, 384]], p.ink, 0.16, 11);
      g.fillStyle(p.cyan, 0.34);
      for (let i = 0; i < 80; i++) g.fillCircle((i * 83) % w, (i * 47) % h, (i % 3) + 0.7);
      g.fillStyle(p.orange, 0.22);
      for (let i = 0; i < 24; i++) g.fillCircle((i * 137 + 19) % w, (i * 71 + 43) % h, 1.4);
    });

    this._texture(scene, 'bg_mid', 512, 512, (g, w, h) => {
      g.fillStyle(0x000000, 0).fillRect(0, 0, w, h);
      this._wash(g, w, h, p.ink, 0.08, 16, 9);
      for (let x = -30; x < w; x += 68) {
        const bh = 150 + ((x * 17) % 150);
        const roof = 18 + ((x * 5) % 22);
        this._jaggedFill(g, [[x - 7, h - bh + roof], [x + 16, h - bh], [x + 49, h - bh + 8], [x + 56, h], [x - 2, h]], p.ink, 0.55);
        g.fillStyle(p.inkBlue, 0.55).fillRect(x + 5, h - bh + 25, 45, bh - 25);
        g.lineStyle(1, p.cyan, 0.22);
        for (let y = h - bh + 42; y < h - 20; y += 38) {
          g.beginPath().moveTo(x + 12, y).lineTo(x + 21, y + 2).moveTo(x + 34, y + 12).lineTo(x + 45, y + 11).strokePath();
        }
      }
      this._dryBrush(g, [[0, 492], [120, 480], [230, 500], [350, 474], [512, 490]], p.ink, 0.34, 9);
    });

    this._texture(scene, 'bg_fog', 512, 256, (g, w, h) => {
      g.fillStyle(0x000000, 0).fillRect(0, 0, w, h);
      this._wash(g, w, h, p.paper, 0.08, 14, 5);
      this._wash(g, w, h, p.cyan, 0.045, 18, 14);
      g.lineStyle(7, p.paper, 0.06);
      for (let y = 48; y < h; y += 58) {
        g.beginPath().moveTo(-20, y).quadraticCurveTo(120, y - 30, 250, y + 6).quadraticCurveTo(390, y + 42, 532, y - 8).strokePath();
      }
    });

    this._texture(scene, 'bg_scanline', 8, 8, (g, w) => {
      g.fillStyle(0x000000, 0).fillRect(0, 0, w, 8);
      g.fillStyle(p.ink, 0.11).fillRect(0, 0, w, 1);
      g.fillStyle(p.cyan, 0.12).fillRect(0, 2, w, 1);
      g.fillStyle(p.paper, 0.06).fillRect(0, 6, w, 1);
    });
  }

  static _buildEffects(scene) {
    const p = this._palette();

    this._texture(scene, 'projectile', 28, 28, (g) => {
      this._wash(g, 28, 28, p.orange, 0.15, 3, 2);
      g.fillStyle(p.orange, 0.18).fillCircle(14, 14, 14);
      g.fillStyle(p.ink, 0.62).fillCircle(14, 14, 9);
      this._neonCore(g, 14, 14, 6, p.orange, 1);
      this._dryBrush(g, [[4, 16], [12, 9], [24, 7]], p.amber, 0.62, 2);
    });

    this._texture(scene, 'spark', 24, 24, (g) => {
      this._dryBrush(g, [[12, 0], [11, 9], [17, 7], [12, 13], [14, 24]], p.cyanSoft, 1, 2);
      this._dryBrush(g, [[0, 13], [9, 11], [7, 17], [14, 12], [24, 10]], p.cyan, 0.9, 2);
      g.fillStyle(0xffffff, 0.9).fillCircle(12, 12, 2);
    });

    this._texture(scene, 'afterimage_glow', 72, 72, (g) => {
      this._wash(g, 72, 72, 0xffffff, 0.08, 10, 6);
      g.fillStyle(0xffffff, 0.11).fillCircle(36, 36, 32);
      g.fillStyle(0xffffff, 0.17).fillCircle(36, 36, 20);
      g.fillStyle(0xffffff, 0.35).fillCircle(36, 36, 6);
    });
  }

  static _buildUi(scene) {
    const p = this._palette();

    this._texture(scene, 'portrait_electric', 58, 58, (g) => {
      this._wash(g, 58, 58, p.cyan, 0.08, 5, 3);
      g.fillStyle(p.paper, 0.16).fillRoundedRect(0, 0, 58, 58, 8);
      this._jaggedFill(g, [[13, 14], [28, 7], [43, 16], [40, 42], [26, 50], [13, 39]], p.ink, 0.96);
      g.fillStyle(p.paper, 0.82).fillRoundedRect(15, 18, 28, 15, 5);
      this._neonCore(g, 23, 26, 3, p.cyan, 1);
      this._neonCore(g, 35, 26, 3, p.cyan, 1);
      g.lineStyle(2, p.cyan, 0.9).strokeRoundedRect(3, 3, 52, 52, 6);
      this._dryBrush(g, [[8, 49], [22, 42], [38, 48], [51, 39]], p.cyan, 0.4, 2);
    });

    this._texture(scene, 'portrait_mecha', 58, 58, (g) => {
      this._wash(g, 58, 58, p.orange, 0.08, 5, 7);
      g.fillStyle(p.paper, 0.14).fillRoundedRect(0, 0, 58, 58, 8);
      this._jaggedFill(g, [[14, 13], [31, 7], [45, 18], [42, 43], [28, 51], [13, 39]], p.ink, 0.96);
      g.fillStyle(0x4b5867, 0.9).fillRoundedRect(17, 14, 28, 31, 5);
      g.fillStyle(p.orange, 0.95).fillRect(18, 22, 24, 5);
      g.lineStyle(2, p.orange, 0.9).strokeRoundedRect(3, 3, 52, 52, 6);
      this._dryBrush(g, [[10, 48], [25, 42], [39, 49], [50, 42]], p.orange, 0.42, 2);
    });
  }
}

if (typeof module !== 'undefined') module.exports = ArtFactory;
