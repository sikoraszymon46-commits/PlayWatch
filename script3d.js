// --- Podstawowa scena ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 120);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// --- Podłoga ---
const floorGeo = new THREE.PlaneGeometry(50,50);
const floorMat = new THREE.MeshStandardMaterial({color:0x555555});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// --- Światło ---
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,50,50);
scene.add(light);

// --- Kontrola gracza ---
const controls = new THREE.PointerLockControls(camera, document.body);
document.addEventListener('click', ()=> controls.lock());
scene.add(controls.getObject());

// --- Gracz ---
const player = {mesh:null, points:0};
const geometry = new THREE.CapsuleGeometry(0.5, 1.2, 4, 8);
const material = new THREE.MeshStandardMaterial({color:0x00ff00});
player.mesh = new THREE.Mesh(geometry, material);
player.mesh.position.y = 1;
scene.add(player.mesh);

// --- Boty AI ---
const bots = [];
for(let i=0;i<10;i++){
  const botGeo = new THREE.CapsuleGeometry(0.5,1.2,4,8);
  const botMat = new THREE.MeshStandardMaterial({color:0xff0000});
  const bot = new THREE.Mesh(botGeo, botMat);
  bot.position.set(Math.random()*20-10,1,Math.random()*20-10);
  scene.add(bot);
  bots.push(bot);
}

// --- Ruch botów (losowy) ---
function moveBots(){
  bots.forEach(bot=>{
    bot.position.x += (Math.random()-0.5)*0.1;
    bot.position.z += (Math.random()-0.5)*0.1;
  });
}

// --- Strzelanie ---
const bullets = [];
document.addEventListener('mousedown', shoot);
function shoot(){
  const bulletGeo = new THREE.SphereGeometry(0.1,8,8);
  const bulletMat = new THREE.MeshStandardMaterial({color:0xffff00});
  const bullet = new THREE.Mesh(bulletGeo, bulletMat);
  bullet.position.copy(camera.position);
  bullet.direction = new THREE.Vector3();
  camera.getWorldDirection(bullet.direction);
  bullets.push(bullet);
  scene.add(bullet);
}

// --- Aktualizacja punktów ---
function updateHUD(){
  document.getElementById('fpsPoints').innerText = player.points;
}

// --- Animacja ---
function animate(){
  requestAnimationFrame(animate);
  moveBots();

  // Bullets
  bullets.forEach((b,i)=>{
    b.position.addScaledVector(b.direction,0.5);
    // Kolizja z botami
    bots.forEach(bot=>{
      if(b.position.distanceTo(bot.position)<0.7){
        player.points+=10;
        scene.remove(bot);
        bots.splice(bots.indexOf(bot),1);
      }
    });
    if(b.position.length()>100) { scene.remove(b); bullets.splice(i,1); }
  });

  updateHUD();
  renderer.render(scene,camera);
}

animate();

// --- Obsługa resize ---
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / (window.innerHeight-120);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight-120);
});
