import { 
	usRef, 
	crzdsRef,
	cardsRef,
	estRef } from "./editor_script.js";
import { qtdePalavras, respostasString, conteudosString, SetarCrosshairSection } from "./cartoes.js";

import { uid } from "./editor_script.js";

export let verthoriz = false;
export var sectionEditavel;
let redimensionarModule = null;

let traducoesEl = document.getElementById("traducoes-create"); 
let t = JSON.parse(traducoesEl.dataset.i18n);

let areacruzadinhasModule = null;

var respostasDB = '';

const h1El = document.querySelector("h1");

const tituloEl = document.getElementById('titulo-input');
const requisitosEl = document.getElementById('requisitos-salvar');
const textoRequisitosEl = document.getElementById('texto-requisitos');
//const closemodalsBtn = document.querySelectorAll('.close-modal');
const salvarmodalBtn = document.getElementById('salvarmodal');

const modalEl = document.querySelectorAll('.modal-salvar');
const closeSalvarsBtn = document.querySelectorAll('.close-salvar');
const menuAvancadoEl = document.getElementById('menu-avancado'); 

closeSalvarsBtn.forEach((closemodal, i) => {
	closemodal.addEventListener('click', async () =>{
		const { FecharModal } = await import("../ferramentas/el_visibilidade.js");
		FecharModal(modalEl[i]);
	});
});

const zoomAdd = document.getElementById('zoomadd');
const zoomRmv = document.getElementById('zoomrmv');
const askBtn = document.getElementById('pergunta');
//const mpageBtn = document.getElementById('mpage');

const interruptorBtn = document.getElementById('interruptor');
const numeditavelEl = document.getElementById('numeditavel');
const avancarBtn = document.getElementById('avancar');
const recuarBtn = document.getElementById('recuar');
const verthorzBtn = document.getElementById('verthoriz');
const gerarBtn = document.getElementById('gerar'); //Talvez alterar esse aqui, split codding
const salvarBtn = document.getElementById('salvar');
const menuAvancadoBtn = document.getElementById('botao-menu-avancado');

let editavel = false, autopos = true;

menuAvancadoBtn.addEventListener('click', MostrarMenuAvancado);
interruptorBtn.addEventListener('click', interruptor); //onclick="interruptor(true);"
avancarBtn.addEventListener('click', avancar);
recuarBtn.addEventListener('click', recuar);
verthorzBtn.addEventListener('click', verticalhorizontal);
gerarBtn.addEventListener('click', interruptor_autopos); //Talvez alterar esse aqui, split codding
gerarBtn.addEventListener('click', autopos_cruzadinha); //Talvez alterar esse aqui, split codding
//mpageBtn.addEventListener('click', movimentar_pagina);
salvarBtn.addEventListener('click', salvar);

salvarmodalBtn.addEventListener('click', verifica_salva);
askBtn.addEventListener('mouseover', ()=>{
	const iconePergunta = askBtn.querySelector('i.brilhante'); // Seleciona o icone dentro do li.
	if (iconePergunta) {
		iconePergunta.classList.remove('brilhante');
		askBtn.classList.remove('brilhanteLi');
		iconePergunta.style.filter = "brightness(1)";
	}
});
askBtn.addEventListener('click', ComoCriar);


/*PAREI DAQUI*/
async function MostrarMenuAvancado(event){
	event.stopPropagation();
	const { AlternarVisibilidade } = await import("../ferramentas/el_visibilidade.js");
	AlternarVisibilidade(menuAvancadoEl);
	menuAvancadoEl.addEventListener('click', function(e){
		e.stopPropagation();
	});
}

async function ComoCriar(){
	const { AbrirCopyModal } = await import("./copy/modal.js");
	const textoAtual = respostasString.map((palavra, index) => {
        return {
            palavra: palavra,
            dica: conteudosString[index] || ""
        };
    });
	AbrirCopyModal(textoAtual);
}


//funcao que funciona como interruptor para o botao editavel//
export function interruptor(botaoChamando){
	if(botaoChamando){
		editavel = !editavel;
		if(editavel){
			interruptorBtn.style.color = 'var(--aside-voce)';
			interruptorBtn.innerHTML = `<div class="info-icons">${t.js_messages.move_allow}</div><i class="fa-solid fa-pen-to-square fa-lg"></i>`;
			if(autopos){
				interruptor_autopos(true); //Chamando o interruptor como se fosse o botão clickado, para que não seja permitido editar na cruzadinha
			}
		}
		else{
			interruptorBtn.style.color = 'var(--close-modal)';
			interruptorBtn.innerHTML = `<div class="info-icons">${t.js_messages.move_block}</div><i class="fa-regular fa-pen-to-square fa-lg"></i>`;
		}
		if(sectionEditavel){
			SetarCrosshairSection(sectionEditavel);
		}
	} 
	return editavel;
}
function interruptor_autopos(botaoChamando){
	if(botaoChamando){
		autopos = !autopos;
		if(autopos){
			gerarBtn.innerHTML = `<div class="info-icons">${t.js_messages.auto_pos_enabled}</div><i class="fa-solid fa-object-ungroup fa-lg"></i>`;
			gerarBtn.style.color = 'var(--aside-voce)';
		}
		else{
			gerarBtn.innerHTML = `<div class="info-icons">${t.js_messages.auto_pos_disabled}</div><i class="fa-regular fa-object-ungroup fa-lg"></i>`;
			gerarBtn.style.color = 'var(--close-modal)';
		}
	} 
	return autopos;
}

export function Setnumeditavel(num){
	numeditavelEl.textContent = num;
}
export function Getnumeditavel(asInt = false) {
    if (asInt) {
		return parseInt(numeditavelEl.textContent); // Retorna 10
	}
	return numeditavelEl.textContent; // Retorna "10"
}
//funcao que adiciona +1 da palavra a ser editada//
function avancar(){
	var numeditavel = numeditavelEl.textContent;
	if(numeditavel < respostasString.length){
		numeditavel++;
	}
	else if(respostasString.length > 0){
		numeditavel = 1;
	}
	else{
		numeditavel = 0;
	}
	numeditavelEl.textContent = numeditavel;
	if(sectionEditavel){
		sectionEditavel.style.cursor = 'no-drop';
        sectionEditavel = document.getElementById('PALAVRA'+numeditavelEl.textContent);
	}
	if(interruptor(false) && sectionEditavel){
		sectionEditavel.style.cursor = 'crosshair';
	}
}

//funcao que subtrai -1 da palavra a ser editada//
function recuar(){
	var numeditavel = numeditavelEl.textContent;
	if(numeditavel <= 1 && respostasString.length > 0){
		numeditavel = respostasString.length;
	}
	else if(numeditavel > 1){
		numeditavel--;
	}
	else{
		numeditavel = 0;
	}
	numeditavelEl.textContent = numeditavel;
	if(sectionEditavel){
		sectionEditavel.style.cursor = 'no-drop';
        sectionEditavel = document.getElementById('PALAVRA'+numeditavelEl.textContent);
	}
	if(interruptor(false) && sectionEditavel){
		sectionEditavel.style.cursor = 'crosshair';
	}
}

//funcao que define se a palavra a ser editada ficara na horizontal ou vertical//
function verticalhorizontal(){
	verthoriz = !verthoriz;
	if(verthoriz){
		verthorzBtn.innerHTML = `<div class="info-icons">${t.js_messages.toggle_direction}</div><i class="fa-solid fa-grip-vertical verthoriz-icon fa-lg"></i>`;
	}
	else{
		verthorzBtn.innerHTML = `<div class="info-icons">${t.js_messages.toggle_direction}</div><i class="fa-solid fa-grip verthoriz-icon fa-lg"></i>`;
	}
	return verthoriz;
}

//funcao para posicionar a cruzadinha automaticamente
export async function autopos_cruzadinha(){
	if(autopos){
		if(!areacruzadinhasModule){
			areacruzadinhasModule = await import("./areacruzadinhas.js");
		}
		const { autoposPalavras } = areacruzadinhasModule;
		if(editavel){
			interruptor(true);
		}
		for(var i = 0; i < 10 && !await autoposPalavras(); i++);

		if(!redimensionarModule){
			redimensionarModule = await import('./redimensionar.js');
		}
		const { conter_cruzadinhas } = redimensionarModule;
		conter_cruzadinhas();
		await SalvarDadosIDB();
	}
}

async function SalvarDadosIDB(){
	const { bauPALAVRAS } = await import('./cartoes.js');
    const { SalvarArraysPosicao_i_db } = await import("../lib/rascunhoeditor.js");
    
    for(var i = 1; i <= qtdePalavras; i++){
        if(bauPALAVRAS[i]){
            await SalvarArraysPosicao_i_db(bauPALAVRAS[i].section.style.left, bauPALAVRAS[i].section.style.top, bauPALAVRAS[i].flexdir);
        }
    }
}

//funcao que adiciona scroll horizontal na pagina
/*function movimentar_pagina(){
	mpage = !mpage;
	
    if(mpage){
        area_cruzadinhasEl.style.cssText += 'overflow-x: auto;';
        area_cruzadinhasEl.style.cssText += 'overflow-y: auto;';
        mpageBtn.style.color = 'var(--aside-voce)';
	}
	else{
        mpageBtn.style.color = 'var(--close-modal)';
        area_cruzadinhasEl.style.cssText += 'overflow-x: hidden;';
        area_cruzadinhasEl.style.cssText += 'overflow-y: hidden;';
	}
}*/

//funcao para quando clickar no botao salvar//
async function salvar(){
	await import("./escolher_opcoes.js");
	var { titulo } = await import("./useredit.js");
	const { AparecerModal } = await import("../ferramentas/el_visibilidade.js");
	
	AparecerModal(modalEl[0]);
	let modaltitulo = document.getElementById('titulo-input');

	modaltitulo.addEventListener('input', function(){
		//h1El.innerHTML = modaltitulo.value;
		h1El.textContent = modaltitulo.value;
	});
	if(titulo != undefined){
		modaltitulo.value = titulo;
		//h1El.innerHTML = modaltitulo.value;
		h1El.textContent = modaltitulo.value;
	}
}

//funcao para quando clickar em cancelar no modal//
/*function cancelar(modal){
    requisitosEl.style.cssText += 'display: none';
    modal.style.cssText += 'display: none';
    modal.style.animation += 'none';
}*/

//funcao para verificar qtd palavras quando clickar em salvar no modal e salvar senha digitada e dados no BD//
export async function verifica_salva(evt, variavelautomatizadora = undefined){
	const { SalvarTitulo_i_db } = await import("../lib/rascunhoeditor.js");
	
	if(variavelautomatizadora)
		tituloEl.value = variavelautomatizadora;
	if(tituloEl.value !== "")
		SalvarTitulo_i_db(tituloEl.value);
	
    //reset da variavel pra nao ficar duplicado no BD se clickar em salvar 2x + e sair
    respostasDB = respostasDB.replace(respostasDB, '');
	
	if(qtdePalavras < 5 || tituloEl.value == ""){
		const { FecharModal, AparecerMensagem } = await import("../ferramentas/el_visibilidade.js");
		requisitosEl.style.cssText += 'display: flex'
		textoRequisitosEl.innerHTML = t.js_messages.req_min_words;
        FecharModal(modalEl[0]);
		AparecerMensagem(requisitosEl);
    }
    else if(!uid){
		const { FecharModal, AparecerMensagem } = await import("../ferramentas/el_visibilidade.js");
		textoRequisitosEl.innerHTML = t.js_messages.req_registration;
        FecharModal(modalEl[0]);
		AparecerMensagem(requisitosEl);
    }
    else{
		const { FecharModal } = await import("../ferramentas/el_visibilidade.js");
		//const carregaTelaEl = document.getElementById("carrega_tela");
        //carregaTelaEl.style.cssText = 'display: flex;';
		FecharModal(modalEl[0]);
		const urlParams = new URLSearchParams(window.location.search);
		const isDaily = urlParams.has('admin'); // Retorna true se houver ?dailycwd na URL
        await salvaBD(isDaily);
    }
}

//Funcao para salvar dados no BD//
export async function salvaBD(isDaily = false){
	const promises = [
        import('../ferramentas/traducao/traducao.js'),
        import("./escolher_opcoes.js"),
        import("./areacruzadinhas.js"),
        import('../ferramentas/firebase.js'),
        import('../lib/rascunhoeditor.js')
    ];

    if (!redimensionarModule) {
        promises.push(import("./redimensionar.js"));
    }

    const resultados = await Promise.all(promises);

    const { langURL, MostrarLoading, EsconderLoading } = resultados[0];
    const { podeGabarito, podePostar, podeDica } = resultados[1];
    const { configQuadrados } = resultados[2];
    const fbMod = resultados[3];
    const { SalvarRascunhoEditor_i_db, LimparRascunhoEditor_i_db } = resultados[4];
    
    if (!redimensionarModule) {
        redimensionarModule = resultados[5];
    }

    MostrarLoading();
    
    const fb = await fbMod.getFirebase();

    const { conter_cruzadinhas } = redimensionarModule;
    conter_cruzadinhas();
	
	var posleftDB = '';
	var postopDB = '';
	var conteudosDB = '';
	var flexdir = '';
	var tituloElSensitivo;

	var qtdeHoriz = 0, qtdeVert = 0;

	tituloElSensitivo = tituloEl.value.toLowerCase();
	tituloElSensitivo = tituloElSensitivo.normalize("NFD").replace(/[^\w\s]/g, "");
    tituloElSensitivo = tituloElSensitivo.replace(/\s+/g, '');
	//for para salvar resultados finais//
	for(var i = 0; i < respostasString.length; i++){
		let sectionDB = document.getElementById('PALAVRA'+(i+1));

		respostasDB += respostasString[i] + '`';
		conteudosDB += conteudosString[i] + '`';
		posleftDB += sectionDB.style.left +'`';
		postopDB += sectionDB.style.top + '`';
		flexdir += sectionDB.style.flexDirection + '`';
		if(sectionDB.style.flexDirection == 'column'){
			qtdeVert++;
		}
		else{
			qtdeHoriz++;
		}
	}

	var METADADOS_CRUZADINHA = {
		titulo: tituloEl.value,
		vw: posleftDB,
		vh: postopDB,
		flexdir: flexdir,
		resp: respostasDB,
		langURL: langURL,
		quadro: configQuadrados.quadrado,
		uId: uid,
		ins: tituloElSensitivo,
		data: fb.serverTimestamp()
	}
	var DADOS_CRUZADINHA = {
		titulo: tituloEl.value,
		vw: posleftDB,
		vh: postopDB,
		flexdir: flexdir,
		resp: respostasDB,
		quadro: configQuadrados.quadrado,
		cont: conteudosDB,
		gbrt: podeGabarito,
		dica: podeDica
	}
	var userRef = fb.doc(usRef, uid);
	var qtcRef = fb.doc(estRef, "QtdeTotalCruzadinhas");
	
	try{
		let dadosRef;		
		let metaRef;
		const { keyEl } = await import("./useredit.js");
		if (isDaily) {
			// Pega a data do input, se estiver vazio, usa o "hoje" como fallback
			const inputData = document.getElementById('input-data-diaria').value;
			const dataAlvo = inputData ? inputData : new Date().toISOString().split('T')[0];
			
			const dailyId = `${dataAlvo}_${langURL}`;
			
			dadosRef = fb.doc(fb.db, "cruzadinhas_diarias", dailyId);
			
			await fb.setDoc(dadosRef, { 
				...DADOS_CRUZADINHA,
				gbrt: false,
				dica: true
			});
			}
			else if (keyEl.length > 1){
				console.log(keyEl);
				dadosRef = fb.doc(crzdsRef, keyEl[1]);
				metaRef = fb.doc(cardsRef, keyEl[1]);
				await fb.setDoc(dadosRef, DADOS_CRUZADINHA);
				await fb.setDoc(metaRef, METADADOS_CRUZADINHA);
			}
		else {
			// 1. Gere uma referência de documento com um ID único, mas não salve nada ainda.
			const metaRef = fb.doc(cardsRef);
			const cruzadinhaId = metaRef.id;

			// 2. Use o setDoc para salvar o documento de metadados.
			await fb.setDoc(metaRef, METADADOS_CRUZADINHA);

			// 3. Use o MESMO ID para criar a referência do segundo documento e salve-o.
			const dadosRef = fb.doc(crzdsRef, cruzadinhaId);
			await fb.setDoc(dadosRef, DADOS_CRUZADINHA);
			
			const { gerarChamadaTweet, gerarLinkTweet, postarTweet, gerarHashtags } = await import('./twitter.js');
			await fb.setDoc(userRef, { qtdeCruzadinhas: fb.increment(1) }, { merge: true });
			await fb.setDoc(qtcRef, { qtdeCruzadinhas: fb.increment(1) }, { merge: true });	
			
			if(podePostar){
				var urlCruzadinha = await gerarLinkTweet(uid, dadosRef.id);
				var mensagem = `${gerarChamadaTweet(tituloEl.value)}\n\n🔗 - ${urlCruzadinha}\n\n${gerarHashtags(tituloEl.value)}`;
				await postarTweet(mensagem, urlCruzadinha);
			}
		}
		LimparRascunhoEditor_i_db();
	}
	catch(error){
		await SalvarRascunhoEditor_i_db(
			DADOS_CRUZADINHA.titulo,
			DADOS_CRUZADINHA.resp,
			DADOS_CRUZADINHA.cont,
			DADOS_CRUZADINHA.vh,
			DADOS_CRUZADINHA.vw,
			DADOS_CRUZADINHA.flexdir,
			DADOS_CRUZADINHA.quadro
		);
		console.log(`Erro ao salvar os dados: ${error}`);
	}

	EsconderLoading();
	if(!isDaily){
		setTimeout(function() {
			window.location.href = `/${langURL === 'en' ? '' : langURL + '/'}game/crossword/`;
		}, 100);
	}
	else{
		window.location.reload();
	}
}

export function SetsectionEditavel(section){
	sectionEditavel = section;
}

zoomAdd.addEventListener('click', async ()=>{
	if(!redimensionarModule){
		redimensionarModule = await import("./redimensionar.js");
	}
	const { zoomIn } = redimensionarModule;
	zoomIn();
});
zoomRmv.addEventListener('click', async ()=>{
	if(!redimensionarModule){
		redimensionarModule = await import("./redimensionar.js");
	}
	const { zoomOut } = redimensionarModule;
	zoomOut();
});

const creaftarIaBtn = document.getElementById("creaftarIA");
creaftarIaBtn.addEventListener('click', modalIa);

async function modalIa(){
	const { AparecerModal } = await import("../ferramentas/el_visibilidade.js");
	AparecerModal(modalEl[1]);	
}

const linksInternos = document.querySelectorAll('.link-interno');
  
linksInternos.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const destinoId = link.dataset.destino;
      const destinoElemento = document.getElementById(destinoId);

      if (destinoElemento) {
        destinoElemento.scrollIntoView({ behavior: 'smooth' });
      }
	});
});