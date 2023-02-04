import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload(): void {
    this.load.image("acho", "assets/acho.png");
    this.load.image("ground", "assets/ground.png");

    // Program controls
    this.load.image("rotate_ccw", "assets/rotate_ccw.png");
    this.load.image("rotate_cw", "assets/rotate_cw.png");
    this.load.image("forward", "assets/forward.png");
    this.load.image("play", "assets/play.png");
    this.load.image("stop", "assets/stop.png");
    this.load.image("x", "assets/x.png");
  }

  create(): void {
    this.scene.start("program");
    this.scene.start("game");
  }
}
