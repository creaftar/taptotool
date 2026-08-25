//import { Icone } from "./Icone";
import { Menu } from "./Menu";
import { debounce } from "@/assets/scripts/utility/config/debounce";
import { ExibirIcone } from "./exibiricones";
import JSON from "../../../../../store/icons/jsons/icons-search.json"; 

const icones_dic = new Map();

const containerIcons = document.getElementById("container-icons");
const fragmento = document.createDocumentFragment();
const qtdeIconesEl = document.getElementById("qtde-icones-encontrados");

let iconesFiltrados = [];

let MAX_ICONES = calcularMaxIcones();
let iconesGerados = 0;

CriarMap();

const iconesTotais = icones_dic.size;
const menu = new Menu(iconesTotais, MAX_ICONES);

GerarMenuVisual();

menu.signal.addEventListener("PaginaAlterada", (evt) =>{
    GerarMenuVisual(evt.detail);
});

export function GerarMenuVisual(){
    const paginaAtual = menu.GetPaginaAtual();
    iconesGerados = 0;
    containerIcons.innerHTML = "";
    const i_iconeAtual = (MAX_ICONES * paginaAtual) + (iconesGerados - MAX_ICONES);
    let id = iconesGerados + i_iconeAtual;
    while(id < iconesFiltrados.length && iconesGerados < MAX_ICONES){
        iconesGerados++;
        fragmento.append(GerarIcones(id));
        id = iconesGerados + i_iconeAtual;
    }
    qtdeIconesEl.textContent = iconesFiltrados.length;
    containerIcons.append(fragmento);
    requestAnimationFrame(() => {
        containerIcons.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/**
 * Cria o map inicializando com os primeiros icones
 */
export function CriarMap(){
    JSON.icons.forEach(icon => {
        icones_dic.set(icon.id, icon);
    });
    iconesFiltrados = Array.from(icones_dic.values());
}

/**
 * Gera o botão para ser armazenado dentro do container de icones
 * @param {*} id - nome do ícone
 */
function GerarIcones(id){
    const botao = document.createElement("button");
    botao.classList.add("btn-icon");
    botao.type = "button";
    botao.dataset.id = iconesFiltrados[id].id;
    
    const icone = document.createElement("i");
    const nome = document.createElement("p");
    
    icone.classList.add(`ttt-${iconesFiltrados[id].id}`);
    nome.textContent = iconesFiltrados[id].name;

    icone.classList.add("nao-clickavel");
    nome.classList.add("nao-clickavel");

    botao.append(icone);
    botao.append(nome);

    return botao;
}

function calcularMaxIcones() {
  const larguraContainer = containerIcons.getBoundingClientRect().width;

  const larguraCard = 100;
  const gap = 12;

  const colunas = Math.floor((larguraContainer + gap) / (larguraCard + gap));

  const linhasDesejadas = 4;
  const totalCalculado = colunas * linhasDesejadas;

  return Math.max(colunas, totalCalculado);
}

containerIcons.addEventListener("click", VerificarCliqueIcone);


function VerificarCliqueIcone(e){
    const botao = e.target.closest(".btn-icon");
    if(!botao)
        return;
    const id = botao.dataset.id;
    ExibirIcone(id, icones_dic);
}

window.addEventListener('resize', debounce(() => {
  MAX_ICONES = calcularMaxIcones();
  menu.RecalcularPaginas(iconesTotais, MAX_ICONES);
  GerarMenuVisual();
}, 200));

const workerCode = `
self.onmessage = function(e) {
    const { texto, icones } = e.data;
    const termo = texto.toLowerCase().trim();

    // Filtra exatamente como você fazia antes
    const resultado = icones.filter(icone => {
        const noNome = icone.name && icone.name.toLowerCase().includes(termo);
        const naCategoria = icone.category && icone.category.toLowerCase().includes(termo);
        const naTag = icone.tags && icone.tags.some(tag => tag.toLowerCase().includes(termo));

        return noNome || naCategoria || naTag;
    });

    self.postMessage(resultado);
};
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));

export function MostrarIconesPesquisados(texto) {
    const listaIcones = Array.from(icones_dic.values());

    return new Promise((resolve) => {
        worker.onmessage = function(e) {

            iconesFiltrados = e.data;
            
            if (!iconesFiltrados || iconesFiltrados.length === 0) {
                containerIcons.innerHTML = "";
                qtdeIconesEl.textContent = 0;
                resolve(false);
                return;
            }

            // Se encontrou
            qtdeIconesEl.textContent = iconesFiltrados.length;
            menu.RecalcularPaginas(iconesFiltrados.length, MAX_ICONES);
            GerarMenuVisual();
            
            resolve(true);
        };

        // Envia para o worker
        worker.postMessage({ texto, icones: listaIcones });
    });
}