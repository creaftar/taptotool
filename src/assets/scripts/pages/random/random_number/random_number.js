import { NumeroGerado } from "./NumeroGerado";

const objeto = new NumeroGerado(0, 1000);

let generatedNumberInp = document.getElementById("generated-value");
const minvalueInp = document.getElementById("min-value");
const maxvalueInp = document.getElementById("max-value");
const gerarBtn = document.getElementById("gerar-numero");
const checkboxInteiroChb = document.getElementById("checkboxInteiro");

gerarBtn.addEventListener('click', GerarResposta);

function GerarResposta(){
    if(checkboxInteiroChb.checked){
        GerarInteiro();
    }
    else{
        GerarFracionario();
    }
}

function GerarInteiro(){
    objeto.SetX(Number(minvalueInp.value));
    objeto.SetY(Number(maxvalueInp.value));
    generatedNumberInp.value = objeto.GerarNumeroInteiro();
}
function GerarFracionario(){
    objeto.SetX(Number(minvalueInp.value));
    objeto.SetY(Number(maxvalueInp.value));
    generatedNumberInp.value = objeto.GerarNumeroFracionario();
}

/*function converterParaNumero(texto) {
    // Mapa de algarismos nativos para ocidentais
    const algarismosNativos = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9', // Hindi
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'  // Árabe
    };

    // Substitui cada caractere nativo pelo seu equivalente 0-9
    const textoConvertido = texto.replace(/[०-९٠-٩]/g, m => algarismosNativos[m]);
    
    // Converte para número real (removendo pontos de milhar que podem confundir)
    return Number(textoConvertido.replace('.', '').replace(',', '.'));
}*/