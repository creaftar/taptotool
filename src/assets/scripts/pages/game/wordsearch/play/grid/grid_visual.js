import { scale } from "../util/redimensionar";
import { bauPalavras, grid } from "./grid";
import { VerificarRespostaPorPosicao } from "./logica";

const gridVisual = document.getElementById("container-cruzadinhas");
const camadaContornos = document.getElementById("camada-contornos");
let elementos = [];

let matrizOriginal = null;
let isSelecting = false;
let startCell = null;        // { l, c }
let endCell = null;          // 🔥 CORREÇÃO: Declarada aqui para ficar visível em todos os eventos!
let pilulaPreview = null;
const COR_PREVIEW = "hsl(210, 100%, 50%)";

// 🚀 VARIÁVEIS DO AUTO-SCROLL BASEADO NA ÁREA DO JOGO
let scrollAnimationFrame = null;
let velocidadeScroll = 0;
const MARGEM_GATILHO = 40;       // Ativa o scroll quando chegar a 40px da borda interna da área
const VELOCIDADE_MAXIMA = 12;    // Velocidade do scroll fluído

// Pegamos a área visual que você quer rastrear como limite
const areaCruzadinhas = document.getElementById("container-area-cruzadinhas");

/**
 * Gera um grid na tela de acordo com o grid passado
 */
export async function GerarGridVisual(grid) {
    matrizOriginal = grid;
    RemoverGridVisual(grid);
    
    for(let l = 0; l < grid.length; l++){
        for(let c = 0; c < grid[l].length; c++){
            let div = document.createElement("div");
            div.id = `${l},${c}`;
            div.classList.add("celula");
            
            // Injeta as coordenadas nativas para a delegação de eventos funcionar
            div.dataset.linha = l;
            div.dataset.coluna = c;

            if(typeof grid[l][c] === "object"){
                div.textContent = grid[l][c].character;
            }
            else if(typeof grid[l][c] === "string"){
                div.textContent = grid[l][c];
            }
            elementos.push(div);
        }
    }

    gridVisual.append(...elementos);
    
    // Desenha as pílulas das palavras já descobertas / salvas
    bauPalavras.forEach((palavra, index) => {
        if (!palavra.posicionada) return;
        
        const destino = calcularDestino(palavra);
        const cor = gerarCorUnica(index, bauPalavras.length);

        desenharContorno(palavra.id, palavra.x, palavra.y, destino.x, destino.y, cor);
    });
}

/**
 * Função para limpar o grid e os contornos da tela
 */
export function RemoverGridVisual(grid){
    gridVisual.replaceChildren(camadaContornos);
    camadaContornos.replaceChildren();

    gridVisual.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;
    gridVisual.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
    
    elementos = [];
}

gridVisual.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("celula")) return;
    
    e.preventDefault(); 
    isSelecting = true;
    
    const l = parseInt(e.target.dataset.linha);
    const c = parseInt(e.target.dataset.coluna);
    startCell = { l, c };
    endCell = { l, c }; // 🔥 Inicializa o endCell com a mesma posição do clique inicial

    // Remove qualquer preview órfã por segurança
    if (pilulaPreview) pilulaPreview.remove();

    // Cria a pílula de preview (estilo idêntico ao seu, mas com ID específico)
    pilulaPreview = document.createElement("div");
    pilulaPreview.classList.add("pill-contorno");
    pilulaPreview.id = "pilula-preview";
    
    // Remove qualquer efeito de transition no preview para evitar travamento no arrasto
    pilulaPreview.style.transition = "none";
    
    camadaContornos.appendChild(pilulaPreview);

    // Renderiza ela inicialmente sobre a célula clicada (origem e destino são iguais no início)
    atualizarContornoDinamico(pilulaPreview, c, l, c, l, COR_PREVIEW);
});

window.addEventListener("mousemove", (e) => {
    if (!isSelecting || !pilulaPreview) return;

    // 1. LÓGICA DE DETECÇÃO DE BORDAS (Sem aceleração picotada)
    if (areaCruzadinhas) {
        const rectArea = areaCruzadinhas.getBoundingClientRect();
        const mouseY = e.clientY;

        if (mouseY < rectArea.top + MARGEM_GATILHO) {
            // Subida direta e constante
            velocidadeScroll = -VELOCIDADE_MAXIMA;
            iniciarLoopScroll();
        } 
        else if (mouseY > rectArea.bottom - MARGEM_GATILHO) {
            // Descida direta e constante
            velocidadeScroll = VELOCIDADE_MAXIMA;
            iniciarLoopScroll();
        } 
        else {
            velocidadeScroll = 0;
            pararLoopScroll();
        }
    }

    // 2. SELEÇÃO DA CÉLULA (Bloqueia re-cálculos visuais inúteis se o mouse sair do grid)
    const elementoSobOMouse = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementoSobOMouse || !elementoSobOMouse.classList.contains("celula")) {
        return; // Deixa o loop de scroll cuidar do visual sozinho aqui
    }

    let targetL = parseInt(elementoSobOMouse.dataset.linha);
    let targetC = parseInt(elementoSobOMouse.dataset.coluna);

    // Correção inteligente de desalinhamento do mouse
    const deltaX = targetC - startCell.c;
    const deltaY = targetL - startCell.l;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > 2 * absY) {
        targetL = startCell.l;
    } else if (absY > 2 * absX) {
        targetC = startCell.c;
    } else {
        const maxDelta = Math.max(absX, absY);
        targetC = startCell.c + Math.sign(deltaX) * maxDelta;
        targetL = startCell.l + Math.sign(deltaY) * maxDelta;
    }

    if (matrizOriginal && targetL >= 0 && targetL < matrizOriginal.length && targetC >= 0 && targetC < matrizOriginal[0].length) {
        // 🔥 Só atualiza o DOM se a célula final REALMENTE mudou, evitando over-rendering
        if (!endCell || endCell.l !== targetL || endCell.c !== targetC) {
            endCell = { l: targetL, c: targetC };
            atualizarContornoDinamico(pilulaPreview, startCell.c, startCell.l, targetC, targetL, COR_PREVIEW);
        }
    }
});

function iniciarLoopScroll() {
    if (scrollAnimationFrame) return;

    let elementoScroll = gridVisual;
    while (elementoScroll && elementoScroll !== document.body) {
        if (elementoScroll.scrollHeight > elementoScroll.clientHeight) {
            break;
        }
        elementoScroll = elementoScroll.parentElement;
    }
    if (elementoScroll === document.body) elementoScroll = window;

    function rodar() {
        if (velocidadeScroll !== 0) {
            // Executa o scroll nativo imediato
            if (elementoScroll === window) {
                window.scrollBy(0, velocidadeScroll);
            } else {
                elementoScroll.scrollTop += velocidadeScroll;
            }
            
            // 🔥 SE O MOUSE FORÇOU O SCROLL PARA ALÉM DO TABLEIRO:
            // Nós esticamos a endCell dinamicamente acompanhando o avanço das linhas ocultas
            if (endCell && pilulaPreview) {
                const rectArea = areaCruzadinhas.getBoundingClientRect();
                
                // Se está scrollando para baixo e ainda há matriz abaixo, empurra a endCell
                if (velocidadeScroll > 0 && endCell.l < matrizOriginal.length - 1) {
                    // Descobre se a linha de baixo já subiu o suficiente para ser selecionada
                    const proximaDiv = document.getElementById(`${endCell.l + 1},${endCell.c}`);
                    if (proximaDiv && proximaDiv.getBoundingClientRect().top < rectArea.bottom) {
                        endCell.l += 1;
                    }
                }
                // Se está scrollando para cima e ainda há matriz acima, puxa a endCell
                else if (velocidadeScroll < 0 && endCell.l > 0) {
                    const anteriorDiv = document.getElementById(`${endCell.l - 1},${endCell.c}`);
                    if (anteriorDiv && anteriorDiv.getBoundingClientRect().bottom > rectArea.top) {
                        endCell.l -= 1;
                    }
                }

                // Renderiza o contorno liso sincronizado com o frame de animação do navegador
                atualizarContornoDinamico(pilulaPreview, startCell.c, startCell.l, endCell.c, endCell.l, COR_PREVIEW);
            }
            
            scrollAnimationFrame = requestAnimationFrame(rodar);
        } else {
            scrollAnimationFrame = null;
        }
    }
    scrollAnimationFrame = requestAnimationFrame(rodar);
}

function pararLoopScroll() {
    if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
    }
}

window.addEventListener("mouseup", () => {
    velocidadeScroll = 0;
    pararLoopScroll();

    if (!isSelecting) return;
    isSelecting = false;

    if (pilulaPreview) {
        // Agora o endCell existe e está perfeitamente seguro!
        const fimL = endCell.l;
        const fimC = endCell.c;

        // Valida diretamente pelas posições do tabuleiro (coluna inicial, linha inicial, coluna final, linha final)
        const acerto = VerificarRespostaPorPosicao(startCell.c, startCell.l, fimC, fimL);
        
        if (acerto) {            
            const destino = calcularDestino(acerto);
            const index = bauPalavras.indexOf(acerto);
            const corDefinitiva = gerarCorUnica(index, bauPalavras.length);

            desenharContorno(acerto.id, acerto.x, acerto.y, destino.x, destino.y, corDefinitiva);
        } /*else {
            console.log("Seleção inválida.");
        }*/
        
        // Remove a pílula azul de arrasto
        pilulaPreview.remove();
        pilulaPreview = null;
    }
});

document.addEventListener("mousedown", (e) => {
    if (!e.target.closest("#container-cruzadinhas")) {
        isSelecting = false; 
        velocidadeScroll = 0;
        pararLoopScroll();
        if (pilulaPreview) {
            pilulaPreview.remove();
            pilulaPreview = null;
        }
    }
});

/**
 * Função padrão para criar e fixar um contorno definitivo na tela
 */
function desenharContorno(id, origemX, origemY, destinoX, destinoY, cor) {
    const pilula = document.createElement("div");
    pilula.classList.add("pill-contorno");
    pilula.id = `pilula${id}`;
    
    camadaContornos.appendChild(pilula);
    atualizarContornoDinamico(pilula, origemX, origemY, destinoX, destinoY, cor);
}

/**
 * Aplica os cálculos matemáticos de tamanho, ângulo e zoom diretamente no estilo de uma div pílula
 */
function atualizarContornoDinamico(elementoPilula, origemX, origemY, destinoX, destinoY, cor) {
    const startEl = document.getElementById(`${origemY},${origemX}`);
    const endEl = document.getElementById(`${destinoY},${destinoX}`);

    if (!startEl || !endEl || !elementoPilula) return;

    // Guarda temporariamente o alvo final da renderização atual no DOM (por segurança extra)
    elementoPilula.dataset.fimLinha = destinoY;
    elementoPilula.dataset.fimColuna = destinoX;

    const zoomAtual = scale || 1;

    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    const containerRect = camadaContornos.getBoundingClientRect();

    const centroStartX = startRect.left + startRect.width / 2;
    const centroStartY = startRect.top + startRect.height / 2;
    const centroEndX = endRect.left + endRect.width / 2;
    const centroEndY = endRect.top + endRect.height / 2;

    const topPos = (centroStartY - containerRect.top) / zoomAtual;
    const leftPos = (centroStartX - containerRect.left) / zoomAtual;

    const distancia = Math.hypot(centroEndX - centroStartX, centroEndY - centroStartY) / zoomAtual;
    const angulo = Math.atan2(centroEndY - centroStartY, centroEndX - centroStartX) * (180 / Math.PI);

    const espessuraCelula = (startRect.width * 0.85) / zoomAtual;
    const larguraPilula = distancia + espessuraCelula;
    const alturaPilula = (startRect.height * 0.8) / zoomAtual;

    // Aplica as regras visuais que você definiu (20% opacidade, bordas e transformações corrigidas)
    Object.assign(elementoPilula.style, {
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        width: `${larguraPilula}px`,
        height: `${alturaPilula}px`,
        borderRadius: `${alturaPilula / 2}px`, 
        backgroundColor: cor.replace('hsl', 'hsla').replace(')', ', 0.2)'),
        border: `2px solid ${cor.replace('hsl', 'hsla').replace(')', ', 0.6)')}`, 
        transform: `translate(-${espessuraCelula / 2}px, -50%) rotate(${angulo}deg)`,
        transformOrigin: `${espessuraCelula / 2}px center`,
        pointerEvents: 'none',
        zIndex: 10,
        boxSizing: 'border-box'
    });
}

export function calcularDestino(palavra) {
    const len = palavra.text.length - 1;
    let destinoX = palavra.x;
    let destinoY = palavra.y;

    if (palavra.direction === 'horizontal') destinoX += len;
    if (palavra.direction === 'vertical')   destinoY += len;
    if (palavra.direction === 'diagonal') {
        destinoX += len;
        destinoY += len;
    }
    if (palavra.direction === 'diagonal_inversa') {
        destinoX += len;
        destinoY -= len;
    }
    return { x: destinoX, y: destinoY };
}

function gerarCorUnica(indice, total) {
    const hue = (indice * (360 / total)) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}