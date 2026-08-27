import { AdicionarVisibilidade, RemoverVisibilidade } from "../../crossword/ferramentas/el_visibilidade";
import { GerarGrid, AtualizarGrid, grid, TratarDados, 
    printGrid, bauPalavras, PreencherGridAleatoriamente,
    ResetBauPalavras } from "./grid";
import { GerarGridVisual, RemoverGridVisual } from "./grid_visual";
import { conter_cruzadinhas } from "./redimensionar";

export let qtdePalavras = 0;
export let vetPalavras = [];

const inputPalavras = document.getElementById("palavra");
export const containerPEl = document.getElementById('container-p-el');
const removerAllPalavrasEl = document.getElementById("remover-all-palavras");
const containerPasteTextEl = document.getElementById("container-paste-text");

removerAllPalavrasEl.addEventListener("click", ResetarPalavras);
inputPalavras.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        AdicionarPalavra();
    }
});


/**
 * Função para adicionar a(s) palavra(s) no cartão, aceitando um texto colado 
 * @returns 
 */
export async function AdicionarPalavra(textoColado) {
    let texto = inputPalavras.value.trim().toUpperCase();
    if (textoColado) texto = textoColado;
    if (texto === "") return;

    // Obtém as palavras tratadas
    let palavrasNovas = TratarDados(null, texto);
    // REGRA DE NEGÓCIO: Filtra para garantir que são únicas
    palavrasNovas = filtrarPalavrasDuplicadas(vetPalavras, palavrasNovas);

    // Se após a filtragem não sobrar nenhuma palavra nova, para a execução
    if (palavrasNovas.length === 0) {
        inputPalavras.value = "";
        return; 
    }
    
    vetPalavras.push(...palavrasNovas);
    
    inputPalavras.value = "";

    // Se o tamanho do vetor é igual ao das novas, significa que o grid estava vazio antes
    if (vetPalavras.length === palavrasNovas.length) {
        let tentativas = 0;
        let gridGerado = await GerarGrid(vetPalavras);
        while(tentativas < 5 && !gridGerado){
            gridGerado = await GerarGrid(vetPalavras);
            tentativas++;
        }
        GerarGridVisual(gridGerado);
        conter_cruzadinhas();
    } 
    else {
        for (const palavra of palavrasNovas){
            await AtualizarGrid(palavra, vetPalavras);
        } 
        GerarGridVisual(grid);
    }
    
    if (vetPalavras.length > 0) {
        RemoverVisibilidade(containerPasteTextEl);
    }
}

// Função utilitária para filtrar palavras repetidas
function filtrarPalavrasDuplicadas(palavrasExistentes, palavrasNovas) {
    // 1. Remove duplicatas do próprio input novo usando Set
    const novasUnicas = [...new Set(palavrasNovas)];
    
    // 2. Filtra para manter apenas as que NÃO existem no array atual
    return novasUnicas.filter(palavra => !palavrasExistentes.includes(palavra));
}

export function CriarPalavraGrid(palavras){
    const fragmento = document.createDocumentFragment();
    for (const palavra of palavras) {
        if(palavra.posicionada){
            const text = palavra.inverso ? palavra.text.split('').reverse().join('') : palavra.text;
            fragmento.appendChild(CriarPalavra(text));
        }
    }
    containerPEl.appendChild(fragmento);
}

export function CriarPalavra(texto){
    qtdePalavras++;
    
    let pEl = document.createElement('p');	
    pEl.setAttribute('id', 'paragrafo'+qtdePalavras);
    
    pEl.innerHTML = `<span class="roxo">${qtdePalavras} - </span>
    <span id="textPEl${qtdePalavras}" class="no-break">${texto}</span>
    <div class="container-remove-edit-btn">
        <button id="removeBtn${qtdePalavras}"><i class="fa-solid fa-trash-can trash-red"></i></button>
    </div>    
    `;

    let removeBtn = pEl.querySelector('#removeBtn' + qtdePalavras);
    removeBtn.addEventListener('click', RemoverPalavra);
    

    return pEl;
}

/**
 * Função para remover a palavra, 
 * @param {*} evt 
 * @param {*} identificador 
*/
async function RemoverPalavra(evt, identificador){
    var id;
    if(identificador)
        id = identificador;
    else{
        id = evt.currentTarget.id.split('n');   
        id = parseInt(id[1]);
    }
    
    let paragrafoEl = document.getElementById('paragrafo'+id);
    
    for(var j = id; j <= qtdePalavras; j++){
        let paragrafoAnt = document.getElementById('paragrafo'+ j);
        paragrafoAnt.innerHTML = `<span class="roxo">${(j - 1) } - </span>
        <span id="textPEl${(j-1)}" class="no-break">${vetPalavras[j - 1]}</span>
        <div class="container-remove-edit-btn">
            <button id="removeBtn${(j-1)}"><i class="fa-solid fa-trash-can trash-red"></i></button>
        </div>
        `;
        
        let removeBtn = document.getElementById('removeBtn'+(j-1));
        removeBtn.addEventListener('click', RemoverPalavra);

        paragrafoAnt.id = 'paragrafo'+ (j - 1);
    } 
    
    AtualizarIdsRemovidos(id - 1);
    
    containerPEl.removeChild(paragrafoEl);
    qtdePalavras--;
    await PreencherGridAleatoriamente();
    if(qtdePalavras === 0){
        AdicionarVisibilidade(containerPasteTextEl, false);
        RemoverGridVisual(grid);
    }
    else{
        GerarGridVisual(grid);
    }
}

function AtualizarIdsRemovidos(idRemovido){
    vetPalavras.splice(idRemovido, 1);

    const palavraRemovida = bauPalavras[idRemovido]
    for(let letra of palavraRemovida.letras){
        letra.RemoverPalavra(palavraRemovida);
    }

    bauPalavras.splice(idRemovido, 1);

    for (let i = idRemovido; i < bauPalavras.length; i++) {
        bauPalavras[i].id = i; 
    }
}

export async function ResetarPalavras(mostrarBotao = true) {
    const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');
    container_cruzadinhasEl.innerHTML = "";
    containerPEl.innerHTML = "";
    qtdePalavras = 0;
    vetPalavras = [];
    ResetBauPalavras();
    
    if(mostrarBotao)
        AdicionarVisibilidade(containerPasteTextEl, false);
}