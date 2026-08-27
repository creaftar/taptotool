export function DefinirDiplay(elemento){
    elemento.classList.add("elemento-none");
}

export function AdicionarDisplay(elemento){
    elemento.classList.remove("elemento-none");
    elemento.classList.add("elemento-flex");
}

export function RemoverDisplay(){
    var elementos = document.querySelectorAll(".elemento-none");
    elementos.forEach(elemento => {
        elemento.classList.remove("elemento-flex");
        elemento.classList.add("elemento-none");
    });
}

export function VerificarDisplay(elemento){
    return elemento.classList.contains("elemento-flex");
}

export function AlternarDisplay(elemento){
    
    if(!VerificarDisplay(elemento)){
        AdicionarDisplay(elemento);
    }
    else{
        RemoverDisplay()
    }
}