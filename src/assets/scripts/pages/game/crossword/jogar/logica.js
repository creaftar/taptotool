import { incrementarCaracteres, grid, placeholder, bauPALAVRAS, incrementarPalavasAcertadas, 
    incrementarPalavrasErradas, respostaEl, 
    qtdePalavras
} from "./preload";
import { somDeletar, somDigitar, somAcerto, somErro } from "./menulateral_jogar";
import { destaca_palavra, isMobile, SobrepoePalavra, TrocarPalavra,
    FocarProximaLetra, FocarPrimeiraPalavra, FocarProximaPalavra,
    FocarLetraAnterior, FocarPalavraAnterior, FocarUltimaPalavra,
    AtualizarIds, ResetFocoGlobal,
    verificarTodasCorretas
 } from "./areacruzadinhas_jogar";
import { AnimarDicasAcrescidas, BonificarJogador, PunirJogador } from "./dicas.js";
import { SalvarEstadoLS } from "../ferramentas/localstorage/salvar.js";

import { RecuperarDivGrid } from "./grid.js";
import { isColumn_orRow, AlterarDivAtiva } from "./areacruzadinhas_jogar";
import { idUSERLOGGED_CRZDKEY } from "./preload";
var inputFantasma = document.getElementById('inputFantasma');
//const area_cruzadinhasEl = document.getElementById('area-cruzadinhas');
var somAtual;

export var idFocado, idLetra;
const segmentadorCruzadinha = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function AtualizarIdFocado(id){
    idFocado = parseInt(id);
}

export function AtualizarIdLetra(id){
    idLetra = parseInt(id);
}

// Variável de controle para idiomas complexos (Hindi, Coreano, Emojis)
let estaCompondo = false;

if(!inputFantasma.hasEvt){
    
    // 1. Início da composição (caractere sendo montado)
    inputFantasma.addEventListener("compositionstart", () => {
        estaCompondo = true;
    });

    inputFantasma.addEventListener("compositionend", (e) => {
        e.preventDefault();
        estaCompondo = false;
        if (e.data)
            verifica_campo(e.data);
        else
            verifica_campo(inputFantasma.value);
    });

    inputFantasma.addEventListener("input", (e) => {
        if (estaCompondo) return;
        if(e.inputType !== "deleteContentBackward"){
            e.preventDefault();
            const valor = inputFantasma.value.trim();
            if (valor.length > 0) {
                verifica_campo(valor);
            }
        }
    });

    inputFantasma.addEventListener("keydown", (e) => {
    // 1. Backspace: Apagar e voltar
    if (e.key === "Backspace") {
        e.preventDefault();
        deleta_campo();
        return;
    }

    // 2. Espaço: Alternar orientação ou pular para próxima palavra
    if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        // Se a letra atual pertence a duas palavras, alterna entre elas (Horizontal/Vertical)
        // Caso contrário, apenas foca a próxima palavra disponível
        const letraAtual = bauPALAVRAS[idFocado].letras[idLetra];
        if (letraAtual.idPALAVRA.length > 1) {
            TrocarPalavra(idLetra, idFocado);
        } else {
            if (bauPALAVRAS[idFocado + 1]) FocarProximaPalavra(idFocado + 1);
            else FocarPrimeiraPalavra();
        }
        return;
    }

    // 3. Tab: Navegação cíclica entre palavras inteiras
    if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
            // Shift + Tab: Palavra anterior
            if (bauPALAVRAS[idFocado - 1]) {
                FocarPalavraAnterior(0, idFocado - 1);
            } else {
                FocarUltimaPalavra();
            }
        } else {
            // Tab: Próxima palavra
            if (bauPALAVRAS[idFocado + 1]) {
                FocarProximaPalavra(idFocado + 1);
            } else {
                FocarPrimeiraPalavra();
            }
        }
        return;
    }

    // 4. Setas Direcionais: Navegação fina por letra ou palavra
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();

        switch (e.key) {
            case "ArrowLeft":
            case "ArrowUp":
                if (idLetra > 0) {
                    FocarLetraAnterior(idLetra - 1, idFocado);
                } else if (bauPALAVRAS[idFocado - 1]) {
                    // Se estiver no início da palavra, vai para o fim da anterior
                    const indexUltimaLetraAnt = bauPALAVRAS[idFocado - 1].texto.length - 1;
                    FocarPalavraAnterior(indexUltimaLetraAnt, idFocado - 1);
                }
                else{
                    FocarUltimaPalavra();
                }
                break;

            case "ArrowRight":
            case "ArrowDown":
                if (idLetra < bauPALAVRAS[idFocado].texto.length - 1) {
                    FocarProximaLetra(idLetra + 1, idFocado);
                } else if (bauPALAVRAS[idFocado + 1]) {
                    // Se estiver no fim da palavra, vai para o início da próxima
                    FocarProximaPalavra(idFocado + 1);
                }
                else{
                    FocarPrimeiraPalavra();
                }
                break;
        }
    }
});

	/*if(isMobile){
        inputFantasma.addEventListener('focus', () => keyboardActivated = true);
        inputFantasma.addEventListener('blur', () => keyboardActivated = false);
    }*/
    inputFantasma.addEventListener("focusout", (e) => {
        const elementoFocado = e.relatedTarget;
        const clicouNoRevelar = elementoFocado && (elementoFocado.id === "revelar" || elementoFocado.closest("#revelar"));

        if (!clicouNoRevelar) {
            ResetFocoGlobal();
        }
    });
        
    inputFantasma.value = ' ';
    inputFantasma.hasEvt = true;
}

export async function focusPhantom(squareGroup = null, id = null, pChamando = false){
    let target;
    
    if(id === 0 || id)
        target = bauPALAVRAS[id].letras[0].div;
    else
        target = squareGroup;
    
    let dados = target.id.split(",");
    var idLetra = parseInt(dados[0]);
    let idPalavra = parseInt(dados[1]);
    
    SobrepoePalavra(idPalavra);
    destaca_palavra(idPalavra);
    
    AlterarDivAtiva(idLetra, idPalavra);
    AtualizarIds(idLetra, idPalavra);
    
    if(!pChamando)
        TrocarPalavra(idLetra, idPalavra);
    
    inputFantasma.focus();

    var placeholderHTML = placeholder[idPalavra];
    var spanDiv = grid[bauPALAVRAS[idPalavra].y][bauPALAVRAS[idPalavra].x].div.querySelector('.placeholder'); 

    if(spanDiv){
        spanDiv.textContent = placeholderHTML;
    }
}

var qtdeCertasTmp = 0;

import { palavraTmp } from "./preload";
function verifica_campo(texto){
    if (idFocado === undefined || idLetra === undefined || !bauPALAVRAS[idFocado]) return;
    if (!texto || typeof texto !== 'string' || texto.trim() === "") return;
    try {
        const entrada = texto.normalize('NFC');
        const segmentos = Array.from(segmentadorCruzadinha.segment(entrada));
        const letraDigitada = segmentos[segmentos.length - 1].segment;

        const letra = bauPALAVRAS[idFocado].letras[idLetra];
        const div = letra.textRect;
        
        if(letra.idLETRA.length > 1)
            palavraTmp[letra.GetidPALAVRA(1)][letra.GetIdLetraAtual(1)] = letraDigitada;
        
        //bauPALAVRAS[idFocado].letras[idLetra].idLETRA.length > 1
        div.textContent = letraDigitada;
        palavraTmp[idFocado][idLetra] = letraDigitada;
        
        if(bauPALAVRAS[idFocado].texto[idLetra + 1])
            FocarProximaLetra(idLetra + 1, idFocado, letraDigitada);
        else if(bauPALAVRAS[idFocado + 1])
            FocarProximaPalavra(idFocado + 1, letraDigitada);
        else
            FocarPrimeiraPalavra(letraDigitada);

        incrementarCaracteres();
        inputFantasma.value = ' ';
    } catch (err) {
        console.error("Erro na segmentação: ", err);
    } finally {
        // Limpa o input mas mantém o espaço fantasma para o próximo backspace
        inputFantasma.value = ' ';
    }
}

function deleta_campo(){
    bauPALAVRAS[idFocado].texto[idLetra].normalize('NFC');
    const div = RecuperarDivGrid(idFocado, idLetra, isColumn_orRow(idFocado)).textRect;
    inputFantasma.value = ' ';
    
    div.textContent = inputFantasma.value;
	palavraTmp[idFocado][idLetra] = ' ';

    if(bauPALAVRAS[idFocado].texto[idLetra - 1])
        FocarLetraAnterior(idLetra - 1, idFocado, ' ');
    else if(bauPALAVRAS[idFocado - 1])
        FocarPalavraAnterior(bauPALAVRAS[idFocado - 1].texto.length - 1, bauPALAVRAS[idFocado - 1].id);
    else
        FocarUltimaPalavra();
}

/*Depois que o usuário sair da palavra que está sobreposta, verificar a resposta*/
export async function verifica_resposta(idAutomatico, automatico = false){
    if(idAutomatico)
        AtualizarIdFocado(idAutomatico);
    
    const palavra = bauPALAVRAS[idFocado];
    const palavraDigitada = [];
    const id = idFocado;

    for(let i = 0; i < palavra.letras.length; i++){
        const letraDigitada = palavraTmp[idFocado][i];
        palavraDigitada.push(letraDigitada);
        const letraEsperada = palavra.letras[i];

        if(saoEquivalentes(letraDigitada, letraEsperada.texto))
            qtdeCertasTmp++;
    }
    
    if(qtdeCertasTmp == palavra.letras.length){
        if(idAutomatico)
            palavra.bonusGanhado = true;
        palavra.SetisPalavraCorreta(true);
        if(!automatico && !palavra.bonusGanhado){
            palavra.bonusGanhado = true;
            incrementarPalavasAcertadas();
            somAcerto.play();
            AnimarDicasAcrescidas(await BonificarJogador(palavra));
        }

        palavra.iconeEl.className = 'fa-solid fa-check icon-end-topic icon-end-topic-green';

        for(let i = 0; i < palavra.letras.length; i++){
            palavra.letras[i].rect.classList.remove("palavra-errada");
            palavra.letras[i].rect.classList.add("palavra-acertada");
        }
    }
    else{
        palavra.SetisPalavraCorreta(false);
        if(!automatico){
            incrementarPalavrasErradas();
            somErro.play();
            AnimarDicasAcrescidas(await PunirJogador());
            bauPALAVRAS[idFocado].SetisPalavraCorreta(false);
        }
        palavra.iconeEl.className = 'fa-solid fa-xmark icon-end-topic icon-end-topic-red';
        
        for(let i = 0; i < palavra.letras.length; i++){
            palavra.letras[i].rect.classList.remove("palavra-acertada");
            palavra.letras[i].rect.classList.add("palavra-errada");
        }
    }
    if(!automatico){
        SalvarEstadoLS(id, palavraDigitada, idUSERLOGGED_CRZDKEY);
    }
    qtdeCertasTmp = 0;
    verificarTodasCorretas();
}

/**
 * Retorna true se as strings forem equivalentes (ignorando acentos e case)
 * Funciona para Português, Russo, Grego, Árabe, etc.
 */
export function saoEquivalentes(str1, str2) {
    if (str1 === str2) return true; // Atalho para performance
    if (str1 == null || str2 == null) return false;

    const comparador = new Intl.Collator('en', { 
        sensitivity: 'base', 
        usage: 'search' 
    });

    return comparador.compare(str1, str2) === 0;
}