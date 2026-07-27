import { TextoInvertido } from "./TextoInvertido.ts";
import { 
  MostrarPasteText, 
  OcultarPasteText
} from '../../../utility/copytext/copytext.js'

let areaTextEl = document.getElementById("textTip");
let resultTextEl = document.getElementById("textResult");
let texto = new TextoInvertido();

areaTextEl.addEventListener('input', AlterarTexto);
areaTextEl.addEventListener('input', GerarTextoInverso);

function AlterarGerarTexto(){
    AlterarTexto();
    GerarTextoInverso();
}

function AlterarTexto(){
    texto.SetTexto(areaTextEl.value);
    texto.GetTexto().length > 0 ? OcultarPasteText() : MostrarPasteText();
}

function GerarTextoInverso(){
    resultTextEl.textContent = texto.InverterTexto();  
    SetResultText(resultTextEl.textContent);
}

import { SetAreaText, SetResultText, SetEventListener } from '../../../utility/copytext/copytext.js';

await SetAreaText(areaTextEl);
await SetResultText(resultTextEl.textContent);
await SetEventListener(AlterarGerarTexto);