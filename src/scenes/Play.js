export class Play extends Phaser.Scene {
  player;
  stars;
  bombs;
  platforms;
  cursors;
  score = 0;
  gameOver = false;
  scoreText;
  gameOverText;

  constructor() {
    super('Play');
  }

  preload() {
    this.load.image('sky', 'assets/galaxy.jpg');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('terrain', 'assets/Terrain (16x16).png', { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    this.add.image(400, 300, 'sky').setDisplaySize(800, 600);

    this.platforms = this.physics.add.staticGroup();

    function createPlatform(scene, x, y, width) {
      let platform = scene.add.tileSprite(x, y, width, 32, 'terrain', 1);
      scene.physics.add.existing(platform, true);
      scene.platforms.add(platform);
      return platform;
    }

    createPlatform(this, 400, 568, 800);

    createPlatform(this, 500, 400, 200);
    createPlatform(this, 150, 250, 400);
    createPlatform(this, 750, 220, 200);

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    if (!this.anims.get('left')) {
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!this.anims.get('turn')) {
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
      });
    }

    if (!this.anims.get('right')) {
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      d: Phaser.Input.Keyboard.KeyCodes.D
    });


    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) {
      child.setBounce(Phaser.Math.FloatBetween(0.4, 1));
      child.setVelocity(Phaser.Math.Between(-30, 30), 20);
      child.setCollideWorldBounds(true);
    });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px', fontFamily: 'Rubik Bubbles, sans-serif', fill: '#fff'
    });

    this.gameOverText = this.add.text(400, 300, 'Press SPACE to start over', {
      fontSize: '32px', fontFamily: 'Rubik Bubbles, sans-serif', fill: '#fff'
    }).setOrigin(0.5, 0.5);
    this.gameOverText.setVisible(false);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar.bind(this), null, this);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb.bind(this), null, this);
  }

  update() {
    if (this.gameOver) {
      if (this.cursors.space.isDown) {
        this.physics.resume();
        this.gameOver = false;
        this.gameOverText.setVisible(false);
        this.score = 0;
        this.scoreText.setText('Score: 0');
        this.scene.restart();
      } else {
        return;
      }
    }

    if (this.cursors.left.isDown || this.keys.a.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if ((this.keys.w.isDown || this.cursors.up.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;

    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play('turn');

    this.gameOver = true;
    this.gameOverText.setVisible(true);
  }
}
