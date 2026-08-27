//import { SetOrdenacao } from './homecards.js';
//import { dados } from './index_script.js';

import { RemoverVisibilidade, DefinirInvisibilidade, AdicionarVisibilidade } from '../ferramentas/el_visibilidade.js';
const menuLimitePaginasEl = document.getElementById("menu-limite-paginas");
const menuOrdenacaoPaginasEl = document.getElementById("menu-ordenacao-paginas");

const avancarPaginaBtn = document.getElementById('avancar-pagina');
const avancarPagina2Btn = document.getElementById('avancar-pagina2');
const recuarPaginaBtn = document.getElementById('recuar-pagina');
const recuarPagina2Btn = document.getElementById('recuar-pagina2');
//const contentcruzadinhaEl = document.getElementById('content-cruzadinhas');
const mainContainerEl = document.getElementById('main-container');

const boxOrdenacaoEl = document.getElementById('box-ordenacao');
const boxOrdenacao2El = document.getElementById('box-ordenacao2');
const listaDinamicaEl = document.getElementById('lista-dinamica');
const listaDinamica2El = document.getElementById('lista-dinamica2');

let cruzadinhaEl = document.getElementById('conteudo-principal');
let ordenacaoBtn = cruzadinhaEl.querySelectorAll(".button-ordenacao");
let ordenacaoMenu = cruzadinhaEl.querySelectorAll(".menu-ordenacao");

ordenacaoBtn.forEach((btn, i)=>{
	btn.addEventListener("click", (event) => {
		RemoverVisibilidade();
		event.stopPropagation();
		AdicionarVisibilidade(ordenacaoMenu[i]);
	});
});

var tempoRestante = 2;
export var podePaginar = true;
export function TogglePaginacao(){
	podePaginar = !podePaginar;
}
var timespanEl = document.getElementById('timespan');
var timespan2El = document.getElementById('timespan2');

export var pagAtual = 1;
var pagMax = 0;

export function ResetPagMax(){
	pagMax = 0;
}

menuOrdenacaoPaginasEl.addEventListener("click", async (evt) => {
	var menuOrdenacaoText = document.getElementById("menu-ordenacao-text");
	if((evt.target.tagName === 'LI') && (evt.target.textContent !== menuOrdenacaoText.textContent) && podePaginar){
		const { SetOrdenacao } = await import('./homecards.js');
		switch (evt.target.dataset.opcao) {
            case 'latest':
				await SetOrdenacao("data", "desc");
                break;
            case 'oldest':
				await SetOrdenacao("data", "asc");
                break;
            case 'a-z':
				await SetOrdenacao("titulo", "asc");
                break;
            case 'z-a':
				await SetOrdenacao("titulo", "desc");
                break;
            default:
                console.log('');
        }

		menuOrdenacaoText.textContent = evt.target.textContent;
		evt.stopPropagation();
		const { RemoverVisibilidade } = await import('../ferramentas/el_visibilidade.js');
        RemoverVisibilidade();
		pagMax = 0;
        GerarListaDinamica(1);
    }
});

menuLimitePaginasEl.addEventListener("click", async (evt) => {
    var idLista = parseInt(evt.target.textContent);
    if((evt.target.tagName === 'LI') && (idLista !== pagAtual) && podePaginar){
		document.getElementById("text-limit-pages").textContent = idLista;
		evt.stopPropagation();
		const { RemoverVisibilidade } = await import('../ferramentas/el_visibilidade.js');
		const { SetLimiteCruzadinha } = await import('./homecards.js');
        RemoverVisibilidade();
        SetLimiteCruzadinha(idLista);
        pagMax = 0;
        GerarListaDinamica(1);
    }
});

listaDinamica2El.addEventListener("click", (evt) => {
    if (evt.target.classList.contains('clickable') && parseInt(evt.target.textContent) !== pagAtual) {
		GerarListaDinamica(evt.target.textContent);
	}
});
listaDinamicaEl.addEventListener("click", (evt) => {
    if (evt.target.classList.contains('clickable') && parseInt(evt.target.textContent) !== pagAtual) {
		GerarListaDinamica(evt.target.textContent);
	}
});

boxOrdenacao2El.addEventListener("click", (evt) => {
    if (evt.target.classList.contains('clickable') && parseInt(evt.target.textContent) !== pagAtual) {
		GerarListaDinamica(evt.target.textContent);
	}
});
boxOrdenacaoEl.addEventListener("click", (evt) => {
    if (evt.target.classList.contains('clickable') && parseInt(evt.target.textContent) !== pagAtual) {
		GerarListaDinamica(evt.target.textContent);
	}
});

export function StartTimerPaginas(){
	// Tempo inicial em segundos
	timespanEl.textContent = ' 3';
	timespan2El.textContent = ' 3';

	const intervalo = setInterval(function() {
	
	timespanEl.textContent = ' ' + tempoRestante;
	timespan2El.textContent = ' ' + tempoRestante;
	tempoRestante--;
	// Verifica se o tempo acabou
		if (tempoRestante < 0) {
			// Para o timer
			clearInterval(intervalo);
			tempoRestante = 2;
			timespanEl.textContent = ' /';
			timespan2El.textContent = ' /';
			podePaginar = true;
		}
	}, 1000); // 1000 milissegundos = 1 segundo

	// A variável 'tempoRestante' sempre armazena o tempo restante em segundos
}

export async function GerarListaDinamica(pagina_atual, primeira_chamada = false) {
	if(!podePaginar){
		return;
	}
	pagina_atual = parseInt(pagina_atual); 
	pagAtual = pagina_atual;
	var { SetConsulta, GetConsulta, GerarLoadCard, ObservarLoadCard, RemoverCard } = await import('./homecards.js');
	await SetConsulta();
	const textBoxOrdenacaoEl = document.getElementById('text-box-ordenacao');
	const textBoxOrdenacao2El = document.getElementById('text-box-ordenacao2');

	var fragmento = document.createDocumentFragment();
	var fragmento2 = document.createDocumentFragment();
	var fragmentodois = document.createDocumentFragment();
	var fragmentodois2 = document.createDocumentFragment();

	boxOrdenacaoEl.innerHTML = '';
	boxOrdenacao2El.innerHTML = '';
	
	listaDinamicaEl.innerHTML = ''; // Limpa a lista antes de adicionar novos elementos
	listaDinamica2El.innerHTML = ''; // Limpa a lista antes de adicionar novos elementos
	RemoverCard();
	
	if(!primeira_chamada){
		await GerarLoadCard();
	}
	ObservarLoadCard();

	var consulta = await GetConsulta();
	var totalPaginas = consulta.tamanho;

	if(pagMax < pagina_atual){
		pagMax = pagina_atual;
	}
	for(var i = 1; i <= pagMax; i++){
		var lista = document.createElement("li");
		lista.classList.add('clickable');
		lista.textContent = i;
		
		var lista2 = document.createElement("li");
		lista2.classList.add('clickable');
		lista2.textContent = i;
		if(i === pagina_atual){
			lista2.classList.add("page-active");
		}
		fragmentodois.appendChild(lista);
		fragmentodois2.appendChild(lista2);
	}
	boxOrdenacaoEl.appendChild(fragmentodois);
	boxOrdenacao2El.appendChild(fragmentodois2);

	textBoxOrdenacaoEl.textContent = pagina_atual;
	textBoxOrdenacao2El.textContent = pagina_atual;
	
	// Definir o intervalo de páginas a serem exibidas
	var inicio = Math.max(1, pagina_atual - 2);
	var fim = Math.max(1,((pagina_atual + 2) < totalPaginas ? (pagina_atual + 2) : totalPaginas));
	avancarPaginaBtn.classList.remove('button-desactive');
	avancarPagina2Btn.classList.remove('button-desactive');
	recuarPaginaBtn.classList.remove('button-desactive');
	recuarPagina2Btn.classList.remove('button-desactive');
	// Adicionar páginas anteriores
	if (inicio >= 1) {
		var primeiraPagina = document.createElement("li");
		primeiraPagina.classList.add('clickable');

		var primeiraPagina2 = document.createElement("li");
		primeiraPagina2.classList.add('clickable');

		if(pagina_atual === 1){
			recuarPaginaBtn.classList.add('button-desactive');
			recuarPagina2Btn.classList.add('button-desactive');
			primeiraPagina.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
			primeiraPagina2.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
		}
		primeiraPagina.textContent = 1;
		primeiraPagina2.textContent = 1;
		
		fragmento.appendChild(primeiraPagina);
		fragmento2.appendChild(primeiraPagina2);

		if (inicio > 1) {
			var elipsis = document.createElement("li");
			elipsis.textContent = "...";
			fragmento.appendChild(elipsis);
			
			var elipsis2 = document.createElement("li");
			elipsis2.textContent = "...";
			fragmento2.appendChild(elipsis2);
		}
	}

	// Adicionar páginas atuais
	for (var j = inicio + 1; j <= fim - 1; j++) {
		var lista = document.createElement("li");
		lista.classList.add('clickable');

		var lista2 = document.createElement("li");
		lista2.classList.add('clickable');

		lista.textContent = j;
		lista2.textContent = j;
		if (j === pagina_atual) {
			lista.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
			lista2.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
		}
		fragmento.appendChild(lista);
		fragmento2.appendChild(lista2);
	}

	// Adicionar páginas posteriores
	if (fim <= totalPaginas) {
		if (fim < totalPaginas - 2) {
			var elipsis = document.createElement("li");
			elipsis.textContent = "...";

			var elipsis2 = document.createElement("li");
			elipsis2.textContent = "...";

			fragmento.appendChild(elipsis);
			fragmento2.appendChild(elipsis2);
		}

		if(pagina_atual >= totalPaginas - 1){
			if(inicio !== fim){
				var ultimaPagina = document.createElement("li");
				ultimaPagina.classList.add('clickable');
				ultimaPagina.textContent = totalPaginas;
				
				var ultimaPagina2 = document.createElement("li");
				ultimaPagina2.classList.add('clickable');
				ultimaPagina2.textContent = totalPaginas;
				if(pagina_atual === totalPaginas){
					avancarPaginaBtn.classList.add('button-desactive');
					avancarPagina2Btn.classList.add('button-desactive');
					ultimaPagina.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
					ultimaPagina2.classList.add('page-active'); // Adiciona uma classe para destacar a página atual
				}
				fragmento.appendChild(ultimaPagina);
				fragmento2.appendChild(ultimaPagina2);
			}
			else{
				avancarPaginaBtn.classList.add('button-desactive');
				avancarPagina2Btn.classList.add('button-desactive');
			}
		}
	}

	if(fim === 1){
		avancarPaginaBtn.classList.add('button-desactive');
		avancarPagina2Btn.classList.add('button-desactive');
	}
	
	/*if((pagAtual - 1) > v_ultimaCruzadinha.length){
		AddUltimaCruzadinha();
	}*/

	listaDinamicaEl.appendChild(fragmento);
	listaDinamica2El.appendChild(fragmento2);
	//SetUltimaCruzadinha(v_ultimaCruzadinha[pagAtual - 2]);
	mainContainerEl.scrollTop = 0;
		
	//StartTimerPaginas();
}

async function RecuarPagina(){
	GerarListaDinamica(pagAtual - 1); 
}
async function AvancarPagina(){
	GerarListaDinamica(pagAtual+1);
}

avancarPagina2Btn.addEventListener("click", ()=>{
    if(!avancarPagina2Btn.classList.contains("button-desactive")){
        AvancarPagina();
    }
});
avancarPaginaBtn.addEventListener("click", ()=>{
    if(!avancarPaginaBtn.classList.contains("button-desactive")){
        AvancarPagina();
    }
});
recuarPaginaBtn.addEventListener("click", ()=>{
    if(!recuarPaginaBtn.classList.contains("button-desactive")){
        RecuarPagina();
    }
});

recuarPagina2Btn.addEventListener("click", ()=>{
    if(!recuarPagina2Btn.classList.contains("button-desactive")){
        RecuarPagina();
    }
});
