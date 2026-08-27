import { bauPALAVRAS, idUSERLOGGED_CRZDKEY, palavraTmp, placeholder } from "./preload.js";
export var grid = [];

var quadrado = 32;
const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');

class Letra {
    constructor(texto, x, y, id, idLETRA) {
        this.texto = texto;
        this.idPALAVRA = [id];
		this.idLETRA = [idLETRA];
		this.valorDigitado = "";
        this.x = x;
        this.y = y;
    }

    SetDiv(div){
        this.div = div;
    }
	SetTextRect(text){
		this.textRect = text;
	}
    AdicionarPALAVRA(idPALAVRA, idLETRA){
        this.idPALAVRA.push(idPALAVRA);
        this.idLETRA.push(idLETRA);
    }
    AlternarPALAVRA(){
        // Remove o primeiro de cada e joga para o fim
        var id_removido = this.idPALAVRA.shift();
        this.idPALAVRA.push(id_removido);

        var idLETRA_removido = this.idLETRA.shift();
        this.idLETRA.push(idLETRA_removido);

        return this.idPALAVRA[0];
    }
    GetTexto(){
        return this.texto;
    }
	GetDiv(){
		return this.div;
	}
    GetidPALAVRA(qual = 0){
        return this.idPALAVRA[qual];
    }
    // Retorna a posição relativa à palavra que está "no topo" agora
    GetIdLetraAtual(qual = 0) {
        return this.idLETRA[qual];
    }
	TodosIDs(){
        return this.idPALAVRA;
    }
}

export var gridWidth = 0;
export var gridHeight = 0;	
export async function montaGrid(){    
	for(var i = 0; i < bauPALAVRAS.length; i++) {
			if(bauPALAVRAS[i].direcao == "column"){
				if((bauPALAVRAS[i].y + bauPALAVRAS[i].texto.length) > gridHeight){
					gridHeight = bauPALAVRAS[i].y + bauPALAVRAS[i].texto.length;
				}
				if(bauPALAVRAS[i].x > gridWidth){
					gridWidth = bauPALAVRAS[i].x;
				}
			}
			else{
				if((bauPALAVRAS[i].x + bauPALAVRAS[i].texto.length) > gridWidth){
					gridWidth = bauPALAVRAS[i].x + bauPALAVRAS[i].texto.length;
				}
				if(bauPALAVRAS[i].y > gridHeight){
					gridHeight = bauPALAVRAS[i].y;
				}
			}
	}

	for(var i = 0; i < gridHeight; i++) {
		grid[i] = [];
		for(var j = 0; j < gridWidth; j++) {
			grid[i][j] = null;
		}
	}

	//for para percorrer todas as palavras
	for(var i = 0; i < bauPALAVRAS.length; i++) {
		//for para percorrer todas as letras
		for(var j = 0; j < bauPALAVRAS[i].texto.length; j++) {
			if(bauPALAVRAS[i].direcao == "column"){

				//criando uma nova LETRA para cada celula do grid que nao esta vazia
				if(grid[bauPALAVRAS[i].y + j][bauPALAVRAS[i].x] == null){
					var celula = new Letra(bauPALAVRAS[i].texto[j], bauPALAVRAS[i].x, (bauPALAVRAS[i].y + j), bauPALAVRAS[i].id, j);
					grid[bauPALAVRAS[i].y + j][bauPALAVRAS[i].x] = celula;
					bauPALAVRAS[i].AdicionarNovaLetra(celula);
				}

				//Adicionando novo id se na celula já existir uma letra
				else{
					grid[bauPALAVRAS[i].y + j][bauPALAVRAS[i].x].AdicionarPALAVRA(bauPALAVRAS[i].id, j);
					bauPALAVRAS[i].AdicionarNovaLetra(grid[bauPALAVRAS[i].y + j][bauPALAVRAS[i].x]);
				}
			}
			else{
				//criando uma nova LETRA para cada celula do grid que nao esta vazia
				if(grid[bauPALAVRAS[i].y][bauPALAVRAS[i].x + j] == null){
					var celula = new Letra(bauPALAVRAS[i].texto[j], (bauPALAVRAS[i].x + j), bauPALAVRAS[i].y, bauPALAVRAS[i].id, j);
					grid[bauPALAVRAS[i].y][bauPALAVRAS[i].x + j] = celula;
					bauPALAVRAS[i].AdicionarNovaLetra(celula);
					//letrasGrid[i][j] = celula;
				}

				//Adicionando novo id se na celula já existir uma letra
				else{
					grid[bauPALAVRAS[i].y][bauPALAVRAS[i].x + j].AdicionarPALAVRA(bauPALAVRAS[i].id, j);
					bauPALAVRAS[i].AdicionarNovaLetra(grid[bauPALAVRAS[i].y][bauPALAVRAS[i].x + j]);
				}
			}
		}
	}
	
	// Chame a função para atualizar o vetor e o localStorage
	await recuperar_estado();
	container_cruzadinhasEl.appendChild(GerarSvg());
	await gerar_letra();
	/*
	printGrid(grid, gridHeight, gridWidth);
	console.log('*****************************************');
	printGridId(grid, gridHeight, gridWidth);

	/*
	printGrid(grid, gridHeight, gridWidth);
	console.log('GRID FINAL*****************************************');
	printGridId(grid, gridHeight, gridWidth);
	printGridLength(grid, gridHeight, gridWidth);
	*/
}

function GerarSvg(){
	var fragmento = document.createDocumentFragment();
	
	const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    svg.classList.add("svg-container");
    svg.id = "area-quadrados";
	svg.setAttribute("viewBox", `-0.5 -0.5 ${(gridWidth * quadrado) + 4} ${(gridHeight * quadrado) + 4}`);
	svg.setAttribute("width", (gridWidth * quadrado) + 4);
	svg.setAttribute("height", (gridHeight * quadrado) + 4);
	//svg.setAttribute("shape-rendering", "crispEdges");
	
	fragmento.appendChild(svg);
    for (var i = 0; i < gridHeight; i++) {
        for (var j = 0; j < gridWidth; j++) {
            if (grid[i][j] != null) {
                const group = document.createElementNS(svgNS, "g");
				
				AtualizarIdGroup(grid[i][j], group);

                // Quadrado principal
                const cellRect = document.createElementNS(svgNS, "rect");
                //cellRect.setAttribute("shape-rendering", "crispEdge");
				//cellRect.setAttribute("shape-rendering", "geometricPrecision");
                cellRect.setAttribute("x", j * quadrado);
                cellRect.setAttribute("y", i * quadrado);
				
                cellRect.setAttribute("width", quadrado);
                cellRect.setAttribute("height", quadrado);
				
                group.appendChild(cellRect);

				const placeholderText = document.createElementNS(svgNS, "text");
				placeholderText.classList.add("placeholder-rect");
				placeholderText.setAttribute("x", j * quadrado + quadrado / 2);
				placeholderText.setAttribute("y", i * quadrado + quadrado / 2);
				//cellText.setAttribute("text-rendering", "crispEdge");
				placeholderText.setAttribute("text-anchor", "middle");
				placeholderText.setAttribute("dominant-baseline", "middle");
				placeholderText.setAttribute("dy", "0.1em");
				placeholderText.setAttribute("aria-hidden", "true");
				placeholderText.classList.add("placeholder-rect");
				
				group.appendChild(placeholderText);

                const cellText = document.createElementNS(svgNS, "text");
				cellText.setAttribute("x", j * quadrado + quadrado / 2);
				cellText.setAttribute("y", i * quadrado + quadrado / 2);
				//cellText.setAttribute("text-rendering", "crispEdge");
				cellText.setAttribute("text-anchor", "middle");
				cellText.setAttribute("dominant-baseline", "middle");
				cellText.setAttribute("dy", "0.1em");
				cellText.classList.add("texto-padrao");
				
                group.classList.add('PALAVRA'+grid[i][j].GetidPALAVRA());
				group.classList.add('LETRA');
				
				group.appendChild(cellText);
                if(grid[i][j].idPALAVRA[0] != grid[i][j].AlternarPALAVRA()){
					grid[i][j].AlternarPALAVRA();
					// Cria uma função de fechamento para capturar o valor atual de grid[i][j].idPALAVRA[0]
					group.addEventListener("click", criarManipulador(grid[i][j]));
				}
                grid[i][j].SetDiv(group);
                grid[i][j].SetTextRect(cellText);
                grid[i][j].placeholder = placeholderText;
                grid[i][j].rect = cellRect;
					
                svg.appendChild(group);
            }
        }
    }
    
	return fragmento;
}

function AtualizarIdGroup(gridId, group){
	//console.log(gridId);
	var id = gridId.idPALAVRA[0];
	var idLetra = gridId.GetIdLetraAtual();
	
	group.id = idLetra +',' + id;
}

function criarManipulador(grid){
	return function(evt){
		AlterarIdGrid(evt, grid);
	}
}
/*
function RedefinirPosicoes(){
	var menor_top = Number.MAX_VALUE;
	var menor_left = Number.MAX_VALUE;

	//redefinir top e left pra 0 [V]
	//pegar o top e left negativo maximos e transformar todas as palavras com essas posicoes [V]
	//ver se o grid tem casas sobrando tanto na esquerda quanto na direita pra transformar todas as palavras 
	//para trás [V]
	
	for(var i = 0; i < bauPALAVRAS.length; i++){
		var top = bauPALAVRAS[i].y;
		var left = bauPALAVRAS[i].x;
		console.log('top: ' + top + ' / ' + 'left: ' + left);
		
		if(menor_top > top){
			menor_top = top;
		}
		if(menor_left > left){
			menor_left = left;
		}
	}
	if(menor_left < 0){
		RightMove_onGrid(menor_left);
	}
	if(menor_top < 0){
		BottomMove_onGrid(menor_top);
	}
	if(menor_left > 0){
		LeftMove_onGrid(menor_left);
	}
	if(menor_top > 0){
		TopMove_onGrid(menor_top);
	}
}

function RightMove_onGrid(qtde){
	console.log("RightMove_onGrid");
	for(var i = 0; i < bauPALAVRAS.length; i++){
		bauPALAVRAS[i].x += (qtde * -1);
	}
}
function BottomMove_onGrid(qtde){
	console.log("BottomMove_onGrid");
	for(var i = 0; i < bauPALAVRAS.length; i++){
		bauPALAVRAS[i].y += (qtde * -1);
	}
}
function LeftMove_onGrid(qtde){
	console.log("LeftMove_onGrid");
	for(var i = 0; i < bauPALAVRAS.length; i++){
		bauPALAVRAS[i].x -= qtde;
	}
}
function TopMove_onGrid(qtde){
	console.log("TopMove_onGrid");
	for(var i = 0; i < bauPALAVRAS.length; i++){
		bauPALAVRAS[i].y -= qtde;
	}
}
*/
function AlterarIdGrid(evt, grid){
	var squareGroup = evt.target.closest("g");
	squareGroup.classList.remove("PALAVRA"+grid.GetidPALAVRA());
	grid.AlternarPALAVRA();
	squareGroup.classList.add("PALAVRA"+grid.GetidPALAVRA());
}

export function RecuperarDivGrid(idPalavra, idLetra, verthorz){
	if(verthorz == "column"){
		return grid[bauPALAVRAS[idPalavra].y + idLetra][bauPALAVRAS[idPalavra].x];
	}
	else{
		return grid[bauPALAVRAS[idPalavra].y][bauPALAVRAS[idPalavra].x + idLetra];
	}
}

async function gerar_letra(){
	const { verifica_resposta } = await import("./logica.js");
	const { isColumn_orRow, verificarTodasCorretas } = await import("./areacruzadinhas_jogar.js");
	var palavraComLetraId = [];
	//let texto;

	// Itera sobre as chaves do objeto
    for (let key in eCruzadinhasLS) {
        if (eCruzadinhasLS.hasOwnProperty(key)) {
			for(var i = 0; i < eCruzadinhasLS[key].length; i++){
				if(eCruzadinhasLS[key][i]){
					RecuperarDivGrid(key, i, isColumn_orRow(key)).textRect.textContent = eCruzadinhasLS[key][i];
					palavraTmp[key][i] = eCruzadinhasLS[key][i];
				}
			}
		}
		if (!palavraComLetraId.includes(key)){
			palavraComLetraId.push(key);
		}
    }
	
	palavraComLetraId.forEach(IdVetor => {
		//SobrepoePalavra(IdVetor);
		verifica_resposta(IdVetor, true);
		//verifica_campo();
	});
	verificarTodasCorretas();
}

var eCruzadinhasLS;
async function recuperar_estado() {
	const { RecuperarEstadoLS } = await import("../ferramentas/localstorage/recuperar.js");
	eCruzadinhasLS = RecuperarEstadoLS(idUSERLOGGED_CRZDKEY);

	if(eCruzadinhasLS.length > 0){
		for (let key in eCruzadinhasLS) {
			if (eCruzadinhasLS.hasOwnProperty(key)) {
				if (eCruzadinhasLS[key].trim() == '') {
					delete eCruzadinhasLS[key]; // Remove a chave do objeto
				}
			}
		}
		localStorage.setItem('estadoCruzadinhasLS', JSON.stringify(eCruzadinhasLS));
	}
}

export function adicionaPlaceholder(){
    for(var i = 0; i < bauPALAVRAS.length; i++) {
        const celula = grid[bauPALAVRAS[i].y][bauPALAVRAS[i].x];

        // Verifica se já existe um placeholder na célula
        const placeholderExistente = celula.div.querySelector(".placeholder");

        if (!placeholderExistente) {
			// Se não existir um placeholder, cria e adiciona um novo
			const placeholderText = document.createElementNS("http://www.w3.org/2000/svg", "text");
			placeholderText.textContent = placeholder[i];
			placeholderText.classList.add("placeholder");

            placeholderText.setAttribute("x", (bauPALAVRAS[i].x * quadrado) + 2);
            placeholderText.setAttribute("y", (bauPALAVRAS[i].y * quadrado) + 2);
            placeholderText.setAttribute("text-anchor", "start");
            placeholderText.setAttribute("dominant-baseline", "hanging");

            celula.div.appendChild(placeholderText);
		}
		else{
			placeholderExistente.textContent = placeholder[i];
		}
    }
}

/*
function printGrid(grid, gridHeight, gridWidth) {
	console.log("Grid Width: "+gridWidth);
	console.log("Grid Height: "+gridHeight);

    for(var i = 0; i < gridHeight; i++) {
        var row = '';
        for(var j = 0; j < gridWidth; j++) {
            if(grid[i][j] === null) {
                row += '_ ';
            } else {
                row += grid[i][j].texto + ' ';
            }
        }
        console.log(row + ' // ' + i + '\n');
    }
}

function printGridLength(grid, gridHeight, gridWidth) {
	console.log("Grid Width: "+gridWidth);
	console.log("Grid Height: "+gridHeight);

    for(var i = 0; i < gridHeight; i++) {
        var row = '';
        for(var j = 0; j < gridWidth; j++) {
            if(grid[i][j] === null) {
                row += '_ ';
            } else {
                row += grid[i][j].TodosIDs() + ' ';
            }
        }
        console.log(row + ' // ' + i + '\n');
    }
}

function printGridId(grid, gridHeight, gridWidth) {
	console.log("Grid Width: "+gridWidth);
	console.log("Grid Height: "+gridHeight);

    for(var i = 0; i < gridHeight; i++) {
        var row = '';
        for(var j = 0; j < gridWidth; j++) {
            if(grid[i][j] === null) {
                row += '_ ';
            } else {
                row += grid[i][j].GetidPALAVRA() + ' ';
            }
        }
        console.log(row + ' // ' + i + '\n');
    }
}
*/