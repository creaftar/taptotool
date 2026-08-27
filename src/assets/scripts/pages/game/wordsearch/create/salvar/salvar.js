import { 
	usRef, 
	crzdsRef,
	cardsRef,
	estRef } from "../create_script.js";
import { qtdePalavras } from "../cartao.js";
import { uid } from "../create_script.js";

const tituloEl = document.getElementById('titulo-input');
const modalEl = document.querySelectorAll('.modal-salvar');
const closeSalvarsBtn = document.querySelectorAll('.close-salvar');

let traducoesEl = document.getElementById("traducoes-create"); 
let t = JSON.parse(traducoesEl.dataset.i18n);

closeSalvarsBtn.forEach((closemodal, i) => {
	closemodal.addEventListener('click', async () =>{
		const { FecharModal } = await import("../../../crossword/ferramentas/el_visibilidade.js");
		FecharModal(modalEl[i]);
	});
});

const requisitosEl = document.getElementById('requisitos-salvar');
const textoRequisitosEl = document.getElementById('texto-requisitos');
const salvarmodalBtn = document.getElementById('salvarmodal');
const salvarBtn = document.getElementById('salvar');
const modaltitulo = document.getElementById('titulo-input');
const h1El = document.querySelector("h1");

salvarmodalBtn.addEventListener('click', verifica_salva);
salvarBtn.addEventListener('click', salvar);

modaltitulo.addEventListener('input', function(){
    h1El.textContent = modaltitulo.value;
});
/**
 * Função para abrir a modal de salvamento
 */
async function salvar(){
	await import("./escolher_opcoes.js");
	//var { titulo } = await import("./useredit.js");
	const { AparecerModal } = await import("../../../crossword/ferramentas/el_visibilidade.js");
	
	AparecerModal(modalEl[0]);

	/*if(titulo != undefined){
		modaltitulo.value = titulo;
		//h1El.innerHTML = modaltitulo.value;
		h1El.textContent = modaltitulo.value;
	}*/
}

/**
 * Função para salvar quando clickado no botão da modal
 */
export async function verifica_salva(){    
    if(qtdePalavras < 5 || tituloEl.value == ""){
        const { FecharModal, AparecerMensagem } = await import("../../../crossword/ferramentas/el_visibilidade.js");
        requisitosEl.style.cssText += 'display: flex'
        textoRequisitosEl.innerHTML = t.js_messages.req_min_words;
        FecharModal(modalEl[0]);
        AparecerMensagem(requisitosEl);
    }
    else if(!uid){
        const { FecharModal, AparecerMensagem } = await import("../../../crossword/ferramentas/el_visibilidade.js");
        textoRequisitosEl.innerHTML = t.js_messages.req_registration;
        FecharModal(modalEl[0]);
        AparecerMensagem(requisitosEl);
    }
    else{
        const { FecharModal } = await import("../../../crossword/ferramentas/el_visibilidade.js");
        FecharModal(modalEl[0]);
        await salvaBD();
    }
}

/**
 * Função para salvar os dados no Firestore
 */
export async function salvaBD(){
	const promises = [
        import('../../../crossword/ferramentas/traducao/traducao.js'),
        import("./escolher_opcoes.js"),
        import('../../../crossword/ferramentas/firebase.js'),
        import("../redimensionar.js"),
        import("../grid.js")
    ];

    const resultados = await Promise.all(promises);

    const { langURL, MostrarLoading, EsconderLoading } = resultados[0];
    const { podeGabarito, podeDica } = resultados[1];
    const fbMod = resultados[2];
    const fb = await fbMod.getFirebase();
    const { GerarDadosSalvamento } = resultados[4]

    var userRef = fb.doc(usRef, uid);
    var qtcRef = fb.doc(estRef, "QtdeTotalCruzadinhas");

    const tituloElSensitivo = GerarTituloInsensitivo();

    MostrarLoading();
    
    const dados = GerarDadosSalvamento();
    var METADADOS_CRUZADINHA = {
            titulo: tituloEl.value,
            grid: dados.gridLetras,
            qtdePalavras: dados.bauSimplificado.length,
            langURL: langURL,
            uId: uid,
            ins: tituloElSensitivo,
            data: fb.serverTimestamp()
        }
        var DADOS_CRUZADINHA = {
            titulo: tituloEl.value,
            ...dados,
            gbrt: podeGabarito,
            dica: podeDica
        }

        
    const metaRef = fb.doc(cardsRef);
    const cruzadinhaId = metaRef.id;

    await fb.setDoc(metaRef, METADADOS_CRUZADINHA);

    const dadosRef = fb.doc(crzdsRef, cruzadinhaId);
    await fb.setDoc(dadosRef, DADOS_CRUZADINHA);
    
    await fb.setDoc(userRef, { qtdeWS: fb.increment(1) }, { merge: true });
    await fb.setDoc(qtcRef, { qtdeCruzadinhas: fb.increment(1) }, { merge: true });	
    EsconderLoading();

    setTimeout(function() {
        window.location.href = `/${langURL === 'en' ? '' : langURL + '/'}game/word-search/`;
    }, 100);
}

function GerarTituloInsensitivo(){
	let tituloElSensitivo = tituloEl.value.toLowerCase();
	tituloElSensitivo = tituloElSensitivo.normalize("NFD").replace(/[^\w\s]/g, "");
    tituloElSensitivo = tituloElSensitivo.replace(/\s+/g, '');

    return tituloElSensitivo;
}