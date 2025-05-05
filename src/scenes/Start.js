export class Start extends Phaser.Scene {
  cursors;

  constructor() {
    super('Start');
  }

  preload() {
    this.load.image('background', 'assets/galaxy.jpg');
  }

  create() {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);

    this.add.text(400, 300, 'Welcome to Space Stars', {
      fontSize: '32px', fill: '#fff', fontFamily: 'Rubik Bubbles, sans-serif'
    }).setOrigin(0.5, 0.5);

    const startText = this.add.text(400, 400, 'Press SPACE to start', {
      fontSize: '24px', fill: '#fff', fontFamily: 'Rubik Bubbles, sans-serif'
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      onYoyo: () => {
        startText.setFill('#ffff00');
      },
      onRepeat: () => {
        startText.setFill('#ffffff');
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('Play');
    }
  }
}
