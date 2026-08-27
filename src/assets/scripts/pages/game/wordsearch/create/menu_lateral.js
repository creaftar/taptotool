import { ResetarPalavras, AdicionarPalavra } from "./cartao.js";

const zoomAdd = document.getElementById('zoomadd');
const zoomRmv = document.getElementById('zoomrmv');
const askBtn = document.getElementById('pergunta');

const randomizerEl = document.getElementById("randomizer");
let redimensionarModule = null;

randomizerEl.addEventListener("click", RandomizarPalavras);

import { vetPalavras } from "./cartao.js";

async function RandomizarPalavras(){
    const palavras = [...vetPalavras]; 
	
	if(vetPalavras.length > 0){
		await ResetarPalavras(false);
		await AdicionarPalavra(palavras);
	}
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
