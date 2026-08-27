const pesquisaCruzadinhaEl = document.getElementById('input_pesquisa');
import { podePaginar } from "../index/menu_paginas.js";

let pesquisarInput = document.getElementById('input_pesquisa');
var pesquisarEl;

let cooldownTime = 3; // 3 segundos de cooldown
let isCooldown = false;

let pesquisaAnterior = null;

pesquisaCruzadinhaEl.addEventListener('keyup', async (evt)=>{
	if(podePaginar){
		if(evt.key == "Enter" && pesquisarInput.value != '' && !isCooldown && pesquisarInput.value != pesquisaAnterior){
			iniciarCooldown();
			PesquisaCruzadinha();
			pesquisaAnterior = pesquisarInput.value;
		}
	}
});

function iniciarCooldown(){
	isCooldown = true;
    let countdown = cooldownTime;
    const cooldownTimerEl = document.getElementById('cooldownTimer');
    cooldownTimerEl.textContent = `${cooldownTime}`;

    const interval = setInterval(() => {
        countdown--;
		cooldownTimerEl.textContent = `${countdown}`;

        if (countdown <= 0) {
            clearInterval(interval);
            //cooldownTimerEl.style.display = 'none';
            isCooldown = false;
			/*ultimaCruzadinha = null;*/
			cooldownTimerEl.textContent = '/';
        }
    }, 1000);
}

async function PesquisaCruzadinha(){
		const { SetWhereDinamico, SetQuemEstaChamando, SetConsulta, LimparCache, RedefinirCardBonus } = await import("../index/homecards.js");
		const { GerarListaDinamica } = await import("../index/menu_paginas.js");
		const { MostrarLoading, EsconderLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading();
        
		pesquisarEl = pesquisarInput.value;
		
		pesquisarEl = pesquisarEl.toLowerCase();
		pesquisarEl = pesquisarEl.normalize("NFD").replace(/[^\w\s]/g, "");
		pesquisarEl = pesquisarEl.replace(/\s+/g, '');
		
		RedefinirCardBonus();
		await LimparCache();
    	SetQuemEstaChamando("pesquisa");
		await SetWhereDinamico('ins', pesquisarEl);
		//await SetConsulta();
		EsconderLoading();
		GerarListaDinamica(1);
}