import fullScreen from './lib/fullScreen';
import './lib/index.scss'
process.env.NODE_ENV !== 'production' && require('./index.html');

let defaultConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // width: 9 * 64, // 576
    // height: 15 * 64, // 960
    parent: 'app',
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false,
        },
    },
};

let game = new window.Phaser.Game(defaultConfig);
let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let bombs;
let gameOver;
let bgMusic;

function preload() {
    this.load.image('star', require('./img/star.png'));
    this.load.image('ground', require('./img/platform.png'));
    this.load.image('sky', require('./img/sky.png'));
    this.load.spritesheet('dude', require('./img/dude.png'), {
        frameWidth: 32,
        frameHeight: 48,
    });
    this.load.image('bomb', require('./img/bomb.png'));
    this.load.audio('bgMusic', require('./media/Aimer.mp3'));
}

function create() {
    bgMusic = this.sound.add('bgMusic', {
        loop: true,
        delay: 2000
    });
    this.sound.play('bgMusic');
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'turn',
        frames: [{
            key: 'dude',
            frame: 4,
        }],
        frameRate: 20,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {
            x: 12,
            y: 0,
            stepX: 70,
        }
    });
    stars.children.iterate((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate((child) => {
            child.enableBody(true, child.x, 0, true, true);
        });
        createNewBomb();
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xFF0000);
    player.anims.play('turn');
    gameOver = true;
}

function createNewBomb() {
    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    let bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}

fullScreen.init();