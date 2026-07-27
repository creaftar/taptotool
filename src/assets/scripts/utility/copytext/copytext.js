let containercopytextEl = document.getElementById('container-paste-text');
let containerblocoerrorEl = document.getElementById('container-bloco-error');
let containericonestextEl = document.getElementById('container-icones-textID');
let btnIconArray = containericonestextEl.querySelectorAll("button"); 

const btncopiarareatextEl = document.getElementById('btn-copiar-areatext');
const btnexlcuirareatextEl = document.getElementById('btn-exlcuir-areatext');
const btncopiarresultEl = document.getElementById('btn-copiar-result');

let _areaTextEl;
let _resultTextEl;
let _isShowingError = false;

/**
 * Função Assíncrona para colar o que o usuário tiver no Ctrl + V no momento para a área desejada, utilizando a API do navigator
 * @returns Texto presente no CTRL + V do usuário
 */
export async function ColarTexto(elemento)
{
    try{
        const tag = elemento.tagName.toUpperCase();
        
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            elemento.value = await navigator.clipboard.readText();
        } 
        
        else {
            elemento.textContent = await navigator.clipboard.readText();
        }
    }
    catch(error){
        ErroTransferencia();
    }
}

/**
 * Função para mostrar o container do PasteText quando ocorrer determinada ação
 * @returns void
 */
export function MostrarPasteText()
{
    containercopytextEl.style.visibility = "visible";
    OcultarSideIcons();
 }

/**
 * Função para ocultar o container do PasteText quando ocorrer determinada ação
 * @returns void
 */
export function OcultarPasteText()
{
    containercopytextEl.style.visibility = "hidden";
    MostrarSideIcons();
}

/**
 * Função para exibir a mensagem de erro quando o usuário não habilitar a área de transferência
 * @returns void
 */
async function ErroTransferencia(){
    if (_isShowingError)
        return;

    _isShowingError = true;

    containerblocoerrorEl.style.opacity = "1";
    containerblocoerrorEl.style.height = "15%";
    containerblocoerrorEl.style.zIndex = "2";
    setTimeout(async () => {
        containerblocoerrorEl.style.opacity = "0";
        containerblocoerrorEl.style.height = "0%";
        await Delay(900);
        containerblocoerrorEl.style.zIndex = "0";
        _isShowingError = false;
    }, 3000);
}

/**
 * Função para exibir os ícones ao lado do Areatext
 * @returns void
 */
function MostrarSideIcons(){
    let tempo = 50;
    btnIconArray.forEach((btnIcon) =>{
        tempo += tempo;
        setTimeout(async ()=>{
            btnIcon.style.transform = "translateX(0%)";
            btnIcon.style.opacity = "1";
            btnIcon.style.userSelect = "all";
            btnIcon.style.cursor = "pointer";
        }, tempo);
    });
}

/**
 * Função para ocultar os ícones ao lado do Areatext
 * @returns void
 */
function OcultarSideIcons(){
    let tempo = 50;
    btnIconArray.forEach((btnIcon) =>{
        tempo += tempo;
        setTimeout(()=>{
            btnIcon.style.transform = "translateX(100%)";
            btnIcon.style.opacity = "0";
            btnIcon.style.userSelect = "none";
            btnIcon.style.cursor = "auto";
        }, tempo);
    });
}

/**
 * Função para copiar o texto da AreaText (text area)
 */
export async function CopiarAreaText(elemento){
    try{
        const tag = elemento.tagName.toUpperCase();
        
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            await navigator.clipboard.writeText(elemento.value);
        } 
        
        else {
            await navigator.clipboard.writeText(elemento.textContent);
        }
    }
    catch(error){
        ErroTransferencia();
    }
}

/**
 * Função para excluir o texto da AreaText (text area)
 */
export function ExcluirAreaText(elemento){
     try{
        const tag = elemento.tagName.toUpperCase();
        
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            elemento.value = '';
        } 
        
        else {
            elemento.textContent = '';
        }
    }
    catch(error){
        ErroTransferencia();
    }
}

/**
 * Função para copiar o resultado obtido no Result Text (text area)
 */
export async function CopiarResultText(data){
    try{
        await navigator.clipboard.writeText(data);
    }
    catch(error){
        ErroTransferencia(); //substituir futuramente
    }
}

/**
 * Função para atribuir listeners aos botões e áreas definidas (somente usar depois de Setar a areaText e resultText)
 * 
 * @param {function(): void} [onActionComplete] - Função de callback a ser executada após Colar Texto ou Excluir Texto ser concluído. 
 * @returns void
 */
export async function SetEventListener(onActionComplete = null){
    containercopytextEl?.addEventListener('click', 
        async function()
        { 
            await ColarTexto(_areaTextEl);
            if(onActionComplete)
                onActionComplete();
        }
    );

    btncopiarareatextEl?.addEventListener('click', 
        async function()
        {  
            CopiarAreaText(_areaTextEl);
        }
    );

    btnexlcuirareatextEl?.addEventListener('click', 
        async function()
        {  
            ExcluirAreaText(_areaTextEl);
            if(onActionComplete)
                onActionComplete();
        }
    );

    btncopiarresultEl?.addEventListener('click', 
        async function()
        {  
            CopiarResultText(_resultTextEl);
        }
    );
}

/**
 * Função para Setar o Area Text
 * @param {TextArea} areaTextEl 
 * @returns void
 */
export function SetAreaText(areaTextEl)
{
    _areaTextEl = areaTextEl;
}

/**
 * Função para Setar o Result Text
 * @param {String} resultTextEl 
 */
export function SetResultText(resultTextEl)
{
    _resultTextEl = resultTextEl;
}

// Defina esta função uma vez no seu arquivo de utilidades ou no topo do script.
function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}