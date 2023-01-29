import Phaser from "phaser";

export default class InitialScene extends Phaser.Scene {
  private achoThePup!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies!: Phaser.Physics.Arcade.Group;

  constructor() {
    super("initial");
  }

  create(): void {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 570, "ground").setScale(2).refreshBody();
    this.platforms.create(750, 220, "ground");

    this.achoThePup = this.physics.add.sprite(0, 0, "acho").setScale(0.3);
    this.achoThePup.setBounce(0.2);
    this.achoThePup.setCollideWorldBounds(true);
    this.achoThePup.body.setGravityY(300);
    this.physics.add.collider(this.achoThePup, this.platforms);

    this.enemies = this.physics.add.group({
      key: "acho",
      repeat: 10,
      setXY: { x: 12, y: 0, stepX: 70 },
      setScale: { x: 0.3, y: 0.3 },
    });
    this.enemies.setTint(Math.random() * 0xffffff);
    this.physics.add.collider(this.enemies, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(): void {
    if (this.cursors.left.isDown) {
      this.achoThePup.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.achoThePup.setVelocityX(160);
    } else {
      this.achoThePup.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.achoThePup.body.touching.down) {
      this.achoThePup.setVelocityY(-330);
    }
  }
}
