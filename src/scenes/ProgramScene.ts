import Phaser from "phaser";

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
        new Phaser.Geom.Point(this.container.x + 25 + 45 * i, this.container.y + 75)
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

  create(): void {
    this.container = this.add.container(50, 450);

    // Add control bank row
    const bankBg = this.add.rectangle(0, 0, 500, 50, 0x3e4652).setOrigin(0);
    this.container.add(bankBg);

    // Add blue program row
    const blueProgramRow = this.add.rectangle(0, 50, 500, 50, 0x2c589c).setOrigin(0);
    this.container.add(blueProgramRow);

    // Add program bounds
    this.programBounds = new Phaser.Geom.Rectangle(
      this.container.x + 250,
      this.container.y + 50 + 25,
      500,
      50
    );

    // Add controls
    const rotateCCWBg = this.add.image(25, 25, "rotate_ccw").setDisplaySize(40, 40);
    const rotateCCW = this.add.image(25, 25, "rotate_ccw").setDisplaySize(40, 40).setInteractive();
    this.input.setDraggable(rotateCCW);
    this.container.add(rotateCCWBg);
    this.container.add(rotateCCW);
    const forwardBg = this.add.image(70, 25, "forward").setDisplaySize(40, 40);
    const forward = this.add.image(70, 25, "forward").setDisplaySize(40, 40).setInteractive();
    this.input.setDraggable(forward);
    this.container.add(forwardBg);
    this.container.add(forward);
    const rotateCWBg = this.add.image(115, 25, "rotate_cw").setDisplaySize(40, 40);
    const rotateCW = this.add.image(115, 25, "rotate_cw").setDisplaySize(40, 40).setInteractive();
    this.input.setDraggable(rotateCW);
    this.container.add(rotateCWBg);
    this.container.add(rotateCW);

    this.updatePoints();

    // Set up drag and drop
    this.showPoints();
    this.input.topOnly = true;
    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        const duplicate = this.add
          .image(gameObject.x, gameObject.y, gameObject.texture)
          .setDisplaySize(40, 40)
          .setInteractive();
        this.input.setDraggable(duplicate);
        this.container.add(duplicate);
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

        this.showPoints();
      }
    );
    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        if (
          Phaser.Geom.Rectangle.Contains(
            this.programBounds,
            gameObject.x + this.container.x + 250,
            gameObject.y + this.container.y + 25
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
              x: this.instructions[i].x + 45,
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

        this.updatePoints();
        this.showPoints();
      }
    );
  }

  update(): void {}
}
