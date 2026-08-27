// Variáveis globais
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');
const area_cruzadinhasEl = document.getElementById('area-cruzadinhas');
const area_restanteEl = document.getElementById('area-restante');

// A largura máxima da tela para consideração, caso deseje um limite
var largura = window.screen.width > 1920 ? 1920 : window.screen.width;

var scaleLimitToScroll = 1; // Escala onde o conteúdo se ajusta sem rolagem

export var conterCruzadinhasEl = { x: 0, y: 0 };
export var scale = 1; // Escala atual do container

/**
 * Agrupa as cruzadinhas em um container centralizado
 */
export function conter_cruzadinhas(){
    remove_scroll();
    calculateScaleLimitToScroll();
}

/**
 * Calcula a escala limite para quando o conteúdo se ajusta perfeitamente na área
 * sem a necessidade de rolagem, e define a variável global scaleLimitToScroll.
 * Esta função deve ser chamada na inicialização e no redimensionamento da janela.
 */
function calculateScaleLimitToScroll() {
    // Temporariamente define a escala para 1 para obter a largura "natural" do container
    const originalTransform = container_cruzadinhasEl.style.transform;
    container_cruzadinhasEl.style.transform = 'scale(1)';

    const containerNaturalWidth = container_cruzadinhasEl.getBoundingClientRect().width;
    const clientAreaWidth = area_cruzadinhasEl.clientWidth;

    // Restaura a transformação original após obter a largura natural
    container_cruzadinhasEl.style.transform = originalTransform;

    if (containerNaturalWidth > 0) {
        // Calcula a proporção para ajustar o container na largura da área visível
        let calculatedLimit = (clientAreaWidth / containerNaturalWidth) - 0.1;

        // Aplica os limites de zoom que você definiu (0.2 a 2, por exemplo)
        // Isso garante que scaleLimitToScroll esteja dentro dos limites operacionais do zoom
        scaleLimitToScroll = Math.max(0.2, Math.min(2, calculatedLimit));
    } else {
        scaleLimitToScroll = 1; // Caso não haja largura, assume 1 como padrão seguro
    }

    // console.log('scaleLimitToScroll calculado:', scaleLimitToScroll);
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

let limiteTop = 15;
let topIn = false;
let leftIn = false;
let isProcessing = false;

/**
 * Função auxiliar para aplicar o origin e o alinhamento
 */
function aplicarEstilosZoom() {
    // Se topIn for true, alinha no topo, se não, centraliza
    area_restanteEl.style.alignItems = topIn ? "flex-start" : "center";
    // Se leftIn for true, alinha na esquerda, se não, centraliza
    area_restanteEl.style.justifyContent = leftIn ? "flex-start" : "center";

    const v = topIn ? "top" : "center";
    const h = leftIn ? "left" : "center";
    container_cruzadinhasEl.style.transformOrigin = `${v} ${h}`;
}

/**
 * Aplica um zoom in no container das cruzadinhas.
 */
export function zoomIn() {
    if (isProcessing) return;
    isProcessing = true;

    if (scale < 2) {
        scale += 0.1;
        container_cruzadinhasEl.style.transform = 'scale(' + scale + ')';
    }

    // Pegamos os retângulos atualizados
    const rectContainer = container_cruzadinhasEl.getBoundingClientRect();
    const rectPai = area_cruzadinhasEl.getBoundingClientRect();

    // Verificação de Topo: se o container ficou maior ou igual à altura da área visível
    if (rectContainer.top <= rectPai.top) {
        if (limiteTop === 15) {
            limiteTop = scale; // Salva a escala exata do "contato"
        }
        topIn = true;
    }

    // Verificação de Lateral: usamos a sua lógica de scaleLimitToScroll que é precisa
    if (scale >= scaleLimitToScroll + 0.15) {
        leftIn = true;
    }

    aplicarEstilosZoom();

    requestAnimationFrame(() => {
        isProcessing = false;
    });
}

/**
 * Aplica um zoom out no container das cruzadinhas.
 */
export function zoomOut() {
    if (isProcessing) return;
    isProcessing = true;

    if (scale > 0.2) {
        scale -= 0.1;
        container_cruzadinhasEl.style.transform = 'scale(' + scale + ')';
    }

    if (scale < limiteTop) {
        topIn = false;
        limiteTop = 15;
    }

    if (scale < scaleLimitToScroll + 0.15) {
        leftIn = false;
    }

    aplicarEstilosZoom();

    requestAnimationFrame(() => {
        isProcessing = false;
    });
}

window.addEventListener('resize', calculateScaleLimitToScroll);