
import { NumeroGerado } from "../../pages/random/random_number/NumeroGerado";

const objetoPlaceholder = new NumeroGerado(0, 1000);

let generatedNumberInp;
let checkboxInteiroChb;

var loopIDResult;

/**
 * Função para atualizar o placeholder de resultados com números inteiros ou fracionarios
 */
function AtualizarPlaceholderResult(){
    if(generatedNumberInp.value !== ''){
        clearInterval(loopIDResult);
    }
    if(checkboxInteiroChb && !checkboxInteiroChb.checked){
        generatedNumberInp.placeholder = objetoPlaceholder.GerarNumeroFracionario();
        return;
    }
    generatedNumberInp.placeholder = objetoPlaceholder.GerarNumeroInteiro();
}

/**
 * Inicia o placeholder matemático dos resultados, trocando o resultado a cada 3s
 */
export function PlaceholderResultDinamico(){
    checkboxInteiroChb = document.getElementById("checkboxInteiro");
    generatedNumberInp = document.getElementById("generated-value");
    generatedNumberInp.placeholder = objetoPlaceholder.GerarNumeroInteiro();
    loopIDResult = setInterval(AtualizarPlaceholderResult, 3000);
}