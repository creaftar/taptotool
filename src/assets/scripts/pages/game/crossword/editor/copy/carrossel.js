let containerButtonEsperadoCopyEl = document.getElementById("container-button-esperado-copy");

const carousel = document.getElementById('creaftar-div-textarea-copy');
const items = carousel.querySelectorAll('.item-carousel');
const container_formatosEsperados = document.getElementById("container-formatos-esperados");
const liItems = container_formatosEsperados.querySelectorAll('.button-esperado-copy');
const btnLeft = document.getElementById("carrossel-btnslide-left");
const btnRight = document.getElementById('carrossel-btnslide-right');

let currentIndex = 0;
let autoPlayTimer; // Variável que vai guardar o "relógio"
const tempoEspera = 3000; // Tempo em milissegundos (5 segundos)

let copyCreaftarEl = document.getElementById("copy-text-creaftar-copy");

iniciarAutoPlay();

function iniciarAutoPlay() {
    // Limpa o timer anterior para não atropelar os segundos
    clearInterval(autoPlayTimer); 
    
    // Cria um novo timer
    autoPlayTimer = setInterval(() => {
        AvancarCarousel();
    }, tempoEspera);
}

function showPage(index) {
    items.forEach(item => item.classList.remove('active'));
    items[index].classList.add('active');
    
    liItems.forEach(item => item.classList.remove('active'));
    const botaoAtivo = liItems[index];
    botaoAtivo.classList.add('active');

    if (botaoAtivo && containerButtonEsperadoCopyEl) {
        const containerWidth = containerButtonEsperadoCopyEl.offsetWidth;
        const botaoOffset = botaoAtivo.offsetLeft;
        const botaoWidth = botaoAtivo.offsetWidth;

        // Calcula a posição para o botão ficar no meio do container
        const scrollDestino = botaoOffset - (containerWidth / 2) + (botaoWidth / 2);

        containerButtonEsperadoCopyEl.scrollTo({
            left: scrollDestino,
            behavior: 'smooth'
        });
    }

    iniciarAutoPlay();
}

btnRight.addEventListener('click', () => {
    AvancarCarousel();
});

btnLeft.addEventListener('click', () => {
    VoltarCarousel();
});


function AvancarCarousel(){
    currentIndex = (currentIndex + 1) % items.length; // Volta pro início se for o último
    showPage(currentIndex);    
}

function VoltarCarousel(){
    currentIndex = (currentIndex - 1 + items.length) % items.length; // Vai pro último se for o primeiro
    showPage(currentIndex);    
}


copyCreaftarEl.addEventListener('click', () => {
    const activeItem = carousel.querySelector('.item-carousel.active');
    
    // Pega o texto limpo (sem tags HTML)
    const textToCopy = activeItem.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
    });
});

liItems.forEach((botao, index) => {
    botao.addEventListener('click', () => {
        currentIndex = index; // Sincroniza o índice global com o botão clicado
        showPage(currentIndex); // Pula direto para a página certa
    });
});