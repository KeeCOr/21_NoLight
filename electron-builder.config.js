module.exports = {
  appId: 'com.21nl.game',
  productName: 'InkWarrior',
  directories: {
    output: 'release',
  },
  files: [
    'main.js',
    'preload.js',
    'index.html',
    'src/**/*',
    'assets/**/*',
    'steam_appid.txt',
    'node_modules/phaser/dist/phaser.min.js',
  ],
  win: {
    target: 'portable',
    signAndEditExecutable: false,
  },
  portable: {
    artifactName: 'InkWarrior_v${version}_portable.exe',
  },
};
