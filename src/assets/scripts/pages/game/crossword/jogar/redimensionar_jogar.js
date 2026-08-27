// Variáveis globais
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');
const area_cruzadinhasEl = document.getElementById('area-cruzadinhas');
const area_restanteEl = document.getElementById('area-restante');
const printEl = document.getElementById('impressora');

// A largura máxima da tela para consideração, caso deseje um limite
var largura = window.screen.width > 1920 ? 1920 : window.screen.width;

var scale = 1; // Escala atual do container
var scaleLimitToScroll = 1; // Escala onde o conteúdo se ajusta sem rolagem
/*const tema = localStorage.getItem("tema");

function AjustarImpressao() {
    document.querySelector("html").classList.remove("darktheme");
    document.querySelector("html").classList.remove("dim");
    document.querySelector("html").classList.add("padrao");
}

function ResetarEstilos() {
    document.querySelector("html").classList.toggle(tema);
}

// O "pulo do gato":
window.onbeforeprint = AjustarImpressao; // Aplica antes de abrir a caixa de diálogo
window.onafterprint = ResetarEstilos;   // Limpa tudo quando fechar/imprimir
*/


/**
 * Calcula a escala limite para quando o conteúdo se ajusta perfeitamente na área
 * sem a necessidade de rolagem, e define a variável global scaleLimitToScroll.
 * Esta função deve ser chamada na inicialização e no redimensionamento da janela.
 */
function calculateScaleLimitToScroll(AreaWidth) {
    const originalTransform = container_cruzadinhasEl.style.transform;
    container_cruzadinhasEl.style.transform = 'scale(1)';

    // Usamos offsetWidth para largura natural sem transformações
    const containerNaturalWidth = container_cruzadinhasEl.offsetWidth;
    
    let clientAreaWidth = AreaWidth ? AreaWidth : area_cruzadinhasEl.clientWidth;

    container_cruzadinhasEl.style.transform = originalTransform;

    if (containerNaturalWidth > 0) {
        // Reduzi a margem de segurança de 0.1 para 0.05 para o print ficar mais preenchido
        let calculatedLimit = (clientAreaWidth / containerNaturalWidth) - 0.05;
        let finalScale = Math.max(0.2, Math.min(2, calculatedLimit));
        
        // Se NÃO passou AreaWidth, é redimensionamento de tela, atualiza a global
        if (!AreaWidth) {
            scaleLimitToScroll = finalScale;
        }
        return finalScale; // Retorna para ser usado no print
    }
    return 1;
}

/**
 * Ajusta a escala do container das cruzadinhas para remover a rolagem horizontal
 * se o conteúdo for muito grande. Também centraliza verticalmente.
 */
function remove_scroll() {
    // Obtenha a largura atual do container com a escala aplicada
    let containerTransformed = container_cruzadinhasEl.getBoundingClientRect();
    const clientAreaWidth = area_cruzadinhasEl.clientWidth;

    // Se o container atual (já com a escala 'scale' aplicada) for maior que a área visível
    if (containerTransformed.width > clientAreaWidth) {
        // Calcule a nova escala necessária para o container se ajustar na largura da área visível
        const requiredScale = /*Math.floor(*/clientAreaWidth / containerTransformed.width/*)*/;

        // Ajuste a escala global 'scale' e aplique ao container.
        // Garanta que a escala não caia abaixo do seu limite mínimo (0.2).
        scale = Math.max(0.2, scale * requiredScale) - 0.1;
        container_cruzadinhasEl.style.transform = 'scale(' + scale + ')';

        // Atualize containerTransformed após a nova escala para obter os valores corretos
        containerTransformed = container_cruzadinhasEl.getBoundingClientRect();
    }

    // Calcula a posição de scroll para 50% da altura visível do elemento
    const posicaoScroll = area_cruzadinhasEl.scrollHeight / 2 - area_cruzadinhasEl.clientHeight / 2;

    area_cruzadinhasEl.scrollTo({
        top: posicaoScroll,
        behavior: 'smooth' // Para um efeito de scroll suave
    });

    return containerTransformed.right; // Retorna o limite direito do container transformado
}

/**
 * Função de inicialização para as cruzadinhas.
 * Garante que o conteúdo se ajuste e configura a transição de altura.
 */
export async function conter_cruzadinhas(){
    // Primeiro, ajuste a escala para remover o scroll se necessário
    remove_scroll();
    // Em seguida, calcule a escala limite para o zoom
    calculateScaleLimitToScroll();

    // Adiciona transição para a altura da área das cruzadinhas
    area_cruzadinhasEl.style.transition = "height 0.9s cubic-bezier(0.6, -0.2, 0.4, 1.2)";
}

let svgContainerEl = document.getElementById("area-quadrados");
let containerAreaCruzadinhasEl = document.getElementById("container-area-cruzadinhas");
let topIn = false, leftIn = false;
let limiteTop = 15;
/**
 * Aplica um zoom in no container das cruzadinhas.
 */
export function zoomIn() {
    if (isProcessing) return;
    isProcessing = true;
    if(!GarantirExistenciaDOM()) return;

    if (scale < 2) {
        scale += 0.1;
        container_cruzadinhasEl.style.transform = 'scale(' + scale + ')';
    }

    const el_x = svgContainerEl.getBoundingClientRect();
    const el_y = containerAreaCruzadinhasEl.getBoundingClientRect();
    
    // Se o topo do conteúdo encostar ou passar o topo da área visível
    if(el_x.top <= el_y.top){
        // Armazena a escala exata em que o transbordo começou
        if(limiteTop === 15) {
            limiteTop = scale; 
        }
        topIn = true;
        area_restanteEl.style.alignItems = "flex-start";
    }
    
    // Lógica para o horizontal (usando sua scaleLimitToScroll que já é boa)
    if(el_x.left <= el_y.left || scale > scaleLimitToScroll + 0.1){
        leftIn = true;
        area_restanteEl.style.justifyContent = "flex-start";
    }

    atualizarOrigin();

    requestAnimationFrame(() => {
        isProcessing = false;
    });
}


let topOut = false, leftOut = false;
let isProcessing = false;
/**
 * Aplica um zoom out no container das cruzadinhas.
 */
export function zoomOut() {
    if (isProcessing) return;
    isProcessing = true;
    if(!GarantirExistenciaDOM()) return;

    if (scale > 0.2) {
        scale -= 0.1;
        container_cruzadinhasEl.style.transform = 'scale(' + scale + ')';
    }

    // SEGURANÇA: Se a escala voltou abaixo do limite de transbordo, 
    // resetamos o alinhamento para o centro.
    if (scale < limiteTop) {
        topIn = false;
        limiteTop = 15; // Reseta o limite para a próxima expansão
        area_restanteEl.style.alignItems = "center";
    }

    if (scale < scaleLimitToScroll + 0.1) {
        leftIn = false;
        area_restanteEl.style.justifyContent = "center";
    }

    atualizarOrigin();

    requestAnimationFrame(() => {
        isProcessing = false;
    });
}

// Função auxiliar para manter o código limpo e evitar erros de concatenação
function atualizarOrigin() {
    const v = topIn ? "top" : "center";
    const h = leftIn ? "left" : "center";
    container_cruzadinhasEl.style.transformOrigin = `${v} ${h}`;
}


function GarantirExistenciaDOM(){
    if(!svgContainerEl || !containerAreaCruzadinhasEl){
        svgContainerEl = document.getElementById("area-quadrados");
        containerAreaCruzadinhasEl = document.getElementById("container-area-cruzadinhas");
    }
    if(!svgContainerEl || !containerAreaCruzadinhasEl){
        return false;
    }
    return true;
}


window.addEventListener('resize', calculateScaleLimitToScroll);