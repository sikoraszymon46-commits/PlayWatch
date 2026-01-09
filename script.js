// Globalne punkty
let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;

function addPoints(points){
    totalPoints += points;
    localStorage.setItem('totalPoints', totalPoints);
    document.querySelectorAll('#totalPoints, #points2D, #points3D')
        .forEach(el => el.textContent = totalPoints);
}

// Aktualizacja przy starcie
document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll('#totalPoints, #points2D, #points3D')
        .forEach(el => el.textContent = totalPoints);
});

// Mini gry
let clicks = 0;
function klik() {
  clicks++;
  document.getElementById("clicks").textContent = clicks;
  addPoints(1);
}

function losuj() {
  let liczba = Math.floor(Math.random()*100)+1;
  document.getElementById("number").textContent = liczba;
  addPoints(5);
}

// Zagadki
const zagadki = [
  {q:"Co zawsze rośnie ale nigdy nie spada?", a:"wiek"},
  {q:"Co ma klucze ale nie może otworzyć drzwi?", a:"pianino"},
  {q:"Co można złamać ale nie można dotknąć?", a:"obietnica"},
  {q:"Co ma wiele twarzy ale nie ma oczu?", a:"moneta"},
  {q:"Co jest twoje, a inni używają tego częściej niż ty?", a:"imię"}
];

let obecnaZagadka;
function losujZagadke() {
  obecnaZagadka = zagadki[Math.floor(Math.random()*zagadki.length)];
  document.getElementById("riddleText").textContent = obecnaZagadka.q;
  document.getElementById("riddleAnswer").value = "";
  document.getElementById("riddleResult").textContent = "";
}

function sprawdzZagadke() {
  let odp = document.getElementById("riddleAnswer").value.toLowerCase().trim();
  if(odp === obecnaZagadka.a) {
    document.getElementById("riddleResult").textContent = "Brawo! +10 punktów";
    addPoints(10);
    losujZagadke();
  } else {
    document.getElementById("riddleResult").textContent = "Spróbuj ponownie!";
  }
}

document.addEventListener("DOMContentLoaded", ()=>{losujZagadke()});
