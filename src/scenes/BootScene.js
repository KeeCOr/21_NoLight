class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('electric_char', 'assets/generated/electric-char.png');
    this.load.image('absorber_char', 'assets/generated/absorber-char.png');
    this.load.image('mecha_char', 'assets/generated/mecha-char.png');
    this.load.image('enemy', 'assets/generated/enemy.png');
    this.load.image('pursuer', 'assets/generated/pursuer.png');
    this.load.image('platform', 'assets/generated/platform.png');
    this.load.image('bg_mountain_generated', 'assets/generated/bg-mountain.png');
    this.load.image('ink_wall', 'assets/generated/ink-wall.png');
    this.load.image('brush_slash', 'assets/generated/brush-slash.png');
    this.load.image('ink_splatter', 'assets/generated/ink-splatter.png');
    this.load.image('blood_ink', 'assets/generated/blood-ink.png');
    this.load.image('impact_ink_burst', 'assets/generated/impact-ink-burst.png');
    this.load.image('impact_brush_ring', 'assets/generated/impact-brush-ring.png');
    this.load.image('combo_brush_smear', 'assets/generated/combo-brush-smear.png');
    this.load.image('heavy_hit_flash', 'assets/generated/heavy-hit-flash.png');
    this.load.image('light_shard_top', 'assets/generated/light-shard-top.png');
    this.load.image('light_shard_bottom', 'assets/generated/light-shard-bottom.png');
    this.load.image('absorb_trail', 'assets/generated/absorb-trail.png');
    this.load.image('absorb_aura', 'assets/generated/absorb-aura.png');
    this.load.image('life_orb', 'assets/generated/life-orb.png');
    this.load.image('afterimage_glow', 'assets/generated/smoke-wisp.png');

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
