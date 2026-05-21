const fs = require('fs');
const path = require('path');
const ArtFactory = require('../src/systems/ArtFactory.js');

function makeGraphics(calls) {
  const chain = {
    fillStyle: (...args) => { calls.push(['fillStyle', args]); return chain; },
    lineStyle: (...args) => { calls.push(['lineStyle', args]); return chain; },
    fillCircle: (...args) => { calls.push(['fillCircle', args]); return chain; },
    fillRoundedRect: (...args) => { calls.push(['fillRoundedRect', args]); return chain; },
    fillRect: (...args) => { calls.push(['fillRect', args]); return chain; },
    fillGradientStyle: (...args) => { calls.push(['fillGradientStyle', args]); return chain; },
    fillEllipse: (...args) => { calls.push(['fillEllipse', args]); return chain; },
    fillTriangle: (...args) => { calls.push(['fillTriangle', args]); return chain; },
    strokeRoundedRect: (...args) => { calls.push(['strokeRoundedRect', args]); return chain; },
    strokeCircle: (...args) => { calls.push(['strokeCircle', args]); return chain; },
    strokeRect: (...args) => { calls.push(['strokeRect', args]); return chain; },
    beginPath: () => { calls.push(['beginPath', []]); return chain; },
    moveTo: (...args) => { calls.push(['moveTo', args]); return chain; },
    lineTo: (...args) => { calls.push(['lineTo', args]); return chain; },
    closePath: () => { calls.push(['closePath', []]); return chain; },
    strokePath: () => { calls.push(['strokePath', []]); return chain; },
    fillPath: () => { calls.push(['fillPath', []]); return chain; },
    generateTexture: (...args) => { calls.push(['generateTexture', args]); return chain; },
    destroy: () => { calls.push(['destroy', []]); return chain; },
  };
  return chain;
}

function makeScene() {
  const calls = [];
  const keys = [];
  return {
    calls,
    keys,
    textures: { exists: () => false },
    make: {
      graphics: () => makeGraphics(calls),
    },
    recordTexture: (key) => keys.push(key),
  };
}

describe('reference-driven visual upgrade', () => {
  test('ArtFactory creates ink splatter and ornate UI textures inspired by the preview image', () => {
    const scene = makeScene();

    ArtFactory.build(scene);

    expect(scene.keys).toEqual(expect.arrayContaining([
      'ink_splatter',
      'blood_ink',
      'ui_gold_corner',
      'brush_slash',
    ]));
  });

  test('HUD uses warm gold mechanical trim instead of the old cyan-only frame', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'HUD.js'), 'utf8');

    expect(source).toContain('0xb88a3a');
    expect(source).toContain('ui_gold_corner');
    expect(source).toContain('portraitFrame');
  });

  test('GameScene layers ink splatter sprites into hit and slash feedback', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'), 'utf8');

    expect(source).toContain('_inkSplatter');
    expect(source).toContain("'ink_splatter'");
    expect(source).toContain("'blood_ink'");
    expect(source).toContain("'brush_slash'");
  });
});
