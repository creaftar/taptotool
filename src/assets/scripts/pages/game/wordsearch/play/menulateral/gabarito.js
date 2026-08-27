/*
let gabaritoEl = document.getElementById("gabarito");
var revelarEl = document.getElementById("revelar");

gabaritoEl.addEventListener('click', ExibirGabarito);
export var respostasExibidas = false;
let gridModule = null;
let areaModule = null;
var grid;
var ocultar = false;

export function AtualizarDisplay(gbrt, dica){
    if(gbrt === false){
        gabaritoEl.style.display = 'none';
    }
    if(dica === false){    
	    revelarEl.style.display = 'none';
    }
}

async function ExibirGabarito(){
    respostasExibidas = true;
    
    if(ocultar){
        OcultarGabarito();
        return;
    }
    
	const { bauPALAVRAS } = await import("./preload.js");

				
	requestAnimationFrame(() => {
        for(var i = 0; i < qtdePalavras; i++){
            for(var j = 0; j < bauPALAVRAS[i].letras.length; j++){
                bauPALAVRAS[i].letras[j].placeholder.textContent = bauPALAVRAS[i].letras[j].texto; 
            }
        }
	});
    ocultar = true;
}

async function OcultarGabarito(){
	const { bauPALAVRAS } = await import("./preload.js");
    requestAnimationFrame(() => {
        for(var i = 0; i < qtdePalavras; i++){
            for(var j = 0; j < bauPALAVRAS[i].letras.length; j++){
                bauPALAVRAS[i].letras[j].placeholder.textContent = ' '; 
            }
        }
	});
    ocultar = false;
}
*/
