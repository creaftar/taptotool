import { gridFirestore, gridWidth, gridHeight, bauPalavrasFirestore } from "../dados/firestore_dados.js";

export const grid = [];
export const bauPalavras = [];

export async function GerarGrid() {
    for (let i = 0; i < gridHeight; i++) {
        const inicio = i * gridWidth;
        const fim = inicio + gridWidth;
        
        const linha = gridFirestore.slice(inicio, fim).split('');
        grid.push(linha);
    }
    GerarPalavras();
    GerarLetrasGrid();
    
    const { GerarGridVisual } = await import("./grid_visual.js");
    GerarGridVisual(grid);
}

function GerarPalavras(){
    for(const palavra of bauPalavrasFirestore)
        bauPalavras.push(new Palavra(palavra.id, palavra.text, palavra.direction, palavra.x, palavra.y, palavra.inverso));
}

function GerarLetrasGrid(){
    for (const palavra of bauPalavras) {
        let x = palavra.x;
        let y = palavra.y;
        
        for (let i = 0; i < palavra.text.length; i++) {
            let letra;
            if (typeof grid[y][x] === "string") {
                letra = new Letra(palavra.text[i], y, x); 
                grid[y][x] = letra;
            }
            else if (typeof grid[y][x] === "object") {
                letra = grid[y][x]; 
            }
            
            letra.AdicionarPalavra(palavra);
            palavra.AdicionarLetra(letra);

            if (palavra.direction === "horizontal") x++;
            else if (palavra.direction === "vertical") y++;
            else if (palavra.direction === "diagonal") { y++; x++; }
            else if (palavra.direction === "diagonal_inversa") { y--; x++; }
        }
    }
}

class Palavra {
    constructor(id, text, direction, x, y, inverso = false){
        this.id = id;
        this.text = text;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.inverso = inverso;
        this.letras = [];
    }

    AdicionarLetra(letra){
        this.letras.push(letra);
    }
}

class Letra {
    constructor(character, l, c){
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