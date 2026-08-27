import { /*AparecerMensagem,*/ RemoverElementosVisiveis } from "./el_visibilidade.js";

let currentZoomIn = null;
let currentZoomOut = null;

const fechar_salvarIco = document.querySelectorAll('.fechar-salvar');
//const avisoEl = document.getElementById("aviso");
let initialDistance = null;
const sensitivity = 30;

/**
 * Define dinamicamente qual lógica de zoom aplicar
 */
export async function ConfigurarZoom(origem) {
    if (origem === 'editor') {
        const mod = await import("../editor/redimensionar.js");
        currentZoomIn = mod.zoomIn;
        currentZoomOut = mod.zoomOut;
    } else if (origem === 'jogar') {
        const mod = await import("../jogar/redimensionar_jogar.js");
        currentZoomIn = mod.zoomIn;
        currentZoomOut = mod.zoomOut;
    }
    else if (origem === 'wordsearch'){
        const mod = await import("../../wordsearch/create/redimensionar.js");
        currentZoomIn = mod.zoomIn;
        currentZoomOut = mod.zoomOut;
    }
}

//Bloqueio de gestos nativos (ESSENCIAL PARA IOS/SAFARI)
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });

//Eventos de Mouse (Scroll + CTRL)
document.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        RemoverElementosVisiveis();

        if (currentZoomIn && currentZoomOut) {
            if (event.deltaY < 0) {
                currentZoomIn();
            } else {
                currentZoomOut();
            }
        }
    }
}, { passive: false });

let isFirstMove = true;

document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
        event.preventDefault(); 
        isFirstMove = true;
        
        const deltaX = event.touches[0].pageX - event.touches[1].pageX;
        const deltaY = event.touches[0].pageY - event.touches[1].pageY;
        initialDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
}, { passive: false });

document.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2) {
        event.preventDefault(); 

        if (initialDistance !== null && currentZoomIn) {
            const deltaX = event.touches[0].pageX - event.touches[1].pageX;
            const deltaY = event.touches[0].pageY - event.touches[1].pageY;
            const currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const diff = currentDistance - initialDistance;

            if (Math.abs(diff) >= sensitivity) {
                RemoverElementosVisiveis();
                
                if (diff > 0) {
                    currentZoomIn();
                    initialDistance += sensitivity; 
                } else {
                    currentZoomOut();
                    initialDistance -= sensitivity;
                }
            }
        }
    }
}, { passive: false });

fechar_salvarIco.forEach((fechar_salvar) => {
    fechar_salvar.addEventListener('click', async () => {
        const { FecharMensagem } = await import("../ferramentas/el_visibilidade.js");
        const container = fechar_salvar.closest(".requisitos");
        if (container) FecharMensagem(container);
    });
});