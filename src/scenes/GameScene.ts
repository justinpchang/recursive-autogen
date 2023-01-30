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

const INSTRUCTIONS: Instruction[] = [Instruction.Forward, Instruction.RotateCW];

interface PlayerState {
  row: number;
  col: number;
  angle: number;
}

const UNIT_LENGTH = 40;
const X_OFFSET = 100;
const Y_OFFSET = 100;
const TOLERANCE = 4;

export default class GameScene extends Phaser.Scene {
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.GameObjects.Triangle;
  private state = {
    instruction: {
      currentIndex: 0,
    },
    player: {
      row: 0,
      col: 0,
      angle: 0,
    },
  };

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

  isCurrentInstructionFinished(): boolean {
    switch (INSTRUCTIONS[this.state.instruction.currentIndex]) {
      case Instruction.Forward:
        const movement = new Phaser.Math.Vector2(0, UNIT_LENGTH).setAngle(this.state.player.angle);
        return (
          this.player.x === this.state.player.col * UNIT_LENGTH + movement.x &&
          this.player.y === this.state.player.row * UNIT_LENGTH + movement.y
        );
      case Instruction.RotateCW:
        return this.player.angle === Phaser.Math.Angle.WrapDegrees(this.state.player.angle + 90);
      case Instruction.RotateCCW:
        return this.player.angle === Phaser.Math.Angle.WrapDegrees(this.state.player.angle - 90);
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
        switch (tile) {
          case 0: // floors
            this.drawFloor(row, col);
            break;
          case 1: // walls
            const wall = this.drawTile(row, col);
            wall.setStrokeStyle(2, 0xffffff);
            this.walls.add(wall);
            break;
          case 2: // player
            this.drawFloor(row, col);
            this.player = this.add.triangle(
              X_OFFSET + col * UNIT_LENGTH,
              Y_OFFSET + row * UNIT_LENGTH,
              0,
              UNIT_LENGTH,
              UNIT_LENGTH,
              UNIT_LENGTH,
              UNIT_LENGTH / 2,
              0,
              0x6666ff
            );
            this.physics.add.existing(this.player);
            this.state.player.row = row;
            this.state.player.col = col;
            this.state.player.angle = this.player.angle;
            break;
        }
      }
    }

    // Add colliders
    this.physics.add.collider(this.player, this.walls);
  }

  update(): void {
    if (this.state.instruction.currentIndex < INSTRUCTIONS.length) {
      switch (INSTRUCTIONS[this.state.instruction.currentIndex]) {
        case Instruction.Forward:
          const delta = new Phaser.Math.Vector2(0, UNIT_LENGTH).setAngle(this.state.player.angle);
          const target = new Phaser.Math.Vector2(
            X_OFFSET + this.state.player.col * UNIT_LENGTH,
            Y_OFFSET + this.state.player.row * UNIT_LENGTH
          ).add(delta);

          const distance = Phaser.Math.Distance.BetweenPoints(this.player, target);
          if (distance < TOLERANCE) {
            (this.player.body as unknown as Phaser.Physics.Arcade.Body).reset(target.x, target.y);
            this.state.instruction.currentIndex += 1;
          } else {
            this.physics.moveTo(this.player, target.x, target.y);
          }
          break;
        case Instruction.RotateCW:
          if (this.player.angle === Phaser.Math.Angle.WrapDegrees(this.state.player.angle + 90)) {
            this.state.instruction.currentIndex += 1;
          } else {
          }
          break;
        case Instruction.RotateCCW:
          if (this.player.angle === Phaser.Math.Angle.WrapDegrees(this.state.player.angle - 90)) {
            this.state.instruction.currentIndex += 1;
          }
          break;
        default:
          throw `Invalid instruction`;
      }
    }
  }
}
