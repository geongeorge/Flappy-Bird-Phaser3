var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    this.load.spritesheet('birdy', 
        'assets/birdy.png',
        { frameWidth: 34, frameHeight: 24 }
    );
}

function create ()
{
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');
}

function update ()
{
}