export var dados = [];
export var userLogged;
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;

const requisitosEl = document.getElementById('requisitos-salvar');
const qtdCrzd = document.getElementById('qtdCrzd');
const qtdUser = document.getElementById('qtdUser');

const campo_feedback = document.getElementById("campo_feedback");
const card_feedback = document.getElementById('card_feedback');
const enviar_feedback = document.getElementById("enviar_feedback");

let cruzadinhaEl = document.getElementById('conteudo-principal');
export let t = JSON.parse(cruzadinhaEl.dataset.i18n).index;

export let visibilidadeModule = null;

export var refId;
export var uid;

export let cardsRef;
export let db, auth, crzdsRef, usRef, estRef, qtcRef, fdbRef;
export let collection, doc, getDoc, setDoc, increment, updateDoc, deleteDoc;

function esperar(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

Inicializar();

export let NovoCard = null;

export function SetNovoCard(func){
    NovoCard = func;
}

let nomeColecaoCards = 'cards';
let nomeColecaoCruzadas = 'cruzadas';

export function SetVariaveisFirebase(config) {
    if (config.cards) nomeColecaoCards = config.cards;
    if (config.cruzadas) nomeColecaoCruzadas = config.cruzadas;
    // Se precisar mudar o documento de estatísticas, pode fazer o mesmo aqui
}

async function Inicializar(){
	const firebasePromise = import('../ferramentas/firebase.js').then(m => m.getFirebase());
	
	const promises = [
		firebasePromise,
		import('../ferramentas/el_visibilidade.js'), 
		import("../ferramentas/traducao/traducao.js"), 
		import("./homecards.js"),
		import("./menu_paginas.js"),
		import("./carrossel.js")
	];	
	const [fb, visibilidadeMod, traducaoMod, homecardsMod, menuMod, carrosselMod ] = await Promise.all(promises);
	const { EsconderLoading } = traducaoMod;
	const { SetQuemEstaChamando, SetLimiteCruzadinha } = homecardsMod;
	const { GerarListaDinamica } = menuMod;
	const { InicializarCarrossel, iniciarContadorProximaCruzadinha } = carrosselMod;

    /*if(!NovoCard)
        iniciarContadorProximaCruzadinha();*/
    
    visibilidadeModule = visibilidadeMod;

	db = fb.db;
    auth = fb.auth;
    collection = fb.collection;
    doc = fb.doc;
    getDoc = fb.getDoc;
    setDoc = fb.setDoc;
    increment = fb.increment;
    updateDoc = fb.updateDoc;
    deleteDoc = fb.deleteDoc;

    cardsRef = collection(db, nomeColecaoCards);
    crzdsRef = collection(db, nomeColecaoCruzadas);
    usRef = collection(db, 'usuarios');
    estRef = collection(db, 'estatisticas');
    fdbRef = doc(estRef, "Feedbacks");
    qtcRef = doc(estRef, "QtdeTotalCruzadinhas");
	
	if(isMobile){
		SetLimiteCruzadinha(10);
		document.getElementById("text-limit-pages").textContent = 10;
	}

	getDoc(qtcRef).then(async function(dado){
		dados[0] = dado.data().qtdeCruzadinhas;
		dados[1] = dado.data().qtdeUsuarios;
		qtdCrzd.innerHTML += "<span class='blue'> " + dados[0] + "</span>";
		qtdUser.innerHTML += "<span class='blue'> " + dados[1] + "</span>";

		SetQuemEstaChamando();
        if(!NovoCard)
            NovoCard = NovoCardPadrao;
		GerarListaDinamica(1, true);
	});

    MonitorarUsuario(fb, usRef);
    
	EsconderLoading();
	import('./aside.js');
	import('./minhascruzadinhas.js');
	import('../menu/pesquisa.js');
	InicializarCarrossel();
}

let sinalizarPronto;
export const FirebasePronto = new Promise((resolve) => {
    sinalizarPronto = resolve;
});

export let totalCard, dadoCard;

export function SetTotal(total){
    totalCard = total;
}

async function MonitorarUsuario(fb, usRef){ 
    const { IniciarMonitoramento } = await import("../menu/usuario.js");
    
    IniciarMonitoramento(async (user) => {
        const qtdCrzdUser = document.getElementById('qtdCrzdUser');
        if (user) {
            userLogged = true;
            uid = user.uid;
            
            try {
                const { doc, getDoc } = fb;
                refId = doc(usRef, user.uid);
                dadoCard = await getDoc(refId);

                if (dadoCard.exists() && qtdCrzdUser) {
                    await sinalizarPronto();
                    if(!totalCard)
                        totalCard = dadoCard.data().qtdeCruzadinhas;
                    qtdCrzdUser.innerHTML = `${t.logged_prompt} <span class='blue'>${totalCard}</span>`;
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        } 
        else {
            userLogged = false;
            if (qtdCrzdUser) {
                qtdCrzdUser.innerHTML = `<span class='blue'>${t.login_prompt}</span>`;
            }
        }
    });
}

export async function NovoCardPadrao(data, id, limiteCruzadinha, isPriority = false){
	const { DefinirInvisibilidade, AlternarVisibilidade } = visibilidadeModule;
	
	//AD DO GOOGLE --> cruzadinhaEl.appendChild(adEl);
	var dadosCruzadinha = data;
	var cruzadinhaId = id;
	let containerCard = document.createElement("div"); 
	let divEl = document.createElement("div");
	let divBotoes = document.createElement("div");

	containerCard.classList.add('container-card');
	divEl.classList.add('card');
	divBotoes.classList.add('card-botoes');

	let linkJogar = document.createElement("a");
	linkJogar.classList.add('linkJogar');
	linkJogar.href = `play/?cr=${cruzadinhaId}`;
    linkJogar.setAttribute('aria-label', `${t.aria.play_button} ${dadosCruzadinha.titulo}`);
	var dadosImgCard = await GerarImagemCard(dadosCruzadinha.resp, dadosCruzadinha.vh, dadosCruzadinha.vw, dadosCruzadinha.flexdir, dadosCruzadinha.titulo, dadosCruzadinha.quadro, isPriority);
	linkJogar.appendChild(dadosImgCard.img);			
	
	let botaoOpcoes = document.createElement("button");
	botaoOpcoes.classList.add('opcBtn');
	botaoOpcoes.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
	botaoOpcoes.setAttribute('aria-label', `${t.aria.options_button} ${dadosCruzadinha.titulo}`);
	divBotoes.appendChild(botaoOpcoes);
	
	let containerOpcoes = document.createElement("div");
	containerOpcoes.classList.add('containerOpc');
	divBotoes.appendChild(containerOpcoes);

	divEl.appendChild(linkJogar);
	let botaoLink = document.createElement("button");
	botaoLink.innerHTML = '<i class="fa-solid fa-link linkBtn"></i>';
	botaoLink.setAttribute('aria-label', `${t.aria.copy_link} ${dadosCruzadinha.titulo}`);
	botaoLink.addEventListener('click', function(e){CopiaLink(e, cruzadinhaId, containerOpcoes);});
	containerOpcoes.appendChild(botaoLink);
	
    let orderValue = Math.floor(Math.random() * limiteCruzadinha);

	if(dadosCruzadinha.uId == uid){
		let botaoEditar = document.createElement("button");
		var linkEditar = document.createElement("a");
		botaoEditar.setAttribute('aria-label', `${t.aria.edit_button} ${dadosCruzadinha.titulo}`);
		linkEditar.setAttribute('aria-label', `${t.aria.edit_button} ${dadosCruzadinha.titulo}`);
		botaoEditar.innerHTML = '<i class="fa-solid fa-pen-to-square editarBtn"></i>';
		linkEditar.appendChild(botaoEditar);
		linkEditar.href = "create/?cr=" + cruzadinhaId;
		containerOpcoes.appendChild(linkEditar);
		
		let botaoExcluir = document.createElement("button");
		botaoExcluir.innerHTML = '<i class="fa-solid fa-trash excluirBtn"></i>';
        botaoExcluir.setAttribute('aria-label', `${t.aria.delete_button} ${dadosCruzadinha.titulo}`);
		botaoExcluir.addEventListener('click', function(){removeDatabase(cruzadinhaId);});
		containerOpcoes.appendChild(botaoExcluir);

        if (dadosCruzadinha.data) {
            // Converte a data do Firebase (Timestamp ou String) para objeto Date
            // Se for Timestamp do Firebase, use dadosCruzadinha.data.toDate()
            // Se for string ISO, use new Date(dadosCruzadinha.data)
            const dataCriacao = dadosCruzadinha.data.toDate ? dadosCruzadinha.data.toDate() : new Date(dadosCruzadinha.data);
            const agora = new Date();
            
            // Diferença em milissegundos
            const diferencaEmMS = agora - dataCriacao;
            const umDiaEmMS = 24 * 60 * 60 * 1000;
            
            // Se a diferença for menor que 1 dia (24h), força a ordem para 0
            if (diferencaEmMS < umDiaEmMS) {
                orderValue = 0;
            }
        }
    }
    containerCard.style.setProperty('--random-order', orderValue);
	
	let divInfos = document.createElement("div");
    divInfos.classList.add("card-infos");
    divInfos.innerHTML = `<div class="header-card-infos">
                            <h2 class="titulo">${dadosCruzadinha.titulo}</h2>
                          </div>
                          <p class="ad aviso-ad description-card">
                            ${dadosImgCard.verticais + dadosImgCard.horizontais} ${t.words_found} - 
                            ${dadosImgCard.horizontais} ${t.horizontals} | 
                            ${dadosImgCard.verticais} ${t.verticals} 
                          </p>
                          <p class="timer-card"><span class="icone-pequeno">●</span> ${formatarTempoDecorridoDoFirebase(dadosCruzadinha.data)}</p>`;

	DefinirInvisibilidade(containerOpcoes);
	
	botaoOpcoes.addEventListener('click', function (event) {
		AlternarVisibilidade(containerOpcoes);
	});

	divEl.appendChild(divBotoes);
	containerCard.appendChild(divEl);
	containerCard.appendChild(divInfos);

	return containerCard;
}

export async function AdicionarLinguagem(){
	var { langURL } = await import("../ferramentas/traducao/traducao.js");
	var linguagem = langURL.toLowerCase();
	
	return linguagem == "en" ? '/' : `${linguagem}/`;
}

async function removeDatabase(key){
	const { MostrarLoading, EsconderLoading } = await import("../ferramentas/traducao/traducao.js");
	MostrarLoading(); 
	
	cruzadinhaEl.style.cssText = "display: none";
	var key = key;

    await Promise.all([
        setDoc(qtcRef, { qtdeCruzadinhas: increment(-1) }, { merge: true }),
        setDoc(refId, { qtdeCruzadinhas: increment(-1) }, { merge: true }),
        deleteDoc(doc(crzdsRef, key)),
        deleteDoc(doc(cardsRef, key))
    ]);
	EsconderLoading();

	window.location.href = window.location;
}

const requisitos_copiarEl = document.getElementById('requisitos-copiar');
export var loadBarMsgs = document.getElementsByClassName('loadBarMsg');

//var msgTo;
export async function CopiaLink(e, key, containerOpcoes, link) {
    const { langURL } = await import('../ferramentas/traducao/traducao.js');
    // 1. Impede que o clique "vaze" para o window e ative o fecharAoClicarFora
    e.stopPropagation(); 

    const { AparecerMensagem, RemoverVisibilidade } = await import('../ferramentas/el_visibilidade.js');
    
    
    if(!link)
        link = `https://taptotool.com/${langURL == 'en' ? '' : (langURL + '/')}game/crossword/play/?cr=${key}`;

    // 3. Copia para o clipboard
    try {
        await navigator.clipboard.writeText(link);
        
        // 4. SEQUÊNCIA DE UI:
        // Primeiro: Mostra o aviso de sucesso (Requisitos Copiar)
        await AparecerMensagem(requisitos_copiarEl);
        
        // Segundo: Fecha o menu de opções IMEDIATAMENTE
        // Usamos RemoverVisibilidade direto para não ter erro de "false/true" do Alternar
        RemoverVisibilidade(containerOpcoes);

    } catch (err) {
        console.error("Erro ao copiar link:", err);
    }
}
	
enviar_feedback.addEventListener('click', EnviarFeedback);

var feedbacksEnviados = 0;
async function EnviarFeedback(){
	const { AparecerMensagem, AlternarVisibilidade } = await import('../ferramentas/el_visibilidade.js');
	//Cancelar();
	feedbacksEnviados++;
	if(!uid){
		uid = "UserNotLogged";
	}
    
	AparecerMensagem(requisitosEl, 6000);
	AlternarVisibilidade(card_feedback);
	
	await updateDoc(fdbRef, { [uid + ' - msg ' + feedbacksEnviados]: campo_feedback.value });
	campo_feedback.value = "";
}

const agora = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
export function formatarTempoDecorrido(timestamp) {
    const agora = new Date().getTime() / 1000;
    const dif = Math.floor(agora - timestamp);
    const tm = t.time;

    if (dif < 60) return `${dif} ${dif === 1 ? tm.second : tm.seconds}`;
    if (dif < 3600) {
        const m = Math.floor(dif / 60);
        return `${m} ${m === 1 ? tm.minute : tm.minutes}`;
    }
    if (dif < 86400) {
        const h = Math.floor(dif / 3600);
        return `${h} ${h === 1 ? tm.hour : tm.hours}`;
    }
    if (dif < 2592000) {
        const d = Math.floor(dif / 86400);
        return `${d} ${d === 1 ? tm.day : tm.days}`;
    }
    if (dif < 31536000) {
        const mes = Math.floor(dif / 2592000);
        return `${mes} ${mes === 1 ? tm.month : tm.meses}`;
    }
    const a = Math.floor(dif / 31536000);
    return `${a} ${a === 1 ? tm.year : tm.years}`;
}

export function formatarTempoDecorridoDoFirebase(timestampDoFirebase) {
	const milissegundos = timestampDoFirebase.seconds * 1000 + timestampDoFirebase.nanoseconds / 1000000;
	return formatarTempoDecorrido(Math.floor(milissegundos / 1000)); // Usando a função anterior
}

const canvasGlobal = document.createElement('canvas');
const ctxGlobal = canvasGlobal.getContext('2d', { 
    alpha: true, 
    desynchronized: true
});

let FILL_COLOR = "#fff";
let STROKE_COLOR = "63, 63, 116";

// Só executa se estiver no navegador
if (typeof window !== "undefined") {
    const styleCached = getComputedStyle(document.documentElement);
    FILL_COLOR = styleCached.getPropertyValue("--index-rect-fill").trim() || "#fff";
    STROKE_COLOR = "63, 63, 116";
}

export async function GerarImagemCard(palavras, topDB, leftDB, flexdirDB, titulo, quadro, isPriority = false) {
    return new Promise((resolve, reject) => {
        const quadrado = 9;
        const quadroDB = quadro || 28;
        const offsetStroke = 1;
        
        const respostas = palavras.split('`').filter(Boolean);
        const left = leftDB.split('`');
        const top = topDB.split('`');
        const flexdir = flexdirDB.split('`');

        let maxW = 0, maxH = 0, v = 0, h = 0;
        let pathData = "";

        for (let i = 0; i < respostas.length; i++) {
            const p = respostas[i];
            const isCol = flexdir[i] === 'column';
            const xBase = (parseFloat(left[i]) / quadroDB) * quadrado;
            const yBase = (parseFloat(top[i]) / quadroDB) * quadrado;

            if (isCol) v++; else h++;

            for (let j = 0; j < p.length; j++) {
                const x = Math.round(isCol ? xBase : xBase + (j * quadrado)) + offsetStroke;
                const y = Math.round(isCol ? yBase + (j * quadrado) : yBase) + offsetStroke;
                pathData += `M${x},${y}h${quadrado}v${quadrado}h-${quadrado}z `;
                if (x + quadrado > maxW) maxW = x + quadrado;
                if (y + quadrado > maxH) maxH = y + quadrado;
            }
        }

        const finalW = maxW + offsetStroke;
        const finalH = maxH + offsetStroke;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", `0 0 ${finalW} ${finalH}`);
        svg.setAttribute("width", finalW);
        svg.setAttribute("height", finalH);

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", FILL_COLOR);
        path.setAttribute("stroke", `rgba(${STROKE_COLOR}, 0.9)`);
        path.setAttribute("stroke-width", "1");
        path.setAttribute("shape-rendering", "crispEdges");
        svg.appendChild(path);

        const serialized = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
        const urlSVG = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
            // USANDO O ÚNICO CANVAS GLOBAL
            canvasGlobal.width = finalW;
            canvasGlobal.height = finalH;
            
            // Limpamos o desenho do card anterior antes de desenhar o novo
            ctxGlobal.clearRect(0, 0, finalW, finalH);
            ctxGlobal.drawImage(img, 0, 0);
            
            URL.revokeObjectURL(urlSVG);

            canvasGlobal.toBlob(blob => {
                const imgUrl = URL.createObjectURL(blob);
                const imgElement = document.createElement('img');
                imgElement.src = imgUrl;
                imgElement.alt = `${t.crossword_by}${titulo}`;
                
                // Configuração de carregamento inteligente
                imgElement.loading = isPriority ? "eager" : "lazy";
                imgElement.decoding = "async";
                if (isPriority) imgElement.setAttribute("fetchpriority", "high");
                
                imgElement.dataset.blobUrl = imgUrl;
                resolve({ img: imgElement, verticais: v, horizontais: h });
            }, 'image/webp', 0.8);
        };

        img.onerror = () => {
            URL.revokeObjectURL(urlSVG);
            reject(new Error('Erro na geração da imagem.'));
        };

        img.src = urlSVG;
    });
}