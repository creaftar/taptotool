import { AlternarVisibilidade } from "../../utility/config/el_visibilidade";
let chooseLanguageEl = document.getElementById("chooseLanguage");
let menuIdiomasEl = document.getElementById("menuIdiomas");

chooseLanguageEl.addEventListener("click", () =>{
    AlternarVisibilidade(menuIdiomasEl);
});