const container = document.getElementById('area-text');
const traducao = JSON.parse(container?.dataset.i18n || '{}');

let areaTextEl;
let resultTextEl;
let _fraseParaInverter;
let _fraseResultCompleta;
let i_normal = 0;
let i_result = 0;

var loopID;
var loopIDResult;

/**
 * Função para atualizar o placeholder de resultados (é possível alterar a frase alterando a variável global)
 * @returns void
 */

function AtualizarPlaceholder(){
  if(!_fraseParaInverter[i_normal]){
    clearInterval(loopID);
    return;
  }
  areaTextEl.placeholder += _fraseParaInverter[i_normal];
  i_normal++;
}

/**
 * Função para atualizar o placeholder de resultados (é possível alterar a frase alterando a variável global)
 * @returns void
 */
function AtualizarPlaceholderResult(){
    // 1. Checa se o próximo índice (i_result) existe na frase completa
    if(!_fraseResultCompleta[i_result]){ 
        clearInterval(loopIDResult);
        return;
    }
    
    // 2. Adiciona o caractere no índice atual
    resultTextEl.placeholder += _fraseResultCompleta[i_result];
    
    // 3. Incrementa para o próximo caractere
    i_result++; 
}


/**
 * Função para iniciar o placeholder da Área de Texto normal
 * @params String contendo a frase para inverter, padrão: "Olá, seja bem vindo(a). Digite seu texto aqui...";
 */
export function PlaceholderDinamico(fraseParaInverter = traducao.standard_phrase){
  areaTextEl = document.getElementById("textTip");
  _fraseParaInverter = fraseParaInverter;
  loopID = setInterval(AtualizarPlaceholder, 25); 
}


/**
 * Função para iniciar o placeholder da Área de Texto dos resultados
 * @params String contendo a frase para inverter, padrão: "Olá, seja bem vindo(a). Digite seu texto aqui..."
 */
export function PlaceholderResultDinamico(fraseResultCompleta = traducao.standard_phrase){
  resultTextEl = document.getElementById("textResult");
  _fraseResultCompleta = fraseResultCompleta; // A frase completa para o 'textResult'
  loopIDResult = setInterval(AtualizarPlaceholderResult, 25);
}