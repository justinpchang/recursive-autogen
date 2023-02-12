import Phaser from "phaser";

import PreloaderScene from "./scenes/PreloaderScene";
import GameScene from "./scenes/GameScene";
import ProgramScene from "./scenes/ProgramScene";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const MAX_WIDTH = DEFAULT_WIDTH * 1.5;
const MAX_HEIGHT = DEFAULT_HEIGHT * 1.5;
const MAX_SMOOTH_SCALE = 1.15;

window.addEventListener("load", () => {
  const config: Phaser.Types.Core.GameConfig = {
    parent: "game",
    type: Phaser.AUTO,
    backgroundColor: "#000111",
    scale: {
      mode: Phaser.Scale.NONE,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene: [PreloaderScene, GameScene, ProgramScene],
  };

  const game = new Phaser.Game(config);

  const smoothResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scale = Math.min(w / DEFAULT_WIDTH, h / DEFAULT_HEIGHT);
    const newWidth = Math.min(w / scale, MAX_WIDTH);
    const newHeight = Math.min(h / scale, MAX_HEIGHT);

    const windowRatio = w / h;
    const defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    const maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    const maxRatioHeight = MAX_HEIGHT / DEFAULT_WIDTH;

    let smooth: number;
    const normalize = (value: number, min: number, max: number) => {
      return (value - min) / (max - min);
    };

    if (defaultRatio < windowRatio) {
      smooth =
        -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) /
          (1 / (MAX_SMOOTH_SCALE - 1)) +
        MAX_SMOOTH_SCALE;
    } else {
      smooth =
        -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) /
          (1 / (MAX_SMOOTH_SCALE - 1)) +
        MAX_SMOOTH_SCALE;
    }

    game.scale.resize(newWidth * smooth, newHeight * smooth);

    game.canvas.style.width = newWidth * scale + "px";
    game.canvas.style.height = newHeight * scale + "px";

    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
  };

  window.addEventListener("resize", smoothResize);

  smoothResize();
});
