const containerPrincipal = document.getElementById('quantidadexqualidade');
const boxDetalhe = document.getElementById('detalheElo');
const todasAsLinhas = document.querySelectorAll('.wrapperGrafico path');
const todosItensLegenda = document.querySelectorAll('.wrapperGrafico .item-legenda');

const container = document.getElementById("traducao-grafico");
const t = container && container.dataset.translations 
  ? JSON.parse(container.dataset.translations) 
  : {};

const t_padrao = container && container.dataset.translationspadrao 
  ? JSON.parse(container.dataset.translationspadrao) 
  : {};
  
if (containerPrincipal && boxDetalhe) {

    // Dados de performance reais para os 6 elos (mapeados de 0 a 260 pixels de altura útil no SVG)
    const dadosReais = {
        mestre:     [100, 95, 55, 20, 5, 0, 0, 0],
        diamante:   [95, 90, 75, 45, 25, 10, 0, 0],
        esmeralda:  [90, 85, 80, 65, 40, 20, 10, 5],
        ouro:       [80, 78, 75, 70, 55, 45, 35, 25],
        prata:      [70, 68, 66, 64, 60, 55, 50, 45],
        ferro:      [55, 54, 53, 52, 51, 50, 48, 46]
    };

    // Textos explicativos para o Box de Detalhes
    const descricoesElo = {...t};

    // Função de conversão para as coordenadas do SVG (Largura útil: 500, Altura útil: 260)
    const gerarCaminho = (valores) => {
        const largura = 500;
        const alturaUtil = 260; // Deixa 30px de margem do topo do SVG
        const topoMargem = 30;
        
        return valores.map((valor, idx) => {
            const x = (idx / (valores.length - 1)) * largura;
            // Inverte o eixo Y e adiciona a margem do topo
            const y = (alturaUtil - ((valor / 100) * alturaUtil)) + topoMargem;
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    // Inicializa os desenhos das linhas
    Object.keys(dadosReais).forEach((elo) => {
        const path = document.getElementById(`linha${elo.charAt(0).toUpperCase() + elo.slice(1)}`);
        if (path) {
            path.setAttribute('d', gerarCaminho(dadosReais[elo]));
        }
    });

    // Funções para ligar/desligar o destaque do elo
    const ativarFoco = (elo) => {
        containerPrincipal.classList.add('tem-foco');
        
        // Ativa a linha correspondente
        const linha = document.querySelector(`.wrapperGrafico path[data-elo="${elo}"]`);
        if (linha) linha.classList.add('focado');

        // Ativa o item da legenda
        const legenda = document.querySelector(`.wrapperGrafico .item-legenda[data-elo="${elo}"]`);
        if (legenda) legenda.classList.add('focado');

        // Altera o texto explicativo
        boxDetalhe.innerHTML = descricoesElo[elo] || "";
    };

    const desativarFoco = () => {
        containerPrincipal.classList.remove('tem-foco');
        todasAsLinhas.forEach(l => l.classList.remove('focado'));
        todosItensLegenda.forEach(l => l.classList.remove('focado'));
        boxDetalhe.innerHTML = t_padrao;
    };

    // Atribui os eventos de Mouse para Linhas e Legendas
    [...todasAsLinhas, ...todosItensLegenda].forEach((elemento) => {
        elemento.addEventListener('mouseenter', () => {
            const elo = elemento.getAttribute('data-elo');
            if (elo) ativarFoco(elo);
        });

        elemento.addEventListener('mouseleave', desativarFoco);
    });

    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                todasAsLinhas.forEach(linha => linha.classList.add('animar'));
                observador.unobserve(containerPrincipal);
            }
        });
    }, { 
        rootMargin: "-20% 0px -20% 0px", 
        threshold: 0.5 
    });

    observador.observe(containerPrincipal);
}