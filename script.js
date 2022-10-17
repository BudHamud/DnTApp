let actual = document.getElementById("actual");
let cardContainer = document.getElementById("cardContainer");
let getData = document.getElementById("getData");
let actualLemon = document.getElementById("actualLemon");
let actualStatus = document.getElementById("status");
let cond = 0;
let ecology = 0;
let peace = 0;
let healthcare = 0;
let prosperity = 0;
let busquedaActual;
let currentRun = [];
let gameSet = [];
let people = [];
let borrar = true;
let modalOpen = false;
let menor = 0;
let mayor = 0;

getStatus();

fetch("api.json")
  .then((resp) => resp.json())
  .then((data) => {
    people = data.map((e) => {
      const cardBody = document.createElement("div");
      cardBody.className = "peopleCard";
      cardBody.innerHTML = `<a href="#" onclick="ingresarBusqueda('${e.name}')">${e.name}</a>`;
      cardContainer.append(cardBody);
      return e.name;
    });
  });

function getStatus() {
  getStorage();
  getLemon();
  actual.innerHTML = `<ul>
      <li><img src="img/ecology.jpg"> Ecology: ${ecology}</li>
      <li><img src="img/peace.jpg"> Peace: ${peace}</li>
      <li><img src="img/healthcare.jpg">Healthcare: ${healthcare}</li>
      <li><img src="img/prosperity.jpg">Prosperity: ${prosperity}</li>
      </ul>
      <button class="change" onclick="changeStatus()"><i class="fa-solid fa-gear"></i></button>
      <button class="reset" onclick="clearStatus()"><i class="fa-solid fa-rotate-left"></i></button>`;
}

function getStorage() {
  ecology = Number(localStorage.getItem("ecology"));
  peace = Number(localStorage.getItem("peace"));
  healthcare = Number(localStorage.getItem("healthcare"));
  prosperity = Number(localStorage.getItem("prosperity"));
}

function updateStatus() {
  localStorage.setItem("ecology", ecology);
  localStorage.setItem("peace", peace);
  localStorage.setItem("healthcare", healthcare);
  localStorage.setItem("prosperity", prosperity);
  getStorage();
  console.log(
    "Ecology: " + ecology + " //",
    "Peace: " + peace + " //",
    "Healthcare: " + healthcare + " //",
    "Prosperity: " + prosperity
  );
}

function clearStatus() {
  ecology = 0;
  peace = 0;
  healthcare = 0;
  prosperity = 0;
  updateStatus();
  getStatus();
}

function changeStatus() {
  const div = document.createElement("div");
  div.innerHTML = `<p>Ecology</p>
    <input id="ecoSet" type="number">
    <p>Peace</p>
    <input id="peaSet" type="number">
    <p>Healthcare</p>
    <input id="helSet" type="number">
    <p>Prosperity</p>
    <input id="proSet" type="number">
    <div class="btns">
    <button onclick="clickSet()">Set</button>
    <button onclick="clickClose()">Close</button>
    </div>`;
  div.className = "changeStatus";
  actual.appendChild(div);
}

function getCard(e, num) {
  cardContainer.innerHTML = `<a href="#" class="volver" onclick="volver()"><i class="fa-solid fa-arrow-left"></i></a> <h3>${e[num].name}</h3>
    <div class="info">
    <div class="cardInfo spare">
    <h4>Spare</h4>
    <ul>
    <li><img src="img/ecology.jpg"> Ecology: ${e[num].spare_ecology}</li>
    <li><img src="img/peace.jpg"> Peace: ${e[num].spare_peace}</li>
    <li><img src="img/healthcare.jpg"> Healthcare: ${e[num].spare_healthcare}</li>
    <li><img src="img/prosperity.jpg"> Prosperity: ${e[num].spare_prosperity}</li>
    </ul>
    <a href="#" onclick="live()"><img src="img/live.png"></a>
    </div>
    <div class="cardInfo death">
    <h4>Death</h4>
    <ul>
    <li><img src="img/ecology.jpg"> Ecology: ${e[num].death_ecology}</li>
    <li><img src="img/peace.jpg"> Peace: ${e[num].death_peace}</li>
    <li><img src="img/healthcare.jpg"> Healthcare: ${e[num].death_healthcare}</li>
    <li><img src="img/prosperity.jpg"> Prosperity: ${e[num].death_prosperity}</li>
    </ul>
    <a href="#" onclick="die()"><img src="img/die.png"></a>
    </div>`;
}

function die() {
  cond = 1;
  fech(busquedaActual);
}

function death(e, num) {
  ecology += e[num].death_ecology;
  peace += e[num].death_peace;
  healthcare += e[num].death_healthcare;
  prosperity += e[num].death_prosperity;
  peopleData.push(people[busquedaActual] + "💀");
  updateStatus();
}

function live() {
  cond = 2;
  fech(busquedaActual);
}

function spare(e, num) {
  ecology += e[num].spare_ecology;
  peace += e[num].spare_peace;
  healthcare += e[num].spare_healthcare;
  prosperity += e[num].spare_prosperity;
  peopleData.push(people[busquedaActual] + "😀");
  updateStatus();
}

function getLemon() {
  if (cond == 0) {
    actualLemon.innerHTML = "Current: " + people[busquedaActual];
    actualStatus.innerHTML = "";
  }
  if (cond === 1) {
    actualLemon.innerHTML = "Last: " + people[busquedaActual];
    actualStatus.innerHTML = "💀";
  }
  if (cond == 2) {
    actualLemon.innerHTML = "Last: " + people[busquedaActual];
    actualStatus.innerHTML = "😀";
  }
}

function getPersonas() {
  fetch("api.json")
    .then((resp) => resp.json())
    .then((data) => {
      people = data.map((e) => {
        const cardBody = document.createElement("div");
        cardBody.className = "peopleCard";
        cardBody.innerHTML = `<a href="#" onclick="ingresarBusqueda('${e.name}')">${e.name}</a>`;
        cardContainer.append(cardBody);
        return e.name;
      });
    });
}

function volver() {
  cardContainer.innerHTML = "";
  getPersonas();
}

getData.addEventListener("input", (e) => {
  const value = e.target.value;
  for (let i = 0; i < people.length; i++) {
    if (people[i].includes(value)) {
      getDatos(people[i]);
    }
    if (borrar === true) {
      cardContainer.innerHTML = "Isn't here";
    }
  }
  borrar = true;
});

function getDatos(e) {
  if (borrar === true) {
    cardContainer.innerHTML = "";
    borrar = false;
  }
  const cardBody = document.createElement("div");
  cardBody.className = "peopleCard";
  cardBody.innerHTML = `<a href="#" onclick="ingresarBusqueda('${e}')">${e}</a>`;
  cardContainer.append(cardBody);
}

function buscar() {
  cond = 0;
  fech(people.indexOf(getData.value));
  busquedaActual = people.indexOf(getData.value);
  getLemon();
  getData.value = "";
}

function ingresarBusqueda(e) {
  fech(people.indexOf(e));
  busquedaActual = people.indexOf(e);
  cond = 0;
  getData.value = "";
}

function clickSet() {
  ecology += Number(document.getElementById("ecoSet").value);
  peace += Number(document.getElementById("peaSet").value);
  healthcare += Number(document.getElementById("helSet").value);
  prosperity += Number(document.getElementById("proSet").value);
  updateStatus();
  getStatus();
}

function clickClose() {
  let div = document.querySelector(".changeStatus");
  div.remove();
}

function fech(num) {
  fetch("api.json")
    .then((resp) => resp.json())
    .then((json) => mostrar(json, num));
}

function mostrar(e, num) {
  if (cond == 1) death(e, num);
  if (cond == 2) spare(e, num);
  getStatus();
  getCard(e, num);
}

function updateSet() {
  return (gameSet = [ecology, peace, healthcare, prosperity]);
}

function getFinal(e) {
  mayor = e[0];
  menor = e[0];
  for (let i = 0; i < e.length; i++) {
    if (e[i] > mayor) {
      mayor = e[i];
    }
    if (e[i] < menor) {
      menor = e[i];
    }
  }
  return mayor, menor;
}
