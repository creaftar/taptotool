import('./copy/copytext.js');
export let meuWorker = null;

export let traducaoModule = null;
export let traducaoModuleEditor = null;
export let usRef, cardsRef, estRef, crzdsRef;

export let fb;
export let uid = null;

if(largura < 1024){
    window.addEventListener('popstate', function () {
        // Impedir que a página volte
        history.pushState(null, '', window.location.href);
    });
}

//, TraduzirBody_Editor, TraduzirHead_Editor, TraducaoExclusiva;

var largura = window.screen.width;
let iaProntaResolver;

const iaProntaPromessa = new Promise((resolve) => {
    iaProntaResolver = resolve;
});

inicializa_editor();

async function inicializa_editor(){
    inicializarIA();
    const promises = [
        import('../../crossword/ferramentas/traducao/traducao.js'),
        import('../../crossword/ferramentas/firebase.js'),
        import("../../crossword/ferramentas/remover_zoom_mobile.js"),
        import("../../crossword/ferramentas/anuncio.js"),
        import("./cartao.js"),
        import("./menu_lateral.js")
    ]
    const [loadMod, fbMod, removerZMod, anuncioMod, cartao, menuLateral] = await Promise.all(promises);
    const { EsconderLoading } = loadMod; 
    EsconderLoading();
    const { ConfigurarZoom } = removerZMod;
    const { GerarAnuncios } = anuncioMod;
    ConfigurarZoom("wordsearch");
    
    fb = await fbMod.getFirebase();
    espera_bd();
    //import("./gemini.js");
    GerarAnuncios();
    import("./salvar/salvar.js");
    import("./salvar/emoji.js");
}


async function MonitorarUsuario() {
    const { IniciarMonitoramento } = await import("../../crossword/menu/usuario.js");

    // Retornamos uma Promise para que o 'await' lá fora funcione
    return new Promise((resolve) => {
        IniciarMonitoramento((user) => {
            if (user) {
                uid = user.uid;
            } else {
                uid = null;
            }
            // Quando o Firebase responde, nós resolvemos a Promise
            resolve(uid);
        });
    });
}

//Funcao para carregar a pagina e esperar os dados do BD
async function espera_bd(){
    cardsRef = fb.collection(fb.db, 'cards_WS');
    crzdsRef = fb.collection(fb.db, 'cruzadas_WS');
    usRef = fb.collection(fb.db, 'usuarios');
    estRef = fb.collection(fb.db, 'estatisticas');
    
    try{
        await MonitorarUsuario();
        /*const { editaCruzadinha } = await import('./useredit.js');
        if(!uid)
            throw new Error("Usuário não conectado");
            
        if (await editaCruzadinha());
        else{
            const { CruzadinhaIndexedDB } = await import('./useredit.js');
            CruzadinhaIndexedDB();
        }*/
    }
    catch(erro){
        /*const { CruzadinhaIndexedDB } = await import('./useredit.js');
        CruzadinhaIndexedDB();
        console.log(erro);*/
    }
}


export let maiorProgressoAteAgora = 0;
//distilbert-base-multilingual-cased-sentiments-student
export async function inicializarIA() {
    if (!meuWorker) {
        // Aponta para os seus arquivos no GitHub Pages
        const BASE = 'https://lucasgpm.github.io/processador/';
        const URL_WORKER = `${BASE}ia-worker.js`;
        const URL_PROCESSADOR = `${BASE}processador-caca.js`; // Seu novo arquivo focado em palavras
        const URL_ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/ort.min.js';

        try {
            // Baixa os 3 arquivos necessários em paralelo
            const [workerRes, procRes, ortRes] = await Promise.all([
                fetch(URL_WORKER),
                fetch(URL_PROCESSADOR),
                fetch(URL_ORT)
            ]);

            if (!workerRes.ok || !procRes.ok || !ortRes.ok) {
                throw new Error("Falha ao baixar os arquivos da IA do GitHub.");
            }

            const workerCodeRaw = await workerRes.text();
            let procCode = await procRes.text();
            const ortCode = await ortRes.text();

            // Limpa os exports do arquivo de lógica para não quebrar o Worker
            procCode = procCode.replace(/^export\s+|(?<=\s)export\s+/gm, '');

            // CORREÇÃO: Não alteramos o nome da função no motor (workerCodeRaw), 
            // pois ela mantém o nome original compatível.
            const motorCode = workerCodeRaw;

            // Monta o script final que o Worker vai executar
            const finalCode = `
                ${ortCode}
                
                if (self.ort) {
                    self.ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';
                    self.ort.env.wasm.simd = true;
                    self.ort.env.wasm.numThreads = self.crossOriginIsolated ? (navigator.hardwareConcurrency || 4) : 1;
                    self.ort.env.wasm.proxy = false;
                }

                // Injeta a lógica adaptada do caça-palavras
                ${procCode}

                // Injeta o motor original compatível
                ${motorCode}
            `;

            // Cria o Worker em memória
            const blob = new Blob([finalCode], { type: 'application/javascript' });
            const blobURL = URL.createObjectURL(blob);
            meuWorker = new Worker(blobURL);

            // Escuta as respostas da IA
            meuWorker.onmessage = async (e) => {
                if (e.data.tipo === 'PRONTO') {
                    iaProntaResolver();
                }
                if (e.data.tipo === 'RESULTADO') {
                    // Dispara o evento passando diretamente o Array de strings puras
                    // Ex: ["BANANA", "PREGO", "XÍCARA"]
                    window.dispatchEvent(new CustomEvent('ia-dados-recebidos', { detail: e.data.dados }));
                }
                if (e.data.tipo === 'ERRO') {
                    console.error("Erro no Worker do Caça-Palavras:", e.data.mensagem);
                }
            };

            // Inicia o carregamento interno da IA (ONNX + Tokenizer)
            meuWorker.postMessage({ tipo: 'PRELOAD' });

        } catch (err) {
            console.error("Erro na montagem da IA do Caça-Palavras:", err);
        }
    }
    return { worker: meuWorker, quandoPronta: iaProntaPromessa };
}