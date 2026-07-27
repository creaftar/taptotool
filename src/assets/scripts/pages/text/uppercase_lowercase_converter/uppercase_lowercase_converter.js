import { TextoConvertido } from "./TextoConvertido.ts";
import { FormatoDesejado } from "./Formato.js";
import { 
  MostrarPasteText, 
  OcultarPasteText
} from '../../../utility/copytext/copytext.js'


let texto = new TextoConvertido();

let areaTextEl = document.getElementById("textTip");
let resultTextEl = document.getElementById("textResult");

areaTextEl.addEventListener('input', AtualizarTexto);
areaTextEl.addEventListener('input', MostrarResultado);

function AlterarGerarTexto(){
    AtualizarTexto();
    MostrarResultado();
}

function AtualizarTexto(){
    texto.SetTexto(areaTextEl.value);
    texto.GetTexto().length > 0 ? OcultarPasteText() : MostrarPasteText();
}

export function MostrarResultado(){
    let formato = FormatoDesejado();
    let resultadoFinal = "";

    switch (formato) {
        case "texto-minusculo":
            resultadoFinal = texto.ConverterMinuscula();
            break;
        case "texto-maiusculo":
            resultadoFinal = texto.ConverterMaiuscula();
            break;
        case "texto-formatado":
            resultadoFinal = texto.PrimeiraLetraMaiuscula();
            break;
        case "texto-troll":
            resultadoFinal = texto.TextoDeTroll();
            break;
        default:
            resultadoFinal = texto.ConverterMinuscula();
            break;
    }

    resultTextEl.textContent = resultadoFinal;
    SetResultText(resultadoFinal); // Chama uma única vez no fim
}

import { SetAreaText, SetResultText, SetEventListener } from '../../../utility/copytext/copytext.js';

await SetAreaText(areaTextEl);
await SetResultText(resultTextEl.textContent);
await SetEventListener(AlterarGerarTexto);