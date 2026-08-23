const segmentos = window.location.pathname.split('/').filter(Boolean);
const paginaCerta = segmentos.at(-1) || 'index';

const elementoOndeInserirMenu = document.querySelector('#menuLateral'); 
const containerScroll = document.querySelector('#container-opcaoAside');

if (elementoOndeInserirMenu) {
    const linkAtivo = elementoOndeInserirMenu.querySelector(`[data-pagina="${paginaCerta}"]`);

    if (linkAtivo) {

        if (containerScroll) {
            const topoItem = linkAtivo.offsetTop;
            const alturaItem = linkAtivo.clientHeight;
            const alturaContainer = containerScroll.clientHeight;

            containerScroll.scrollTo({
                top: topoItem - (alturaContainer / 2) + (alturaItem / 2),
            });
        }
    } else {
        console.warn(`Link com data-pagina="${paginaCerta}" não encontrado.`);
    }
}