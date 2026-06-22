const fs = require('fs');
const path = require('path');

describe('planning docs gameplay preview asset', () => {
  test('MD and HTML planning docs reference an existing gameplay preview image', () => {
    const docsDir = path.join(__dirname, '..', 'docs');
    const md = fs.readFileSync(path.join(docsDir, '21NL_기획서.md'), 'utf8');
    const html = fs.readFileSync(path.join(docsDir, '21NL_기획서.html'), 'utf8');
    const mdMatch = md.match(/!\[[^\]]*\]\(\.\/(.+?\.png)\)/);
    const htmlMatch = html.match(/<img src="\.\/(.+?\.png)"/);

    expect(mdMatch && mdMatch[1]).toBe('21NL_gameplay_preview.png');
    expect(htmlMatch && htmlMatch[1]).toBe('21NL_gameplay_preview.png');
    expect(fs.existsSync(path.join(docsDir, '21NL_gameplay_preview.png'))).toBe(true);
  });
});
