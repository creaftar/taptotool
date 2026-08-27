const containerPasteDicaEl = document.getElementById("conteudo-copy");
const containerTextoVazioCopyEl = document.getElementById("container-texto-vazio-copy");
export let contCopiavel = true;

containerPasteDicaEl.addEventListener("click", TratarEventoDicas);

async function TratarEventoDicas(e, texto = null) {
    try {
        let textoColado = texto || await navigator.clipboard.readText();
        const { AparecerMensagem } = await import("../../ferramentas/el_visibilidade.js");
        if (!textoColado){ 
            AparecerMensagem(containerTextoVazioCopyEl);
            return;
        }

        const [cartoesMod, idbMod] = await Promise.all([
            import("../cartoes"),
            import("../../lib/rascunhoeditor.js")
        ]);

        const { adiciona_conteudo } = cartoesMod; 
        const { SalvarConteudo_i_db } = idbMod;

        const dicasTratadas = processarEntradaDicas(textoColado);

        if (dicasTratadas.length === 0) return;

        for (const dica of dicasTratadas) {
            try {
                await adiciona_conteudo(null, dica);
                await SalvarConteudo_i_db(dica);
            } catch (err) {
                console.error("Erro ao salvar dica:", err);
            }
        }

    } catch (err) {
        const { ErroTransferencia } = await import("../../ferramentas/copy/error.js");
        ErroTransferencia();
    }
}

/**
 * Apenas limpa a estrutura da linha, tratando cada linha como uma dica única
 */
function processarEntradaDicas(textoBruto) {
    return textoBruto
        .split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0)
        .map(linha => formatarDica(linha))
        .filter(dica => dica.length > 1);
}

/**
 * Remove apenas numeração, bullets e lixo de formatação do início da frase
 */
function formatarDica(texto) {
    if (!texto) return "";
    
    return texto
        // 1. Remove numeração inicial em qualquer idioma/formato: "1. ", "10) ", "2- "
        .replace(/^\d+[\.\-\)\s]+/, '')
        
        // 2. O PULO DO GATO: Remove pontuações de lista (bullets/travessões)
        // \p{Pd} pega qualquer tipo de traço (curto, longo, cirílico, etc)
        // \p{Po} pega pontuações gerais como • ou ●
        .replace(/^[\p{Pd}\p{Po}*◦▪•●]\s*/u, '') 
        
        // 3. Limpeza final de espaços
        .trim();
}