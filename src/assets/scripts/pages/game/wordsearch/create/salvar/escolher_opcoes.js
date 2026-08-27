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