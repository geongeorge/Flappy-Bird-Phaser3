var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.spritesheet('birdy', 
        'assets/birdy.png',
        { frameWidth: 34, frameHeight: 24 }
    );
}
var platforms,spacebar,player;

function create ()
{
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'pipe').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'birdy');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'flap',
        frames: this.anims.generateFrameNumbers('birdy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });

    player.body.setGravityY(300)

    this.physics.add.collider(player, platforms)


    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // spacebar.onDown.add(flapNow, this);
    this.input.keyboard.on('keydown-' + 'SPACE', flapNow);

    //  Stop the following keys from propagating up to the browser
    // this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACEBAR ]);
}

function update ()
{
    if(spacebar.isDown) {
        console.log("pressed space")
    }
}

function flapNow(){
    console.log("flap")
    player.setVelocityY(-330);
    player.anims.play('flap', true);
}