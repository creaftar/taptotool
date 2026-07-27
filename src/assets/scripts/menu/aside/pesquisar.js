let inpPesquisaPages = document.getElementById('pesquisar-ferramenta');
let containerPages = document.getElementById('container-opcaoAside');
let hrAside = containerPages.querySelectorAll('.hr-aside');
let hrsVisiveis = true; // Controle para não rodar o loop sem necessidade

function PesquisarPaginas() {
    const termoPesquisa = inpPesquisaPages.value.toLowerCase().trim();

    // --- OTIMIZAÇÃO DAS LINHAS (HR) ---
    // Só esconde se estiverem visíveis e houver texto
    if (termoPesquisa.length > 0 && hrsVisiveis) {
        hrAside.forEach(hr => hr.style.display = "none");
        hrsVisiveis = false;
    } 
    // Só mostra se estiverem escondidas e o campo for limpo
    else if (termoPesquisa.length === 0 && !hrsVisiveis) {
        hrAside.forEach(hr => hr.style.display = "block");
        hrsVisiveis = true;
    }

    // --- FILTRAGEM DOS ITENS ---
    const opcoesPages = containerPages.querySelectorAll('.opcaoAside');
    opcoesPages.forEach(opcaoPage => {
        const tituloElement = opcaoPage.querySelector('a .aside-text-icon');
        if (tituloElement) {
            const tituloPagina = tituloElement.textContent.toLowerCase();
            opcaoPage.style.display = tituloPagina.includes(termoPesquisa) ? 'flex' : 'none';
        }
    });
}

// Apenas um listener de input é necessário
inpPesquisaPages.addEventListener('input', PesquisarPaginas);

// Mantemos o focusout apenas como garantia extra
inpPesquisaPages.addEventListener('focusout', () => {
    if (inpPesquisaPages.value.trim() === "") {
        hrAside.forEach(hr => hr.style.visibility = "visible");
        hrsVisiveis = true;
    }
});