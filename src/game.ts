import Phaser from "phaser";

import PreloaderScene from "./scenes/PreloaderScene";
import InitialScene from "./scenes/InitialScene";
import GameScene from "./scenes/GameScene";
import ProgramScene from "./scenes/ProgramScene";

window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    parent: "game",
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
    },
    scene: [PreloaderScene, InitialScene, GameScene, ProgramScene],
    backgroundColor: "#000111",
  };

  const game = new Phaser.Game(config);
});
