export {};

var usuarioAtual;
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;

let botaoEl = document.getElementById('menu');
let voltarEl = document.getElementById('voltar');
let pressionadas = 1;
let navEl = document.getElementById('navegacao');
let blocoNavEl = document.querySelectorAll('.bloco-nav');
//let menuEl = document.getElementById('info');
let containerPerfilEl = document.getElementById('container-perfil');
let submenuEl = document.querySelectorAll('.submenu');
let entrarEl = document.getElementById('entrar');
let cadastrarEl = document.getElementById('cadastrar');

var content_cruzadinhas = document.getElementById('content-cruzadinhas');
//var largura = window.screen.width;

let bloco1El = document.getElementById('bloco1');
let bloco1_2El = document.getElementById('bloco1-2');
let bloco2El = document.getElementById('bloco2');
var lupaEl = document.getElementById('lupa');
var input_pesquisaEl = document.getElementById('input_pesquisa');
var cooldownTimerEl = document.getElementById('cooldownTimer');


let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vw', `${vw}px`);

let AlternarVisibilidade = () => {}, 
    //DefinirInvisibilidade = () => {}, 
    RemoverVisibilidade = () => {}, 
    AdicionarVisibilidade = () => {}; 
    //VerificarVisibilidade = () => {};

let t = JSON.parse(navEl.dataset.translations).auth_errors;

inicializa_menu();
async function inicializa_menu(){
	
	const [visibilidade/*, loginModulo*/] = await Promise.all([
		import("../ferramentas/el_visibilidade.js"),
        import("./login.js")
    ]);
	
    ({ 
		AlternarVisibilidade, 
        //DefinirInvisibilidade, 
        RemoverVisibilidade, 
        AdicionarVisibilidade, 
        //VerificarVisibilidade 
    } = visibilidade);
	
    /*const { GerarImagemUsuario } = loginModulo;
    GerarImagemUsuario();*/
	import("./linguagem.js");
	import("./toggletheme.js");
}

if(isMobile){
	if(lupaEl){
		lupaEl.addEventListener('click', function(){
			cooldownTimerEl.style.cssText = 'display:flex';
			input_pesquisaEl.style.cssText = 'display:flex';
			input_pesquisaEl.style.animation = 'surgirLi 0.6s forwards';
			bloco1_2El.style.cssText = 'width: 100%';
			bloco1El.style.cssText ='display:none';
			bloco2El.style.cssText ='display:none';
			input_pesquisaEl.focus();
			input_pesquisaEl.select();
			input_pesquisaEl.addEventListener("focusout", mostrar_icones);
		});
	}
}

function mostrar_icones(){
	input_pesquisaEl.style.animation = '';
	bloco1_2El.style.cssText = 'width: 70%';
	bloco1El.style.cssText ='display:flex';
	bloco2El.style.cssText ='display:flex';
	fechar_cadastro();
	cooldownTimerEl.style.cssText = 'display:none';
	input_pesquisaEl.style.cssText = 'display:none';
}

if(botaoEl) {
    let podeExecutar = true;

    botaoEl.addEventListener('click', async () => {
        if (podeExecutar) {
            podeExecutar = false;
            executa_animacao();

            setTimeout(function() {
                podeExecutar = true;
            }, 1000);
        }
    });
}


function executa_animacao(){
	fechar_cadastro();
		pressionadas++;
		botaoEl.style.animation = '';
			if(pressionadas % 2 == 0){
				botaoEl.innerHTML = '<i class="fa-solid fa-plus"></i>';
				for(var i = 0; i < blocoNavEl.length; i++){
					blocoNavEl.forEach(el => el.style.display = 'none');
				}
				botaoEl.style.animation = 'rotacionar 0.9s';
				navEl.style.animation = 'encolher_menu 0.6s forwards';
			}
			else{
				botaoEl.innerHTML = '<i class="fa-solid fa-bars icons"></i>';
				botaoEl.style.animation = 'desrotacionar 0.9s';
				navEl.style.animation  = 'expandir_menu 0.9s forwards';
				setTimeout(function() {
					blocoNavEl.forEach(el => el.style.display = 'flex');
				}, 600);
			}
}

if(voltarEl){
	voltarEl.addEventListener('click', function(){
		menu_lateral.style.animation = '';
		menu_lateral.style.cssText = 'display:none';
		navEl.style.cssText = '-webkit-filter: blur(0px)';
		content_cruzadinhas.style.cssText = '-webkit-filter: blur(0px)';
	});
}

function fechar_cadastro(){
	submenuEl[0].style.cssText = 'visibility:none';
	submenuEl[1].style.animation = '';
	submenuEl[1].style.cssText = 'visibility:none';
}

containerPerfilEl.addEventListener('click', abre_menu);

submenuEl[0].addEventListener('click', function(event){
	event.stopPropagation();
});
submenuEl[1].addEventListener('click', function(event){
	event.stopPropagation();
});

function abre_menu(event){
	AlternarVisibilidade(submenuEl[1]);
	submenuEl[0].style.animation = '';
	submenuEl[1].style.animation = '';
	submenuEl[1].style.animation = 'surgirLi 0.9s forwards';
}

entrarEl.addEventListener('click', function(){
	RemoverVisibilidade(submenuEl[0]);
	AdicionarVisibilidade(submenuEl[1]);
	submenuEl[0].style.animation = '';
	submenuEl[1].style.animation = '';
	submenuEl[1].style.animation = 'surgirLi 0.9s forwards';
});

cadastrarEl.addEventListener('click', function(){
	RemoverVisibilidade(submenuEl[1]);
	AdicionarVisibilidade(submenuEl[0]);
	submenuEl[0].style.animation = '';
	submenuEl[1].style.animation = '';
	submenuEl[0].style.animation = 'surgirLi 0.9s forwards';
});