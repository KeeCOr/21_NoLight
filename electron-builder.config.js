module.exports = {
  appId: 'com.21nl.game',
  productName: '21NL',
  directories: {
    output: 'release',
  },
  files: [
    'main.js',
    'index.html',
    'src/**/*',
    'assets/**/*',
    'node_modules/phaser/dist/phaser.min.js',
  ],
  win: {
    target: 'portable',
  },
  portable: {
    artifactName: '21NL_v${version}_portable.exe',
  },
};
