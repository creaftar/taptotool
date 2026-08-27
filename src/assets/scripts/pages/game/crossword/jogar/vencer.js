import { StopTimer, HiddeTimer, somVitoria } from "./menulateral_jogar.js";
import { ResetFocoGlobal } from "./areacruzadinhas_jogar.js";
import { titulo, caracteresDigitados, palavrasAcertadas, palavrasErradas } from "./preload.js";

let query, collection, orderBy, limit, getDocs, db;

async function iniciarFirebaseLocal() {
    if (query) return; // Já carregou as funções, não faz nada
    const { getFirebase } = await import("../ferramentas/firebase.js");
    const fb = await getFirebase();
    
    // Alimenta as variáveis locais com as funções vindas do cache
    db = fb.db;
    query = fb.query;
    collection = fb.collection;
    orderBy = fb.orderBy;
    limit = fb.limit;
    getDocs = fb.getDocs;
}

const bgcardVencer = document.getElementById("bg-card-vencer");
const cardVencer00El = document.getElementById("card-vencer_00");
const topicosVencer = document.querySelectorAll(".topico-vencer");
const cruzadinhasVencerEl = document.getElementById("cruzadinhas-vencer");
const tituloVencerEl = document.getElementById("titulo-vencer");
const inpLinkVencerEl = document.getElementById("input-link-vencer");
const copiarVencerEl = document.getElementById("copiar-button-vencer");
const tempoVencerEl = document.getElementById("tempo-vencer");
const caracteresVencerEl = document.getElementById("caracteres-vencer");
const acertosVencerEl = document.getElementById("acertos-vencer");
const errosVencerEl = document.getElementById("erros-vencer");

var url = window.location.href;
var limiteCruzadinha = 3;

export async function vencerCruzadinha(){
    //somVitoria.load();
    const { RemoverProgressoLS } = await import("../ferramentas/localstorage/excluir.js");
    const { SalvarVencimentoLS } = await import("../ferramentas/localstorage/salvar.js");
    
    AbrirCardVencimento();
    RemoverProgressoLS(url);    
    SalvarVencimentoLS(titulo, url);
    
    await GerarCardsVencer();
    
    FormatTextVencer();
    StopTimer();
    HiddeTimer();
    ResetFocoGlobal(true);
    somVitoria.play();

    //iniciarContadorProximaCruzadinha();
    return true;
}

function AbrirCardVencimento(){
    bgcardVencer.style.visibility = "visible";
    bgcardVencer.style.transition = "opacity 1.2s";
    bgcardVencer.style.opacity = "1";
    cardVencer00El.style.visibility = "visible";
    cardVencer00El.style.transition = "opacity 1.2s";
    cardVencer00El.style.opacity = "1";
    
    cardVencer00El.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    bgcardVencer.addEventListener("click", FecharCardVencimento);
}

function FecharCardVencimento(){
    bgcardVencer.style.display = "none";
    cardVencer00El.style.display = "none";
}

async function GerarCardsVencer(){
    await iniciarFirebaseLocal(); // Garante que temos as funções do Firestore

    var tituloLinkVencer = document.querySelectorAll(".titulo-link-vencer");
    var linkVencerEl = document.querySelectorAll(".link-vencer");
    
    // Criamos a referência usando o 'db' e 'collection' carregados
    const crRef = collection(db, 'cards');
    var consulta = query(crRef, orderBy("data", "desc"), limit(limiteCruzadinha));
    
    var contadorGerar = 0;
    let cruzadinhaSnapshot = await getDocs(consulta);

    for(const cruzadinha of cruzadinhaSnapshot.docs){
        let dadosCrzd = cruzadinha.data();
        if(linkVencerEl[contadorGerar]) {
            linkVencerEl[contadorGerar].href = "play?cr=" + cruzadinha.id;
            tituloLinkVencer[contadorGerar].innerHTML = dadosCrzd.titulo; 
            contadorGerar++; 
        }
    }
}

// --- LÓGICA DE FORMATAÇÃO E COMPARTILHAMENTO ---
async function FormatTextVencer(){
    url = window.location.href;
    const { RecuperarCruzadinhasLS } = await import(/* webpackChunkName: "recuperar" */"../ferramentas/localstorage/recuperar.js");
    
    if(cruzadinhasVencerEl) cruzadinhasVencerEl.textContent = RecuperarCruzadinhasLS().length;
    if(tituloVencerEl) tituloVencerEl.innerHTML = titulo;
    
    inpLinkVencerEl.value = url;
    
    // Tenta pegar o tempo do timer da tela
    const timerDisplay = document.getElementById("timerstamp"); 
    tempoVencerEl.textContent = timerDisplay ? timerDisplay.textContent : "00:00";

    // Listeners de cliques
    copiarVencerEl.addEventListener("click", copiarTextoVencer);
    topicosVencer[0].addEventListener("click", TwitterViaLinkShare);
    topicosVencer[1].addEventListener("click", RedditViaLinkShare);
    topicosVencer[2].addEventListener("click", FacebookViaLinkShare);
    
    caracteresVencerEl.textContent = caracteresDigitados;
    acertosVencerEl.textContent = palavrasAcertadas;
    errosVencerEl.textContent = palavrasErradas;
}

function TwitterViaLinkShare() {
    const tituloTextoPuro = titulo.replace(/<[^>]*>?/gm, ''); 
    const mensagem = `${tituloTextoPuro} - 🔗`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(mensagem)} ${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function FacebookViaLinkShare() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
}

function RedditViaLinkShare() {
    const tituloTextoPuro = titulo.replace(/<[^>]*>?/gm, ''); 
    const mensagem = `📚 - ${tituloTextoPuro}`;
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(mensagem)}`;
    window.open(redditUrl, '_blank');
}

function copiarTextoVencer() {
    inpLinkVencerEl.select();
    inpLinkVencerEl.setSelectionRange(0, 99999); // Suporte mobile
    navigator.clipboard.writeText(inpLinkVencerEl.value);
}

/*
function iniciarContadorProximaCruzadinha() {
    const display = document.getElementById('tempoProximaCruzadinha');

    setInterval(() => {
        const agora = new Date();
        
        // Criamos uma data para "amanhã" às 00:00:00
        const amanha = new Date();
        amanha.setDate(agora.getDate() + 1);
        amanha.setHours(0, 0, 0, 0);

        // Diferença em milissegundos
        const diferenca = amanha - agora;

        // Se por algum motivo a diferença for negativa (ex: o dia virou), resetamos
        if (diferenca <= 0) {
            display.innerText = "00:00:00";
            // Aqui você pode disparar um window.location.reload() se quiser que a página atualize
            return;
        }

        // Cálculos de horas, minutos e segundos
        const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
        const segundos = Math.floor((diferenca / 1000) % 60);

        // Formatando com zero à esquerda (00:00:00)
        display.innerText = 
            String(horas).padStart(2, '0') + ":" + 
            String(minutos).padStart(2, '0') + ":" + 
            String(segundos).padStart(2, '0');

    }, 1000);
}*/