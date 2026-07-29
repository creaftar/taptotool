import('./pesquisar.js');
//import('./definirDivAtiva.js');

let bloco0El = document.getElementById("bloco0");
let menuLateralEl = document.getElementById("container-opcaoAside");
let containerConteudoEl = document.getElementById("container-conteudo");
let cardElements = containerConteudoEl.querySelectorAll('.card');
let textIcons = menuLateralEl.querySelectorAll('.aside-text-icon');
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var opcaoAtivaEl = menuLateralEl.querySelector("#opcaoAtiva");
let placeholderAsideEl = document.getElementById("placeholder-aside-container");
let pesquisarFerramentaInp = document.getElementById("pesquisar-ferramenta");
let lupaAsideEl = document.getElementById("lupa-aside");
let hrAside = menuLateralEl.querySelectorAll('.hr-aside');

let possuiListener = false;

bloco0El.addEventListener("click", AbrirMenu);
lupaAsideEl.addEventListener("click", AbrirMenu);

function AbrirMenu(){
    if(isMobile){
        hrAside.forEach(hr => hr.style.visibility = "visible");
        menuLateralEl.style.visibility = "visible";    
    }
    menuLateralEl.style.width = "300px";
    placeholderAsideEl.style.width = "300px";
    containerConteudoEl.style.opacity = "0.5";
    DesabilitarCards();
    HabilitarTextIcons();
    AlternarListener();
    pesquisarFerramentaInp.focus();
}

function FecharMenu(){
    menuLateralEl.style.width = "64px";
    placeholderAsideEl.style.width = "64px";
    containerConteudoEl.style.opacity = "1";
    HabilitarCards();
    DesabilitarTextIcons();
    AlternarListener();
    if(isMobile){
        hrAside.forEach(hr => hr.style.visibility = "hidden");
        menuLateralEl.style.visibility = "hidden";
    }
}

function HabilitarTextIcons(){
    textIcons.forEach(textIcon => {
        textIcon.style.display = "block";
    });
    pesquisarFerramentaInp.style.display = "block";
}

function DesabilitarTextIcons(){
    textIcons.forEach(textIcon => {
        textIcon.style.display = "none";
    });
    pesquisarFerramentaInp.style.display = "none";
}

function HabilitarCards(){
    cardElements.forEach(card => {
        card.classList.remove("desativar-cliques");
    });
}

function DesabilitarCards(){
    cardElements.forEach(card => {
        card.classList.add("desativar-cliques");
    });
}

function AlternarListener(){
    if(!possuiListener){
        bloco0El.removeEventListener("click", AbrirMenu);
        bloco0El.addEventListener("click", FecharMenu);
        containerConteudoEl.addEventListener("click", FecharMenu);
        possuiListener = true;
        return;
    }
    bloco0El.removeEventListener("click", FecharMenu);
    bloco0El.addEventListener("click", AbrirMenu);
    containerConteudoEl.removeEventListener("click", FecharMenu);
    possuiListener = false;
}