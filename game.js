var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 550 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
const pipeWidth = 52;
var game = new Phaser.Game(config);
var isPaused = false,
    gameOver = false;
var score = 0;
var birdyX = 200;
function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    // this.load.image('star', 'assets/star.png');
    this.load.image('pipeb', 'assets/pipeb.png');
    this.load.image('pipet', 'assets/pipet.png');
    this.load.spritesheet('birdy', 
        'assets/birdy.png',
        { frameWidth: 34, frameHeight: 24 }
    );

    this.load.audio('flap', './assets/sounds/sfx_wing.ogg');
    this.load.audio('hit', './assets/sounds/sfx_hit.ogg');
    this.load.audio('die', './assets/sounds/sfx_die.ogg');
    this.load.audio('score', './assets/sounds/sfx_point.ogg');
}
var platforms,spacebar,player,scoreText;
var gap = 150;
var music;
function create ()
{
    this.add.image(400, 300, 'sky');
//    this.add.image(400, 300, 'star');
    // this.physics.world.setBoundsCollision(true, true, true, false);

    //Add score text
    scoreText = this.add.text(birdyX, 100,score,{ fontFamily: '"04b19"', fontSize: 60, color: '#fff' });
    
    platforms = this.physics.add.staticGroup();
    // bottom placable at 260+gap to height
    let pos = getRandom();
    platforms.create(game.canvas.width*1.5, pos[0], 'pipeb').setScale(1).refreshBody();
    platforms.create(game.canvas.width*1.5, pos[1], 'pipet').setScale(1).refreshBody();
    pos = getRandom();
    platforms.create(game.canvas.width*2, pos[0], 'pipeb').setScale(1).refreshBody();
    platforms.create(game.canvas.width*2, pos[1], 'pipet').setScale(1).refreshBody();

    player = this.physics.add.sprite(birdyX, 450, 'birdy');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'flap',
        frames: this.anims.generateFrameNumbers('birdy', { start: 0, end: 3 }),
        frameRate: 20,
        repeat: 0
    });

    player.body.setGravityY(300)



    this.physics.add.collider(player, platforms, playerHit, null, game)


    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // spacebar.onDown.add(flapNow, this);
    this.input.keyboard.on('keydown-' + 'SPACE', flapNow);
    this.input.on('pointerdown', flapNow); //touch support

    //  Stop the following keys from propagating up to the browser
    // this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACE ]);

}

function getRandom() {
    let safePadding = 25;
    let min = Math.ceil(safePadding+gap/2);
    let max = Math.floor(game.canvas.height-safePadding-gap/2);
    let ran =  Math.floor(Math.random() * (max - min + 1)) + min;
    let rantop = ran-((gap/2)+260);
    let ranbot = ran+((gap/2)+260);
    console.log(ranbot,rantop)
    return [ranbot, rantop]
}

var countpipe = 0;
function update ()
{
    // if(spacebar.isDown) {
        // console.log("pressed space")
    // }
    //platforms.setAll('body.velocity.x', -100);
    let children = platforms.getChildren();
    children.forEach((child) => {
        if (child instanceof Phaser.GameObjects.Sprite) {
            child.refreshBody();
            child.x += -3;
            if(child.x <= -50) {
                countpipe+=1;
                console.log("Destroyed one "+countpipe)
                child.destroy();

                if(countpipe>=2) {
                    pos = getRandom();
                    console.log("created one")
                    platforms.create(game.canvas.width+50, pos[0], 'pipeb').setScale(1).refreshBody();
                    platforms.create(game.canvas.width+50, pos[1], 'pipet').setScale(1).refreshBody();
                    countpipe=0;
                }

                // child.x = game.canvas.width+pipeWidth;
                // child.y = getRandom()[0];
            }

            //check if pipe passed bird (birdyX)
            // if(child.texture.key=="pipeb"){
            //     console.log("x: ",child.x)
            // }
            if(child.x< birdyX && !gameOver && child.texture.key=="pipeb" && !child.scored){ //only check one pipe
                child.scored = true
                score+=1;
                scoreText.setText(score)
                game.sound.play("score");
                console.log("score:",score);
            }
        }
    });
    //set lower Bounds
    // console.log("y= ",player.y)
    if(player.y > Number(game.canvas.height)+200) {
        console.log("y= ",player.y)
        endGame();
    }
    //set upper Bounds
    if(player.y < -200) {
        console.log("y= ",player.y)
        endGame();
    }
}

function flapNow(){
    if(gameOver) return;
    // console.log("flap")
    player.setVelocityY(-330);
    game.sound.play("flap");
}
var hitflag = false;
function playerHit() {
    if(hitflag) return
    console.log("Player hit!!!!!!!!!")
    var hitSound = game.sound.play("hit");
    hitflag=true;
    setTimeout(playerDead, 200)
}

function playerDead() {
    console.log("Player dead!!!!!!!!!")
    game.sound.play("die");
    player.setCollideWorldBounds(false);
    gameOver =  true;
}


function endGame() {
    gameOver= true;
    game.scene.pause("default")
    console.log("game paused")
    player.y =450
}
