const containerPasteTextEl = document.getElementById("container-paste-text");
const containerPasteTextPalavraEl = document.getElementById("palavra-copy");
const containerTextoVazioCopyEl = document.getElementById("container-texto-vazio-copy");

containerPasteTextEl.addEventListener("click", TratarEvento);
containerPasteTextPalavraEl.addEventListener("click", TratarEvento);

// Trava para evitar execuções duplicadas (comum em cliques rápidos no mobile)
let estaProcessando = false;

async function tratarColagemGlobal(e) {
    const target = e.target;
    // Não interfere se o usuário estiver digitando em um campo de texto real
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return; 
    }
    
    const textoColado = (e.clipboardData || window.Clipboard /*|| window.clipboardData*/).getData('text');
    
    TratarEvento(e, textoColado);
}

export function AdicionarListenerColagem(){
    document.addEventListener("paste", tratarColagemGlobal);
}

export function RemoverListenerColagem(){
    document.removeEventListener("paste", tratarColagemGlobal);
}

AdicionarListenerColagem();

export async function TratarEvento(e, texto = null){
    if (estaProcessando) return;
    estaProcessando = true;
    
    try {
        let textoColado = texto || await navigator.clipboard.readText();
        //let textUserEl = document.getElementById("user-div-textarea-copy");

        const { AparecerMensagem } = await import("../../../crossword/ferramentas/el_visibilidade.js");
        const { AdicionarPalavra } = await import("../cartao.js");

        //textUserEl.innerText = textoColado;

        try{
            const textoTratado = await TratarLixoIA(textoColado);
            if(typeof textoTratado === "string" && textoTratado.trim() === '')
                throw new Error("Empty text...");
            AdicionarPalavra(textoTratado);
        }
        catch (error){
            console.log(error);
            AparecerMensagem(containerTextoVazioCopyEl);
            return;
        }
    } catch (err) {
        console.error("Falha ao processar colagem: ", err);
        const { ErroTransferencia } = await import("../../../crossword/ferramentas/copy/error.js");
        ErroTransferencia();
    } finally {
        estaProcessando = false;
    }
}

/**
 * Função para tratar o lixo vindo do texto colado pelo usuário e deixar apenas as palavras,
 * utilizando IA para tal.
 * @param {*} texto 
 * @returns 
 */
async function TratarLixoIA(texto){
    if(texto === '')
        throw new Error("Texto vazio");
    
    AtualizarBarraFake();
    const { AlternarVisibilidade } = await import("../../../crossword/ferramentas/el_visibilidade.js");
    const { GerarAnunciosCopy } = await import("../../../crossword/ferramentas/anuncio.js");
    
    const containerCarregarCopyEl = document.getElementById("container-carregar-copy");
    const barCopyEl = document.getElementById("bar-copy");

    if (containerCarregarCopyEl) {
        GerarAnunciosCopy();
        AlternarVisibilidade(containerCarregarCopyEl, false);
        containerCarregarCopyEl.style.opacity = "1";
    }

    let textoTratado;
    const promessaFallback = ChamarProcessadorIA(texto);

    try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

        if (isLocal) {
            throw new Error("Localhost: Forçando Fallback.");
        }
        textoTratado = await ChamarIAGemini(texto);

    } catch (error) {
        const textoIA = await promessaFallback;
        if(textoIA.length === 0){
            textoTratado = texto;
        }
        else
            textoTratado = textoIA;
    }
    if(!textoTratado)
        textoTratado = texto;

    PararBarraFake();
    AlternarVisibilidade(containerCarregarCopyEl, false);
    barCopyEl.style.width = "0%";
    
    return textoTratado;
}

/**
 * Chama o processador de IA hospedado no GitHub Pages.
 * @param {string} textoBruto - O lixo colado pelo usuário.
 * @returns {Promise<Array|null>} - Retorna o array de objetos ou null se falhar.
 */
export async function ChamarProcessadorIA(texto) {
    const [moduloIA] = await Promise.all([
        import("../create_script.js")
    ]);

    const { inicializarIA } = moduloIA;

    const { worker, quandoPronta } = await inicializarIA();
    await quandoPronta; 

    return new Promise((resolve) => {
        const handler = (e) => {
            if (e.data.tipo === 'RESULTADO') {
                
                // Verificação rápida: os dados são um array? Têm conteúdo?
                if (!e.data.dados || e.data.dados.length === 0) {
                  //  console.warn("⚠️ A IA retornou um array vazio ou inválido!");
                }

                worker.removeEventListener('message', handler);
                resolve(e.data.dados);
            }
        };

        worker.addEventListener('message', handler);
        worker.postMessage({ tipo: 'PROCESSAR', texto });
    });
}

export async function ChamarIAGemini(textoBruto) {
    try {
        const response = await fetch("https://crivras.vercel.app/api/copytext_wordsearch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: textoBruto })
        });

        if (!response.ok) throw new Error(`Erro API: ${response.status}`);

        const dados = await response.json();

        return typeof dados === 'string' 
            ? JSON.parse(dados.replace(/```json/g, '').replace(/```/g, '').trim())
            : dados;

    } catch (e) {
        throw e;
    }
}

let maiorProgressoAteAgora = 0; // Resetar sempre que iniciar um novo processo
let _progressoFake;
export function AtualizarBarraFake() {
    PararBarraFake(); // Limpa resíduos anteriores
    maiorProgressoAteAgora = 0; // Reseta para o novo início
    
    let larguraAtual = 0;
    
    _progressoFake = setInterval(() => {
        if (larguraAtual < 99) {
            larguraAtual += (99 - larguraAtual) * 0.1;
            aplicarProgressoNaTela(larguraAtual); // Usa a função centralizada
        }
    }, 450);
}

export function aplicarProgressoNaTela(valor) {
    const novoValor = Math.round(valor);
    
    if (novoValor > maiorProgressoAteAgora) {
        maiorProgressoAteAgora = novoValor;
        
        const barra = document.getElementById('bar-copy');
        const textoPorcentagem = document.querySelector('#container-bar-percent-copy span');
        
        if (barra) barra.style.width = maiorProgressoAteAgora + '%';
        if (textoPorcentagem) textoPorcentagem.innerText = maiorProgressoAteAgora + '%';
    }
}

export function PararBarraFake() {
    const barra = document.getElementById('bar-copy');
    const textoPorcentagem = document.querySelector('#container-bar-percent-copy span');
    
    clearInterval(_progressoFake);
    maiorProgressoAteAgora = 0; // Reset fundamental aqui
    
    if (barra) barra.style.width = '0%';
    if (textoPorcentagem) textoPorcentagem.innerText = '0%';
}

export async function AlternarVisibilidadeBotao(){
    const promises = [
        import("../../../crossword/ferramentas/el_visibilidade.js"),
        //import("../cartoes"),
    ]
    const [elMod/*, cartoesMod*/] = await Promise.all(promises);
    
    const { AlternarVisibilidade, VerificarVisibilidade } = elMod;
    //const { qtdeConteudos, qtdePalavras } = cartoesMod;

    // Só mostra o botão de colagem se o tabuleiro estiver vazio
    //if(qtdePalavras === 0 && qtdeConteudos === 0){
        AlternarVisibilidade(containerPasteTextEl, false);
        AdicionarListenerColagem();
    /*}
    else if(VerificarVisibilidade(containerPasteTextEl)){
        AlternarVisibilidade(containerPasteTextEl);    
        RemoverListenerColagem();
    }
    else{
        RemoverListenerColagem();
    }*/
}