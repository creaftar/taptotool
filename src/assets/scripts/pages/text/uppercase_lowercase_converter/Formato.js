import { MostrarResultado } from "./uppercase_lowercase_converter";
let containerEl = document.getElementById("container-icon-textTip");
let _formato = "texto-minusculo";

containerEl.addEventListener("click", function(e){
    let filho = e.target;
    let destaque = containerEl.querySelector(".icon-textTip-ativo");

    if(filho !== destaque){
        destaque.classList.remove("icon-textTip-ativo");
        filho.classList.add("icon-textTip-ativo");
    }

    _formato = filho.dataset.icon;
    MostrarResultado();
});

export function FormatoDesejado(){
    return _formato;
}