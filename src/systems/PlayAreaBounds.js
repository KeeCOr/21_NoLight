(function (root) {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getPlayAreaBounds(input = {}) {
    const width = Math.max(320, Math.round(input.width || 900));
    const requestedMargin = Math.round(input.margin || 120);
    const margin = clamp(requestedMargin, 72, Math.floor(width * 0.36));
    const wallWidth = 72;
    const wallVisualWidth = 96;
    const physicsHeight = Math.max(100000, Math.round(input.physicsHeight || 100000));
    const minX = margin;
    const maxX = width - margin;

    return {
      width,
      margin,
      minX,
      maxX,
      wallWidth,
      wallVisualWidth,
      physicsHeight,
      leftWallX: minX - wallWidth / 2,
      rightWallX: maxX + wallWidth / 2,
      leftVisualX: minX - wallVisualWidth / 2,
      rightVisualX: maxX + wallVisualWidth / 2,
      innerLineLeftX: minX,
      innerLineRightX: maxX,
    };
  }

  root.getPlayAreaBounds = getPlayAreaBounds;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getPlayAreaBounds };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
