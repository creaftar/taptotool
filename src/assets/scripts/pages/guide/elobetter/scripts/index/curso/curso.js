//export const traducao = document.getElementById("i18n");

export function ProximaSecao(secao){
    const proximaSecao = document.getElementById(secao);
    if (proximaSecao) {
        const posicaoScrollAtual = window.scrollY || window.pageYOffset;
        const posicaoElemento = proximaSecao.getBoundingClientRect().top;
        const posicaoFinal = posicaoScrollAtual + posicaoElemento - 62;
        window.scrollTo({
            top: posicaoFinal,
            behavior: 'smooth'
        });
    }
}