import Phaser from "phaser";

export default class ProgramScene extends Phaser.Scene {
  private debugRect!: Phaser.GameObjects.Rectangle;
  private points!: Phaser.Geom.Point[];
  private closestPoint!: Phaser.Geom.Point;
  private programBounds!: Phaser.Geom.Rectangle;

  constructor() {
    super("program");
  }

  showPoints() {
    for (const point of this.points) {
      if (this.closestPoint?.x === point.x && this.closestPoint?.y === point.y) {
        this.add.rectangle(point.x, point.y, 5, 5, 0xffff00);
      } else {
        this.add.rectangle(point.x, point.y, 5, 5, 0x00ffff);
      }
    }
  }

  getClosestPoint(x: number, y: number): Phaser.Geom.Point {
    let origin = new Phaser.Geom.Point(x, y);
    let closestPoint = this.points[0];
    let minDistance = Infinity;
    for (const point of this.points) {
      let distance = Phaser.Math.Distance.BetweenPoints(point, origin);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    return closestPoint;
  }

  create(): void {
    this.points = [];

    const container = this.add.container(50, 450);

    // Add control bank row
    const bankBg = this.add.rectangle(0, 0, 500, 50, 0x3e4652).setOrigin(0);
    container.add(bankBg);

    // Add blue program row
    const blueProgramRow = this.add.rectangle(0, 50, 500, 50, 0x2c589c).setOrigin(0);
    container.add(blueProgramRow);

    // Add program bounds
    this.programBounds = new Phaser.Geom.Rectangle(
      container.x + 250,
      container.y + 50 + 25,
      500,
      50
    );

    // Add points
    this.points.push(new Phaser.Geom.Point(container.x + 25, container.y + 75));
    //this.points.push(new Phaser.Geom.Point(container.x + 70, container.y + 75));
    //this.points.push(new Phaser.Geom.Point(container.x + 115, container.y + 75));

    // Add controls
    const rotateCCWBg = this.add.image(25, 25, "rotate_ccw").setDisplaySize(40, 40);
    const rotateCCW = this.add.image(25, 25, "rotate_ccw").setDisplaySize(40, 40).setInteractive();
    this.input.setDraggable(rotateCCW);
    container.add(rotateCCWBg);
    container.add(rotateCCW);
    const forward = this.add.image(70, 25, "forward").setDisplaySize(40, 40);
    container.add(forward);
    const rotateCW = this.add.image(115, 25, "rotate_cw").setDisplaySize(40, 40);
    container.add(rotateCW);

    // Set up drag and drop
    this.showPoints();
    this.debugRect = this.add.rectangle(1000, 1000, 50, 50, 0xff0000, 0.1).setOrigin(0);
    this.input.topOnly = true;
    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        const duplicate = this.add
          .image(gameObject.x, gameObject.y, gameObject.texture)
          .setDisplaySize(40, 40)
          .setInteractive();
        this.input.setDraggable(duplicate);
        container.add(duplicate);
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
        this.closestPoint = this.getClosestPoint(dragX + container.x, dragY + container.y);
        this.showPoints();
      }
    );
    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        // If trying to drop out of bounds, delete
        if (
          Phaser.Geom.Rectangle.Contains(
            this.programBounds,
            gameObject.x + container.x + 250,
            gameObject.y + container.y + 25
          )
        ) {
          this.tweens.add({
            targets: gameObject,
            duration: 100,
            ease: "Sine.easeInOut",
            x: this.closestPoint.x - container.x,
            y: this.closestPoint.y - container.y,
          });
        } else {
          gameObject.destroy();
        }
        this.showPoints();
      }
    );
  }

  update(): void {}
}
