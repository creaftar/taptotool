import { WheelManager } from './manager.ts';

let areaTextEl = document.getElementById("textTip");
const containerI18n = document.getElementById("area-text");
const t = JSON.parse(containerI18n.dataset.i18n);
const texto = t.standard_phrase;
const container = document.getElementById('roletas-container');
const manager = new WheelManager(container);


//const btnCriar = document.getElementById('addRoulette');


let timeoutAtualizacao;
export async function FirstUpdateRoleta(){
    const rawText = areaTextEl.value || texto; 
    // Separar por quebra de linha ou vírgula (textarea geralmente é quebra de linha)
    const listaItens = rawText.split(/\n/) 
        .map(item => item.trim())
        .filter(item => item !== "");
    manager.updateFirstWheel(listaItens); 
}
async function handleCriarRoleta() {
    
    clearTimeout(timeoutAtualizacao);
    
    // Espera 150ms após a última tecla para processar a roleta
    timeoutAtualizacao = setTimeout(async () => {
        // LER o valor atual do textarea, não a variável estática
        const rawText = areaTextEl.value || texto; 
        
        // Separar por quebra de linha ou vírgula (textarea geralmente é quebra de linha)
        const listaItens = rawText.split(/\n/) 
            .map(item => item.trim())
            .filter(item => item !== "");

        // Só atualiza se tiver pelo menos 2 itens para a roleta não quebrar
        if (listaItens.length < 1) return;

        
        // Em vez de criar uma nova roleta toda vez (o que encheria a tela), 
        // nós atualizamos a existente.
        /*try {
            await document.fonts.load('600 1em texto');
        } catch (e) {}*/
        manager.updateFirstWheel(listaItens); 
    }, 150)
    
};

// Evento de input para atualizar "ao vivo"
areaTextEl.addEventListener('input', handleCriarRoleta);

// Inicialização com os placeholders ou valor inicial
handleCriarRoleta();
FirstUpdateRoleta();
//btnCriar.addEventListener('click', handleCriarRoleta);

// Atalho: apertar Enter também cria a roleta
/*inputItens.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCriarRoleta();
});*/

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