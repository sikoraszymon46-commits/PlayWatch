let points2D = 0;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, cursors, bullets, lastFired = 0, enemies;

function preload(){
    this.load.image('player','https://i.imgur.com/TqjQxH3.png'); // przyklad gracza
    this.load.image('bullet','https://i.imgur.com/3RkzQpV.png');
    this.load.image('enemy','https://i.imgur.com/0Zl4I1k.png');
}

function create(){
    player = this.physics.add.sprite(400,550,'player');
    player.setCollideWorldBounds(true);

    bullets = this.physics.add.group();
    enemies = this.physics.add.group();
    
    for(let i=0;i<5;i++){
        let e = enemies.create(100 + i*120, 50, 'enemy');
        e.setVelocity(Phaser.Math.Between(-50,50), Phaser.Math.Between(20,50));
        e.setBounce(1,1);
        e.setCollideWorldBounds(true);
    }

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', ()=>{shoot(this)});

    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
}

function update(){
    if(cursors.left.isDown) player.x -= 5;
    if(cursors.right.isDown) player.x += 5;
    if(cursors.up.isDown) player.y -= 5;
    if(cursors.down.isDown) player.y += 5;
}

function shoot(scene){
    let bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-300);
}

function hitEnemy(bullet, enemy){
    bullet.destroy();
    enemy.x = Phaser.Math.Between(50,750);
    enemy.y = Phaser.Math.Between(50,150);
    points2D += 10;
    addPoints(10);
    document.getElementById('points2D').textContent = points2D;
}
