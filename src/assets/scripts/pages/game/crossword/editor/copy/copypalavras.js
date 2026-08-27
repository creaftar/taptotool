const containerPasteTextEl = document.getElementById("palavra-copy");
const containerTextoVazioCopyEl = document.getElementById("container-texto-vazio-copy");

containerPasteTextEl.addEventListener("click", TratarEventoPalavras);


async function TratarEventoPalavras(e, texto = null) {
    try {
        let textoColado = texto || await navigator.clipboard.readText();
        const { AparecerMensagem } = await import("../../ferramentas/el_visibilidade.js");
        if (!textoColado){ 
            AparecerMensagem(containerTextoVazioCopyEl);
            return;
        }
        const [cartoesMod, idbMod, menuMod] = await Promise.all([
            import("../cartoes"),
            import("../../lib/rascunhoeditor.js"),
            import('../menulateral.js')
        ]);

        const { adiciona_palavra } = cartoesMod;
        const { SalvarPalavra_i_db } = idbMod;
        const { autopos_cruzadinha } = menuMod;

        // A mágica acontece aqui: processamento inteligente
        const palavrasTratadas = processarEntradaPalavras(textoColado);

        for (const item of palavrasTratadas) {
            try {
                await adiciona_palavra(null, item);
                await SalvarPalavra_i_db(item);
            } catch (err) {
                console.error(`Erro ao inserir: ${item}`, err);
            }
        }

        autopos_cruzadinha();

    } catch (err) {
        const { ErroTransferencia } = await import("../../ferramentas/copy/error.js");
        ErroTransferencia();
    }
}

/**
 * Função que decide qual a melhor forma de quebrar o texto
 * baseada na estrutura do que foi colado.
 */
function processarEntradaPalavras(textoBruto) {
    // 1. Identifica se o usuário usou delimitadores formais
    const temDelimitadoresFortes = /[,;\t\n\r]/.test(textoBruto);

    let textoNormalizado = textoBruto;

    if (temDelimitadoresFortes) {
        // Se tem quebra de linha ou vírgula, o espaço deve ser PRESERVADO dentro das palavras
        // (ex: "Bata Doce" continua junto para ser limpo depois)
        textoNormalizado = textoBruto.replace(/[\n\t\r]+/g, ',');
    } else {
        // Se NÃO tem nada, é uma frase simples. O espaço e o ponto viram separadores.
        // Isso resolve o Teste 6 e o Teste 1 (caso o ponto seja o único divisor)
        textoNormalizado = textoBruto.replace(/[\s.]+/g, ',');
    }

    // 2. Agora o ponto também entra como divisor caso tenha sobrado (como no Teste 1)
    let termosIniciais = textoNormalizado.split(/[,;.]/);

    return termosIniciais
        .map(t => {
            // Remove numeração inicial (1. , 1- , 1) ou 1 seguido de espaço)
            let semNumero = t.trim().replace(/^\p{N}+([\.\-\)\s]+|\s+)/u, '')
            return limparParaCruzadinha(semNumero);
        })
        .filter(t => t.length > 1);
}

function limparParaCruzadinha(texto) {
    if (!texto) return "";
    
    // 1. Converte para maiúsculo PRIMEIRO (importante para cruzadinhas)
    let uppercase = texto.toUpperCase();

    // 2. Remove acentos latinos, mas mantém a integridade de outros alfabetos
    let limpo = uppercase.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    try {
        // \p{L} = Qualquer letra de qualquer idioma (Latino, Cirílico, Grego, etc.)
        // \p{N} = Qualquer número
        // Mantemos + e # como você pediu
        return limpo.replace(/[^\p{L}\p{N}+#]/gu, '');
    } catch (e) {
        // Fallback para navegadores muito antigos (Yandex Browser antigo, por exemplo)
        return limpo.replace(/[^A-Z0-9+#]/g, '');
    }
}