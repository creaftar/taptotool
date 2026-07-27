let inpPesquisaPages = document.getElementById('input-pesquisa-pages');
let containerPages = document.getElementById('container-pages');
let lupa = document.getElementById('lupa');

inpPesquisaPages.addEventListener('input', PesquisarPaginas);

function PesquisarPaginas(){
    // 1. Obtém o texto digitado, converte para minúsculas e remove espaços desnecessários
    const termoPesquisa = inpPesquisaPages.value.toLowerCase().trim();

    // 2. Obtém todos os itens de página
    // O 'containerPages' garante que só busquemos itens dentro da área de páginas
    const opcoesPages = containerPages.querySelectorAll('.opcaoPage a');

    // 3. Itera sobre cada item de página
    opcoesPages.forEach(opcaoPage => {
        // Encontra o parágrafo que contém o título da página
        const tituloElement = opcaoPage.querySelector('.page-text-icon');
        
        // Verifica se o elemento de título existe
        if (tituloElement) {
            // Obtém o texto do título e converte para minúsculas para comparação
            const tituloPagina = tituloElement.textContent.toLowerCase().trim();

            // Lógica de Filtragem:
            // Se o termo de pesquisa estiver contido no título da página
            if (tituloPagina.includes(termoPesquisa)) {
                // Se for encontrado, mostra o item
                opcaoPage.style.display = 'flex'; 
            } else {
                // Se não for encontrado, esconde o item
                opcaoPage.style.display = 'none';
            }
        }
    });
}

inpPesquisaPages.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        PesquisarPaginas(); 
    }
});

lupa.addEventListener('click', PesquisarPaginas);