import("./carrossel");

let modalCopyEl = document.getElementById("modal-copy");
let copyEl = document.getElementById("copy-text-user-copy");
let pasteEl = document.getElementById("paste-text-user-copy");
let clearEl = document.getElementById("clear-text-user-copy");
let textUserEl = document.getElementById("user-div-textarea-copy");

let salvaCopyEl = document.getElementById("salvar-copy");

let dadosTratados;
let debounceTimer;

export async function AbrirCopyModal(textoColado){
    const { AlternarVisibilidade } = await import("../../ferramentas/el_visibilidade");
    
    let textoFinal;

    if(textoColado){
        textoFinal = textoColado.map(par => {
            return `${par.palavra} = ${par.dica}`;
        }).join('\n');
        textUserEl.innerText = textoFinal;
        
        TratarDadosLocal(textoFinal); 
    }


    AlternarVisibilidade(modalCopyEl);

    modalCopyEl.style.opacity = 1;
    modalCopyEl.style.border = "dashed 2px rgba(var(--padrao), 0.6)";
}

export async function TratarDados(textoColado) {
    if(textoColado === '')
        throw new Error("Texto vazio");
        
    const { ChamarIAGemini, ChamarProcessadorIA, PararBarraFake } = await import("./copytext.js");
    const { AlternarVisibilidade } = await import("../../ferramentas/el_visibilidade");
    const { GerarAnunciosCopy } = await import("../../ferramentas/anuncio.js");
    
    const containerCarregarCopyEl = document.getElementById("container-carregar-copy");
    const barCopyEl = document.getElementById("bar-copy");

    if (containerCarregarCopyEl) {
        GerarAnunciosCopy();
        AlternarVisibilidade(containerCarregarCopyEl, false);
        containerCarregarCopyEl.style.opacity = "1";
    }

    let dadosTratados, qtdePal = 0, qtdeCont = 0;
    let dadosIA;
    const promessaFallback = ChamarProcessadorIA(textoColado);
    
    try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

        if (isLocal) {
            throw new Error("Localhost: Forçando Fallback.");
        }
        dadosIA = await ChamarIAGemini(textoColado);

    } catch (error) {
        dadosIA = await promessaFallback;
    }
    
    PararBarraFake();
    if (dadosIA && dadosIA.length > 0) {
        dadosTratados = dadosIA;
        
        dadosTratados.forEach(par => {
            if(par.palavra.trim() !== "") qtdePal++;
            if(par.dica.trim() !== "") qtdeCont++;
        });
    }
    
    const desequilibrado = qtdePal !== qtdeCont;
    const muitoPobre = qtdePal < 3 && qtdeCont < 3;
    
    if ((qtdePal == 0 && qtdeCont == 0) || (desequilibrado && muitoPobre)) {
        const obj = await TratarDadosLocal(textoColado);
        dadosTratados = obj.dadosTratados; 
        qtdePal = obj.qtdePal;
        qtdeCont = obj.qtdeCont;
    }
    
    AlternarVisibilidade(containerCarregarCopyEl, false);
    barCopyEl.style.width = "0%";
    
    if(!dadosTratados || dadosTratados.length === 0) return;
    return { 
        dados: dadosTratados, 
        palavrasIguaisConteudos: (qtdePal === qtdeCont && qtdePal > 0) 
    };
}

async function  TratarDadosLocal(textoDigitado){
    const { processarCaptura } = await import("./copytext.js");
    let dadosTratados = await processarCaptura(textoDigitado);
    
    // Contagem rápida do que o Regex entregou
    let qtdePal = 0, qtdeCont = 0;
    
    if(dadosTratados){
        dadosTratados.forEach(par => {
            if(par.palavra.trim() !== "") qtdePal++;
            if(par.dica.trim() !== "") qtdeCont++;
        });
    }
    
    let detectorPEl = document.getElementById("detector-palavras-copy");
    let detectorCEl = document.getElementById("detector-dicas-copy");

    detectorPEl.textContent = qtdePal;
    detectorCEl.textContent = qtdeCont;

    return { dadosTratados, qtdePal, qtdeCont};
}

textUserEl.addEventListener("input", (e) => {
    const valorParaProcessar = e.target.innerText || e.target.value; 

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        TratarDadosLocal(valorParaProcessar); 
    }, 500);
});

copyEl.addEventListener('click', () => {
    const textoParaCopiar = textUserEl.innerText;
    
    navigator.clipboard.writeText(textoParaCopiar)
        .then(() => {
        })
        .catch(err => {
            console.error("Erro ao copiar: ", err);
        });
});

pasteEl.addEventListener('click', async () => {
    textUserEl.innerText = await navigator.clipboard.readText();
    TratarDadosLocal(textUserEl.innerText);
});

clearEl.addEventListener('click', () => {
    textUserEl.innerText = '';
    TratarDadosLocal(textUserEl.innerText);
});

/*async function SalvarTextoColado(texto){
    const { getFirebase } = await import('../../ferramentas/firebase.js');
    const fb = await getFirebase();

    try {
        // Apenas "Analytics" para ser uma coleção de primeiro nível
        const colecaoAnalytics = fb.collection(fb.db, "logs");

        await fb.addDoc(colecaoAnalytics, {
            tipo: "colagem", // Dica: adicione um tipo caso queira salvar outros eventos depois
            texto_original: texto,
            data: new Date(),
            plataforma: navigator.userAgent
        });
    } catch (err) {
        console.error("Erro ao salvar log no Firebase", err);
    }
}*/

/*async function copiarUltimoLog() {
    const { getFirebase } = await import('../../ferramentas/firebase.js');
    const fb = await getFirebase();
    
    // Puxa o log mais recente
    const q = fb.query(fb.collection(fb.db, "logs"), fb.orderBy("data", "desc"), fb.limit(1));
    const querySnapshot = await fb.getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const txt = doc.data().texto_original;
        console.log("Copiando o seguinte texto:");
        console.log(txt);
    });
}*/

//copiarUltimoLog();

salvaCopyEl.addEventListener("click", GerarCruzadinhaCopiada);

export async function GerarCruzadinhaCopiada(e, dadosTratados){
    
    //SalvarTextoColado(dadosTratados);
    
    const promises = [
        import("../../ferramentas/el_visibilidade"),
        import("../cartoes"),
        import('../menulateral.js'),
        import("../../lib/rascunhoeditor.js")
    ];

    const [elMod, cartoesMod, menuLateralMod, idbMod] = await Promise.all(promises);

    const { RemoverVisibilidade, AparecerMensagem } = elMod; 
    const { adiciona_palavra, adiciona_conteudo, ResetarPalavras, ResetarConteudos } = cartoesMod; 
    const { autopos_cruzadinha } = menuLateralMod;
    const { SalvarPalavra_i_db, SalvarConteudo_i_db } = idbMod;

    try{
        if(!dadosTratados){
            dadosTratados = await TratarDados(textUserEl.innerText);
            if(!dadosTratados){
                dadosTratados = [];
                AbrirCopyModal();
                return;
            }
            else
                dadosTratados = dadosTratados.dados;
        }
    }
    catch (error){
        const containerTextoVazioCopyEl = document.getElementById("container-texto-vazio-copy");
        //RemoverVisibilidade(modalCopyEl);
        AparecerMensagem(containerTextoVazioCopyEl);
        return;
    }
    
    await Promise.all([
        ResetarPalavras(),
        ResetarConteudos()
    ]);
    for (const i of dadosTratados) {
        try {
            // Adiciona na interface
            await adiciona_conteudo(null, i.dica);
            await adiciona_palavra(null, i.palavra);
            // Salva no banco local
            await SalvarPalavra_i_db(i.palavra);
            await SalvarConteudo_i_db(i.dica);    
        } catch (itemError) {
            console.error(`Erro ao processar o item "${i.palavra}":`, itemError);
        }
    }

    // Reposiciona a cruzadinha com as novas palavras
    autopos_cruzadinha();
    RemoverVisibilidade(modalCopyEl);
}