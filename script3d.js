// --- Inicjalizacja sceny ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // niebo
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight*0.8, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight*0.8);
document.getElementById("gameContainer").appendChild(renderer.domElement);

// --- Podłoga ---
const floorGeo = new THREE.PlaneGeometry(100,100);
const floorMat = new THREE.MeshStandardMaterial({color:0x555555});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI/2;
floor.receiveShadow = true;
scene.add(floor);

// --- Światło ---
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,100,50);
scene.add(light);

// --- Gracz ---
const player = {
    velocity: new THREE.Vector3(),
    speed: 0.2,
    points: 0,
    mesh: new THREE.Mesh(new THREE.BoxGeometry(1,2,1), new THREE.MeshStandardMaterial({color:0x00ff00}))
};
player.mesh.position.y = 1;
scene.add(player.mesh);

// Kamera i kontrola myszy
const controls = new THREE.PointerLockControls(camera, document.body);
document.addEventListener('click', ()=>{controls.lock();});
camera.position.set(0,1.8,5);

// --- Boty ---
const bots = [];
const botCount = 5;
for(let i=0;i<botCount;i++){
    let bot = new THREE.Mesh(new THREE.BoxGeometry(1,2,1), new THREE.MeshStandardMaterial({color:0xff0000}));
    bot.position.set(Math.random()*20-10,1,Math.random()*20-10);
    scene.add(bot);
    bots.push(bot);
}

// --- Strzały ---
const bullets = [];
function shoot(){
    const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), new THREE.MeshBasicMaterial({color:0xffff00}));
    bullet.position.set(player.mesh.position.x, player.mesh.position.y+1.5, player.mesh.position.z);
    bullet.direction = new THREE.Vector3();
    camera.getWorldDirection(bullet.direction);
    bullets.push(bullet);
    scene.add(bullet);
}
document.addEventListener('mousedown', shoot);

// --- Ruch gracza ---
const keys = {};
document.addEventListener('keydown', (e)=>{keys[e.key.toLowerCase()]=true;});
document.addEventListener('keyup', (e)=>{keys[e.key.toLowerCase()]=false;});

// --- Logika botów ---
function moveBots(){
    bots.forEach(bot=>{
        const dir = player.mesh.position.clone().sub(bot.position).normalize();
        bot.position.add(dir.multiplyScalar(0.02));
    });
}

// --- Kolizje i strzały ---
function updateBullets(){
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
}

// --- Animacja ---
function animate(){
    requestAnimationFrame(animate);

    // ruch gracza
    if(keys['w']) player.mesh.position.z -= player.speed;
    if(keys['s']) player.mesh.position.z += player.speed;
    if(keys['a']) player.mesh.position.x -= player.speed;
    if(keys['d']) player.mesh.position.x += player.speed;

    camera.position.x = player.mesh.position.x;
    camera.position.z = player.mesh.position.z + 5;
    camera.lookAt(player.mesh.position);

    moveBots();
    updateBullets();

    renderer.render(scene,camera);
}
animate();
