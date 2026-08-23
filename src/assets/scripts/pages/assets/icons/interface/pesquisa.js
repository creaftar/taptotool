import { debounce } from "@/assets/scripts/utility/config/debounce";
import { MostrarIconesPesquisados } from "./areaicones";

const pesquisaEl = document.getElementById("pesquisar-icones");
const telaErro = document.getElementById("no-icons-found");
const containerIcons = document.getElementById("container-icons"); // Adicionado
const limparpesquisaBtn = document.getElementById("limpar-pesquisa-btn");
const limparpesquisa = document.getElementById("limpar-pesquisa");

limparpesquisaBtn.addEventListener("click", LimparPesquisa);
limparpesquisa.addEventListener("click", LimparPesquisa);

pesquisaEl.addEventListener("input", debounce(PesquisarIcone, 300));

async function LimparPesquisa(){
    pesquisaEl.value = "";
    await PesquisarIcone();
    pesquisaEl.focus();
}

async function PesquisarIcone(){
    const textoNormalizado = pesquisaEl.value.trim().toLowerCase(); 
    if(!await MostrarIconesPesquisados(textoNormalizado))
        SemResultados();
    else
        ComResultados();
}

function SemResultados(){
    telaErro.classList.remove("elemento-sem-display");
    containerIcons.classList.add("elemento-sem-display"); // Oculta os ícones
}

function ComResultados(){
    telaErro.classList.add("elemento-sem-display");
    containerIcons.classList.remove("elemento-sem-display"); // Mostra os ícones
}