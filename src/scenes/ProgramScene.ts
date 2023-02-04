import Phaser from "phaser";

const UNIT_LENGTH = 40;
const MARGIN = 5;
const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 50;

export default class ProgramScene extends Phaser.Scene {
  private container!: Phaser.GameObjects.Container;
  private points: Phaser.Geom.Point[];
  private closestPointIndex!: number;
  private programBounds!: Phaser.Geom.Rectangle;
  private instructions: Phaser.GameObjects.Image[];

  constructor() {
    super("program");

    this.points = [];
    this.instructions = [];
  }

  updatePoints() {
    // Place points on each existing instruction and then one after that
    this.points = [];
    for (let i = 0; i < this.instructions.length + 1; i++) {
      this.points.push(
        new Phaser.Geom.Point(
          this.container.x + MARGIN + UNIT_LENGTH / 2 + (MARGIN + UNIT_LENGTH) * i,
          this.container.y + 75
        )
      );
    }
  }

  showPoints() {
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (i === this.closestPointIndex) {
        this.add.rectangle(point.x, point.y, 5, 5, 0xffff00);
      } else {
        this.add.rectangle(point.x, point.y, 5, 5, 0x00ffff);
      }
    }
  }

  updateClosestPointIndex(x: number, y: number): void {
    let origin = new Phaser.Geom.Point(x, y);
    let closestPointIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      let distance = Phaser.Math.Distance.BetweenPoints(point, origin);
      if (distance < minDistance) {
        minDistance = distance;
        closestPointIndex = i;
      }
    }
    this.closestPointIndex = closestPointIndex;
  }

  addControl(x: number, y: number, texture: string, interactive = true): Phaser.GameObjects.Image {
    const control = this.add.image(x, y, texture).setDisplaySize(UNIT_LENGTH, UNIT_LENGTH);
    this.container.add(control);

    if (interactive) {
      control.setInteractive();
      this.input.setDraggable(control);
    }

    return control;
  }

  create(): void {
    this.container = this.add.container(50, 450);

    // Add control bank row
    const bankBg = this.add
      .rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x3e4652)
      .setOrigin(0);
    this.container.add(bankBg);

    // Add blue program row
    const blueProgramRow = this.add
      .rectangle(0, CONTAINER_HEIGHT, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x2c589c)
      .setOrigin(0);
    this.container.add(blueProgramRow);

    // Add program bounds
    this.programBounds = new Phaser.Geom.Rectangle(
      this.container.x + CONTAINER_WIDTH / 2,
      this.container.y + CONTAINER_HEIGHT + CONTAINER_HEIGHT / 2,
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT
    );

    // Add controls
    this.addControl(MARGIN * 1 + (UNIT_LENGTH * 1) / 2, MARGIN + UNIT_LENGTH / 2, "rotate_ccw");
    this.addControl(MARGIN * 2 + (UNIT_LENGTH * 3) / 2, MARGIN + UNIT_LENGTH / 2, "forward");
    this.addControl(MARGIN * 3 + (UNIT_LENGTH * 5) / 2, MARGIN + UNIT_LENGTH / 2, "rotate_cw");

    // Set up drag and drop
    this.input.topOnly = true;

    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        this.addControl(gameObject.x, gameObject.y, gameObject.texture as unknown as string);
      }
    );
    this.input.on(
      Phaser.Input.Events.DRAG,
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number
      ) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
        this.updateClosestPointIndex(dragX + this.container.x, dragY + this.container.y);
      }
    );
    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        if (
          Phaser.Geom.Rectangle.Contains(
            this.programBounds,
            gameObject.x + this.container.x + CONTAINER_WIDTH / 2,
            gameObject.y + this.container.y + MARGIN + UNIT_LENGTH / 2
          )
        ) {
          this.tweens.add({
            targets: gameObject,
            duration: 100,
            ease: "Sine.easeInOut",
            x: this.points[this.closestPointIndex].x - this.container.x,
            y: this.points[this.closestPointIndex].y - this.container.y,
          });

          // Move existing instructions around
          for (let i = this.closestPointIndex; i < this.instructions.length; i++) {
            this.tweens.add({
              targets: this.instructions[i],
              duration: 100,
              ease: "Sine.easeInOut",
              x: this.instructions[i].x + MARGIN + UNIT_LENGTH,
            });
          }

          // Add new instruction
          this.instructions = [
            ...this.instructions.slice(0, this.closestPointIndex),
            gameObject,
            ...this.instructions.slice(this.closestPointIndex),
          ];
        } else {
          gameObject.destroy();
        }
      }
    );
  }

  update(): void {
    this.updatePoints();
    this.showPoints();
  }
}
