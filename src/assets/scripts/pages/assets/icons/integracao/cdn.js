const copylink = document.getElementById("copy-link");
const icone = copylink.querySelector("#icone-copiavel-cdn");
const texto = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@taptotool/icons@${copylink.dataset.version}/css/ttt.css">`;

copylink.addEventListener("click", CopiarLink);

let timerCopia = null;

function CopiarLink(){
    navigator.clipboard.writeText(texto);
    icone.classList.remove("fa-solid");
    icone.classList.add("fa-regular");

    if(timerCopia)
        clearTimeout(timerCopia);

    timerCopia = setTimeout(() => {
        icone.classList.remove("fa-regular");
        icone.classList.add("fa-solid");
        timerCopia = null; // Limpa a referência do timer
    }, 3000);
}