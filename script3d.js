// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
document.getElementById("gameContainer").appendChild(renderer.domElement);

// Podłoga
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Gracz
const player = {
    mesh: new THREE.Mesh(new THREE.BoxGeometry(1,2,1), new THREE.MeshBasicMaterial({color:0x00ff00})),
    speed: 0.2,
    points: 0
};
player.mesh.position.y = 1;
scene.add(player.mesh);
camera.position.set(0,2,5);
camera.lookAt(player.mesh.position);

// Boty
const bots = [];
for(let i=0;i<5;i++){
    let bot = new THREE.Mesh(
        new THREE.BoxGeometry(1,2,1),
        new THREE.MeshBasicMaterial({color:0xff0000})
    );
    bot.position.set(Math.random()*20-10,1,Math.random()*20-10);
    scene.add(bot);
    bots.push(bot);
}

// Sterowanie
const keys = {};
document.addEventListener('keydown', (e)=>{keys[e.key]=true;});
document.addEventListener('keyup', (e)=>{keys[e.key]=false;});

// Strzały
const bullets = [];
function shoot() {
    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1,8,8),
        new THREE.MeshBasicMaterial({color:0xffff00})
    );
    bullet.position.set(player.mesh.position.x, player.mesh.position.y+1, player.mesh.position.z);
    bullet.direction = camera.getWorldDirection(new THREE.Vector3());
    bullets.push(bullet);
    scene.add(bullet);
}
document.addEventListener('click', shoot);

// Aktualizacja
function animate(){
    requestAnimationFrame(animate);

    // Ruch gracza
    if(keys['w']) player.mesh.position.z -= player.speed;
    if(keys['s']) player.mesh.position.z += player.speed;
    if(keys['a']) player.mesh.position.x -= player.speed;
    if(keys['d']) player.mesh.position.x += player.speed;
    camera.position.x = player.mesh.position.x;
    camera.position.z = player.mesh.position.z + 5;
    camera.lookAt(player.mesh.position);

    // Ruch botów (proste AI)
    bots.forEach(bot=>{
        let dir = player.mesh.position.clone().sub(bot.position).normalize();
        bot.position.add(dir.multiplyScalar(0.02));
    });

    // Strzały
    bullets.forEach((b, idx)=>{
        b.position.add(b.direction.clone().multiplyScalar(0.5));
        bots.forEach((bot, bIdx)=>{
            if(b.position.distanceTo(bot.position)<1){
                player.points += 10;
                document.getElementById("fpsPoints").innerText = player.points;
                scene.remove(bot);
                bots.splice(bIdx,1);
                scene.remove(b);
                bullets.splice(idx,1);
            }
        });
    });

    renderer.render(scene,camera);
}

animate();
