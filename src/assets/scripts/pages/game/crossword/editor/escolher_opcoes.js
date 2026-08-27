/*var container = document.getElementById("fotoCrivras");
var carrossel = document.createElement('div');
carrossel.classList.add("card_editor");

export async function GerarFoto(){

    const { TraduzirBody } = await import("../ferramentas/traducao/traducaoIndex.js");
    await DefinirImagens();
    carrossel.innerHTML ='';
    carrossel.innerHTML =`<div class="carousel-track_editor" id="carouselTrack_editor">
                                <img class="slide_editor" src="${await DefinirImagens()}" alt="Crossword Photo">
                            </div>`;

    container.appendChild(carrossel);
    TraduzirBody();
}


async function DefinirImagens(){    
    return `/assets/imgs/${selectedValue}.jpg`;
}

 const selectElement = document.getElementById('escolher_foto');

    // Função para selecionar uma opção aleatoriamente
    function selecionarOpcaoAleatoria() {
        const options = selectElement.options;
        // Garante que haja opções para selecionar e não inclua uma possível primeira opção "placeholder"
        const startIndex = 0; // Se quiser incluir a primeira opção (índice 0)
        const randomIndex = Math.floor(Math.random() * (options.length - startIndex)) + startIndex;
        selectElement.selectedIndex = randomIndex;

        // Chame a função para mostrar o valor inicial aleatório também
        atualizarValorSelecionado();
    }

    var selectedValue;
    // Função para obter e exibir o valor atualmente selecionado
    function atualizarValorSelecionado() {
        selectedValue = selectElement.value; // Pega o 'value' da opção selecionada
        GerarFoto();
    }


selecionarOpcaoAleatoria();
selectElement.addEventListener('change', atualizarValorSelecionado);*/

// Seleciona todos os botões de rádio com o nome 'desejoxnaoPostar'
const botoesDeRadio = document.querySelectorAll('input[name="desejoxnaoGabarito"]');
export var podeGabarito = true;
var valorSelecionado;
// Adiciona um 'event listener' para cada botão
botoesDeRadio.forEach(radio => {
  radio.addEventListener('change', (event) => {
    valorSelecionado = event.target.value;
    if(valorSelecionado == 'desejoNaoGabarito'){
        podeGabarito = false;
    }
    else{
        podeGabarito = true;
    }
  });
});

// Seleciona todos os botões de rádio com o nome 'desejoxnaoPostar'
const botoesDicas = document.querySelectorAll('input[name="desejoxnaoDicas"]');
export var podeDica = true;
var valorSelecionadoDica;
// Adiciona um 'event listener' para cada botão
botoesDicas.forEach(radio => {
  radio.addEventListener('change', (event) => {
    valorSelecionadoDica = event.target.value;
    if(valorSelecionadoDica == 'desejoNaoDicas'){
        podeDica = false;
    }
    else{
        podeDica = true;
    }
  });
});



// Seleciona todos os botões de rádio com o nome 'desejoxnaoPostar'
const botoesPostar = document.querySelectorAll('input[name="desejoxnaoPostar"]');
export var podePostar = true;
var valorSelecionadoPostar;
// Adiciona um 'event listener' para cada botão
botoesPostar.forEach(radio => {
  radio.addEventListener('change', (event) => {
    valorSelecionadoPostar = event.target.value;
    if(valorSelecionadoPostar == 'desejoNaoPostar'){
        podePostar = false;
    }
    else{
        podePostar = true;
    }
  });
});