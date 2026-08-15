import { Clique } from "./Click.ts";

let cliques = new Clique();
const contadorEl = document.getElementById("contador");
const botaoAdd = document.getElementById("adicionar-clique");
const botaoRemove = document.getElementById("remover-clique");
const botaoReset = document.getElementById("resetar-clique");

async function InicializarApp() {
    const valorSalvo = await idb.obter("total_cliques");
    
    cliques = new Clique(valorSalvo ?? 0);
    
    contadorEl.textContent = cliques.GetCliques().toString();
}

InicializarApp();

botaoAdd.addEventListener("pointerdown", IncrementarCliques);
botaoAdd.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    IncrementarCliques();
});

botaoRemove.addEventListener("pointerdown", DecrementarCliques);
botaoRemove.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    DecrementarCliques();
});

botaoReset.addEventListener("pointerdown", ResetarCliques);

document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar" || event.key === "Enter") {
        event.preventDefault();
        IncrementarCliques();
    } else if (event.key === "Backspace") {
        event.preventDefault();
        DecrementarCliques();
    }
});

async function IncrementarCliques(){
    cliques.IncrementarCliques();
    contadorEl.textContent = cliques.GetCliques();
    await idb.salvar("total_cliques", cliques.GetCliques(), 0);
}

async function DecrementarCliques(){
    cliques.DecrementarCliques();
    contadorEl.textContent = cliques.GetCliques();
    await idb.salvar("total_cliques", cliques.GetCliques(), 0);
}

async function ResetarCliques(){
    cliques.ResetarCliques();
    contadorEl.textContent = cliques.GetCliques();
    await idb.salvar("total_cliques", cliques.GetCliques(), 0);
}