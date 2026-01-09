const canvas = document.getElementById('game2D');
const ctx = canvas.getContext('2d');

let player = { x: 400, y: 550, width: 50, height: 50 };
let bullets = [];
let enemies = [];
let points2D = 0;

// Tworzymy wrogów
for(let i=0;i<5;i++){
    enemies.push({x: Math.random()*750, y: Math.random()*100, width:50, height:50});
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle="red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));

    ctx.fillStyle="yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") player.x -= 10;
    if(e.key==="ArrowRight") player.x += 10;
    if(e.key===" ") bullets.push({x:player.x+20, y:player.y, width:10, height:20});
});

function update(){
    bullets.forEach((b, i)=>{
        b.y -= 10;
        enemies.forEach((e,j)=>{
            if(b.x < e.x + e.width && b.x + b.width > e.x &&
               b.y < e.y + e.height && b.y + b.height > e.y){
                enemies.splice(j,1);
                bullets.splice(i,1);
                points2D += 10;
                addPoints(10);
                enemies.push({x: Math.random()*750, y: Math.random()*100, width:50, height:50});
            }
        });
    });
}

function loop(){
    draw();
    update();
    requestAnimationFrame(loop);
}
loop();
