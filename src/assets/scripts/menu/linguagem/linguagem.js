let chooseLanguageEl = document.getElementById("chooseLanguage");
let menuIdiomasEl = document.getElementById("menuIdiomas");

chooseLanguageEl.addEventListener("click", AbrirMenuLinguas);

let menuAberto = false;

function AbrirMenuLinguas(){
    if(!menuAberto){
        chooseLanguageEl.classList.add("ativo");
        menuIdiomasEl.style.display = "flex";
        window.addEventListener('click', CliqueFora);
        menuAberto = true;
    }
    else{
        FecharMenuLinguas();
    }
}

function FecharMenuLinguas(){    
    menuAberto = false;
    menuIdiomasEl.style.display = "none";
    chooseLanguageEl.classList.remove("ativo");
    window.removeEventListener('click', CliqueFora);
}

function CliqueFora(e) {
    // Se o clique não foi no formulário e nem no ícone de abrir
    if (!chooseLanguageEl.contains(e.target) && !menuIdiomasEl.contains(e.target)) {
        FecharMenuLinguas();
    }
}