//import { i_db } from '../../lib/db';
//import { getDoc, doc } from 'firebase/firestore';
import { configQuadrados } from './areacruzadinhas.js';
export var titulo;

export var url = new URL(window.location.href);

const h1El = document.querySelector("h1");
const tituloEl = document.getElementById('titulo-input');

export var keyEl = null;

//Quando o usuario clickar em editar no index
export async function editaCruzadinha(){
	url = window.location.href;
	keyEl = url.split("?cr=");
	
	if(keyEl[1]){
		const [firebaseToolMod, editorMod, rascunhoMod] = await Promise.all([
			import('../ferramentas/firebase.js'),
			import("./editor_script.js"),
			import("../lib/rascunhoeditor.js")
		]);
		
		const fb = await firebaseToolMod.getFirebase();
    	const { crzdsRef } = editorMod;
		const { SetChave } = rascunhoMod;
		
		SetChave(keyEl[1]);
		var getRef = fb.doc(crzdsRef, keyEl[1]);
		fb.getDoc(getRef).then(async function(item){
			var dados = {
				titulo: item.data().titulo,
				conteudodb: item.data().cont,
				resposta: item.data().resp,
				vwbd: item.data().vw,
				vhbd: item.data().vh,
				flexdir: item.data().flexdir,
				quadro: item.data().quadro
			}
			await gera_cruzadinha(dados);
			configQuadrados.quadrado = dados.quadro ? dados.quadro : 28;
			configQuadrados.quadradoMetade = configQuadrados.quadrado / 2;
			
			document.documentElement.style.setProperty('--tamanho-quadrado', `${configQuadrados.quadrado}px`);
		}).catch((error) => {
			console.log(error);
		});
		return true;
	}
	return false;
}

export async function CruzadinhaIndexedDB(novaCruzadinha = true, dados){
	const { GarantirRascunhoExistente, GetRascunhoLocal } = await import('../lib/rascunhoeditor.js');
	if(dados && dados.titulo !== ""){
		h1El.textContent = dados.titulo;
		tituloEl.value = h1El.textContent;
		await GarantirRascunhoExistente(dados.titulo, dados.resposta, dados.conteudo, dados.vh, dados.vw, dados.flexdir);
	}
	else if(dados){
		await GarantirRascunhoExistente("", dados.resposta, dados.conteudo, dados.vh, dados.vw, dados.flexdir);
	}
	else{
		await GarantirRascunhoExistente();
	}
	const rascunhoLocal = await GetRascunhoLocal();
	if (rascunhoLocal) {
		// Removemos o ID e a data antes de mandar para a função
		const { chave, ...dadosLimpos } = rascunhoLocal;
		await gera_cruzadinha_idb(dadosLimpos, novaCruzadinha);
	} else {
		console.warn("Nenhum rascunho encontrado localmente.");
	}
}

//Gera a cruzadinha que o usuario vai editar 
async function gera_cruzadinha(dados){
	const dadosConvertidos = {
		titulo: dados.titulo,
		conteudo: dados.conteudodb.split('`').filter(item => item !== ""),
		resposta: dados.resposta.split('`').filter(item => item !== ""),
		vw: dados.vwbd.split('`').filter(item => item !== ""),
		vh: dados.vhbd.split('`').filter(item => item !== ""),
		flexdir: dados.flexdir.split('`').filter(item => item !== ""),
		quadro: dados.quadro || 34
	};
	//console.log(dadosConvertidos.titulo);
	//const { adiciona_palavra, adiciona_conteudo } = await import('./cartoes.js');
	//const { setDadosSection } = await import('./areacruzadinhas.js');
    //const { conter_cruzadinhas } = await import("./redimensionar.js");
	
	/*
	for(var i = 0; i < conteudoEl.length - 1; i++){
		//await adiciona_conteudo(null, conteudoEl[i]);
		//await SalvarConteudo_i_db(conteudoEl[i]);
	}
	
	for(var j = 0; j < respostaEl.length - 1; j++){
		//await adiciona_palavra(null, respostaEl[j]);
		//await SalvarPalavra_i_db(respostaEl[j]);
		//await setDadosSection((j+1), vhEl[j], vwEl[j], flexdirEl[j], true);
		//await SalvarArraysPosicao_i_db(vwEl[j], vhEl[j], flexdirEl[j]);
	}*/
	
	await CruzadinhaIndexedDB(false, dadosConvertidos);
	
	
	//conter_cruzadinhas();
}

async function gera_cruzadinha_idb(dados, novaCruzadinha = true){
	const { adiciona_palavra, adiciona_conteudo } = await import('./cartoes.js');
	const { setDadosSection } = await import('./areacruzadinhas.js');
    const { conter_cruzadinhas } = await import("./redimensionar.js");

    var conteudoEl = dados.conteudodb;
    var respostaEl = dados.resposta;
    var vwEl = dados.vwbd;
    var vhEl = dados.vhdb;
    var flexdirEl = dados.flexdir;

	for(var i = 0; i < conteudoEl.length; i++){
		await adiciona_conteudo(null, conteudoEl[i]);
	}
	
	for(var j = 0; j < respostaEl.length; j++){
		var vh = vhEl[j];
		var vw = vwEl[j];

		await adiciona_palavra(null, respostaEl[j]);
		/*await */setDadosSection((j+1), vh, vw, flexdirEl[j], true);
	}
		
	if(novaCruzadinha){
		if(dados.titulo !== ""){
			h1El.textContent = dados.titulo;
			tituloEl.value = h1El.textContent;
		}
	}
	conter_cruzadinhas();
}