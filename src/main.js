import { Play } from './scenes/Play.js';
import { Start } from './scenes/Start.js';

const config = {
  type: Phaser.AUTO,
  title: 'Space Stars',
  description: '',
  parent: 'game-container',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  backgroundColor: '#000000',
  pixelArt: false,
  scene: [
    Start,
    Play,
  ],
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH
  // },
}

new Phaser.Game(config);
