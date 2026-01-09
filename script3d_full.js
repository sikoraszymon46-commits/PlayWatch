// -------------------- KONFIGURACJA --------------------
let points3D = 0;
const container = document.getElementById('fps-container');

// SCENA I KAMERA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);
const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
camera.position.set(0,1.6,5);

// RENDERER
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// KONTROLER FPS
const controls = new THREE.PointerLockControls(camera, renderer.domElement);
container.addEventListener('click', ()=>{controls.lock();});

// PODŚWIETLENIE
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// PODŁOGA
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50,50),
    new THREE.MeshStandardMaterial({color:0x228B22})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// -------------------- GRACZ --------------------
const player = {
    height:1.6,
    speed:0.1,
    velocity: new THREE.Vector3(),
    canShoot:true
};

// -------------------- BOTY --------------------
const botMaterial = new THREE.MeshStandardMaterial({color:0xff0000});
const botGeometry = new THREE.BoxGeometry(1,1.6,1);
let bots = [];
for(let i=0;i<5;i++){
    let bot = new THREE.Mesh(botGeometry, botMaterial);
    bot.position.set(Math.random()*20-10,0.8,Math.random()*20-10);
    scene.add(bot);
    bots.push({mesh:bot, alive:true});
}

// -------------------- STRZAŁY --------------------
let bullets = [];

function shootBullet(){
    if(!player.canShoot) return;
    player.canShoot=false;
    setTimeout(()=>{player.canShoot=true},200); // limit strzałów

    const geometry = new THREE.SphereGeometry(0.1,8,8);
    const material = new THREE.MeshBasicMaterial({color:0xffff00});
    const bullet = new THREE.Mesh(geometry, material);
    bullet.position.set(camera.position.x, camera.position.y, camera.position.z);

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    bullet.userData.direction = direction.clone().multiplyScalar(0.5);
    bullets.push(bullet);
    scene.add(bullet);
}

document.addEventListener('click', shootBullet);

// -------------------- RUCH GRACZA --------------------
const keys = {};
document.addEventListener('keydown', e=>keys[e.code]=true);
document.addEventListener('keyup', e=>keys[e.code]=false);

function movePlayer(){
    const direction = new THREE.Vector3();
    if(keys['KeyW']) direction.z -= 1;
    if(keys['KeyS']) direction.z += 1;
    if(keys['KeyA']) direction.x -= 1;
    if(keys['KeyD']) direction.x += 1;

    direction.normalize();
    direction.applyEuler(camera.rotation);
    camera.position.add(direction.multiplyScalar(player.speed));
}

// -------------------- KOLIZJE BULLET -> BOT --------------------
function checkCollisions(){
    bullets.forEach((b,i)=>{
        bots.forEach(bot=>{
            if(bot.alive && b.position.distanceTo(bot.mesh.position)<1){
                scene.remove(bot.mesh);
                bot.alive=false;
                scene.remove(b);
                bullets.splice(i,1);
                points3D += 10;
                document.getElementById('points3D').textContent = points3D;
            }
        });
    });
}

// -------------------- PROSTY AI BOTÓW --------------------
function moveBots(){
    bots.forEach(bot=>{
        if(!bot.alive) return;
        const direction = new THREE.Vector3(
            camera.position.x-bot.mesh.position.x,
            0,
            camera.position.z-bot.mesh.position.z
        );
        direction.normalize();
        bot.mesh.position.add(direction.multiplyScalar(0.02));
    });
}

// -------------------- ANIMACJA --------------------
function animate(){
    requestAnimationFrame(animate);

    movePlayer();
    moveBots();

    bullets.forEach((b,i)=>{
        b.position.add(b.userData.direction);
        if(b.position.length()>100) {
            scene.remove(b);
            bullets.splice(i,1);
        }
    });

    checkCollisions();
    renderer.render(scene,camera);
}
animate();
