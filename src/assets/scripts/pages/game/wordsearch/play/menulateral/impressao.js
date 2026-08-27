let impressoraEl = document.getElementById("impressora");
impressoraEl.addEventListener('click', ImprimirCruzadinha);

async function ImprimirCruzadinha(){
    window.print();
}