export async function InicializarMenu(){
    await import('./temas/definir_temas.js');
    await import('./linguagem/linguagem.js');
    loadPage();
}


export function loadPage(){
   // await TraduzirBody(); //Traduzindo o Body da página
   var carregaTelaEl = document.getElementById('carrega_tela');
    var loadingBarEl = document.getElementById('loadingBar');
    carregaTelaEl.style.display = 'flex'; // Defina o display como 'none'
    loadingBarEl.style.animation = "loadingBar 0.9s infinite"
    carregaTelaEl.style.animation = "aparecer 0.9s forwards";
    carregaTelaEl.addEventListener('animationend', function(event) {
        if (event.animationName == 'aparecer') { // Verifique se a propriedade de transição é 'opacity'
            carregaTelaEl.style.display = 'none'; // Defina o display como 'none'
        }
        loadingBarEl.style.animation = "none"
        carregaTelaEl.style.animation = "none";
    });
}