// --- Punkty ---
let totalPoints = 0;
function addPoints(n){ totalPoints+=n; document.getElementById("totalPoints").innerText = totalPoints; }

// --- GRA 1: Zagadki ---
const zagadki = [
  {q:"Co zawsze rośnie, ale nigdy nie spada?",a:"wiek"},
  {q:"Co ma klucze, ale nie może otworzyć drzwi?",a:"pianino"},
  {q:"Co można złamać, ale nie można dotknąć?",a:"obietnica"},
  {q:"Co ma wiele twarzy, ale nie ma oczu?",a:"moneta"},
  {q:"Co jest twoje, a inni używają częściej niż ty?",a:"imię"}
];
function losujZagadke(){
  const idx = Math.floor(Math.random()*zagadki.length);
  document.getElementById("riddleText").innerText = zagadki[idx].q;
  document.getElementById("riddleText").dataset.answer = zagadki[idx].a.toLowerCase();
  document.getElementById("riddleAnswer").value="";
  document.getElementById("riddleResult").innerText="";
}
function sprawdzZagadke(){
  const answer = document.getElementById("riddleAnswer").value.toLowerCase();
  const correct = document.getElementById("riddleText").dataset.answer;
  if(answer===correct){ document.getElementById("riddleResult").innerText="✅ Poprawnie!"; addPoints(5);}
  else{ document.getElementById("riddleResult").innerText="❌ Spróbuj ponownie.";}
}
losujZagadke();

// --- GRA 2: Klikacz ---
let clicks=0;
function klik(){ clicks++; addPoints(1); document.getElementById("clicks").innerText=clicks;}

// --- GRA 3: Losowa liczba ---
function losuj(){ const num=Math.floor(Math.random()*100)+1; document.getElementById("number").innerText=num; addPoints(1);}

// --- GRA 4: Szybkie kliknięcia ---
let fastClicks=0;
const fastBtn=document.getElementById("fastClickBtn");
fastBtn.addEventListener("click",()=>{
  fastClicks++;
  document.getElementById("fastClicks").innerText=fastClicks;
  if(fastClicks<=5)addPoints(1);
});

// --- GRA 5: Losowa karta ---
function losujKarte(){ const karty=["♥","♦","♣","♠"]; const karta=karty[Math.floor(Math.random()*karty.length)]; document.getElementById("card").innerText=karta; addPoints(1);}

// --- GRA 6: Odgadnij liczbę ---
function sprawdzLiczbe(){
  const guess=parseInt(document.getElementById("guessNumber").value);
  const number=Math.floor(Math.random()*10)+1;
  if(guess===number){document.getElementById("guessResult").innerText="✅ Trafiłeś!"; addPoints(5);}
  else{document.getElementById("guessResult").innerText="❌ Nie trafiłeś, liczba to "+number;}
}

// --- GRA 7: Strzelanka 2D ---
const canvas=document.getElementById("shootGame");
const ctx=canvas.getContext("2d");
let bots2D=[];
let hits2D=0;
function spawnBot2D(){ bots2D.push({x:Math.random()*(canvas.width-20),y:Math.random()*(canvas.height-20),size:20}); }
for(let i=0;i<5;i++) spawnBot2D();
function drawBots2D(){ ctx.clearRect(0,0,canvas.width,canvas.height); bots2D.forEach(b=>{ctx.fillStyle="red"; ctx.fillRect(b.x,b.y,b.size,b.size);});}
canvas.addEventListener("click",function(e){
  const rect=canvas.getBoundingClientRect(); const mx=e.clientX-rect.left; const my=e.clientY-rect.top;
  for(let i=0;i<bots2D.length;i++){
    const b=bots2D[i];
    if(mx>=b.x && mx<=b.x+b.size && my>=b.y && my<=b.y+b.size){
      bots2D.splice(i,1); hits2D++; addPoints(5); document.getElementById("shootHits").innerText=hits2D; spawnBot2D(); break;
    }
  }
});
function animate2D(){ drawBots2D(); requestAnimationFrame(animate2D);}
animate2D();

// --- GRA 8: FPS 3D ---
let fpsHits=0; document.getElementById("fpsHits").innerText=fpsHits;
let scene=new THREE.Scene();
let camera=new THREE.PerspectiveCamera(75,600/400,0.1,1000);
let renderer=new THREE.WebGLRenderer();
renderer.setSize(600,400);
document.getElementById("fps3d").appendChild(renderer.domElement);
camera.position.y=2; camera.position.z=5;

// podłoga
let floorGeo=new THREE.BoxGeometry(20,0.1,20);
let floorMat=new THREE.MeshBasicMaterial({color:0x808080});
let floor=new THREE.Mesh(floorGeo,floorMat);
scene.add(floor);

// boty
let bots3D=[];
function spawnBot3D(x,z){
  let botGeo=new THREE.BoxGeometry(1,1,1);
  let botMat=new THREE.MeshBasicMaterial({color:0xff0000});
  let bot=new THREE.Mesh(botGeo,botMat);
  bot.position.set(x,0.5,z);
  scene.add(bot);
  bots3D.push(bot);
}
for(let i=0;i<3;i++) spawnBot3D(Math.random()*10-5,Math.random()*10-5);

// ruch gracza
let move={forward:false,back:false,left:false,right:false};
document.addEventListener('keydown',e=>{
  if(e.code==='KeyW') move.forward=true;
  if(e.code==='KeyS') move.back=true;
  if(e.code==='KeyA') move.left=true;
  if(e.code==='KeyD') move.right=true;
});
document.addEventListener('keyup',e=>{
  if(e.code==='KeyW') move.forward=false;
  if(e.code==='KeyS') move.back=false;
  if(e.code==='KeyA') move.left=false;
  if(e.code==='KeyD') move.right=false;
});

// strzały
renderer.domElement.addEventListener('click',e=>{
  let mouse=new THREE.Vector2(0,0);
  let raycaster=new THREE.Raycaster();
  raycaster.setFromCamera(mouse,camera);
  let intersects=raycaster.intersectObjects(bots3D);
  if(intersects.length>0){
    let bot=intersects[0].object;
    scene.remove(bot);
    bots3D.splice(bots3D.indexOf(bot),1);
    fpsHits++; addPoints(10);
    document.getElementById("fpsHits").innerText=fpsHits;
    spawnBot3D(Math.random()*10-5,Math.random()*10-5);
  }
});

function animateFPS(){ 
  requestAnimationFrame(animateFPS);
  if(move.forward) camera.position.z-=0.1;
  if(move.back) camera.position.z+=0.1;
  if(move.left) camera.position.x-=0.1;
  if(move.right) camera.position.x+=0.1;
  renderer.render(scene,camera);
}
animateFPS();
