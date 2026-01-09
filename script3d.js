let points3D = 0;
const container = document.getElementById('fps3d-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
camera.position.set(0,1.6,5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.PointerLockControls(camera, renderer.domElement);
container.addEventListener('click', ()=>{controls.lock()});

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);

// Podłoga
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshStandardMaterial({color:0x228B22}));
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Gracz i bot
const botGeometry = new THREE.BoxGeometry(1,1,1);
const botMaterial = new THREE.MeshStandardMaterial({color:0xff0000});
const bot = new THREE.Mesh(botGeometry, botMaterial);
bot.position.set(0,0.5,-5);
scene.add(bot);

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);

    // Bot AI – prosty ruch
    bot.position.x += Math.sin(Date.now()*0.001)*0.02;
    bot.position.z += Math.cos(Date.now()*0.001)*0.02;
}

animate();
