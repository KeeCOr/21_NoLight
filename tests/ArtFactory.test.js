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

describe('ArtFactory', () => {
  test('build creates all gameplay and sumi neon texture keys', () => {
    const scene = makeScene();

    ArtFactory.build(scene);

    expect(scene.keys).toEqual([
      'electric_char',
      'mecha_char',
      'enemy',
      'pursuer',
      'platform',
      'bg_far',
      'bg_mid',
      'bg_fog',
      'bg_scanline',
      'projectile',
      'spark',
      'ink_splatter',
      'blood_ink',
      'brush_slash',
      'afterimage_glow',
      'life_orb',
      'hud_logo_panel',
      'hud_brush_bar',
      'hud_score_box',
      'hud_joystick_ring',
      'hud_skill_button',
      'hud_item_slot',
      'portrait_electric',
      'portrait_mecha',
      'ui_gold_corner',
    ]);
  });

  test('world art uses white background and dark walkable platforms', () => {
    const scene = makeScene();

    ArtFactory._buildWorld(scene);

    const fillColors = scene.calls
      .filter(([name]) => name === 'fillStyle')
      .map(([, args]) => args[0]);
    const lineColors = scene.calls
      .filter(([name]) => name === 'lineStyle')
      .map(([, args]) => args[1]);

    expect(fillColors).toEqual(expect.arrayContaining([0xffffff, 0xf8f7f1, 0x05070b]));
    expect(lineColors).toEqual(expect.arrayContaining([0x51f6ff, 0xff9b3d]));
  });
});
