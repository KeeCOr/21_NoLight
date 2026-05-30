class MapGenerator {
  constructor(scene) {
    this.scene = scene;
    this.CHUNK_HEIGHT = 360;
    this.BUFFER = 2;
    this.chunks = new Map();
    // 단일 staticGroup으로 모든 플랫폼 관리 (충돌 등록 한 번만)
    this.platformGroup = scene.physics.add.staticGroup();
  }

  getChunkIndex(y) {
    return Math.floor(y / this.CHUNK_HEIGHT);
  }

  update(player, enemyFactory, pickupFactory) {
    const center = this.getChunkIndex(player.y);

    for (let i = center - this.BUFFER; i <= center + this.BUFFER; i++) {
      if (!this.chunks.has(i)) this.generateChunk(i, enemyFactory, pickupFactory);
    }

    for (const [index] of this.chunks) {
      if (Math.abs(index - center) > this.BUFFER + 1) this.removeChunk(index);
    }
  }

  generateChunk(chunkIndex, enemyFactory, pickupFactory) {
    const yTop = chunkIndex * this.CHUNK_HEIGHT;
    const worldWidth = this.scene.scale?.width || this.scene.cameras.main.width || 900;
    const margin = Math.max(70, Math.floor(worldWidth * 0.09));
    const laneLeft = Math.floor(worldWidth * 0.22);
    const laneCenter = Math.floor(worldWidth * 0.5);
    const laneRight = Math.floor(worldWidth * 0.78);

    // 항상 이동 가능한 경로 보장: 좌/중/우 각 1개
    const guaranteed = [
      { x: laneLeft,   y: yTop + 170, w: 375 },
      { x: laneRight,  y: yTop + 270, w: 375 },
    ];

    const platforms = guaranteed.map(p => {
      return this._createPlatform(p.x, p.y, p.w);
    });

    const extra = Phaser.Math.Between(1, 2);
    for (let i = 0; i < extra; i++) {
      const y = yTop + Phaser.Math.Between(45, 320);
      const w = Phaser.Math.Between(180, 450);
      const halfW = Math.floor(w / 2);
      const x = Phaser.Math.Between(Math.max(margin, halfW), Math.min(worldWidth - margin, worldWidth - halfW));
      const plat = this._createPlatform(x, y, w);
      platforms.push(plat);
    }

    const enemies = [];
    if (enemyFactory && chunkIndex !== 0) {
      const count = Phaser.Math.Between(1, 3);
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(margin, worldWidth - margin);
        const y = yTop + 50;
        const e = enemyFactory(x, y);
        if (e) enemies.push(e);
      }
    }

    const pickups = [];
    if (pickupFactory && chunkIndex !== 0 && platforms.length > 0 && Phaser.Math.Between(0, 3) === 0) {
      const platform = platforms[Phaser.Math.Between(0, platforms.length - 1)];
      const x = Phaser.Math.Clamp(
        platform.x + Phaser.Math.Between(-Math.floor(platform.displayWidth * 0.3), Math.floor(platform.displayWidth * 0.3)),
        margin,
        worldWidth - margin
      );
      const y = platform.y - 18;
      const pickup = pickupFactory(x, y);
      if (pickup) pickups.push(pickup);
    }

    this.chunks.set(chunkIndex, { platforms, enemies, pickups });
  }

  _createPlatform(x, y, width) {
    const plat = this.platformGroup.create(x, y, 'platform');
    plat.isOneWayPlatform = true;
    plat.setDisplaySize(width, 20).refreshBody();
    return plat;
  }

  removeChunk(chunkIndex) {
    const chunk = this.chunks.get(chunkIndex);
    if (!chunk) return;
    chunk.platforms.forEach(p => p.destroy());
    chunk.enemies.forEach(e => { if (e.active) e.destroy(); });
    (chunk.pickups || []).forEach(p => { if (p.active) p.destroy(); });
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
