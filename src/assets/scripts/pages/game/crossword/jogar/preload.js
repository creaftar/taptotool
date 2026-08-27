import { SalvarJogandoLS } from "../ferramentas/localstorage/salvar.js";
import { AtualizarDisplay } from "./menulateral_jogar.js";

export var caracteresDigitados, palavrasErradas, palavrasAcertadas;
export var idUSERLOGGED_CRZDKEY;
export var respostaEl;
export var conteudoEl;
export var placeholder = [];
export var bauPALAVRAS = [];
export let palavraTmp = [];
export var titulo;
export let gridModule = null;
export var grid;
export let allpEl;
export var qtdePalavras = 0;

import { uid } from "./jogar_script.js";

//var gbrt, dica;
const traducoesEl = document.getElementById('traducoes');

const t = JSON.parse(traducoesEl.dataset.i18n);

const verticalEl = document.getElementById('VERTICAL');
const horizontalEl = document.getElementById('HORIZONTAL');
const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');

//const ldjsonScript = document.getElementById('ldjson-script');
//const ldjson = JSON.parse(ldjsonScript.textContent);

const dicasEl = document.getElementById("qtdeDicas");

/*var url = window.location.href;
var chave, conteudo,*/
var resposta, vw, vh, flexdir, quadro;
var vertcont = 0, horzcont = 0;
var vw = [], vh = [];

//var cpRef;


//texto, x, y, direcao, ligacoes, posicionada, id
class Palavra {
    #isPalavraCorreta;
    constructor(texto, x, y, direcao = null, ligacoes = 0, posicionada = false, id = -1, isPalavraCorreta = false, pEl) {
        this.texto = texto;
        this.x = x;
        this.y = y;
        this.direcao = direcao;
        this.id = id;

        //variavel para ver quantas palavras estão ligando uma nas outras
        this.ligacoes = ligacoes;

        //variavel para ver se a palavra foi posicionada
        this.posicionada = posicionada;
        this.#isPalavraCorreta = isPalavraCorreta;
		this.pEl = pEl;

        this.iconeEl = document.createElement('i');
        this.iconeEl.classList.add('icon-end-topic'); 

		if (this.pEl) {
            this.pEl.appendChild(this.iconeEl);
        }

		this.letras = [];
    }
    SetisPalavraCorreta(valor){
        this.#isPalavraCorreta = valor;
    }

    GetisPalavraCorreta(){
        return this.#isPalavraCorreta;
    }

	AdicionarNovaLetra(letra){
		this.letras.push(letra);
	}
    
}

export function incrementarCaracteres() {
    caracteresDigitados++;
}

export function incrementarPalavasAcertadas() {
    palavrasAcertadas++;
}

export function incrementarPalavrasErradas() {
    palavrasErradas++;
}

async function atualiza_dados(){
	const { conter_cruzadinhas } = await import("./redimensionar_jogar.js");
    const { FirstStartTimer } = await import("./menulateral_jogar.js");
    const { RecuperarDadosLS, RecuperarDicasLS } = await import("../ferramentas/localstorage/recuperar.js");
    //letras = document.querySelectorAll('.letra'); 
	//mescla_letras(qtdeLetras);
	caracteresDigitados = RecuperarDadosLS(idUSERLOGGED_CRZDKEY, "typedChars");
	caracteresDigitados = (Array.isArray(caracteresDigitados) && caracteresDigitados.length === 0) ? 0 : parseInt(caracteresDigitados, 10);
	palavrasAcertadas = RecuperarDadosLS(idUSERLOGGED_CRZDKEY, "Hits");
	palavrasAcertadas = (Array.isArray(palavrasAcertadas) && palavrasAcertadas.length === 0) ? 0 : parseInt(palavrasAcertadas, 10);
	palavrasErradas = RecuperarDadosLS(idUSERLOGGED_CRZDKEY, "Mistakes");
	palavrasErradas = (Array.isArray(palavrasErradas) && palavrasErradas.length === 0) ? 0 : parseInt(palavrasErradas, 10);
	timerstamp.textContent = RecuperarDadosLS(idUSERLOGGED_CRZDKEY, "TimeSpent");
	dicasEl.textContent = RecuperarDicasLS(uid);
	FirstStartTimer();
	
	if(!gridModule){
		gridModule = await import("./grid.js");
	}
	const { adicionaPlaceholder, montaGrid, grid: gridGridjs } = gridModule; 
	await montaGrid();
	grid = gridGridjs;
	adicionaPlaceholder();
	conter_cruzadinhas();
}

export async function set_dados() {
		const [
			{ getFirebase },
			{ RedirecionarUsuario },
			{ EsconderLoading },
			{ SetupMenuEvents }
		] = await Promise.all([
			import("../ferramentas/firebase.js"),
			import("./Redirect.js"),
			import("../ferramentas/traducao/traducao.js"),
			import("./menulateral_jogar.js")
		]);
		
		const fb = await getFirebase();
		const cpRef = fb.collection(fb.db, 'cruzadas');
		
		const url = window.location.href;
		const cdg = url.split("?cr=");
		if (cdg[1]) {
			try {
			const refDB = fb.doc(cpRef, cdg[1]);
			const item = await fb.getDoc(refDB);
			if(!item.data()){
				await RedirecionarUsuario();
			}
			titulo = item.data().titulo;
			resposta = item.data().resp;
			quadro = item.data().quadro ? item.data().quadro : 28; 
			vw = item.data().vw;
			vh = item.data().vh;
			flexdir = item.data().flexdir;
            
            if (item.exists()) {
                const data = item.data();
                const { titulo, cont, gbrt, dica } = data;

                conteudoEl = cont.split('`');
                document.title = `${titulo} - Tap to Tool`;
                const h1El = document.querySelector('h1');
                if (h1El) h1El.innerHTML = titulo;
                //UpdateDynamicSEO(titulo, descDinamica);

                SalvarJogandoLS(titulo, url);
                AtualizarDisplay(gbrt, dica);
                gera_cruzadinha();
            }
        } catch (error) {
            console.error(error);
        }
    }
	EsconderLoading();
	
	idUSERLOGGED_CRZDKEY = uid + cdg[1];
	SetupMenuEvents(); 
}

export async function set_dados_daily() {
		const [
			{ getFirebase },
			{ EsconderLoading },
			{ SetupMenuEvents },
			{ langURL }
		] = await Promise.all([
			import("../ferramentas/firebase.js"),
			import("../ferramentas/traducao/traducao.js"),
			import("./menulateral_jogar.js"),
			import("../ferramentas/traducao/traducao.js")
		]);
		
		const fb = await getFirebase();
		
		const dataObjeto = new Date();

		const ano = dataObjeto.getFullYear();
		const mes = String(dataObjeto.getMonth() + 1).padStart(2, '0'); // +1 porque Janeiro é 0
		const dia = String(dataObjeto.getDate()).padStart(2, '0');

		// Monta o ID exatamente como o Firestore espera: YYYY-MM-DD
		const hojeISO = `${ano}-${mes}-${dia}`;

		const idBusca = `${hojeISO}_${langURL}`;
		
		const url = window.location.href;
		
		try {
			const item = await fb.getDoc(fb.doc(fb.db, "cruzadinhas_diarias", idBusca));

			titulo = item.data().titulo;
			resposta = item.data().resp;
			quadro = item.data().quadro ? item.data().quadro : 28; 
			vw = item.data().vw;
			vh = item.data().vh;
			flexdir = item.data().flexdir;
			
			if (item.exists()) {
				const data = item.data();
				const { cont, gbrt, dica } = data;

				const opcoesData = { day: 'numeric', month: 'long', year: 'numeric' };
				const dataFormatada = dataObjeto.toLocaleDateString(langURL, opcoesData);
				titulo = `${t.daily.cruzada_diaria_h1}: <span class="data">${dataFormatada}</span>`

				conteudoEl = cont.split('`');
				const d1 = conteudoEl[0].substring(0, 50);
				const d2 = (conteudoEl.length > 2) ? conteudoEl[conteudoEl.length - 2].substring(0, 50) : "";
				
				
				const tituloTextoPuro = titulo.replace(/<[^>]*>?/gm, '');
				document.title = `${tituloTextoPuro} - Creaftar`;
				const descDinamica = `${tituloTextoPuro}${t.daily.curiosidade}"${d1}...", "${d2}..."${t.daily.CTA}`;
				const h1El = document.querySelector('h1');
				if (h1El) h1El.innerHTML = titulo;

				UpdateMeta('meta[name="description"]', descDinamica);
				UpdateMeta('meta[property="og:description"]', descDinamica);
				UpdateMeta('meta[property="og:title"]', `${tituloTextoPuro} - Creaftar`);
				UpdateMeta('meta[name="keywords"]', `${t.play.kw_cruzadinha}${tituloTextoPuro}, ${t.play.kw_jogo}${tituloTextoPuro}`);

				//UpdateDynamicSEO(tituloTextoPuro, descDinamica);

				SalvarJogandoLS(tituloTextoPuro, url);
				AtualizarDisplay(gbrt, dica);
				gera_cruzadinha();
			}
		} catch (error) {
			console.error(error);
		}
	EsconderLoading();
	
	idUSERLOGGED_CRZDKEY = uid + idBusca;
	SetupMenuEvents(); 
}

function UpdateMeta(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
}

async function UpdateDynamicSEO(titulo, descricao) {
    const scriptTag = document.getElementById('ldjson-script');
    if (!scriptTag) return;

    try {
        const data = JSON.parse(scriptTag.textContent);
        const fullTitle = `${titulo} - Creaftar`;
        const currentUrl = window.location.href;

        data["@graph"].forEach(node => {
            if (["WebPage", "Game"].includes(node["@type"])) {
                node.name = fullTitle;
                node.description = descricao;
                node.url = currentUrl;
            }
        });

        scriptTag.textContent = JSON.stringify(data);
    } catch (e) {
        console.error("Erro no JSON-LD:", e);
    }
}

async function gera_cruzadinha(){
	const { focusPhantom } = await import("./logica.js");
	const { SobrepoePalavra, destaca_palavra } = await import("./areacruzadinhas_jogar.js");
	
	respostaEl = resposta.split('`');
	var vwEl = vw.split('`');
	var vhEl = vh.split('`');
	var flexdirEl = flexdir.split('`');
	
	for(let i = 0; i < conteudoEl.length - 1; i++){
		qtdePalavras++;
		var pEl = document.createElement('p');
		pEl.setAttribute('id', 'paragrafo'+ i);
		pEl.classList.add ("paragrafos");
		pEl.addEventListener("click", function(){
			SobrepoePalavra(i);
			FocaPalavra(i);
			destaca_palavra(i);
			focusPhantom(null, i, true);
		});
		var letrasResp = respostaEl[i].split('');
		if(flexdirEl[i] == 'column'){
			vertcont++;
			pEl.innerHTML = '<span class="roxo roxo-play">' + vertcont +  ' - ' + '</span>' + conteudoEl[i];
			verticalEl.appendChild(pEl);
			placeholder[i] = vertcont;
		}
		else{
			horzcont++;
			pEl.innerHTML = '<span class="roxo roxo-play">' + horzcont +  ' - ' + '</span>' + conteudoEl[i];
			horizontalEl.appendChild(pEl);
			placeholder[i] = horzcont;
		}
		vh = vhEl[i].split('px')[0];
		vw = vwEl[i].split('px')[0];
		
		
		var posicao = {
			x: Math.round(vw / quadro),
			y: Math.round(vh / quadro)
		}

    	bauPALAVRAS[i] = new Palavra(letrasResp, posicao.x, posicao.y, flexdirEl[i], 0, false, i, false, pEl);
	}
	container_cruzadinhasEl.addEventListener("click", async function(evt) {
    	const squareGroup = evt.target.closest("g");
    
		if (squareGroup && container_cruzadinhasEl.contains(squareGroup)) {
			const { focusPhantom } = await import("./logica.js");
			const { RevelarLetra, modoDicaAtivo } = await import("./dicas.js")
			
			await focusPhantom(squareGroup);
			if (modoDicaAtivo)
				RevelarLetra(squareGroup);
		}
	}, false);
	
	palavraTmp = bauPALAVRAS.map(() => []);
	atualiza_dados();
	allpEl = document.querySelectorAll(".paragrafos");
}

function FocaPalavra(id){
	var divAtiva = document.querySelector('.divAtiva');

	if(divAtiva){
		divAtiva.classList.remove('divAtiva');
	}
	var letraInicial = document.getElementById('0,'+id);
	letraInicial.classList.add('divAtiva');
	letraInicial.scrollIntoView({behavior: "smooth", block: "center"});
}