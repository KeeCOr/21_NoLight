class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('ui_hp_frame', 'assets/generated/ui-hp-frame.png');
    this.load.image('ui_stamina_frame', 'assets/generated/ui-stamina-frame.png');
    this.load.image('ui_score_frame', 'assets/generated/ui-score-frame.png');
    this.load.image('ui_portrait_frame', 'assets/generated/ui-portrait-frame.png');
    this.load.image('ui_button_frame', 'assets/generated/ui-button-frame.png');
    this.load.image('ui_skill_frame', 'assets/generated/ui-skill-frame.png');
    this.load.image('ui_gold_corner_large', 'assets/generated/ui-gold-corner-large.png');
    this.load.image('ui_medallion', 'assets/generated/ui-medallion.png');
  }

  create() {
    ArtFactory.build(this);
    this.scene.start('MainMenuScene');
  }
}
