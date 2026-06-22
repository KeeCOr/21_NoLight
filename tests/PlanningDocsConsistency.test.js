const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('planning docs implementation status consistency', () => {
  test('current implementation status tracks package version in MD and HTML', () => {
    const version = require('../package.json').version;
    const md = read('docs/21NL_기획서.md');
    const html = read('docs/21NL_기획서.html');

    expect(md).toContain(`## 11. 현재 구현 상태 (v${version})`);
    expect(html).toContain(`<h2>11. 현재 구현 상태 (v${version})</h2>`);
  });

  test('implemented visual asset work is not still listed as future work', () => {
    const md = read('docs/21NL_기획서.md');
    const futureSection = md.split('### 미구현 / 향후 과제')[1].split('---')[0];

    expect(futureSection).not.toContain('실제 아트 에셋');
    expect(futureSection).not.toContain('수묵화 스타일 비주얼');
    expect(md).toContain('생성 아트 에셋과 수묵 액션 피드백');
  });
});
