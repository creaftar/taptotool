//import { doc, collection, getDoc } from 'firebase/firestore';
import { SalvarDadosLS } from "../ferramentas/localstorage/salvar.js";
import { timerstamp } from "./menulateral_jogar.js";
import { 
	bauPALAVRAS, gridModule, allpEl, caracteresDigitados,
	conteudoEl, palavrasAcertadas, palavrasErradas, idUSERLOGGED_CRZDKEY,
	qtdePalavras
} from "./preload.js";
import { AtualizarIdFocado, AtualizarIdLetra, verifica_resposta } from "./logica.js";
import { RecuperarDivGrid } from "./grid.js";

let keyboardActivated = false;
export var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
var cruzadinhaVencida = false;

document.addEventListener("keydown", function(event) {
    if (event.key === "F5") {
		event.preventDefault();
		//reset_destaca_palavra();
		window.location.reload();
   	}
});

//funcao para retornar se a palavra é column
export function isColumn_orRow(id){
	var is = "row";
	if(bauPALAVRAS[id].direcao == "column"){
		is = "column";
	}
	return is;
}

/**
 * funcao para alterar os ids das palavras que se sobrepoe para focar na que o usuario clickar
 **/
export async function SobrepoePalavra(id){
	var direcaoGrid = "row";
	var divGrid;
	var cont = 0;
	const svgContainerEl = document.getElementById("area-quadrados");
	
	//se existir a palavra (tem como nao existir se o usuario digitar na ultima letra da ultima palavra, ai passaria pra primeira)
	if(bauPALAVRAS[id]){
		while(cont < bauPALAVRAS[id].texto.length){
			direcaoGrid = isColumn_orRow(id);
			
			divGrid = RecuperarDivGrid(id, cont, direcaoGrid);
			divGrid.div.id = cont +','+id;
			
			while(divGrid.GetidPALAVRA() !== /*bauPALAVRAS[id].*/id){
				//Removo a classe antiga pra tirar o id da palavra, altero o id do grid e adiciono ele para a div
				divGrid.div.classList.remove("PALAVRA" + divGrid.GetidPALAVRA());
				divGrid.AlternarPALAVRA();
				divGrid.div.classList.add("PALAVRA" + divGrid.GetidPALAVRA());
			}
			svgContainerEl.append(divGrid.div);
			cont++;
		}
		return true;
	}
	else{
		return false;
	}
}

export function TrocarPalavra(idLetra, idPalavra) {
    const letraAnalisada = bauPALAVRAS[idPalavra].letras[idLetra];
    
    if (letraAnalisada?.idPALAVRA.length > 1) {
		
        letraAnalisada.AlternarPALAVRA(); 
        const novoIdFocado = letraAnalisada.GetidPALAVRA();

        const novoIndiceLetra = bauPALAVRAS[novoIdFocado].letras.indexOf(letraAnalisada);
        letraAnalisada.div.id = `${novoIndiceLetra},${novoIdFocado}`;

        // 4. Sincroniza o estado global
		AtualizarIds(novoIndiceLetra, novoIdFocado);
    	AlterarDivAtiva(novoIndiceLetra, novoIdFocado);
        
    	SobrepoePalavra(novoIdFocado);
        destaca_palavra(novoIdFocado);

		return true;
    }
	return false;
}

let ultimoItemFocado = null;
let letrasDestacadasAnteriores = [];
const container_verthorz = document.getElementById('container-vertical_horizontal');

export function destaca_palavra(id) {
    letrasDestacadasAnteriores.forEach(letra => {
        letra.div.classList.remove("destaque-quadrado");
    });
    
	letrasDestacadasAnteriores = [];

    const palavraAtual = bauPALAVRAS[id];
    palavraAtual.letras.forEach(letra => {
        letra.div.classList.add("destaque-quadrado");
        letrasDestacadasAnteriores.push(letra);
    });

    const pElNovo = palavraAtual.pEl;

    if (!container_verthorz.classList.contains('modo-jogando')) {
        container_verthorz.classList.add('modo-jogando');
    }

    if (ultimoItemFocado) {
        ultimoItemFocado.classList.remove("p-focado");
    }

    if (pElNovo) {
        pElNovo.classList.add("p-focado");
        ultimoItemFocado = pElNovo;
        pElNovo.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

let celulaAtiva = null; // Memória da célula do grid
export function AlterarDivAtiva(idLetra, idPalavra) {
    const divAtivaNova = bauPALAVRAS[idPalavra].letras[idLetra]?.div;
	if (celulaAtiva) {
        celulaAtiva.classList.remove('divAtiva');
    }

    if (divAtivaNova) {
        divAtivaNova.classList.add('divAtiva');
        celulaAtiva = divAtivaNova; // Atualiza a memória
    }
}

export function ResetFocoGlobal(automatico = false) {
    if (letrasDestacadasAnteriores.length > 0) {
        letrasDestacadasAnteriores.forEach(letra => {
            letra.div.classList.remove("destaque-quadrado");
        });
        letrasDestacadasAnteriores = [];
    }

    if (celulaAtiva) {
        celulaAtiva.classList.remove('divAtiva');
        celulaAtiva = null;
    }

    if (ultimoItemFocado) {
        ultimoItemFocado.classList.remove("p-focado");
        ultimoItemFocado = null;
    }

    if (container_verthorz) {
        container_verthorz.classList.remove('modo-jogando');
    }
    
    inputFantasma.blur();

	if(!automatico)
		verifica_resposta();
}

export async function verificarTodasCorretas(){
	var qtdePalavrasCorretas = 0;
	for(var i = 0; i < bauPALAVRAS.length; i++){
		if(bauPALAVRAS[i].GetisPalavraCorreta()){
			qtdePalavrasCorretas++;
		}
	}
	if(qtdePalavrasCorretas == bauPALAVRAS.length && !cruzadinhaVencida){
		const { vencerCruzadinha } = await import ("./vencer.js");
		cruzadinhaVencida = vencerCruzadinha();
	}
}

window.addEventListener('beforeunload', function (e) {
	SalvarDadosLS("Hits", palavrasAcertadas, idUSERLOGGED_CRZDKEY);
	SalvarDadosLS("Mistakes", palavrasErradas, idUSERLOGGED_CRZDKEY);
	SalvarDadosLS("typedChars", caracteresDigitados, idUSERLOGGED_CRZDKEY);
	SalvarDadosLS("TimeSpent", timerstamp.textContent, idUSERLOGGED_CRZDKEY);
	//e.returnValue = ''; // Alguns navegadores exigem que você defina returnValue para uma string vazia
});

export function FocarProximaLetra(idLetra, idPalavra){
	AtualizarIds(idLetra, idPalavra);
	AlterarDivAtiva(idLetra, idPalavra);
}

export function FocarProximaPalavra(idPalavra){
	verifica_resposta();
	SobrepoePalavra(0, idPalavra);
	destaca_palavra(idPalavra);
	AtualizarIds(0, idPalavra);
	AlterarDivAtiva(0, idPalavra);
	celulaAtiva.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function FocarPrimeiraPalavra(){
	verifica_resposta();
	SobrepoePalavra(0, 0);
	destaca_palavra(0);
	AtualizarIds(0, 0);
	AlterarDivAtiva(0, 0);
	celulaAtiva.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function FocarLetraAnterior(idLetra, idPalavra){
	AtualizarIds(idLetra, idPalavra)
	AlterarDivAtiva(idLetra, idPalavra);
}

export function FocarPalavraAnterior(idLetra, idPalavra){
	verifica_resposta();
	SobrepoePalavra(idLetra, idPalavra);
	destaca_palavra(idPalavra);
	AtualizarIds(idLetra, idPalavra);
	AlterarDivAtiva(idLetra, idPalavra);
	celulaAtiva.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function FocarUltimaPalavra(){
	verifica_resposta();
	SobrepoePalavra(bauPALAVRAS[qtdePalavras - 1].texto.length - 1, qtdePalavras - 1);
	destaca_palavra(qtdePalavras - 1);
	AtualizarIds(bauPALAVRAS[qtdePalavras - 1].texto.length - 1, qtdePalavras - 1);
	AlterarDivAtiva(bauPALAVRAS[qtdePalavras - 1].texto.length - 1, qtdePalavras - 1);
	celulaAtiva.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function AtualizarIds(idLetra, idPalavra){
	AtualizarIdLetra(parseInt(idLetra));
	AtualizarIdFocado(parseInt(idPalavra));
	/*console.log(bauPALAVRAS[idPalavra]);
	console.log(idLetra, idPalavra);
	
	console.log(bauPALAVRAS[idPalavra].texto[idLetra], bauPALAVRAS[idPalavra]);*/
}