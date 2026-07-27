// 1. Seleciona os elementos
const carousel = document.getElementById('carrossel-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const firstCard = carousel.querySelector('.card');

var _cardAtual = 1;
const qtdeCards = 4;
const larguraCard = firstCard ? firstCard.offsetWidth : 900;

let isTransitioning = false; // Flag para evitar transições simultâneas

// 2. Adiciona o evento de clique para o botão "Anterior"
prevBtn.addEventListener('click', () => {
    PrevSlide();
});

// 3. Adiciona o evento de clique para o botão "Próximo"
nextBtn.addEventListener('click', () => {
    NextSlide();
});

setInterval(RolarAutomaticamente, 3000);

let aux = 0;
function RolarAutomaticamente()
{
    NextSlide();
}

function NextSlide()
{
    if(isTransitioning)
        return;
    carousel.scrollTo({
        left: larguraCard * _cardAtual,
        behavior: 'smooth' // Rola suavemente
    });
    _cardAtual++;
    if(_cardAtual > qtdeCards)
        _cardAtual = 0;
    IniciarTransicao();
}

function PrevSlide()
{
    if(isTransitioning)
        return;
    _cardAtual--;
    if(_cardAtual < 0)
        _cardAtual = qtdeCards;
    carousel.scrollTo({
        left: larguraCard * _cardAtual,
        behavior: 'smooth' // Rola suavemente
    });
    IniciarTransicao();
}

function IniciarTransicao()
{
    isTransitioning = true;
    setTimeout(() =>{
        isTransitioning = false;
    }, 333);
}