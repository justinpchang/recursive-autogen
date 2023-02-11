import Phaser from "phaser";

export enum GameEvent {
  Play = "PLAY", // ProgramScene -> GameScene
  Stop = "STOP", // ProgramScene -> GameScene
  Finished = "FINISHED", // GameScene -> ProgramScene
}

const eventsCenter = new Phaser.Events.EventEmitter();

export default eventsCenter;
