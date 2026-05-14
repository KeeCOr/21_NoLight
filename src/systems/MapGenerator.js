class MapGenerator {
  constructor(scene) {
    this.scene = scene;
    this.CHUNK_HEIGHT = 300;
    this.BUFFER = 2;
    this.chunks = new Map();
    // 단일 staticGroup으로 모든 플랫폼 관리 (충돌 등록 한 번만)
    this.platformGroup = scene.physics.add.staticGroup();
  }

  getChunkIndex(y) {
    return Math.floor(y / this.CHUNK_HEIGHT);
  }

  update(player, enemyFactory) {
    const center = this.getChunkIndex(player.y);

    for (let i = center - this.BUFFER; i <= center + this.BUFFER; i++) {
      if (!this.chunks.has(i)) this.generateChunk(i, enemyFactory);
    }

    for (const [index] of this.chunks) {
      if (Math.abs(index - center) > this.BUFFER + 1) this.removeChunk(index);
    }
  }

  generateChunk(chunkIndex, enemyFactory) {
    const yTop = chunkIndex * this.CHUNK_HEIGHT;

    // 항상 이동 가능한 경로 보장: 좌/중/우 각 1개
    const guaranteed = [
      { x: 200,  y: yTop + 150, w: 120 },
      { x: 640,  y: yTop + 80,  w: 120 },
      { x: 1080, y: yTop + 200, w: 120 },
    ];

    const platforms = guaranteed.map(p => {
      const plat = this.platformGroup.create(p.x, p.y, 'platform');
      plat.setDisplaySize(p.w, 20).refreshBody();
      return plat;
    });

    const extra = Phaser.Math.Between(2, 4);
    for (let i = 0; i < extra; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = yTop + Phaser.Math.Between(30, 260);
      const w = Phaser.Math.Between(60, 150);
      const plat = this.platformGroup.create(x, y, 'platform');
      plat.setDisplaySize(w, 20).refreshBody();
      platforms.push(plat);
    }

    const enemies = [];
    if (enemyFactory && chunkIndex !== 0) {
      const count = Phaser.Math.Between(1, 3);
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(100, 1180);
        const y = yTop + 50;
        const e = enemyFactory(x, y);
        if (e) enemies.push(e);
      }
    }

    this.chunks.set(chunkIndex, { platforms, enemies });
  }

  removeChunk(chunkIndex) {
    const chunk = this.chunks.get(chunkIndex);
    if (!chunk) return;
    chunk.platforms.forEach(p => p.destroy());
    chunk.enemies.forEach(e => { if (e.active) e.destroy(); });
    this.chunks.delete(chunkIndex);
  }

  getPlatformGroup() {
    return this.platformGroup;
  }

  getAllEnemies() {
    const result = [];
    for (const [, chunk] of this.chunks) {
      chunk.enemies.forEach(e => { if (e.active) result.push(e); });
    }
    return result;
  }
}

if (typeof module !== 'undefined') module.exports = MapGenerator;
