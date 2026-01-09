let points3D = 0;
const container = document.getElementById('fps3d-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

camera.position.y = 2;
camera.position.z = 5;

const floorGeometry = new THREE.PlaneGeometry(20,20);
const floorMaterial = new THREE.MeshBasicMaterial({color:0x228B22});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

const enemyGeometry = new THREE.BoxGeometry(1,1,1);
const enemyMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0,0.5,-5);
scene.add(enemy);

let bullets = [];

document.addEventListener("keydown", e=>{
    if(e.key==="w") camera.position.z -= 0.5;
    if(e.key==="s") camera.position.z += 0.5;
    if(e.key==="a") camera.position.x -= 0.5;
    if(e.key==="d") camera.position.x += 0.5;
    if(e.key===" ") bullets.push({x:camera.position.x, y:0.5, z:camera.position.z, target:enemy});
});

function animate(){
    requestAnimationFrame(animate);

    bullets.forEach((b,i)=>{
        let dx = b.target.position.x - b.x;
        let dz = b.target.position.z - b.z;
        b.x += dx*0.1;
        b.z += dz*0.1;

        if(Math.abs(b.x - b.target.position.x)<0.5 && Math.abs(b.z - b.target.position.z)<0.5){
            points3D += 10;
            addPoints(10);
            b.target.position.set(Math.random()*10-5,0.5,Math.random()*-10);
            bullets.splice(i,1);
        }
    });

    renderer.render(scene, camera);
}
animate();
