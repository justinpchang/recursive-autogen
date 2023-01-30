import Phaser from "phaser";

import PreloaderScene from "./scenes/PreloaderScene";
import InitialScene from "./scenes/InitialScene";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [PreloaderScene, InitialScene, GameScene],
  backgroundColor: "#21213B",
};

export default new Phaser.Game(config);
