import { uid } from "./jogar_script";
import { bauPALAVRAS, palavraTmp } from "./preload";
import { idLetra, idFocado } from "./logica";

const dicasEl = document.getElementById("qtdeDicas");

export async function BonificarJogador() {
	const { SalvarDicasLS } = await import("../ferramentas/localstorage/salvar");
	var qtdeDicas = parseInt(dicasEl.textContent); 
	var dicasAcrescidas = await AcrescentarDicas();
	qtdeDicas += dicasAcrescidas;
	SalvarDicasLS(qtdeDicas, uid);
	dicasEl.textContent = qtdeDicas;
	return dicasAcrescidas;
}

export async function PunirJogador(qtdeEspecifica = 0){
	const { SalvarDicasLS } = await import("../ferramentas/localstorage/salvar");
	var dicasAcrescidas = RemoverDicas();
	if (qtdeEspecifica != 0){
		dicasAcrescidas = qtdeEspecifica; 
	}
	var qtdeDicas = parseInt(dicasEl.textContent);
	if(qtdeDicas > dicasAcrescidas){
		qtdeDicas -= dicasAcrescidas;
		SalvarDicasLS(qtdeDicas, uid);
		dicasEl.textContent = qtdeDicas; 
		return dicasAcrescidas *= -1;
	}
	else if(qtdeDicas > 0){
		qtdeDicas--;
		SalvarDicasLS(qtdeDicas, uid);
		dicasEl.textContent = qtdeDicas;
		return -1;
    }
	else{
    	dicasEl.textContent = 0;
		return 0;
	}
}

async function AcrescentarDicas(){
    const { respostasExibidas } = await import("./menulateral_jogar");
    var dicasAcrescidas = 0;

	if(!respostasExibidas){
		var randomNumber = Math.random(); // Gera um número entre 0 (inclusive) e 1 (exclusive)

        if (randomNumber < 0.03) { // 3% de chance
            dicasAcrescidas = 3;
        } else if (randomNumber < 0.03 + 0.25) { //25% de chance 
            dicasAcrescidas = 2;
        } else if (randomNumber < 0.03 + 0.25 + 0.72) { //72% de chance (a soma tem que dar 100%)
            dicasAcrescidas = 1;
        }
	}
	return dicasAcrescidas;
}

function RemoverDicas(){
	var dicasRemovidas = 0;
	var randomNumber = Math.random(); // Gera um número entre 0 (inclusive) e 1 (exclusive)

        if (randomNumber < 0.01) { // 1% de chance
            dicasRemovidas = 1;
        } else if (randomNumber < 0.01 + 0.20) { // 20% de chance
            dicasRemovidas = 2;
        } else if (randomNumber < 0.01 + 0.20 + 0.79) { //79% de chance (a soma tem que dar 100%)
            dicasRemovidas = 3;
        }
	return dicasRemovidas;
}

const dicaAnimadaEl = document.getElementById('dica-animada');
export async function AnimarDicasAcrescidas(qtdeDicas) {
	
	dicaAnimadaEl.classList.remove('animar');
    dicaAnimadaEl.classList.add('animar');
	
	if(qtdeDicas > 0)
		dicaAnimadaEl.textContent = '+'+qtdeDicas;
	else if(qtdeDicas < 0)
		dicaAnimadaEl.textContent = '-'+qtdeDicas;
	else
		dicaAnimadaEl.textContent = 0;

    setTimeout(() => {
        dicaAnimadaEl.classList.remove('animar');
    }, 1200);
}

var revelarEl = document.getElementById("revelar");
revelarEl.addEventListener('click', SelecionarLetraRevelada);

const bodyEl = document.querySelector("body");
export let modoDicaAtivo = false;

function SelecionarLetraRevelada() {
    modoDicaAtivo = true;
    bodyEl.style.cursor = "crosshair";
    // Não precisamos mais do document.addEventListener('click', RevelarLetra...) aqui
}

export function RevelarLetra(squareGroup) {
    const qtdeDicas = parseInt(dicasEl.textContent);
    if (qtdeDicas > 0) {
        // Agora o idFocado e idLetra ESTÃO GARANTIDOS pelo focusPhantom que acabou de rodar
        const letraCorreta = bauPALAVRAS[idFocado].texto[idLetra];
        
        // Revela no texto principal
        const textoEl = squareGroup.querySelector(".texto-padrao");
        textoEl.textContent = letraCorreta;
        
        // Salva no seu array temporário para o jogo saber que a letra está lá
        palavraTmp[idFocado][idLetra] = letraCorreta;
        
        PunirJogador(1);
        
        // Opcional: validar se a palavra completou
        import("./logica.js").then(m => m.verifica_resposta(idFocado, true));
    }
	modoDicaAtivo = false;
	bodyEl.style.cursor = "default";
}


/*function RevelarLetra(){
	if(qtdeDicas > 0){
		divAtiva.textContent = letraARevelar;
		PunirJogador(1);
	}
	bodyEl.style.cursor = "default";
}*/