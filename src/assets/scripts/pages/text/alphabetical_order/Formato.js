import { OrdenarLista } from "./alphabetical_order";
let containerEl = document.getElementById("container-icon-textTip");
let _formato = "a-z";
let containerMidIconEl = document.getElementById("container-mid-icon");

containerEl.addEventListener("click", 
    /**
     * Função para verificar, e, se necessário, alterar a escolha do usuário
     * @param {*} e 
     */
    function(e){
    let filho = e.target;
    let destaque = containerEl.querySelector(".icon-textTip-ativo");

    if(filho !== destaque && filho.classList.contains("icon-textTip")){
        destaque.classList.remove("icon-textTip-ativo");
        filho.classList.add("icon-textTip-ativo");
        _formato = filho.dataset.icon;
        AlterarIcone(_formato);
        OrdenarLista();
    }
});

/**
 * @returns formato desejado pelo usuário
 */
export function FormatoDesejado(){
    return _formato;
}

/**
 * Função para alterar o icone entre os textAreas
 */
function AlterarIcone(novoFormato){
    if(novoFormato === "a-z")
        containerMidIconEl.innerHTML = '<i class="fa-solid fa-arrow-down-a-z icon-text"></i>';
    else
        containerMidIconEl.innerHTML = '<i class="fa-solid fa-arrow-up-a-z icon-text"></i>';
}