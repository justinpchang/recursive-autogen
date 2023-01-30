import Phaser from "phaser";

const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

enum Instruction {
  Forward,
  RotateCW,
  RotateCCW,
}

const INSTRUCTIONS: Instruction[] = [
  Instruction.Forward,
  Instruction.RotateCW,
  Instruction.Forward,
  Instruction.RotateCCW,
  Instruction.Forward,
];

const UNIT_LENGTH = 40;
const X_OFFSET = 100;
const Y_OFFSET = 100;
const DURATION = 1000;
const EASE = "Sine.easeInOut";

export default class GameScene extends Phaser.Scene {
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.GameObjects.Triangle;

  constructor() {
    super("game");
  }

  drawTile(row: number, col: number, color?: number): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(
      X_OFFSET + col * UNIT_LENGTH,
      Y_OFFSET + row * UNIT_LENGTH,
      UNIT_LENGTH,
      UNIT_LENGTH,
      color
    );
  }

  drawFloor(row: number, col: number): Phaser.GameObjects.Rectangle {
    return this.drawTile(row, col).setStrokeStyle(1, 0xffffff).setAlpha(0.1);
  }

  addTween(index: number, target: object): void {
    this.tweens.add({
      targets: this.player,
      duration: DURATION,
      ease: EASE,
      onComplete: () => this.startInstruction(index + 1),
      ...target,
    });
  }

  startInstruction(index: number): void {
    if (index >= INSTRUCTIONS.length) {
      return;
    }
    switch (INSTRUCTIONS[index]) {
      case Instruction.Forward:
        const delta = new Phaser.Math.Vector2(UNIT_LENGTH, 0).setAngle(
          Phaser.Math.DegToRad(this.player.angle)
        );
        const target = (<Phaser.Math.Vector2>this.player.body.position).add(delta);
        this.addTween(index, {
          x: target.x + UNIT_LENGTH / 2,
          y: target.y + UNIT_LENGTH / 2,
        });
        break;
      case Instruction.RotateCW:
        this.addTween(index, {
          angle: this.player.angle + 90,
        });
        break;
      case Instruction.RotateCCW:
        this.addTween(index, {
          angle: this.player.angle - 90,
        });
        break;
      default:
        throw `Invalid instruction`;
    }
  }

  create(): void {
    // Draw map
    this.walls = this.physics.add.staticGroup();
    for (let row = 0; row < MAP.length; row += 1) {
      for (let col = 0; col < MAP[row].length; col += 1) {
        const tile = MAP[row][col];
        this.drawFloor(row, col);
        switch (tile) {
          case 0: // floors
            break;
          case 1: // walls
            const wall = this.drawTile(row, col);
            wall.setStrokeStyle(2, 0xffffff);
            this.walls.add(wall);
            break;
          case 2: // player
            this.player = this.add.triangle(
              X_OFFSET + col * UNIT_LENGTH,
              Y_OFFSET + row * UNIT_LENGTH,
              0,
              0,
              0,
              UNIT_LENGTH,
              UNIT_LENGTH,
              UNIT_LENGTH / 2,
              0x6666ff
            );
            this.player.angle = -90;
            this.physics.add.existing(this.player);
            break;
        }
      }
    }

    // Add colliders
    this.physics.add.collider(this.player, this.walls);

    // Start
    this.startInstruction(0);
  }

  update(): void {}
}
