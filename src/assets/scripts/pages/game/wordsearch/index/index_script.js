import { SetCardBonus } from "../../crossword/index/homecards.js";
import { SetNovoCard, AdicionarLinguagem, visibilidadeModule, 
    t, uid, SetVariaveisFirebase, formatarTempoDecorridoDoFirebase, CopiaLink,
    setDoc, qtcRef, refId, crzdsRef, cardsRef, increment, deleteDoc, doc,
    FirebasePronto, SetTotal, dadoCard
} from "../../crossword/index/index_script.js";
import { langURL } from "../../crossword/ferramentas/traducao/traducao.js";


SetCardBonus(1);

SetNovoCard(NovoCardWs);

SetVariaveisFirebase({
    cards: 'cards_WS',
    cruzadas: 'cruzadas_WS'
});

SetarCard();
async function SetarCard(){
    await FirebasePronto;
    SetTotal(dadoCard.data().qtdeWS);
}

export async function NovoCardWs(data, id, limiteCruzadinha, isPriority = false){
    const { DefinirInvisibilidade, AlternarVisibilidade } = visibilidadeModule;
    
    //AD DO GOOGLE --> cruzadinhaEl.appendChild(adEl);
    var dadosCruzadinha = data;
    var cruzadinhaId = id;
    let containerCard = document.createElement("div"); 
    let divEl = document.createElement("div");
    let divBotoes = document.createElement("div");

    containerCard.classList.add('container-card');
    divEl.classList.add('card');
    divBotoes.classList.add('card-botoes');

    let linkJogar = document.createElement("a");
    linkJogar.classList.add('linkJogar');
    linkJogar.href = `play/?ws=${cruzadinhaId}`;
    linkJogar.setAttribute('aria-label', `${t.aria.play_button} ${dadosCruzadinha.titulo}`);
    var dadosImgCard = await GerarImagemCard(dadosCruzadinha.grid, dadosCruzadinha.qtdePalavras);
    linkJogar.appendChild(dadosImgCard.grid);
    
    let botaoOpcoes = document.createElement("button");
    botaoOpcoes.classList.add('opcBtn');
    botaoOpcoes.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
    botaoOpcoes.setAttribute('aria-label', `${t.aria.options_button} ${dadosCruzadinha.titulo}`);
    divBotoes.appendChild(botaoOpcoes);
    
    let containerOpcoes = document.createElement("div");
    containerOpcoes.classList.add('containerOpc');
    divBotoes.appendChild(containerOpcoes);

    divEl.appendChild(linkJogar);
    let botaoLink = document.createElement("button");
    botaoLink.innerHTML = '<i class="fa-solid fa-link linkBtn"></i>';
    botaoLink.setAttribute('aria-label', `${t.aria.copy_link} ${dadosCruzadinha.titulo}`);
    const link = `https://taptotool.com/${langURL == 'en' ? '' : (langURL + '/')}word-search/play/?cr=${cruzadinhaId}`;
    botaoLink.addEventListener('click', function(e){CopiaLink(e, cruzadinhaId, containerOpcoes, link);});
    containerOpcoes.appendChild(botaoLink);
    
    let orderValue = Math.floor(Math.random() * limiteCruzadinha);

    if(dadosCruzadinha.uId == uid){
        let botaoEditar = document.createElement("button");
        var linkEditar = document.createElement("a");
        botaoEditar.setAttribute('aria-label', `${t.aria.edit_button} ${dadosCruzadinha.titulo}`);
        linkEditar.setAttribute('aria-label', `${t.aria.edit_button} ${dadosCruzadinha.titulo}`);
        botaoEditar.innerHTML = '<i class="fa-solid fa-pen-to-square editarBtn"></i>';
        linkEditar.appendChild(botaoEditar);
        linkEditar.href = "create/?ws=" + cruzadinhaId;
        containerOpcoes.appendChild(linkEditar);
        
        let botaoExcluir = document.createElement("button");
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash excluirBtn"></i>';
        botaoExcluir.setAttribute('aria-label', `${t.aria.delete_button} ${dadosCruzadinha.titulo}`);
        botaoExcluir.addEventListener('click', function(){removeDatabase(cruzadinhaId);});
        containerOpcoes.appendChild(botaoExcluir);

        if (dadosCruzadinha.data) {
            // Converte a data do Firebase (Timestamp ou String) para objeto Date
            // Se for Timestamp do Firebase, use dadosCruzadinha.data.toDate()
            // Se for string ISO, use new Date(dadosCruzadinha.data)
            const dataCriacao = dadosCruzadinha.data.toDate ? dadosCruzadinha.data.toDate() : new Date(dadosCruzadinha.data);
            const agora = new Date();
            
            // Diferença em milissegundos
            const diferencaEmMS = agora - dataCriacao;
            const umDiaEmMS = 24 * 60 * 60 * 1000;
            
            // Se a diferença for menor que 1 dia (24h), força a ordem para 0
            if (diferencaEmMS < umDiaEmMS) {
                orderValue = 0;
            }
        }
    }
    containerCard.style.setProperty('--random-order', orderValue);
    
    let divInfos = document.createElement("div");
    divInfos.classList.add("card-infos");
    /*
        ${dadosImgCard.verticais + dadosImgCard.horizontais} ${t.words_found} - 
        ${dadosImgCard.horizontais} ${t.horizontals} | 
        ${dadosImgCard.verticais} ${t.verticals} 
                            */
    divInfos.innerHTML = `<div class="header-card-infos">
                            <h2 class="titulo">${dadosCruzadinha.titulo}</h2>
                          </div>
                          <p class="ad aviso-ad description-card">
                            ${dadosImgCard.palavras} ${t.words_found}
                          </p>
                          <p class="timer-card"><span class="icone-pequeno">●</span> ${formatarTempoDecorridoDoFirebase(dadosCruzadinha.data)}</p>`;

    DefinirInvisibilidade(containerOpcoes);
    
    botaoOpcoes.addEventListener('click', function (event) {
        AlternarVisibilidade(containerOpcoes);
    });

    divEl.appendChild(divBotoes);
    containerCard.appendChild(divEl);
    containerCard.appendChild(divInfos);

    return containerCard;
}

async function GerarImagemCard(gridString, qtdePalavras) {
    return new Promise((resolve, reject) => {
        try {
            const p = qtdePalavras;

            // 1. Descobre o tamanho original do lado do quadrado
            const tamanhoOriginal = Math.sqrt(gridString.length);

            if (!Number.isInteger(tamanhoOriginal)) {
                throw new Error("O comprimento da string não forma um quadrado perfeito.");
            }

            // --- NOVA LÓGICA DE RECORTE 10x10 ---
            // Define o limite máximo (10 ou o tamanho real, caso o grid seja menor que 10)
            const limiteLado = Math.min(12, tamanhoOriginal); 
            let letrasRecortadas = [];

            // Pega apenas as primeiras 'limiteLado' linhas e colunas
            for (let linha = 0; linha < limiteLado; linha++) {
                for (let coluna = 0; coluna < limiteLado; coluna++) {
                    // Calcula a posição exata do caractere na string original
                    const indexOriginal = (linha * tamanhoOriginal) + coluna;
                    letrasRecortadas.push(gridString[indexOriginal]);
                }
            }
            // -------------------------------------

            // 2. Cria o elemento PAI (o container do Grid) baseado no novo tamanho
            const containerGrid = document.createElement('div');
            containerGrid.classList.add('grid-container');
            
            // Injeta o CSS Grid dinamicamente direto no estilo do elemento
            containerGrid.style.display = 'grid';
            containerGrid.style.gridTemplateColumns = `repeat(${limiteLado}, 1fr)`;
            containerGrid.style.aspectRatio = '1 / 1';

            // 3. Cria e joga os elementos FILHOS (as letras recortadas) dentro do container
            letrasRecortadas.forEach(letra => {
                const celula = document.createElement('div');
                celula.classList.add('grid-item');
                celula.style.display = 'flex';
                celula.style.alignItems = 'center';
                celula.style.justifyContent = 'center';
                celula.style.aspectRatio = '1 / 1';
                celula.textContent = letra;
                
                containerGrid.appendChild(celula);
            });

            // 4. Retorna o Node HTML pronto, junto com as outras variáveis
            resolve({ 
                grid: containerGrid, 
                palavras: p 
            });

        } catch (error) {
            reject(error);
        }
    });
}

async function removeDatabase(key){
    const { MostrarLoading, EsconderLoading } = await import("../../crossword/ferramentas/traducao/traducao.js");
    MostrarLoading(); 
    
    //cruzadinhaEl.style.cssText = "display: none";
    var key = key;

    await Promise.all([
        setDoc(qtcRef, { qtdeCruzadinhas: increment(-1) }, { merge: true }),
        setDoc(refId, { qtdeWS: increment(-1) }, { merge: true }),
        deleteDoc(doc(crzdsRef, key)),
        deleteDoc(doc(cardsRef, key))
    ]);
    EsconderLoading();

    window.location.href = window.location;
}