const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('planning docs implementation status consistency', () => {
  test('planning docs track package version in MD and HTML', () => {
    const version = require('../package.json').version;
    const md = read('docs/21NL_기획서.md');
    const html = read('docs/21NL_기획서.html');

    expect(md).toContain(`현재 문서 기준 버전: ${version}`);
    expect(html).toContain('InkWarrior 기획서');
    expect(md).toContain('## 현재 구현 상태');
  });

  test('implemented visual and camera work is documented without stale future-work copy', () => {
    const md = read('docs/21NL_기획서.md');
    const riskSection = md.split('## 남은 리스크와 다음 우선순위')[1].split('## 빌드, 테스트, 릴리스')[0];

    expect(riskSection).not.toContain('실제 아트 에셋');
    expect(riskSection).not.toContain('수묵화 스타일 비주얼');
    expect(md).toContain('CameraImpactProfile 순수 규칙');
    expect(md).toContain('UI 디자이너 후속 작업 목록');
  });
});
