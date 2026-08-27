import { qtdePalavras, CriarPalavraGrid, ResetarPalavras } from "./cartao";

export let bauPalavras = [];
export const grid = [];
let gridWidth;
let gridHeight;
const maxTentativasPorPalavra = 200;
const direction = [
    'horizontal', 'horizontal', 
    'vertical', 'vertical', 
    'diagonal', 'diagonal_inversa'
];

export function ResetBauPalavras(){
    bauPalavras = [];
}

/**
 * Trata o texto desejado, transformando em um vetor ordenado da palavra mais longa para a menor
 * e transformando todas em alffabéticas
 */
export function TratarDados(e, textoOuArray) {
    let textoFinal = Array.isArray(textoOuArray) 
        ? textoOuArray.join(' ') 
        : textoOuArray;

    // Validação
    if (!textoFinal || textoFinal.trim().length === 0) {
        throw new Error("Texto ou array vazio");
    }

    return textoFinal
        .toUpperCase()                        // Transforma tudo em maiúsculo
        .split(/\s+/)                         // Transforma a string em um Array de palavras
        .filter(palavra => palavra)           // Remove strings vazias
        .sort((a, b) => b.length - a.length); // Ordena da maior para a menor
}

/**
 * Função para gerar o grid final da lógica, para posteriormente ser usado no frontend
 * @param {*} palavras 
 * @returns 
 */
export async function GerarGrid(palavras, tentativas = 0){
    //await ResetarPalavras(false);
    bauPalavras.length = 0;
    grid.length = 0;

    const totalLetras = palavras.reduce((soma, p) => soma + p.length, 0);
    let tamanhoPorDensidade = Math.ceil(Math.sqrt(totalLetras / 0.80));
    let tamanhoMinimo = palavras[0].length + 2;
    
    gridWidth = Math.max(tamanhoPorDensidade, tamanhoMinimo);
    gridHeight = gridWidth;

    for(let l = 0; l < gridHeight; l++){
        grid[l] = [];
        for(let c = 0; c < gridWidth; c++){
            grid[l][c] = '-';
        }
    }

    if(await GerarPalavras(palavras) !== palavras.length){
        ExpandirGrid();
        return null;
    }
    
    CriarPalavraGrid(bauPalavras);    
    await PreencherGridAleatoriamente();

    return grid;
}

/**
 * Função para atualizar o grid final com uma nova palavra sem perder a posição inicial
 * @param {*} palavras 
 * @returns 
 */
export async function AtualizarGrid(palavra, palavras){
    const palavrasTratadas = TratarDados(null, palavras.join(" "));
    const totalLetras = palavrasTratadas.reduce((soma, p) => soma + p.length, 0);
    
    let tamanhoPorDensidade = Math.ceil(Math.sqrt(totalLetras / 0.80));
    let tamanhoMinimo = palavrasTratadas[0].length + 2;

    gridWidth = Math.max(tamanhoPorDensidade, tamanhoMinimo);
    gridHeight = gridWidth;

    for(let l = 0; l < gridHeight; l++){
        if (!grid[l])
            grid[l] = [];
        for(let c = 0; c < gridWidth; c++){
            if(typeof grid[l][c] === "string" || grid[l][c] === undefined){
                grid[l][c] = '-';
            } 
        }
    }

    let tentativa = 0;
    let palavraAdicionada = await AdicionarPalavra(palavra); 
    while(tentativa < 5 && !palavraAdicionada){
        palavraAdicionada = await AdicionarPalavra(palavra); 
        tentativa++;   
    }
    await PreencherGridAleatoriamente();

    return grid;
}

/**
 * Função para expandir o grid quando a palavra não couber no grid existente
 */
function ExpandirGrid(){
    gridWidth = gridWidth + 1;
    gridHeight = gridWidth;

    for(let l = 0; l < gridHeight; l++){
        if (!grid[l])
            grid[l] = [];
        for(let c = 0; c < gridWidth; c++){
            if(grid[l][c] === undefined){
                grid[l][c] = '-';
            } 
        }
    }
}

/**
 * Função para preencher o grid com letras aleatórias onde não tiver objetos
 */
export async function PreencherGridAleatoriamente(){
    const alfabeto = await ObterAlfabeto();

    for(let l = 0; l < gridHeight; l++){
        for(let c = 0; c < gridWidth; c++){
            if(grid[l][c] === '-' || (typeof grid[l][c] === "object" && grid[l][c].palavras.length < 1)){
                const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
                grid[l][c] = alfabeto[indiceAleatorio];
            } 
        }
    }
}

/**
 * A partir da lang do usuário, gera o alfabeto correspondente
 * @returns string contendo o alfabeto
 */
async function ObterAlfabeto() {
    const { langURL } = await import("../../crossword/ferramentas/traducao/traducao");
    const ALFABETOS = {
        'pt': 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇÁÉÍÓÚÂÊÔÃÕ',
        'ru': 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
        'hi': 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह',
    };
    return ALFABETOS[langURL] || ALFABETOS['pt'];
}


/**
 * Gera as palavras com base na classe para serem usadas via frontend
 * @param {*} palavras 
 */
async function GerarPalavras(palavras) {
    let qtdePosicionadas = 0;
    for (const palavra of palavras) {
        let text = palavra;
        let posicionada = false;
        let tentativasDaPalavra = 0;
        
        while (!posicionada && tentativasDaPalavra < maxTentativasPorPalavra) {
            const dirSort = Math.floor(Math.random() * direction.length);
            const reverseSort = Math.floor(Math.random() * 2);
            const textoFoiInvertido = reverseSort === 1;
            let textoProcessado = textoFoiInvertido ? text.split('').reverse().join('') : text;

            const coordenadas = await CoordenadasGrid(qtdePosicionadas, textoProcessado, direction[dirSort], textoFoiInvertido);
            
            if (coordenadas.x > -1) {
                bauPalavras[bauPalavras.length - 1].posicionada = true;
                qtdePosicionadas++;
                posicionada = true;
            }
            tentativasDaPalavra++;
        }
    }
    return qtdePosicionadas;
}

/**
 * Função para adicionar uma palavra específica ao grid já existente, sem alterar ele
 * @param {*} palavra 
 * @returns 
 */
export async function AdicionarPalavra(palavra){
    let palavraVetorizada = palavra;
    if(typeof palavraVetorizada === "string")
        palavraVetorizada = [palavra];
    if(await GerarPalavras(palavraVetorizada) !== 1){
        ExpandirGrid();
        return false;
    }

    CriarPalavraGrid([bauPalavras[bauPalavras.length - 1]]);
    await PreencherGridAleatoriamente();
    return true;
}

/**
 * Permite o encaixe no grid, caso nao ultrapasse os limites do mesmo e caso nao sobreponha letras diferentes
 * das que já existem na posição desejada do encaixe
 * @param {*} text 
 * @param {*} direction 
 * @returns (x, y)
 */
async function CoordenadasGrid(qtdePosicionadas, text, direction, textoFoiInvertido){
    let x = -1, y = -1;

    if(direction === "horizontal"){
        const y_random = Math.floor(Math.random() * gridHeight);
        const x_random = Math.floor(Math.random() * (gridWidth - text.length + 1));
        let letrasEncaixaveis = 0;

        for(let c = x_random, aux = 0; aux < text.length; aux++, c++){
            if(grid[y_random][c] === '-' || grid[y_random][c].character === text[aux]){
                letrasEncaixaveis++;
            }
        }

        if(letrasEncaixaveis === text.length){
            y = y_random;
            x = x_random;
            bauPalavras.push(new Palavra(qtdePosicionadas + qtdePalavras, text, direction, x, y, textoFoiInvertido));
            const palavraAtual = bauPalavras[bauPalavras.length - 1];
            
            for(let c = x_random, aux = 0; aux < text.length; aux++, c++){
                if(typeof grid[y_random][c] !== "object"){
                    const novaLetra = new Letra(text[aux], y_random, c);
                    palavraAtual.AdicionarLetra(novaLetra);
                    novaLetra.AdicionarPalavra(palavraAtual);
                    grid[y_random][c] = novaLetra;
                }
                else{
                    grid[y_random][c].AdicionarPalavra(palavraAtual);
                    palavraAtual.AdicionarLetra(grid[y_random][c]);
                }
            }
        }
    }
    else if(direction == "vertical"){
        const x_random = Math.floor(Math.random() * gridWidth);
        const y_random = Math.floor(Math.random() * (gridHeight - text.length + 1));

        let letrasEncaixaveis = 0;

        for(let l = y_random, aux = 0; aux < text.length; aux++, l++){
            if(grid[l][x_random] === '-' || grid[l][x_random].character === text[aux]){
                letrasEncaixaveis++;
            }
        }

        if(letrasEncaixaveis === text.length){
            y = y_random;
            x = x_random;
            bauPalavras.push(new Palavra(qtdePosicionadas + qtdePalavras, text, direction, x, y, textoFoiInvertido));
            const palavraAtual = bauPalavras[bauPalavras.length - 1];
            for(let l = y_random, aux = 0; aux < text.length; aux++, l++){
                if(typeof grid[l][x_random] !== "object"){
                    const novaLetra = new Letra(text[aux], l, x_random);
                    palavraAtual.AdicionarLetra(novaLetra);
                    novaLetra.AdicionarPalavra(palavraAtual);
                    grid[l][x_random] = novaLetra;
                }
                else{
                    grid[l][x_random].AdicionarPalavra(palavraAtual);
                    palavraAtual.AdicionarLetra(grid[l][x_random]);
                }
            }
        }
    }
    else if(direction == "diagonal"){
        const x_random = Math.floor(Math.random() * (gridWidth - text.length + 1));
        const y_random = Math.floor(Math.random() * (gridHeight - text.length + 1));

        let letrasEncaixaveis = 0;

        for(let l = y_random, c = x_random, aux = 0; aux < text.length; aux++, l++, c++){
            if(grid[l][c] === '-' || grid[l][c].character === text[aux]){
                letrasEncaixaveis++;
            }
        }

        if(letrasEncaixaveis === text.length){
            y = y_random;
            x = x_random;
            bauPalavras.push(new Palavra(qtdePosicionadas + qtdePalavras, text, direction, x, y, textoFoiInvertido));
            const palavraAtual = bauPalavras[bauPalavras.length - 1];
            for(let l = y_random, c = x_random, aux = 0; aux < text.length; aux++, l++, c++){
                
                if(typeof grid[l][c] !== "object"){
                    const novaLetra = new Letra(text[aux], l, c);
                    palavraAtual.AdicionarLetra(novaLetra);
                    novaLetra.AdicionarPalavra(palavraAtual);
                    grid[l][c] = novaLetra;
                }
                else{
                    grid[l][c].AdicionarPalavra(palavraAtual);
                    palavraAtual.AdicionarLetra(grid[l][c]);
                }
            }
        }
    }
    else if(direction == "diagonal_inversa"){
        // X vai para a direita (c++), então sorteia deixando espaço na direita
        const x_random = Math.floor(Math.random() * (gridWidth - text.length + 1));
        
        // Y vai SUBIR (l--). O valor MÍNIMO inicial deve ser o tamanho da palavra menos 1.
        const y_min = text.length - 1;
        const y_random = Math.floor(Math.random() * (gridHeight - y_min)) + y_min;

        let letrasEncaixaveis = 0;

        // l-- (sobe) e c++ (vai para a direita)
        for(let l = y_random, c = x_random, aux = 0; aux < text.length; aux++, l--, c++){
            if(grid[l][c] === '-' || grid[l][c].character === text[aux]){
                letrasEncaixaveis++;
            }
        }

        if(letrasEncaixaveis === text.length){
            y = y_random;
            x = x_random;
            bauPalavras.push(new Palavra(qtdePosicionadas + qtdePalavras, text, direction, x, y, textoFoiInvertido));
            const palavraAtual = bauPalavras[bauPalavras.length - 1];
            for(let l = y_random, c = x_random, aux = 0; aux < text.length; aux++, l--, c++){
                if(typeof grid[l][c] !== "object"){
                    const novaLetra = new Letra(text[aux], l, c, true);
                    palavraAtual.AdicionarLetra(novaLetra);
                    novaLetra.AdicionarPalavra(palavraAtual);
                    grid[l][c] = novaLetra;
                }
                else{
                    grid[l][c].AdicionarPalavra(palavraAtual);
                    palavraAtual.AdicionarLetra(grid[l][c]);
                }
            }
        }
    }

    return { x: x, y: y }
}

/**
 * Função para printar o grid completo [útil para debug]
 */
export function printGrid() {
	console.log("Grid Width: "+gridWidth);
	console.log("Grid Height: "+gridHeight);

    for(var i = 0; i < gridHeight; i++) {
        var row = '';
        for(var j = 0; j < gridWidth; j++) {
            if(typeof grid[i][j] === "string") {
                row += ' ' + grid[i][j];
            } else {
                row += ' ' + grid[i][j].palavras.length;
            }
        }
        console.log(row + ' // ' + i + '\n');
    }
}


class Palavra{
    constructor(id, text, direction, x, y, inverso = false){
        this.id = id;
        this.text = text;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.inverso = inverso;
        this.posicionada = false;
        this.letras = [];
    }

    AdicionarLetra(letra){
        this.letras.push(letra);
    }
}

class Letra{
    constructor(character, l, c, debug = false){
        this.character = character;
        this.div = document.createElement("div");
        this.div.id = `${l},${c}`
        this.palavras = []
    }

    AdicionarPalavra(objetoPalavra){
        if (!this.palavras.includes(objetoPalavra)) {
            this.palavras.push(objetoPalavra);
        }
    }

    RemoverPalavra(objetoPalavra) {
        const index = this.palavras.indexOf(objetoPalavra);
        if (index !== -1) {
            this.palavras.splice(index, 1);
        }
    }
}

/**
 * Função para gerar dados para o salvamento no banco de dados
 * @returns 
 */
export function GerarDadosSalvamento() {
    const gridLetrasAchatado = []; 
    
    for (let l = 0; l < gridHeight; l++) {
        for (let c = 0; c < gridWidth; c++) {
            const celula = grid[l][c];
            const letra = typeof celula === "object" ? celula.character : celula;
            gridLetrasAchatado.push(letra); 
        }
    }

    const bauSimplificado = bauPalavras.map(p => ({
        id: p.id,
        text: p.text,
        direction: p.direction,
        x: p.x,
        y: p.y,
        inverso: p.inverso,
        posicionada: p.posicionada
    }));

    return {
        // 💡 A MUDANÇA É AQUI: Adiciona o .join('') para virar uma string única
        gridLetras: gridLetrasAchatado.join(''), 
        bauSimplificado: bauSimplificado,
        gridWidth,
        gridHeight
    };
}