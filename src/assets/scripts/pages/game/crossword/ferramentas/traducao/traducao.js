export var langURL = document.documentElement.lang;

export function SetLangUrl(par_langURL){
    langURL = par_langURL;
}

export function MostrarLoading(tempo = 0.4) {
    const carregaTelaEl = document.getElementById('carrega_tela');
    const loadingBarEl = document.getElementById('loadingBar');
    
    if (!carregaTelaEl) return;

    // Remove a classe que esconde e garante que o display está flex
    carregaTelaEl.classList.remove('carrega_tela_hidden');
    carregaTelaEl.style.display = "flex";
    
    if (loadingBarEl) loadingBarEl.style.animation = `loadingBarMove ${tempo} infinite linear`;
}

export function EsconderLoading() {
    const carregaTelaEl = document.getElementById('carrega_tela');
    if (!carregaTelaEl) return;

    // Adiciona a classe que faz o fade-out
    carregaTelaEl.classList.add('carrega_tela_hidden');

    // Limpa o display:none só depois que a animação de 0.9s acabar
    carregaTelaEl.addEventListener('transitionend', () => {
        carregaTelaEl.style.display = 'none';
    }, { once: true });
}