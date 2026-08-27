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
		import('./copy/copypalavras.js'),
		import('./copy/copyconteudo.js'),
		import('../ferramentas/traducao/traducao.js'),
		import('../ferramentas/firebase.js'),
		import("../ferramentas/remover_zoom_mobile.js"),
		import("../ferramentas/anuncio.js")
	]
	const [copyP, copyC, loadMod, fbMod, removerZMod, anuncioMod] = await Promise.all(promises);
	const { EsconderLoading } = loadMod; 
    EsconderLoading();
	const { ConfigurarZoom } = removerZMod;
	const { GerarAnuncios } = anuncioMod;
	ConfigurarZoom("editor");
	
	fb = await fbMod.getFirebase();
	espera_bd();
	import("./gemini.js");
	GerarAnuncios();
    import("./salvar/emoji.js");
}


async function MonitorarUsuario() {
    const { IniciarMonitoramento } = await import("../menu/usuario.js");

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
	cardsRef = fb.collection(fb.db, 'cards');
	crzdsRef = fb.collection(fb.db, 'cruzadas');
	usRef = fb.collection(fb.db, 'usuarios');
	estRef = fb.collection(fb.db, 'estatisticas');
	
	try{
        await MonitorarUsuario();
		const { editaCruzadinha } = await import('./useredit.js');
        if(!uid)
            throw new Error("Usuário não conectado");
            
		if (await editaCruzadinha());
		else{
			const { CruzadinhaIndexedDB } = await import('./useredit.js');
			CruzadinhaIndexedDB();
		}
	}
	catch(erro){
		const { CruzadinhaIndexedDB } = await import('./useredit.js');
		CruzadinhaIndexedDB();
		console.log(erro);
	}
}


export let maiorProgressoAteAgora = 0;
//distilbert-base-multilingual-cased-sentiments-student
export async function inicializarIA() {
    if (!meuWorker) {
        const BASE = 'https://lucasgpm.github.io/processador/';
        const URL_WORKER = `${BASE}ia-worker.js`;
        const URL_PROCESSADOR = `${BASE}processador.js`; // Verifique se esta URL está correta
        const URL_ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/ort.min.js';

        try {
            
            // O ERRO ESTAVA AQUI: As 3 promessas precisam de 3 variáveis
            const [workerRes, procRes, ortRes] = await Promise.all([
                fetch(URL_WORKER),
                fetch(URL_PROCESSADOR),
                fetch(URL_ORT)
            ]);

            // Verificação de segurança
            if (!workerRes.ok || !procRes.ok || !ortRes.ok) {
                throw new Error("Falha ao baixar um dos arquivos do GitHub.");
            }

            const workerCodeRaw = await workerRes.text();
            let procCode = await procRes.text(); // Agora procRes existe!
            const ortCode = await ortRes.text();

            // Limpeza do export para o Worker não dar erro de sintaxe
            procCode = procCode.replace(/^export\s+|(?<=\s)export\s+/gm, '');

            // Montagem do Código Final (A ordem ORT -> Lógica -> Motor é vital)
            const finalCode = `
                ${ortCode}
                
                if (self.ort) {
                    self.ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';
					self.ort.env.wasm.simd = true;
                    self.ort.env.wasm.numThreads = self.crossOriginIsolated ? (navigator.hardwareConcurrency || 4) : 1;
					self.ort.env.wasm.proxy = false;
                }

                // Injeta a lógica de processamento (tokenize, softmax, etc)
                ${procCode}

                // Injeta o motor do worker (carregarIA, onmessage)
                ${workerCodeRaw}
            `;

            const blob = new Blob([finalCode], { type: 'application/javascript' });
            const blobURL = URL.createObjectURL(blob);
            meuWorker = new Worker(blobURL);

            meuWorker.onmessage = async (e) => {
                if (e.data.tipo === 'PRONTO') {
                    iaProntaResolver();
                }
                /*if (e.data.tipo === 'PROGRESSO') {
                    const { aplicarProgressoNaTela } = await import("./copy/copytext.js");
                    aplicarProgressoNaTela(e.data.valor);
                }*/
                if (e.data.tipo === 'RESULTADO') {
                    // Dispara para o copytext.js ouvir
                    window.dispatchEvent(new CustomEvent('ia-dados-recebidos', { detail: e.data.dados }));
                }
                if (e.data.tipo === 'ERRO') console.error("Erro no Worker:", e.data.mensagem);
            };

            meuWorker.postMessage({ tipo: 'PRELOAD' });

        } catch (err) {
            console.error("Erro na montagem:", err);
        }
    }
    return { worker: meuWorker, quandoPronta: iaProntaPromessa };
}