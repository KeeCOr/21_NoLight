(function (root) {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getPlatformSpawnBands(input = {}) {
    const width = Math.max(320, Math.round(input.width || 900));
    const margin = Math.max(60, Math.round(input.margin || Math.floor(width * 0.09)));
    const centerRatio = Number.isFinite(input.centerRatio) ? clamp(input.centerRatio, 0.2, 0.5) : 0.32;
    const centerHalf = Math.round((width * centerRatio) / 2);
    const center = Math.round(width * 0.5);
    const centerLeft = center - centerHalf;
    const centerRight = center + centerHalf;

    return {
      width,
      margin,
      centerLeft,
      centerRight,
      left: { min: margin, max: Math.max(margin, centerLeft) },
      right: { min: Math.min(width - margin, centerRight), max: width - margin },
    };
  }

  function lerp(min, max, roll) {
    if (max <= min) return min;
    return Math.round(min + (max - min) * clamp(Number.isFinite(roll) ? roll : 0.5, 0, 1));
  }

  function bandCenterRange(band, halfWidth) {
    return {
      min: band.min + halfWidth,
      max: Math.max(band.min + halfWidth, band.max - halfWidth),
    };
  }

  function chooseSidePlatformX(input = {}) {
    const width = Math.max(320, Math.round(input.width || 900));
    const platformWidth = Math.max(120, Math.round(input.platformWidth || 240));
    const halfW = Math.floor(platformWidth / 2);
    const bands = getPlatformSpawnBands(input);
    const side = (Number.isFinite(input.sideRoll) ? input.sideRoll : 0) < 0.5 ? 'left' : 'right';
    const preferred = bandCenterRange(bands[side], halfW);
    const fallback = {
      min: Math.min(width - halfW, Math.max(halfW, bands.margin, halfW)),
      max: Math.max(halfW, Math.min(width - bands.margin, width - halfW)),
    };
    const range = preferred.max > preferred.min ? preferred : fallback;
    return lerp(range.min, range.max, input.positionRoll);
  }

  root.getPlatformSpawnBands = getPlatformSpawnBands;
  root.chooseSidePlatformX = chooseSidePlatformX;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getPlatformSpawnBands, chooseSidePlatformX };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
