// MapGenerator의 순수 로직 부분만 단위 테스트

function getChunkIndex(y, chunkHeight) {
  return Math.floor(y / chunkHeight);
}

function getChunkBounds(chunkIndex, chunkHeight) {
  return { top: chunkIndex * chunkHeight, bottom: (chunkIndex + 1) * chunkHeight };
}

describe('MapGenerator 청크 인덱스 로직', () => {
  const H = 300;

  test('y=0 → 청크 0', () => expect(getChunkIndex(0, H)).toBe(0));
  test('y=299 → 청크 0', () => expect(getChunkIndex(299, H)).toBe(0));
  test('y=300 → 청크 1', () => expect(getChunkIndex(300, H)).toBe(1));
  test('y=-1 → 청크 -1', () => expect(getChunkIndex(-1, H)).toBe(-1));
  test('y=-300 → 청크 -1', () => expect(getChunkIndex(-300, H)).toBe(-1));
  test('청크 1의 범위: top=300, bottom=600', () => {
    expect(getChunkBounds(1, H)).toEqual({ top: 300, bottom: 600 });
  });
  test('청크 -1의 범위: top=-300, bottom=0', () => {
    expect(getChunkBounds(-1, H)).toEqual({ top: -300, bottom: 0 });
  });
});
