import { scale } from "./redimensionar";
import { bauPalavras } from "./grid";

const gridVisual = document.getElementById("container-cruzadinhas");
const camadaContornos = document.getElementById("camada-contornos");
let elementos = [];

/**
 * Gera um grid na tela de acordo com o grid passado
 */
export async function GerarGridVisual(grid) {
    RemoverGridVisual(grid);
    for(let l = 0; l < grid.length; l++){
        for(let c = 0; c < grid[l].length; c++){
            let div = document.createElement("div");
            div.id = `${l},${c}`;
            div.classList.add("celula");
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
    
    // 3. Segundo loop: Desenha as pílulas
    bauPalavras.forEach((palavra, index) => {
        if (!palavra.posicionada) return;
        
        const destino = calcularDestino(palavra);
        const cor = gerarCorUnica(index, bauPalavras.length);

        desenharContorno(palavra.id, palavra.x, palavra.y, destino.x, destino.y, cor, grid);
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

/**
 * Desenha o contorno estilo "pílula" sobre as palavras neutralizando o efeito de escala (zoom)
 */
function desenharContorno(id, origemX, origemY, destinoX, destinoY, cor, grid) {
    const startEl = document.getElementById(`${origemY},${origemX}`);
    const endEl = document.getElementById(`${destinoY},${destinoX}`);

    if (!startEl || !endEl) return;

    // 1. Obtém o fator de zoom atualizado (garante fallback para 1 caso venha indefinido)
    const zoomAtual = scale || 1;

    // 2. Obtém as medidas físicas afetadas pelo zoom
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    const containerRect = camadaContornos.getBoundingClientRect();

    // 3. Calcula o centro físico na tela (ainda sob efeito do zoom)
    const centroStartX = startRect.left + startRect.width / 2;
    const centroStartY = startRect.top + startRect.height / 2;
    const centroEndX = endRect.left + endRect.width / 2;
    const centroEndY = endRect.top + endRect.height / 2;

    // 4. NEUTRALIZA o zoom para determinar o posicionamento dentro do container absolute
    // Dividir os deltas pelo zoom restabelece os pixels reais do CSS (escala 1:1)
    const topPos = (centroStartY - containerRect.top) / zoomAtual;
    const leftPos = (centroStartX - containerRect.left) / zoomAtual;

    // A distância física medida na tela também precisa ser reduzida/ampliada de volta ao normal
    const distancia = Math.hypot(centroEndX - centroStartX, centroEndY - centroStartY) / zoomAtual;
    
    // O ângulo em graus não muda com o zoom, permanece o mesmo
    const angulo = Math.atan2(centroEndY - centroStartY, centroEndX - centroStartX) * (180 / Math.PI);

    // Neutraliza o tamanho da espessura e altura
    const espessuraCelula = (startRect.width * 0.85) / zoomAtual;
    const larguraPilula = distancia + espessuraCelula;
    const alturaPilula = (startRect.height * 0.8) / zoomAtual;

    const pilula = document.createElement("div");
    pilula.classList.add("pill-contorno");
    pilula.id = `pilula${id}`;

    // 5. Aplicação dos estilos dinâmicos corrigidos
    Object.assign(pilula.style, {
        position: 'absolute',
        
        top: `${topPos}px`,
        left: `${leftPos}px`,
        
        width: `${larguraPilula}px`,
        height: `${alturaPilula}px`,
        
        backgroundColor: cor.replace('hsl', 'hsla').replace(')', ', 0.2)'), // 20% de opacidade
        border: `2px solid ${cor.replace('hsl', 'hsla').replace(')', ', 0.1)')}`,
        
        // Desloca metade da espessura neutralizada para trás no eixo X e centraliza no Y (-50%)
        transform: `translate(-${espessuraCelula / 2}px, -50%) rotate(${angulo}deg)`,
        transformOrigin: `${espessuraCelula / 2}px center`,
        
        pointerEvents: 'none',
        zIndex: 10,
        boxSizing: 'border-box'
    });

    camadaContornos.appendChild(pilula);
}

function calcularDestino(palavra) {
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
    // Divide os 360 graus do círculo cromático pelo total de palavras
    const hue = (indice * (360 / total)) % 360;
    return `hsl(${hue}, 100%, 50%)`; // Saturação 70%, Brilho 50% (cores vivas)
}