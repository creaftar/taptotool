import { AlternarVisibilidade } from "../ferramentas/el_visibilidade";
let chooseLanguageEl = document.getElementById("chooseLanguage");
let menuIdiomasEl = document.getElementById("menuIdiomas");

chooseLanguageEl.addEventListener("click", AbrirMenuLinguas);

function AbrirMenuLinguas(){
    AlternarVisibilidade(menuIdiomasEl);
    chooseLanguageEl.classList.toggle("ativo");
}