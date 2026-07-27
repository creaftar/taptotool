import { Lista } from './Lista';
import { FormatoDesejado } from './Formato';
import { 
  MostrarPasteText, 
  OcultarPasteText,
  SetAreaText, 
  SetResultText, 
  SetEventListener
} from '../../../utility/copytext/copytext.js'

const lang = document.documentElement.lang || 'en'; 
let lista = new Lista('', lang);

let areaTextEl = document.getElementById("textTip");
let resultTextEl = document.getElementById("textResult");

areaTextEl.addEventListener('input', AlterarLista);
areaTextEl.addEventListener('input', OrdenarLista);

function AlterarGerarTexto(){
    AlterarLista();
    OrdenarLista();
}

function AlterarLista(){
    lista.SetLista(areaTextEl.value);
    lista.GetLista().length > 0 ? OcultarPasteText() : MostrarPasteText();
}

export function OrdenarLista(){
    let formato = FormatoDesejado();
    switch (formato) {
        case "a-z":
            resultTextEl.textContent = lista.OrdenarLista();
            SetResultText(resultTextEl.textContent);
        break;
        case "z-a":
            resultTextEl.textContent = lista.OrdenarListaReversa();
            SetResultText(resultTextEl.textContent);
        break;
        default:
            resultTextEl.textContent = lista.OrdenarLista();
            SetResultText(resultTextEl.textContent);
        break;
    }
}

await SetAreaText(areaTextEl);
await SetResultText(resultTextEl.textContent);
await SetEventListener(AlterarGerarTexto);