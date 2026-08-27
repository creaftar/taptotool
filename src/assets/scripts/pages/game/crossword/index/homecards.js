export var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;

let wheresDinamicos = [];

export var v_ultimaCruzadinha = [];
export var limiteCruzadinha = 20;
export var totalPaginas;
var cruzadinhasViaFirestore = null;
var numeroDeCruzadinhasTotaisNaConsulta = undefined;

var cruzadinhasTotaisNaConsulta = 0;
var ultimaCruzadinha = null;
var crescdecresc = "desc", variavelDB = "data", especificidade = undefined, comparadorEspecificidade = undefined;
var quemEstaChamando = undefined;
var crosswordsCache = [];

let cruzadinhaEl = document.getElementById('conteudo-principal');
let t = JSON.parse(cruzadinhaEl.dataset.i18n).index.js_messages;

export var cardsBonus;
cardsBonus = 1;

var qtdeCardsPorLinha = cardsPorBreakPoints();

// VARIÁVEIS DO FIREBASE
let db, query, limit, startAfter, orderBy, getCountFromServer, where, getDocs;

async function iniciarFirebaseLocal() {
    if (query) return; 
    const { getFirebase } = await import("../ferramentas/firebase.js");
    const fb = await getFirebase();
    
    db = fb.db;
    query = fb.query;
    limit = fb.limit;
    startAfter = fb.startAfter;
    orderBy = fb.orderBy;
    getCountFromServer = fb.getCountFromServer;
    where = fb.where;
    getDocs = fb.getDocs;
}

export function SetQuemEstaChamando(quem){
    quemEstaChamando = quem;
}

export function SetLimiteCruzadinha(limitCrossword){
    limiteCruzadinha = limitCrossword;
}

export async function SetWhereDinamico(valorEspecificidade = undefined, valorComparadorEspecificidade = undefined){
    await iniciarFirebaseLocal(); // Garante as funções do Firebase aqui
    
    wheresDinamicos = []; 
    especificidade = valorEspecificidade;
    comparadorEspecificidade = valorComparadorEspecificidade;
    
    switch (quemEstaChamando){
        case "pesquisa":
            wheresDinamicos.push(where(especificidade, '>=', comparadorEspecificidade));
            wheresDinamicos.push(where(especificidade, '<=', comparadorEspecificidade + '\uf8ff'));
            break;
        case "minhascruzadinhas": 
            wheresDinamicos.push(where(especificidade, '==', comparadorEspecificidade));    
            break;
    }
}

export async function SetOrdenacao(nome_variavelDB, toggle_crescdecresc){
    await LimparCache();
    variavelDB = nome_variavelDB;
    crescdecresc = toggle_crescdecresc;
}

var chamadas = 0;
export async function SetConsulta(){
    chamadas++;
    await iniciarFirebaseLocal(); // Garante acesso ao query, limit, etc.
    
    var { pagAtual } = await import('./menu_paginas.js');
    const { cardsRef } = await import("./index_script.js");
    var consulta = null;
    var cruzadinhasFaltantesCache = (limiteCruzadinha * pagAtual) - crosswordsCache.length; 
    
    if(!especificidade && !comparadorEspecificidade){
        if(ultimaCruzadinha){
            if(cruzadinhasFaltantesCache > 0){
                ultimaCruzadinha = v_ultimaCruzadinha[v_ultimaCruzadinha.length - 1]; 
                consulta = query(cardsRef, orderBy(variavelDB, crescdecresc), startAfter(ultimaCruzadinha), limit(cruzadinhasFaltantesCache));
            }
        }
        else{
            if(cruzadinhasFaltantesCache > 0){
                if(cruzadinhasTotaisNaConsulta === 0){
                    consulta = query(cardsRef, orderBy(variavelDB, crescdecresc));
                    cruzadinhasTotaisNaConsulta = await getCountFromServer(consulta);
                    numeroDeCruzadinhasTotaisNaConsulta = cruzadinhasTotaisNaConsulta.data().count;
                    if(numberCrosswordsTitle) numberCrosswordsTitle.textContent = numeroDeCruzadinhasTotaisNaConsulta;
                }
                consulta = query(cardsRef, orderBy(variavelDB, crescdecresc), limit(cruzadinhasFaltantesCache));
            }
        }
    }
    else{
        if(ultimaCruzadinha){
            if(cruzadinhasFaltantesCache > 0){
                ultimaCruzadinha = v_ultimaCruzadinha[v_ultimaCruzadinha.length - 1]; 
                consulta = query(cardsRef,
                    orderBy(variavelDB, crescdecresc), 
                    ...wheresDinamicos,
                    startAfter(ultimaCruzadinha), 
                    limit(cruzadinhasFaltantesCache));
            }
        }
        else{
            if(cruzadinhasFaltantesCache > 0){
                if(cruzadinhasTotaisNaConsulta === 0){
                    consulta = query(cardsRef, 
                        orderBy(variavelDB, crescdecresc),
                        ...wheresDinamicos
                    );
                    cruzadinhasTotaisNaConsulta = await getCountFromServer(consulta);
                    numeroDeCruzadinhasTotaisNaConsulta = cruzadinhasTotaisNaConsulta.data().count;
                    if(numberCrosswordsTitle) numberCrosswordsTitle.textContent = numeroDeCruzadinhasTotaisNaConsulta;
                }
                consulta = query(cardsRef, 
                    orderBy(variavelDB, crescdecresc), 
                    ...wheresDinamicos,
                    limit(cruzadinhasFaltantesCache));
            }
        }
    }
    
    if(crosswordsCache.length == numeroDeCruzadinhasTotaisNaConsulta){
        cruzadinhasFaltantesCache = 0;
    }
    
    totalPaginas = Math.ceil((numberCrosswordsTitle?.textContent || 0) / limiteCruzadinha);
    cruzadinhasViaFirestore = { consulta: consulta, faltantes: cruzadinhasFaltantesCache, tamanho: totalPaginas };
}

export async function GetConsulta(){
    return cruzadinhasViaFirestore;
}

export async function LimparCache(){
    var { ResetPagMax } = await import("./menu_paginas.js");
    ResetPagMax();
    v_ultimaCruzadinha = [];
    crosswordsCache = [];
    ultimaCruzadinha = null;
    cardsCarregadosTotais = 0;
    cruzadinhasTotaisNaConsulta = 0;
    totalPaginas = 0;
}

var cardsCarregados = 0;
var cardsCarregadosTotais = 0;
let observer;

const numberCrosswordsTitle = document.getElementById("numberCrosswordsTitle");
const contentcruzadinhaEl = document.getElementById('content-cruzadinhas');

export async function GerarLoadCard() {
    var { pagAtual } = await import('./menu_paginas.js');
    var fragmento = document.createDocumentFragment();
    var indiceLoadCard = 0;
    if(quemEstaChamando == "minhascruzadinhas"){
        GerarPrimeiroCard();
    }
    var qtdeLoadCard = await calcularCardsFaltando() + (pagAtual * limiteCruzadinha);

    for(var i = (pagAtual - 1) * limiteCruzadinha; i < qtdeLoadCard; i++){
        var containerLoadCard = document.createElement('div');
        containerLoadCard.classList.add('container-load-card');

        containerLoadCard.innerHTML = `
            <div class="load-card">
                <div class="load-imagem"></div>
                <div class="load-divBtn"></div>
            </div>
            <div class="desc-load-card">
                <div class="load-titulo"></div>
                <div class="load-desc"></div>
                <div class="load-timer"></div>
            </div>
        `;

        if(indiceLoadCard == 0) containerLoadCard.id = 'load-card-observer';
        fragmento.appendChild(containerLoadCard);
        indiceLoadCard++;
    }
    contentcruzadinhaEl.appendChild(fragmento);
}

async function GerarPrimeiroCard(){
    var firstCard = document.createElement('div');
    firstCard.classList.add("container-card");
    firstCard.innerHTML = `
        <div class="card">
            <a class="linkJogar traduzirbody" href="/create" aria-label="${t.js_create_aria}">
                <i class="fa-solid fa-plus x-large blue"></i>
            </a>
            <div class="card-botoes"></div>
        </div>
        <div class="card-infos">
            <div class="header-card-infos">
                <h2 class="titulo titulo-create traduzirbody">${t.js_create_title}</h2>
            </div>
            <p class="ad aviso-ad">
                ${t.js_create_desc} 
                <span class="icone-pequeno">●</span> 
                <a class="blue" href="/create">${t.js_create_link}</a>
            </p>
        </div>
    `;
    contentcruzadinhaEl.appendChild(firstCard);
}

export function RemoverLoadCard(){
    var fake_cards = contentcruzadinhaEl.querySelectorAll(".container-load-card");
    fake_cards.forEach(card => contentcruzadinhaEl.removeChild(card));
}

export function RemoverCard(){
    var cards = contentcruzadinhaEl.querySelectorAll(".container-card");
    cards.forEach(card => {
        if(!card.classList.contains("anuncio")) contentcruzadinhaEl.removeChild(card);
    });
}

export async function ObservarLoadCard(){
    let options = { root: null, rootMargin: '0px', threshold: 0.01 };
    var loadCardObserver = document.getElementById('load-card-observer');
    if(!loadCardObserver) return;
    
    observer = new IntersectionObserver(carregarMaisCruzadinhas, options);
    observer.observe(loadCardObserver);
}

async function carregarMaisCruzadinhas(entries) {
    for (let entry of entries) {
        if (entry.isIntersecting) await ProcessaCruzadinhas();
    }
}

export async function ProcessaCruzadinhas(){
    await iniciarFirebaseLocal(); // Garante getDocs
    var { pagAtual, StartTimerPaginas, TogglePaginacao } = await import('./menu_paginas.js');
    const { NovoCard } = await import("./index_script.js");
    const { NovoAnuncio } = await import("./carrossel.js");

    TogglePaginacao();
    cardsCarregados = 0;
    let promises = []; 
    
    var anunciosFaltantes = await calcularCardsFaltando();
    var anuncioACada = Math.floor(cruzadinhasCarregadas / anunciosFaltantes);
    var anuncioACadaXCards = anuncioACada;

    for(var i = (pagAtual - 1) * limiteCruzadinha; i < (pagAtual * limiteCruzadinha); i++){
        if(crosswordsCache[i]){
            promises.push(NovoCard(crosswordsCache[i].data, crosswordsCache[i].id, limiteCruzadinha, cardsCarregados <= 6));
            cardsCarregados++;
            if(anunciosFaltantes > 0 && cardsCarregados == anuncioACada){
                promises.push(NovoAnuncio(limiteCruzadinha, anunciosFaltantes));   
                anuncioACada += Math.floor(Math.random() * (anuncioACadaXCards / 2)) + Math.floor(anuncioACadaXCards / 2);
                anunciosFaltantes--;
            }
        }
    }
    
    if(cruzadinhasViaFirestore.faltantes > 0){
        let cruzadinhaSnapshot = await getDocs(cruzadinhasViaFirestore.consulta);
        if(cruzadinhaSnapshot.size == 0){
            StartTimerPaginas();
            return;
        }

        for(const cruzadinha of cruzadinhaSnapshot.docs){
            crosswordsCache[cardsCarregadosTotais] = {data: cruzadinha.data(), id: cruzadinha.id};
            cardsCarregados++;
            cardsCarregadosTotais++;
            
            promises.push(NovoCard(cruzadinha.data(), cruzadinha.id, limiteCruzadinha, cardsCarregados <= 6));
                
            if(anunciosFaltantes > 0 && cardsCarregados == anuncioACada){
                promises.push(NovoAnuncio(limiteCruzadinha, anunciosFaltantes));   
                anuncioACada += anuncioACadaXCards;
                anunciosFaltantes--;
            }

            if(cardsCarregadosTotais % 10 == 0){
                v_ultimaCruzadinha.push(cruzadinha);
            }
        }
    }

    ultimaCruzadinha = v_ultimaCruzadinha[(pagAtual * (limiteCruzadinha / 10)) - 1]; 

    const cards = await Promise.all(promises);
    requestAnimationFrame(() => {
        RemoverLoadCard();
        contentcruzadinhaEl.append(...cards);
    });

    StartTimerPaginas();
}

export function RedefinirCardBonus(){
    cardsBonus = 1;
}

export function increaseCardBonus(){
    cardsBonus = 2;
}

export function SetCardBonus(qtdeCardBonus){
    cardsBonus = qtdeCardBonus;
}

function cardsPorBreakPoints() {
    const w = window.innerWidth;
    if (w <= 527) return 1;
    if (w <= 993) return Math.floor(1 / 0.48);
    if (w <= 1575) return Math.floor(1 / 0.30);
    if (w <= 1899) return Math.floor(1 / 0.23);
    return Math.floor(1 / 0.19);
}

window.addEventListener('resize', () => {
    qtdeCardsPorLinha = cardsPorBreakPoints();
});

var cruzadinhasCarregadas;
async function calcularCardsFaltando(){ 
    var { pagAtual } = await import('./menu_paginas.js');
    cruzadinhasCarregadas = pagAtual == totalPaginas ? (numeroDeCruzadinhasTotaisNaConsulta || 0) - cardsCarregadosTotais : limiteCruzadinha;
    const calculo = qtdeCardsPorLinha - ((cruzadinhasCarregadas + cardsBonus) % qtdeCardsPorLinha);
    return calculo;/* == qtdeCardsPorLinha ? 0 : calculo;*/
}