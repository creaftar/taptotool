import { podePaginar } from "./menu_paginas.js";

const user_cruzadinhas = document.getElementById('minhas_cruzadinhas');
//const contentcruzadinhaEl = document.getElementById('content-cruzadinhas');
const requisitos_entrarEl = document.getElementById('requisitos-entrar');
var flagCardBonus = true;
var mcClickado = false;

user_cruzadinhas.addEventListener('click', async function(){
    const { userLogged } = await import("./index_script.js");
    //Cancelar();
    if(!userLogged){
        const { AparecerMensagem } = await import("../ferramentas/el_visibilidade.js");
        AparecerMensagem(requisitos_entrarEl, 3000);
    }
    else if(userLogged && podePaginar && !mcClickado){
        const { MostrarLoading, EsconderLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading();
        await MinhasCruzadinhas();
        EsconderLoading();
    }
});

async function MinhasCruzadinhas(){
    const { SetWhereDinamico, SetQuemEstaChamando, LimparCache, increaseCardBonus } = await import("./homecards.js");
    const { uid } = await import("./index_script.js");
    const { GerarListaDinamica } = await import("./menu_paginas.js");
	
	increaseCardBonus(flagCardBonus);
    await LimparCache();
    SetQuemEstaChamando("minhascruzadinhas");
	await SetWhereDinamico("uId", uid);
    GerarListaDinamica(1);

    flagCardBonus = false;
    mcClickado = true;
}