let cronometroEl = document.getElementById("cronometro");
let generateLapEl = document.getElementById("generateLap");
let containerVoltaEl = document.getElementById("container-volta");
let resetTimerEl = document.getElementById("resetTimer");

let _voltas = 1;
let _tempoInicial = cronometroEl.textContent;

generateLapEl.addEventListener('click', () => GenerateLap());
resetTimerEl.addEventListener('click', ResetLaps);

export let squares = [];

function GenerateLap(dadosStorage = null){
    let divEl = document.createElement('div');
    let dados;
    if(dadosStorage)
        dados = dadosStorage;
    else
        dados = {id:_voltas, inicio: _tempoInicial, fim: cronometroEl.textContent};

    divEl.innerHTML = `<div class="square-volta" id="sq-${_voltas}">
    <div><i class="fa-solid fa-xmark x-sq" id="x-sq-${_voltas}"></i></div>
                <div class="titulo-volta">${_voltas.toString().padStart(2, '0')}</div><div>${dados.inicio}</div><div>${dados.fim}</div>
              </div>`;
    containerVoltaEl.appendChild(divEl);
    _tempoInicial = cronometroEl.textContent;
    divEl.scrollIntoView({behavior:'smooth', block: 'end'});
    
    divEl.querySelector(`#x-sq-${_voltas}`).addEventListener("click", () => DeleteSquare(dados.id));
    
    squares.push(dados);
    _voltas++;
}

export function ResetLaps(){
    containerVoltaEl.innerHTML = ""; 
    _voltas = 1;
    _tempoInicial = cronometroEl.textContent;
    squares = [];
}

export function LoadLaps(lapsArray) {
    containerVoltaEl.innerHTML = "";
    squares = []; 
    _voltas = 1;

    lapsArray.forEach(lapData => {
        GenerateLap(lapData);
    });
    
    if (containerVoltaEl.lastChild) {
        containerVoltaEl.lastChild.scrollIntoView({behavior:'smooth', block: 'end'});
    }
}

function DeleteSquare(id){
    squares = squares.filter(item => item.id !== id);
    LoadLaps(squares);
}