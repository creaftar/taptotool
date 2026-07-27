// Filtra o array para remover strings vazias antes de pegar o último elemento
const segmentos = window.location.pathname.split('/').filter(s => s !== '');
const paginaCerta = segmentos.pop() || 'index';

// Use o ID correto do seu <aside>
const elementoOndeInserirMenu = document.querySelector('#menuLateral'); 

if (elementoOndeInserirMenu) {
    const linkAtivo = elementoOndeInserirMenu.querySelector(`[data-pagina="${paginaCerta}"]`);

    if (linkAtivo) {
        linkAtivo.id = 'opcaoAtiva'; 
        /*linkAtivo.scrollIntoView({ behavior: "smooth", block: "center" });*/
    } else {
        console.warn(`Link com data-pagina="${paginaCerta}" não encontrado.`);
    }
}