var topicosComCard = document.querySelectorAll('.topico-com-card');
var cardCorrespondente, loadCard;
let temaClaroEl = document.getElementById('tema-claro');
let temaEscuroEl = document.getElementById('tema-escuro');
let temaTardeEl = document.getElementById('tema-tarde');
let asideEl = document.getElementById('aside_opcoes');
let asideLDEl = document.getElementById('aside-main');
/*let click_aside = 0;
let divitemsEl = asideLDEl.querySelectorAll('.descricao-topico');
let iconsitemsEl = asideLDEl.querySelectorAll('.icons-aside');
let iconsEndTopic = asideLDEl.querySelectorAll('.end-topic');
let h3itemsEl = asideLDEl.querySelectorAll('.h3-aside');

let cruzadinhaEl = document.getElementById('conteudo-principal');*/

var _asideAberto = window.innerWidth > 1024;


var topicosComCard = document.querySelectorAll('.topico-com-card');
var cardCorrespondente, loadCard, timeoutCard;

topicosComCard.forEach(topico => {
    topico.addEventListener('click', async (e) => {
        if (e.target.tagName === 'BUTTON') return;
        const { AbrirCard } = await import('../ferramentas/el_visibilidade.js');

        const card = topico.querySelector('.card-lateral');
        
        AbrirCard(card, 9000);
    });
});

var historicoEl = document.getElementById('historico');

historicoEl.addEventListener('click', GerarConteudoHistorico, { once: true });

let localstorageModule = null
async function GerarConteudoHistorico(){
    if(!localstorageModule){
        localstorageModule = await import('../ferramentas/localstorage/recuperar.js');
    }
    const { RecuperarCruzadinhasLS, RecuperarJogandoLS } = localstorageModule;
    var historicoFeitas = document.getElementById('card-lateral-conteudo-feitas');
    var historicoProgresso = document.getElementById('card-lateral-conteudo-emProgresso');

	var fragmento = document.createDocumentFragment();

    RecuperarCruzadinhasLS().forEach(cruzadinha => {
        var novoLink = document.createElement('a');
        novoLink.textContent = `- ${cruzadinha.titulo}`;
        novoLink.href = cruzadinha.link;
        fragmento.appendChild(novoLink);
    });
    historicoFeitas.appendChild(fragmento);

    RecuperarJogandoLS().forEach(cruzadinha => {
        var novoLink = document.createElement('a');
        novoLink.textContent = `- ${cruzadinha.titulo}`;
        novoLink.href = cruzadinha.link;
        fragmento.appendChild(novoLink);
    });
    historicoProgresso.appendChild(fragmento);
}

temaClaroEl.addEventListener('click', function seta_tema(){
	localStorage.setItem('tema', 'padrao');
	location.reload();
});

temaEscuroEl.addEventListener('click', function seta_tema(){
	localStorage.setItem('tema', 'darktheme');
	location.reload();
});
temaTardeEl.addEventListener('click', function seta_tema(){
	localStorage.setItem('tema', 'dim');
	location.reload();
});

asideEl.addEventListener('click', redimensiona_aside);

function AbrirAside() {
    _asideAberto = true;
    asideLDEl.classList.remove('collapsed');
}

function redimensiona_aside() {
    _asideAberto = !_asideAberto;
    asideLDEl.classList.toggle('collapsed');
}

function FecharAside() {
    _asideAberto = false;
    asideLDEl.classList.add('collapsed');
}


// 1. Definição dos sensores
const desktopRes = window.matchMedia('(min-width: 1225px)');
const tabletRes = window.matchMedia('((min-width: 1025px) and (max-width: 1224px))');
const mobileRes = window.matchMedia('(max-width: 1024px)');

let statusMobileNoLoad = mobileRes.matches;

const checarDesktop = (e) => {
    if (e.matches && !_asideAberto) {
        AbrirAside();
    }
};

const checarTablet = (e) => {
    if (e.matches && _asideAberto) {
        FecharAside();
    }
};

// 4. Função do Reload (Mobile)
const checarMobile = (e) => {
    if (e.matches) {
        AbrirAside();
    }
};

desktopRes.addEventListener('change', checarDesktop);
tabletRes.addEventListener('change', checarTablet);
mobileRes.addEventListener('change', checarMobile);

checarTablet(tabletRes);

function ToggleOcultarBlocos(ocultar = false){
    var blocosOcultaveis = asideLDEl.querySelectorAll('.bloco-ocultavel');
    if (ocultar){
        blocosOcultaveis.forEach((bloco)=>{
            bloco.style.display = 'none';
        });
    }
    else{
        blocosOcultaveis.forEach((bloco)=>{
            bloco.style.display = 'flex';
        });
    }
}