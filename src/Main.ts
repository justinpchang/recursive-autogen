import Phaser from "phaser";

import PreloaderScene from "./scenes/PreloaderScene";
import InitialScene from "./scenes/InitialScene";
import GameScene from "./scenes/GameScene";
import ProgramScene from "./scenes/ProgramScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [PreloaderScene, InitialScene, GameScene, ProgramScene],
  backgroundColor: "#000111",
};

var game = new Phaser.Game(config);

export default game;
