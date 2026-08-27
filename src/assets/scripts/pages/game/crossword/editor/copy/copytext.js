const containerPasteTextEl = document.getElementById("container-paste-text");
const containerTextoVazioCopyEl = document.getElementById("container-texto-vazio-copy");

containerPasteTextEl.addEventListener("click", TratarEvento);

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

// Inicializa o listener global
AdicionarListenerColagem();

export async function TratarEvento(e, texto = null){
    if (estaProcessando) return;
    estaProcessando = true;
    
    try {
        let textoColado = texto || await navigator.clipboard.readText();
        let textUserEl = document.getElementById("user-div-textarea-copy");
        
        const { AparecerMensagem } = await import("../../ferramentas/el_visibilidade.js");
        const { TratarDados, GerarCruzadinhaCopiada, AbrirCopyModal } = await import("./modal.js");

        textUserEl.innerText = textoColado;
        let obj;

        try{
            obj = await TratarDados(textoColado);
        }
        catch{
            AparecerMensagem(containerTextoVazioCopyEl);
            return;
        }
        

        if(obj && obj.palavrasIguaisConteudos)
            GerarCruzadinhaCopiada(null, obj.dados);
        else
            AbrirCopyModal();
    } catch (err) {
        console.error("Falha ao processar colagem: ", err);
        const { ErroTransferencia } = await import("../../ferramentas/copy/error.js");
        ErroTransferencia();
    } finally {
        estaProcessando = false;
    }
}

/**
 * Lógica de extração Inteligente (Internacionalizada)
 */
export async function processarCaptura(textoBruto) {
    if(!textoBruto || textoBruto.length === 0)
        return;
    const linhas = textoBruto
    .split(/\n|;(?=\s*[\p{L}\p{N}]+[:\-\t])/gu)
    .filter(l => l.trim().length > 2);
    
    return linhas.map(linha => {
        // 2. Limpa numeração inicial (Suporta numerais arábicos, hindi, romanos, etc via \p{N})
        let linhaLimpa = linha.trim().replace(/^\p{N}+[\.\-\)\s]+/u, '').trim();

        // 3. Caso especial: Espaços triplos (Padrão de tabelas/PDFs)
        if (/\s{3,}/.test(linhaLimpa)) {
            const partes = linhaLimpa.split(/\s{3,}/);
            return { 
                palavra: limparTexto(partes[0], true), 
                dica: partes.slice(1).join(' ').trim() 
            };
        }

        // 4. Identificação de divisores universais (Tab, Dois-pontos, Travessões Cirílicos/En/Em)
        if (linhaLimpa.includes('\t')) return separarPorDivisor(linhaLimpa, '\t');
        if (linhaLimpa.includes(':')) return separarPorDivisor(linhaLimpa, ':');
        if (linhaLimpa.includes('=')) return separarPorDivisor(linhaLimpa, '=');
        if (linhaLimpa.includes('/')) return separarPorDivisor(linhaLimpa, '/');
        if (linhaLimpa.includes(' — ')) return separarPorDivisor(linhaLimpa, ' — ');
        if (linhaLimpa.includes(' - ')) return separarPorDivisor(linhaLimpa, ' - ');
        if (linhaLimpa.includes(' – ')) return separarPorDivisor(linhaLimpa, ' – ');
        if (linhaLimpa.includes(' — ')) return separarPorDivisor(linhaLimpa, ' — ');
        if (linhaLimpa.includes('>')) return separarPorDivisor(linhaLimpa, '>');
        if (linhaLimpa.includes('->')) return separarPorDivisor(linhaLimpa, '->');
        if (linhaLimpa.includes('-->')) return separarPorDivisor(linhaLimpa, '-->');
        if (linhaLimpa.includes('=>')) return separarPorDivisor(linhaLimpa, '=>');
        if (linhaLimpa.includes('==>')) return separarPorDivisor(linhaLimpa, '==>');
        if (linhaLimpa.includes('|')) return separarPorDivisor(linhaLimpa, '|');
        
        // Regex para capturar qualquer tipo de traço/hífen do Unicode (Pd = Punctuation Dash)
        const regexTracoUnicode = /\p{Pd}/u; 
        if (regexTracoUnicode.test(linhaLimpa)) {
            const divisorEncontrado = linhaLimpa.match(regexTracoUnicode)[0];
            return separarPorDivisor(linhaLimpa, divisorEncontrado);
        }

        // 5. Último recurso: Assume que a primeira palavra é a resposta e o resto é a dica
        return separarPorPrimeiroEspaco(linhaLimpa);
    });
}

function separarPorDivisor(linha, divisor) {
    let [palavra, ...resto] = linha.split(divisor);
    let dica = resto.join(divisor); 

    return {
        palavra: limparTexto(palavra, true),
        dica: dica.trim()
    };
}

function separarPorPrimeiroEspaco(linha) {
    const partes = linha.trim().split(/\s+/);
    if (partes.length > 1) {
        return {
            palavra: limparTexto(partes[0], true),
            dica: partes.slice(1).join(' ')
        };
    }
    return { palavra: limparTexto(partes[0], true), dica: "" };
}

/**
 * Limpeza profunda para Crosswords (Aceita qualquer alfabeto)
 */
function limparTexto(texto, ePalavra = false) {
    if (!texto) return "";
    
    // Converte para caixa alta ANTES de normalizar (Protege caracteres cirílicos como Й)
    let uppercase = texto.trim().toUpperCase();
    
    if (ePalavra) {
        // Normaliza NFD e remove diacríticos (acentos latinos)
        let semAcentos = uppercase.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        try {
            // Mantém Letras de qualquer idioma (\p{L}), Números (\p{N}), +, # e espaços
            // Remove símbolos, emojis e pontuações lixo.
            return semAcentos.replace(/[^\p{L}\p{N}\s+#]/gu, '');
        } catch (e) {
            // Fallback para navegadores obsoletos que não suportam Regex Unicode
            return semAcentos.replace(/[^A-Z0-9\s+#]/g, '');
        }
    }
    return uppercase;
}

export async function AlternarVisibilidadeBotao(){
    const promises = [
        import("../../ferramentas/el_visibilidade"),
        import("../cartoes"),
    ]
    const [elMod, cartoesMod] = await Promise.all(promises);
    
    const { AlternarVisibilidade, VerificarVisibilidade } = elMod;
    const { qtdeConteudos, qtdePalavras } = cartoesMod;

    // Só mostra o botão de colagem se o tabuleiro estiver vazio
    if(qtdePalavras === 0 && qtdeConteudos === 0){
        AlternarVisibilidade(containerPasteTextEl, false);
        AdicionarListenerColagem();
    }
    else if(VerificarVisibilidade(containerPasteTextEl)){
        AlternarVisibilidade(containerPasteTextEl);    
        RemoverListenerColagem();
    }
    else{
        RemoverListenerColagem();
    }
}

/**
 * Chama o processador de IA hospedado no GitHub Pages.
 * @param {string} textoBruto - O lixo colado pelo usuário.
 * @returns {Promise<Array|null>} - Retorna o array de objetos ou null se falhar.
 */
export async function ChamarProcessadorIA(texto) {
    const [moduloVisibilidade, moduloIA] = await Promise.all([
        import("../../ferramentas/el_visibilidade"),
        import("../editor_script.js")
    ]);

    const { AlternarVisibilidade } = moduloVisibilidade;
    const { inicializarIA } = moduloIA;

    const { worker, quandoPronta } = await inicializarIA();
    //console.log("- - - - - - PROCESSANDO COM I.A. 🤖 - - - - - -");

    // A MÁGICA: Ele vai ficar parado aqui se a IA ainda estiver baixando
    // Se a IA já carregou (preload terminou), ele passa direto instantaneamente
    await quandoPronta; 

    return new Promise((resolve) => {
        const handler = (e) => {
            if (e.data.tipo === 'RESULTADO') {
                //console.log("📥 Recebido no copytext.js:", e.data.dados);
                
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
    AtualizarBarraFake();

    try {
        const response = await fetch("https://crivras.vercel.app/api/copytext", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: textoBruto })
        });

        if (!response.ok) throw new Error(`Erro API: ${response.status}`);

        const dados = await response.json();


        // Processa o resultado
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