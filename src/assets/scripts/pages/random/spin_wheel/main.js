import { WheelManager } from './manager.ts';

let areaTextEl = document.getElementById("textTip");
const containerI18n = document.getElementById("area-text");
const t = JSON.parse(containerI18n.dataset.i18n);
const texto = t.standard_phrase;
export const textoItens =  texto.split(/\n/) 
        .map(item => item.trim())
        .filter(item => item !== "");
const container = document.getElementById('roletas-container');
const manager = new WheelManager(container);
//const btnCriar = document.getElementById('addRoulette');

let timeoutAtualizacao;

function GerarItens(){
    const rawText = areaTextEl.value || texto; 
    return { 
        armazenar: rawText !== texto, 
        itens: rawText.split(/\n/) 
        .map(item => item.trim())
        .filter(item => item !== "") };
}

export async function FirstUpdateRoleta(){
    manager.updateFirstWheel(GerarItens().itens); 
}

async function handleCriarRoleta() {    
    clearTimeout(timeoutAtualizacao);
    timeoutAtualizacao = setTimeout(async () => {
        const listaItens = GerarItens();
        if (listaItens.length < 1) return;
        manager.updateCurrentWheel(listaItens.itens, listaItens.armazenar); 
    }, 150);
};

FirstUpdateRoleta();

import { 
  MostrarPasteText, 
  OcultarPasteText,
  SetEventListener
} from '../../../utility/copytext/copytext.js'


areaTextEl.addEventListener('input', AlterarTexto);

function AlterarTexto(){
    areaTextEl.value.length > 0 ? OcultarPasteText() : MostrarPasteText();
    handleCriarRoleta();
}

import { SetAreaText } from '../../../utility/copytext/copytext.js';

await SetAreaText(areaTextEl);
SetEventListener(AlterarTexto);

const btnCriar = document.getElementById('addRoulette');
const containerRoletas = document.getElementById("container-roletas");

btnCriar?.addEventListener('click', () => {
    areaTextEl.value = "";
    const listaItens = GerarItens().itens;
    
    if (listaItens.length < 1) return;

    containerRoletas.appendChild(manager.addWheel(listaItens).element);
});