let ecology = localStorage.getItem('ecology')
let peace = localStorage.getItem('peace')
let healthcare = localStorage.getItem('healthcare')
let prosperity = localStorage.getItem('prosperity');
let actual = document.getElementById("actual");
let cardContainer = document.getElementById("cardContainer");
let getData = document.getElementById("getData");
let cond = 0;
let ecologyCont = 0
let peaceCont = 0
let healthcareCont = 0
let prosperityCont = 0
let people = [];
let borrar = true;
let busquedaActual;
let modalOpen = false;

getStatus();

function getStatus() {
  actual.innerHTML = `<ul>
  <li><img src="img/ecology.jpg"> Ecology: ${ecology}</li>
  <li><img src="img/peace.jpg"> Peace: ${peace}</li>
  <li><img src="img/healthcare.jpg">Healthcare: ${healthcare}</li>
  <li><img src="img/prosperity.jpg">Prosperity: ${prosperity}</li>
  </ul>
  <button class="change" onclick="changeStatus()"><i class="fa-solid fa-gear"></i></button>
  <button class="reset" onclick="clearStatus()"><i class="fa-solid fa-rotate-left"></i></button>`;
  
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

function fech(num) {
  fetch("api.json")
    .then((resp) => resp.json())
    .then((json) => mostrar(json, num));
}

function ingresarBusqueda(e) {
  fech(people.indexOf(e));
  busquedaActual = people.indexOf(e);
}

function buscar() {
  fech(people.indexOf(getData.value))
}

function mostrar(e, num) {
  if (cond == 1) death(e, num);
  if (cond == 2) spare(e, num);
  getStatus();
  getCard(e, num);
}

function getCard(e, num) {
  cardContainer.innerHTML = `<a href="#" class="volver" onclick="volver()"><i class="fa-solid fa-arrow-left"></i></a> <h3>${e[num].name}</h3>
  <div class="info">
  <div class="cardInfo death">
  <h4>Death</h4>
  <ul>
  <li><img src="img/ecology.jpg"> Ecology: ${e[num].death_ecology}</li>
  <li><img src="img/peace.jpg"> Peace: ${e[num].death_peace}</li>
  <li><img src="img/healthcare.jpg"> Healthcare: ${e[num].death_healthcare}</li>
  <li><img src="img/prosperity.jpg"> Prosperity: ${e[num].death_prosperity}</li>
  </ul>
  <a href="#" onclick="die()"><img src="img/die.png"></a>
  </div>
  <div class="cardInfo spare">
  <h4>Spare</h4>
  <ul>
  <li><img src="img/ecology.jpg"> Ecology: ${e[num].spare_ecology}</li>
  <li><img src="img/peace.jpg"> Peace: ${e[num].spare_peace}</li>
  <li><img src="img/healthcare.jpg"> Healthcare: ${e[num].spare_healthcare}</li>
  <li><img src="img/prosperity.jpg"> Prosperity: ${e[num].spare_prosperity}</li>
  </ul>
  <a href="#" onclick="live()"><img src="img/live.png"></a>
  </div>`;
}

function die() {
  cond = 1;
  fech(busquedaActual);
}

function death(e, num) {
  ecologyCont += e[num].death_ecology;
  peaceCont += e[num].death_peace;
  healthcareCont += e[num].death_healthcare;
  prosperityCont += e[num].death_prosperity;
  updateStatus()
}

function live() {
  cond = 2;
  fech(busquedaActual);
}

function spare(e, num) {
  ecologyCont += e[num].spare_ecology;
  peaceCont += e[num].spare_peace;
  healthcareCont += e[num].spare_healthcare;
  prosperityCont += e[num].spare_prosperity;
  updateStatus()
}

function volver() {
  cardContainer.innerHTML = "";
  cond = 0;
  getPersonas();
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

function updateStatus() {
  localStorage.setItem('ecology', ecologyCont)
  localStorage.setItem('peace', peaceCont)
  localStorage.setItem('healthcare', healthcareCont)
  localStorage.setItem('prosperity', prosperityCont)
  ecology = localStorage.ecology
  peace = localStorage.peace
  healthcare = localStorage.healthcare
  prosperity = localStorage.prosperity
  console.log("Ecology: " + ecology + " //","Peace: " + peace + " //","Healthcare: " + healthcare + " //","Prosperity: " + prosperity)
}

function clearStatus() {
  ecologyCont = 0
  peaceCont = 0
  healthcareCont = 0
  prosperityCont = 0
  updateStatus()
  getStatus()
}

function changeStatus() {
  const div = document.createElement('div')
  div.innerHTML = 
  `<p>Ecology</p>
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
  </div>`
  div.className = "changeStatus"
  actual.appendChild(div)
}

function clickSet() {
  ecologyCont += Number(document.getElementById('ecoSet').value)
  peaceCont += Number(document.getElementById('peaSet').value)
  healthcareCont += Number(document.getElementById('helSet').value)
  prosperityCont += Number(document.getElementById('proSet').value)
  updateStatus()
  getStatus()
}

function clickClose() {
  let div = document.querySelector('.changeStatus')
  div.remove()
}