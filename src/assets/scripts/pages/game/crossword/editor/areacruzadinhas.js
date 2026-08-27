import { EditarFlexdir_i_db, EditarVh_i_db, EditarVw_i_db/*, RemoverPalavraRascunho_i_db*/ } from '../lib/rascunhoeditor.js';
import { Getnumeditavel } from './menulateral.js';
import { sectionEditavel, interruptor, verthoriz } from './menulateral.js';
import { respostasString, qtdePalavras } from './cartoes.js';
import { bauPALAVRAS } from './cartoes.js';

//menulateralModule = null;
let redimensionarModule = null;
const area_cruzadinhasEl = document.getElementById('area-cruzadinhas');
const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');
//const menu_iconesEl = document.querySelectorAll('.menu-icones');

//var interruptor;
var largura = window.screen.width;
let posAntX, posAntY, MOBposAntX, MOBposAntY;
//var autoposPalavras
let viewwidth = window.innerWidth;
let viewheight = window.innerHeight;
var GRID_SIZE = 100;
export const configQuadrados = {
    quadrado: 34,
    quadradoMetade: 17
};

document.documentElement.style.setProperty('--tamanho-quadrado', `${configQuadrados.quadrado}px`);

area_cruzadinhasEl.addEventListener('click', posTela);
area_cruzadinhasEl.addEventListener("touchstart", detecta_click, {passive: true});
area_cruzadinhasEl.addEventListener("mousedown", detecta_click);


const verthorzBtn = document.getElementById('verthoriz');
verthorzBtn.addEventListener('click', posTela);
//menu_iconesEl[1].addEventListener('click', posTela);
//menu_iconesEl[0].addEventListener('click', posTela);

export async function posTela(){
    /*if(!menulateralModule){
        menulateralModule = await import('./menulateral.js');
    }*/
    //interruptor = menulateralModule.interruptor;
    //sectionEditavel = menulateralModule.sectionEditavel;
	//verifica se o botao é verdadeiro, verifica se a section existe	
	if(interruptor(false) && sectionEditavel){
		if(verthoriz){
			sectionEditavel.style.cssText += 'flex-direction: column';
			EditarFlexdir_i_db(Getnumeditavel(true) - 1, "column");
			//sectionEditavel.style.cssText += 'justify-content: space-around';
		}
		else{
			sectionEditavel.style.cssText += 'flex-direction: row';	
            EditarFlexdir_i_db(Getnumeditavel(true) - 1, "row");
			//sectionEditavel.style.cssText += 'justify-content: space-around';
		}
	}
}

//funcao que detecta click do mouse na section//
async function detecta_click(e){
    if(interruptor(false)){
        area_cruzadinhasEl.style.cssText += 'overflow-x: hidden;';
        area_cruzadinhasEl.style.cssText += 'overflow-y: hidden;';
		if(largura < 800 && e.changedTouches && e.changedTouches[0] && sectionEditavel){
			MOBposAntX = e.changedTouches[0].clientX - sectionEditavel.offsetLeft;
			MOBposAntY = e.changedTouches[0].clientY - sectionEditavel.offsetTop;
			area_cruzadinhasEl.addEventListener("touchmove", segurar, {passive: true});
			area_cruzadinhasEl.addEventListener("touchend", soltar, {passive: true});
		}
		else if(largura > 800 && sectionEditavel){
			posAntX = e.clientX - sectionEditavel.offsetLeft; //deu algum erro na linha 81	
			posAntY = e.clientY - sectionEditavel.offsetTop;
			area_cruzadinhasEl.addEventListener("mousemove", segurar);
			area_cruzadinhasEl.addEventListener("mouseup", soltar);
		}
	}
}
//funcao que detecta se o mouse esta sendo pressionado//
function segurar(e){
	if(interruptor(false)){
       if(largura < 800){
			var touch = e.changedTouches[0];
			sectionEditavel.style.left = (Math.round((touch.clientX - MOBposAntX) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade) + 'px';
			sectionEditavel.style.top = (Math.round((touch.clientY - MOBposAntY) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade) + 'px';
        }
		else {
			sectionEditavel.style.left = (Math.round((e.clientX - posAntX) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade) + 'px';
			sectionEditavel.style.top = (Math.round((e.clientY - posAntY) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade) + 'px';
        }
	}
}
//funcao que detecta se soltou o click do mouse//
async function soltar(){
    if(interruptor(false)){
        const { conterCruzadinhasEl } = await import('./redimensionar.js');
        area_cruzadinhasEl.style.cssText += 'overflow-x: auto;';
        area_cruzadinhasEl.style.cssText += 'overflow-y: auto;';
    	
		area_cruzadinhasEl.removeEventListener("touchmove", segurar, {passive: true});
		area_cruzadinhasEl.removeEventListener("touchend", soltar, {passive: true});	
		
		area_cruzadinhasEl.removeEventListener("mousemove", segurar);
		area_cruzadinhasEl.removeEventListener("mouseup", soltar);

        // 1. Pegar o deslocamento que o "conter_cruzadinhas" aplicou ao container
        // Importante: use parseFloat para ignorar o "px"
        const containerL = parseFloat(conterCruzadinhasEl.x) || 0;
        const containerT = parseFloat(conterCruzadinhasEl.y) || 0;

        // 2. Pegar a posição visual que o elemento parou após o drag
        const visualL = parseFloat(sectionEditavel.style.left);
        const visualT = parseFloat(sectionEditavel.style.top);

        // 3. REVERSÃO: Somar os dois para ter o valor "real" (absoluto)
        const valorRealX = (visualL + containerL) + "px";
        const valorRealY = (visualT + containerT) + "px";
        
        await EditarVw_i_db(Getnumeditavel(true) - 1, valorRealX);
        await EditarVh_i_db(Getnumeditavel(true) - 1, valorRealY);
        //await RemoverPalavraRascunho_i_db(Getnumeditavel(true) - 1, false);
	}
}

export async function autoposPalavras(){
    const { LimparArraysPosicao_i_db } = await import("../lib/rascunhoeditor.js");
    LimparArraysPosicao_i_db();

    if(qtdePalavras > 0){
		area_cruzadinhasEl.style.cssText = "justify-content: flex-start";
		var posicao;
		var grid = [];
		/*Objeto bau para guardar as palavras e suas posicoes, otimizador de código para 
		não precisar passar pelo grid toda hora*/
			
		for(var i = 0; i < GRID_SIZE; i++) {
			grid[i] = [];
			for(var j = 0; j < GRID_SIZE; j++) {
				grid[i][j] = null; // Todas as células estão inicialmente vazias
			}
		}


		//posicionando a primeira palavra pras outras terem ela de referencia 
		var id_palavra = Math.floor(Math.random() * qtdePalavras + 1);
		
		let section_inicial = bauPALAVRAS[id_palavra].section;
		
        for(var x = 0; x < qtdePalavras; x++){
            var section_atual = bauPALAVRAS[x+1].section;;
			bauPALAVRAS[x+1].posicionada = false;
            //		if(x != id_palavra-1){
            section_atual.style.left = '0px';
            section_atual.style.top = '0px';
		//		}
		}
		//toda hora naquele for do j ali de baixo
		/*for(var x = 0; x < qtdePalavras; x++){
			var section_atual = document.getElementById('PALAVRA'+(x+1));
				if(x != id_palavra-1){
					section_atual.style.left = '0px';
					section_atual.style.top = '0px';
				}
		}*/

		//posicionando a primeira palavra pras outras terem ela de referencia 
		//var id_palavra = Math.floor(Math.random() * qtdePalavras + 1);
		//let section_inicial = document.getElementById('PALAVRA' + id_palavra);
		
		/*let id_ultima_letra = section_moving.lastElementChild.id.split(',');
		//variavel para mostrar a qtde de letras que a primeira palavra tem 
		var ultima_letra = parseInt(id_ultima_letra[0]) + 1;*/

		let verthoriz_sectioninicial = (Math.floor(Math.random() * 2) + 1);
		//let verthoriz_sectioninicial = 1;

		if(verthoriz_sectioninicial == 1){
			section_inicial.style.cssText += 'flex-direction: row';
			section_inicial.style.left = (Math.round((Math.floor(Math.random() * (viewwidth * 0.5 - viewwidth * 0.4 )) + viewwidth * 0.4) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade)+'px';
			section_inicial.style.top = (Math.round((Math.floor(Math.random() * (viewheight * 0.5 - viewheight * 0.3)) + viewheight * 0.3) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade)+'px';
			posicao = {
				x: 46,
				y: 50
			};
            bauPALAVRAS[id_palavra].texto = respostasString[id_palavra - 1].toLowerCase().split(''), 
			bauPALAVRAS[id_palavra].x = posicao.x;
			bauPALAVRAS[id_palavra].y = posicao.y;
			bauPALAVRAS[id_palavra].flexdir = "row";
            Adicionar_palGrid(grid, bauPALAVRAS[id_palavra]);
            bauPALAVRAS[id_palavra].posicionada = true;
            /*
            respostasString[id_palavra - 1].toLowerCase().split(''), 
            posicao.x, 
            posicao.y, 
            "row",
            section_inicial
            */
			
		}
		else if(verthoriz_sectioninicial == 2){
			section_inicial.style.cssText += 'flex-direction: column';
			section_inicial.style.left = (Math.round((Math.floor(Math.random() * (viewwidth * 0.5 - viewwidth * 0.4 )) + viewwidth * 0.4) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade)+'px';
			section_inicial.style.top = (Math.round((Math.floor(Math.random() * (viewheight * 0.3 - viewheight * 0.1)) + viewheight * 0.1) / configQuadrados.quadradoMetade) * configQuadrados.quadradoMetade)+'px';
			posicao = {
				x: 46,
				y: 50
			};
            bauPALAVRAS[id_palavra].texto = respostasString[id_palavra - 1].toLowerCase().split(''), 
			bauPALAVRAS[id_palavra].x = posicao.x;
			bauPALAVRAS[id_palavra].y = posicao.y;
			bauPALAVRAS[id_palavra].flexdir = "column";
			Adicionar_palGrid(grid, bauPALAVRAS[id_palavra]);
			bauPALAVRAS[id_palavra].posicionada = true;
            /*
			bauPALAVRAS[id_palavra] = new Palavra(respostasString[id_palavra - 1].toLowerCase().split(''), 
            posicao.x, 
            posicao.y, 
            "column",
            section_inicial);*/
		}
		//fim

		/******FOR ANVERSO*******/
		//for pra ver a palavra a ser movida
		/*id_palavra + 1 porque não quero editar a posição da palavra que se moveu antes de todas*/
		for(var i = id_palavra+1; i <= qtdePalavras; i++){
            bauPALAVRAS[i].texto = respostasString[i - 1].toLowerCase().split('');
			//for pra percorrer todas as palavras e analisar com a que esta sendo movida
			for(var j = 1; j <= qtdePalavras && !bauPALAVRAS[i].posicionada; j++){
			
                bauPALAVRAS[i].posicionada = await verifica_letras(bauPALAVRAS[i], bauPALAVRAS[j], bauPALAVRAS[i].section, bauPALAVRAS[j].section, grid);
                
            }
		}
        
		/******FOR REVERSO*******/
		//for pra ver a palavra a ser movida
		/*id_palavra - 1 porque não quero editar a posição da palavra que se moveu antes de todas*/
		for(var i = id_palavra-1; i > 0; i--){
            bauPALAVRAS[i].texto = respostasString[i - 1].toLowerCase().split('');
            //for pra percorrer todas as palavras e analisar com a que esta sendo movida
			for(var j = qtdePalavras; j > 0 && !bauPALAVRAS[i].posicionada; j--){
                bauPALAVRAS[i].posicionada = await verifica_letras(bauPALAVRAS[i], bauPALAVRAS[j], bauPALAVRAS[i].section, bauPALAVRAS[j].section, grid);
			}
		}
        
        let naoConseguiuPosicionar = [];
        /******FOR DE CONSERTO*******/
		//for pra posicionar palavras que ainda não foram colocadas
		/*id_palavra - 1 porque não quero editar a posição da palavra que se moveu antes de todas*/
		for(var i = 1; i <= qtdePalavras; i++){
            bauPALAVRAS[i].texto = respostasString[i - 1].toLowerCase().split('');
            if(bauPALAVRAS[i].posicionada !== true){
                naoConseguiuPosicionar.push(bauPALAVRAS[i]);
				//for pra percorrer todas as palavras e analisar com a que esta sendo movida
				for(var j = qtdePalavras; j > 0 && !bauPALAVRAS[i].posicionada; j--){
                    bauPALAVRAS[i].posicionada = await verifica_letras(bauPALAVRAS[i], bauPALAVRAS[j], bauPALAVRAS[i].section, bauPALAVRAS[j].section, grid);
                }
			}
		}

        
        let conseguiuPosicionar = true;
        for(const el of naoConseguiuPosicionar){
            if(el.posicionada != true)
                conseguiuPosicionar = false;
        }
        
        if(conseguiuPosicionar){
            return true;
        }
        return false;
    }
    return false;
}

function Adicionar_palGrid(grid, PALAVRA) {
    var y = PALAVRA.y;
    var x = PALAVRA.x;
    var campos_iguais = 0;
    var campos_nulos = 0;
    PALAVRA.ligacoes = 0;

    if(PALAVRA.flexdir == "column"){
        // Percorre cada letra da palavra
        for (var i = 0; i < PALAVRA.texto.length; i++) {
            if(grid[y + i][x] == null){
                campos_iguais++;
            }
            if(grid[y + i][x] == PALAVRA.texto[i]){
                campos_iguais++;
                PALAVRA.ligacoes++;
            }
            if(grid[y + i][x + 1] == null && grid[y + i][x - 1] == null){
                campos_nulos++;
            }
        }
        
        /*
        LEMBRANDO QUE PALAVRAS LIGADAS NÃO CONTAM PARA A REMOCAO, O PROGRAMA ANALISA OS ESPAÇOS NULOS E
        SE SE FOR IGUAL AO TAMANHO DA PALAVRA - LIGACOES COM OUTRAS AI POSICIONA.
        verificacao pra remover palavras de cima, baixo e do lado imediado da esquerda e direita, exemplo:
        - - * - - - 	
        - * a * - -
        - *	b * - -
        - *	a * - -
        - *	c * - -
        - *	a * - -
        - *	x * - -
        - *	i * - -
        - - * - - -
        A FUNÇÃO ANALISA OS ASTERISCOS*
        */
        if(grid[y - 1][x] == null && grid[y + PALAVRA.texto.length][x] == null
            && PALAVRA.texto.length - campos_nulos == PALAVRA.ligacoes){
            campos_iguais++;
        }

        if(campos_iguais == PALAVRA.texto.length + 1){
            for (var i = 0; i < PALAVRA.texto.length; i++) {
                grid[y + i][x] = PALAVRA.texto[i];
            }
            return campos_iguais - 1;
        }
    }

    else{ // row
        for (var i = 0; i < PALAVRA.texto.length; i++){
            if(grid[y][x + i] == null){
                campos_iguais++;
            }
            if(grid[y][x + i] == PALAVRA.texto[i]){
                campos_iguais++;
                PALAVRA.ligacoes++;
            }
            if(grid[y + 1][x + i] == null && grid[y - 1][x + i] == null){
                campos_nulos++;
            }
        }

        /*
        LEMBRANDO QUE PALAVRAS LIGADAS NÃO CONTAM PARA A REMOCAO, O PROGRAMA ANALISA OS ESPAÇOS NULOS E
        SE SE FOR IGUAL AO TAMANHO DA PALAVRA - LIGACOES COM OUTRAS AI POSICIONO.
        verificacao pra remover palavras de cima, baixo e do lado imediado da esquerda e direita, exemplo:
        - - * * * * * * * - - 	
        - * a b a c a x i * -
        - - * * * * * * * - - 
        estou analisando as linhas com asterisco*
        */
        if(grid[y][x - 1] == null && grid[y][x  + PALAVRA.texto.length] == null
            && PALAVRA.texto.length - campos_nulos == PALAVRA.ligacoes){
            campos_iguais++;
        }
        if(campos_iguais == PALAVRA.texto.length + 1){
            for (var i = 0; i < PALAVRA.texto.length; i++) {
                grid[y][x + i] = PALAVRA.texto[i];
            }
            return campos_iguais - 1;
        }
    }
    return 0;
}

async function verifica_letras(PALAVRA, PALAVRA_analised, section_moving, section_analised, grid){
    if(section_analised.style.left != '0px'){  
        var coordX_analised = section_analised.offsetLeft;
        var coordY_analised = section_analised.offsetTop;
        
        //for pra percorrer todas as letras da palavra a ser movida
        for(var l = 0; l < PALAVRA.texto.length; l++){
            //for pra analisar todas as letras da palavra a ser analisada
            for(var c = 0; c < PALAVRA_analised.texto.length; c++){
                if(PALAVRA.texto[l] == PALAVRA_analised.texto[c] && section_moving.id != section_analised.id){
                    if(section_analised.style.flexDirection == "column"){	

                        var posicao = {
                            x: PALAVRA_analised.x - l,
                            y: PALAVRA_analised.y + c
                        };
                        PALAVRA.x = posicao.x;
                        PALAVRA.y = posicao.y;
                        PALAVRA.flexdir = "row";
                        

                        if(Adicionar_palGrid(grid, PALAVRA) == PALAVRA.texto.length){
                            //primeira_ocorrencia++;
                            /*PALAVRA.texto[l] = '/*';
                            /*if(l < PALAVRA.texto.length - 1){
                                PALAVRA.texto[l+1] = '/*';
                            }
                            
                            if(l > 0){
                                PALAVRA.texto[l-1] = '/*';
                            }*/
                            section_moving.style.cssText += 'flex-direction: row';

                            //aqui tem que ser l porque é a letra a ser movida da section_moving
                            section_moving.style.left = (coordX_analised - (configQuadrados.quadrado * l)) + 'px';
                            //aqui tem que ser c porque eu to pegando a letra da palavra analisada
                            section_moving.style.top = (coordY_analised + (configQuadrados.quadrado * c)) + 'px';
                            PALAVRA.posicionada = true;
                            return true;
                        }
                    }
                    else if(section_analised.style.flexDirection == "row"){
                        var posicao = {
                            x: PALAVRA_analised.x + c,
                            y: PALAVRA_analised.y - l
                        };
                        PALAVRA.x = posicao.x;
                        PALAVRA.y = posicao.y;
                        PALAVRA.flexdir = "column";

                        
                        if(Adicionar_palGrid(grid, PALAVRA) == PALAVRA.texto.length){
                            //primeira_ocorrencia++;
                            /*PALAVRA_analised.texto[c] = '/*';
                            /*if(c < PALAVRA_analised.texto.length - 1){
                                PALAVRA_analised.texto[c+1] = '/*';
                            }
                            if(c > 0){
                                PALAVRA_analised.texto[c-1] = '/*';
                            }*/
                            section_moving.style.cssText += 'flex-direction: column';
                            //aqui tem que ser c porque eu to pegando a letra da palavra analisada
                            section_moving.style.left = (coordX_analised + (configQuadrados.quadrado * c)) + 'px';
                            //aqui tem que ser l porque é a posição da letra que eu quero da section_moving
                            section_moving.style.top = (coordY_analised - (configQuadrados.quadrado * l)) + 'px';
                            PALAVRA.posicionada = true;
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
    //grids printados, proximo passo fazer a verificacao de letras sobrepostas e espaco livre atraves da matriz
}

/* ESSA FUNÇÃO TA TODA ERRADA, na verdade nem tanto, lembrei aqui e esse grid do create é diferente do
grid do play. ele é um grid 100 por 100 mas nao lembro direito como, eu acho que não é exatamente uma matriz
100x100, mas cada "_" do 100x100 possui 100 elementos se nao me engano, algo assim

_ _ _ _ _ ... 100x
_ _ _ _ _ ... 100x
e repete isso mais 98x

function printGrid(grid) {
    for(var i = 0; i < GRID_SIZE; i++) {
        var row = '';
        for(var j = 0; j < GRID_SIZE; j++) {
            if(grid[i][j] === null) {
                row += '_ '; // Use um sublinhado para representar células vazias
                console.log(row);
            } else {
                row += grid[i][j] + ' '; // Imprima a letra na célula
                console.log(row);
            }
        }
    }
}*/

export async function gerarSection(palavraEl, sectionEl) {
    const { langURL } = await import('../ferramentas/traducao/traducao.js');
    const segmenter = new Intl.Segmenter(langURL, { granularity: 'grapheme' });
    const segmentos = segmenter.segment(palavraEl);
    const letrasReais = Array.from(segmentos).map(s => s.segment);

    // 2. Agora usamos o array de letras reais no seu loop
    for (var i = 0; i < letrasReais.length; i++) {
        const letraAtual = letrasReais[i];
        
        if (i < 1) {
            sectionEl.innerHTML += '<div class="p' + qtdePalavras + ' letra" id="' + i + ',' + qtdePalavras + '" contenteditable="true" placeholder="' + qtdePalavras + '">' + letraAtual + '</div>';
            sectionEl.style.left = 0 + 'px';
            sectionEl.style.top = 0 + '%';
        } else {
            sectionEl.innerHTML += '<div class="p' + qtdePalavras + ' letra" id="' + i + ',' + qtdePalavras + '" contenteditable="true">' + letraAtual + '</div>';
        }
    }

    container_cruzadinhasEl.appendChild(sectionEl);
    
    let divclass = sectionEl.querySelectorAll('.p' + qtdePalavras);
    
    // Usamos letrasReais.length aqui também para garantir a contagem correta
    for (var i = 0; i < letrasReais.length; i++) {
        divclass[i].addEventListener("input", verifica_campo);
        divclass[i].addEventListener("keydown", verifica_bspace);
        if (i == letrasReais.length - 1) {
            divclass[i].addEventListener("focusout", verifica_resposta);
        }
    }
}



//Funcao para verificar se há mais de duas letras em uma DIV
function verifica_campo(evt){
	var dados = evt.target.id.split(',');
	var id = parseInt(dados[1]);
	var letra = parseInt(dados[0]);
	let palavraInicial = document.querySelectorAll('.p1');
	let palavraEl = document.querySelectorAll(classe_atual(id));
	let palavraElnext = document.querySelectorAll(classe_atual(id+1));
	
	//removendo o caractere antigo e colocando o novo digitado
	palavraEl[letra].innerHTML = evt.data;
	
	//foca a proxima letra
	if(palavraEl[letra + 1] && evt.keyCode != 8){
		palavraEl[letra + 1].focus();
	}
	//foca a proxima palavra se ela existir
	else if(palavraElnext[0] != undefined && evt.keyCode != 8){
		palavraElnext[0].focus();
	}
	else if(palavraElnext[0] == undefined && evt.keyCode != 8){
		palavraInicial[0].focus();
	}
}

//Funcao para verificar o backspace na letra
function verifica_bspace(evt){
	var dados = evt.target.id.split(',');
	var id = parseInt(dados[1]);
	var letra = parseInt(dados[0]);
	let palavraFinal = document.querySelectorAll('.p'+qtdePalavras);
	let palavraElant = document.querySelectorAll(classe_atual(id-1));
	let palavraEl = document.querySelectorAll(classe_atual(id));
	
	if (evt.keyCode == 8 && palavraEl[letra - 1]) {
		palavraEl[letra - 1].focus();
	}
	else if(evt.keyCode == 8 && palavraElant[0]){
		palavraElant[palavraElant.length - 1].focus()
	}
	else if(evt.keyCode == 8 && !palavraElant[0] && !palavraEl[letra - 1]){
		palavraFinal[palavraFinal.length - 1].focus();
	}
}

// Funcao para comparar as respostas com as digitadas tanto apos o primeiro quanto ultimo caracteres serem inseridos
function verifica_resposta(evt){
    var dados = evt.target.id.split(',');
    var id = parseInt(dados[1]);
    var respostas = respostasString[id - 1].split(''); // Array de letras da resposta correta
    let palavraEl = document.querySelectorAll(classe_atual(id)); // Elementos da palavra digitada no editor

    // Função auxiliar para remover acentos (igual à do seu jogo)
    const removerAcentos = (texto) => {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    for(var i = 0; i < palavraEl.length; i++){
        // Obtém a letra digitada pelo usuário e a resposta correta para a posição atual
        const letraDigitada = palavraEl[i].textContent;
        const letraResposta = respostas[i];

        // Compara as letras sem considerar acentos e ignorando maiúsculas/minúsculas
        // Verifica se a letra digitada (sem acento e minúscula) é igual à letra da resposta (sem acento e minúscula)
        if(removerAcentos(letraDigitada.toLowerCase()) === removerAcentos(letraResposta.toLowerCase())){
            // Se estiver correta, aplica os estilos de acerto
            palavraEl[i].style.cssText += 'color: var(--texto);' +
                                          'border: solid 1px green;' +
                                          'background: var(--bg-cruzadinha);' +
                                          'z-index:1;' +
                                          'opacity: 1.0;';
        } else {
            // Se estiver incorreta, aplica os estilos de erro
            palavraEl[i].style.cssText += 'color: var(--texto);' +
                                          'border: solid 1.25px var(--fedback-negativo);' +
                                          'background: var(--bg-cruzadinhaN);' +
                                          'opacity: 0.9;';
        }
    }
}

//funcao para retornar a classe atual da palavra//
function classe_atual(id){
	var classe = '.p' + id.toString();
	return classe;
}

export function EditSection(id, texto){
    var sectionEditada = document.getElementById('PALAVRA'+id);
	sectionEditada.innerHTML = "";
	for(var i = 0; i < texto.length; i++){
		if(i < 1){
			sectionEditada.innerHTML += '<div class="p'+ id +' letra" id="'+i+','+id+'" contenteditable="true" placeholder="'+id+'">'+texto[i]+'</div>';
			container_cruzadinhasEl.appendChild(sectionEditada);
		}
		else{
			sectionEditada.innerHTML += '<div class="p'+ id +' letra"id="'+i+','+id+'" contenteditable="true">'+texto[i]+'</div>';
		}	
	}
}

export function remove_section(id, j){
    let sectionElAnt = document.getElementById('PALAVRA'+ j);
    let divAnt = document.querySelectorAll('.p' + j/*.toString()*/);
    for (var x = 0; x < divAnt.length; x++){
        sectionElAnt.removeChild(divAnt[x]);
    }	
    
    sectionElAnt.id = 'PALAVRA'+ (j - 1);
    for(var i = 0; i < divAnt.length; i++){
        if(i < 1){
            sectionElAnt.innerHTML += '<div class="p'+ (j-1) +' letra" id="'+i+','+(j-1)+'" contenteditable="true" placeholder="'+(j-1)+'">'+respostasString[j - 1][i]+'</div>';
        }
        else{
            sectionElAnt.innerHTML += '<div class="p'+ (j-1) +' letra"id="'+i+','+(j-1)+'" contenteditable="true">'+respostasString[j - 1][i]+'</div>';
            //onfocusout="verifica_resposta('+qtdePalavras+')"
        }
    }
    for(var i = 0; i < divAnt.length; i++){
        let divclass = document.querySelectorAll('.p'+(j-1));
        divclass[i].addEventListener("input", verifica_campo);
        divclass[i].addEventListener("keydown", verifica_bspace);
        if(i == divAnt.length - 1){
            divclass[i].addEventListener("focusout", verifica_resposta);
        }
    }
}

export function setDadosSection(id, vh, vw, flexdir, isString = false){
    var sectionLocal = document.getElementById(`PALAVRA${id}`);
    //console.log(sectionLocal);
    if(!isString)
        sectionLocal.style.cssText = `left: ${vw}px; top: ${vh}px; flex-direction: ${flexdir};`;
    else
        sectionLocal.style.cssText = `left: ${vw}; top: ${vh}; flex-direction: ${flexdir};`;
}