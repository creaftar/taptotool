import { FecharComentario } from "./commentary";

let gadgetPositionerEl = document.getElementById("gadget-positioner");
let traducao = JSON.parse(gadgetPositionerEl.dataset.i18n);

const btnCopy = document.getElementById('btnCopy');
let inputLink = document.getElementById("shareLink");
let ShareEl = document.getElementById("share");
let containerShareEl = document.getElementById("containerShare");

let compartilhamentoAberto = false;

ShareEl.addEventListener('click', AbrirCompartilhamento);
btnCopy.addEventListener('click', CopiarSelecao);

containerShareEl.addEventListener('click', (e) => {
    e.stopPropagation();
});

function AbrirCompartilhamento(e){
    e.stopPropagation();
    if(!compartilhamentoAberto){
        compartilhamentoAberto = true;
        containerShareEl.style.opacity = "1";
        containerShareEl.style.display = "block";
        FecharComentario();
        SelecionarInput();
        window.addEventListener('click', CliqueForaCompartilhamento);
    }
    else{
        FecharCompartilhamento();
    }
}

export function FecharCompartilhamento() {
    containerShareEl.style.display = "none";
    containerShareEl.style.opacity = "0";
    compartilhamentoAberto = false;
    window.removeEventListener('click', CliqueForaCompartilhamento);
}

function CliqueForaCompartilhamento(e) {
    // Se o clique não foi no formulário e nem no ícone de abrir
    if (!containerShareEl.contains(e.target) && !ShareEl.contains(e.target) ) {
        FecharCompartilhamento();
    }
}

function SelecionarInput(){
    inputLink.value = window.location;
    inputLink.select(); 
    inputLink.setSelectionRange(0, 99999);
}

function CopiarSelecao(){
    navigator.clipboard.writeText(inputLink.value).then(() => {
        const textoOriginal = btnCopy.textContent;
        btnCopy.textContent = traducao.COPIED;
        btnCopy.style.color = "var(--destaque)";
        setTimeout(() => {
            btnCopy.textContent = textoOriginal;
            btnCopy.style.backgroundColor = ""; 
            btnCopy.style.color = "";
        }, 3000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}