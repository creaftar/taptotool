import { MarcarCorreta } from "../cartoes/palavras";
import { bauPalavras } from "./grid";
import { calcularDestino } from "./grid_visual";
//import { VencerJogo } from "./vencer";

const audioAcerto = document.getElementById("correct-sound");
const palavrasCorretas = [];
//const audioErro = document.getElementById("wrong-sound");

export function VerificarRespostaPorPosicao(startC, startL, endC, endL) {
    const palavraEncontrada = bauPalavras.find(p => {
        if (p.descoberta) return false;

        const dest = calcularDestino(p); 

        const ordemDireta = (startC === p.x && startL === p.y && endC === dest.x && endL === dest.y);
        const ordemInversa = (startC === dest.x && startL === dest.y && endC === p.x && endL === p.y);

        return ordemDireta || ordemInversa;
    });

    if (palavraEncontrada) {
        palavrasCorretas.push(palavraEncontrada);
        if (audioAcerto) audioAcerto.play();
        
        palavraEncontrada.descoberta = true;
        MarcarCorreta(palavraEncontrada.div);
        
        verificarTodasCorretas();

        return palavraEncontrada;
    }

    return null;
}

/**
 * Verifica se o jogo acabou da forma mais rápida possível (Complexidade O(N))
 */
function verificarTodasCorretas() {
    const fimDeJogo = bauPalavras.every(palavra => palavra.descoberta);

    if (fimDeJogo) {
        console.log("🏆 Parabéns! Você encontrou todas as palavras!");
    }
}