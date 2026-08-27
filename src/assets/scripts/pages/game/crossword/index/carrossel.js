import img1 from '@/assets/imgs/anuncios/taptotool-ad.png';
import img2 from '@/assets/imgs/anuncios/gerador_caracteres.webp';
import img3 from '@/assets/imgs/anuncios/elobetter.png';  
import img4 from '@/assets/imgs/anuncios/inverter_texto.webp';

export var linksAmazon = [
  'https://taptotool.com/', //conversor maiuscula minuscula
  'https://taptotool.com/text/character-counter', //gerador de caractere
  'https://elobetter.com/', //gerador de numeros
  'https://taptotool.com/text/text-inverter' //inversor de texto
];
export var imgsAmazon = [
    img1.src,  
    img2.src,
    img3.src,
    img4.src
  ];
  
const contentcruzadinhaEl = document.getElementById('content-cruzadinhas');
const t = JSON.parse(contentcruzadinhaEl.dataset.i18n).carousel;

/*
export async function GerarCarrossel(){
    //const { TraducaoExclusiva } = await import("../ferramentas/traducao/traducao.js");
    var carrossel = document.createElement('div');

    carrossel.classList.add("main-card");
    carrossel.classList.add("container-card");
    carrossel.classList.add("anuncio");

    //const { TraducaoExclusiva } = await import("../ferramentas/traducao/traducao.js");
    //const { TraduzirBody } = await import("../ferramentas/traducao/traducaoIndex.js");
    await DefinirImagens();
    
    carrossel.innerHTML =`
                      <div class="card">
                        <div class="linkJogar" id="card-area">
                          <button class="btnCarrossel traduzirbody" aria-label="${t.btn_prev_aria}" id="carrosselPrevBtn"><i class="fa-solid fa-angle-left"></i></button>
                          <div class="carousel-track" id="carouselTrack">
                            <a href="${linksAmazon[0]}" target="_blank" class="card slide"><img src="${imgsAmazon[0]}" alt="${t.advertisement}"></a>
                            <a href="${linksAmazon[1]}" target="_blank" class="card slide"><img src="${imgsAmazon[1]}" alt="${t.advertisement}"></a>
                            <a href="${linksAmazon[2]}" target="_blank" class="card slide"><img src="${imgsAmazon[2]}" alt="${t.advertisement}"></a>
                            <a href="${linksAmazon[3]}" target="_blank" class="card slide"><img src="${imgsAmazon[3]}" alt="${t.advertisement}"></a>
                            <a href="${linksAmazon[0]}" target="_blank" class="card slide"><img src="${imgsAmazon[0]}" alt="${t.advertisement}"></a>
                          </div>
                          <button class="btnCarrossel traduzirbody" aria-label="${t.btn_next_aria}" id="carrosselNextBtn"><i class="fa-solid fa-angle-right"></i></button>
                        </div> 
                        <div class="card-botoes">
                          <button class="traduzirbody" aria-label="${t.button_buy}"><a class="icon-link blue traduzirbody" href="https://taptotool.com" target="_blank" id="icon-card" aria-label="${t.button_buy}"><i class="fa-solid fa-gears"></i></a></button>
                        </div>
                      </div>
                      <div class="card-infos">
                        <div class="header-card-infos header-card-infos-ad">
                          <a class="blue button-topico" id="comprarCarrosselBtn" href="${linksAmazon[0]}" target="_blank">
                          <i class="fa-solid fa-gears"></i> 
                          <span>${t.details}</span> 
                          <i class="fa-solid fa-arrow-up-right-from-square end-topic blue end-topic-btn"></i></a>
                          
                          <p class="ad blue no-break-lines text-advertisement"><span class="icone-pequeno">●</span> ${t.advertisement}</p>
                        </div>
                        <p class="ad aviso-ad">${t.advice} - <a href="/politics.html" target="_blank" class="blue">${t.read_more}</a></p>
                      </div>`;

    contentcruzadinhaEl.appendChild(carrossel);
    //TraduzirBody();
    setTimeout(()=>{
      inicializarCarrossel();
    },3000);
}*/
//var slideWidth;

export function InicializarCarrossel(){
    const cardAreaEl = document.getElementById('card-area');
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = Array.from(carouselTrack.querySelectorAll('.slide')); // Converte NodeList para Array
    const comprarCarrosselBtn = document.getElementById("comprarCarrosselBtn");
    //const iconCardEl = document.getElementById("icon-card");
    
    let currentIndex = 0;
    let isTransitioning = false; // Flag para evitar transições simultâneas
    let slideWidth;
    let intervaloId; // Variável para armazenar o ID do intervalo
    
    slideWidth = cardAreaEl.getBoundingClientRect().width;
    
    // Duplica os primeiros slides para o final do carrossel
    /*const firstSlides = slides.slice(0, 2); // Duplica os dois primeiros slides
    firstSlides.forEach(slide => {
      const clone = slide.cloneNode(true);
      carouselTrack.appendChild(clone);
    });*/
    
    // Atualiza a lista de slides após a duplicação
    //const allSlides = Array.from(document.querySelectorAll('.slide'));
    
    // Inicia o intervalo automático
    function iniciarIntervalo() {
      clearInterval(intervaloId); // Limpa qualquer intervalo existente
      intervaloId = setInterval(nextSlide, 6000);
    }
    
    const prevBtn = document.getElementById('carrosselPrevBtn');
    const nextBtn = document.getElementById('carrosselNextBtn');
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      iniciarIntervalo(); // Reseta o intervalo ao navegar manualmente
    
      if (currentIndex >= slides.length - 1) {
        // Transição para o primeiro slide (sem animação)
        carouselTrack.style.transition = 'none';
        currentIndex = 0;
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        // Força um reflow para aplicar a mudança imediatamente
        //carouselTrack.offsetWidth;
      }
      currentIndex++;
      carouselTrack.style.transition = 'transform 0.3s ease-in-out';
      carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
      // Aguarda o final da transição antes de permitir a próxima
      setTimeout(() => {
        isTransitioning = false;
      }, 333); // Tempo da transição (0.5s)
    
      comprarCarrosselBtn.href = linksAmazon[currentIndex];
      //iconCardEl.href = linksAmazon[currentIndex];
    
      if(currentIndex == slides.length - 1){
      comprarCarrosselBtn.href = linksAmazon[0];
      //iconCardEl.href = linksAmazon[0];
      }
    }
    
    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      iniciarIntervalo(); // Reseta o intervalo ao navegar manualmente
      if (currentIndex <= 0) {
        // Transição para o último slide (sem animação)
        carouselTrack.style.transition = 'none';
        currentIndex = slides.length - 1;
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        //carouselTrack.offsetWidth;
        //currentIndex = slides.length - 1; // Ajusta o índice
      }
      
      currentIndex--;
    
      carouselTrack.style.transition = 'transform 0.3s ease-in-out';
      carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
      setTimeout(() => {
        isTransitioning = false;
      }, 333);
      comprarCarrosselBtn.href = linksAmazon[currentIndex];
      //iconCardEl.href = linksAmazon[currentIndex];
    }
    
    const observador = new ResizeObserver((entradas) => {
      entradas.forEach((entrada) => {
      //const largura = entrada.contentRect.width;
      //const altura = entrada.contentRect.height;
      slideWidth = cardAreaEl.getBoundingClientRect().width;
      // Recalcula a posição do carrossel ao redimensionar
      carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      //carouselTrack.offsetWidth; // Força o reflow
      carouselTrack.style.transition = 'transform 0.3s ease-in-out';
      });
    });
  
   observador.observe(cardAreaEl);
  
   // Inicia o intervalo automático na inicialização
   iniciarIntervalo();
}

export function NovoAnuncio(limiteCruzadinha, id) {
    // Chamamos a função do Yandex, passando uma função de fallback da Amazon
    return NovoAnuncioYandex(limiteCruzadinha, id, () => gerarEstruturaAmazon(limiteCruzadinha));
}

// Função auxiliar apenas para criar o HTML da Amazon
function gerarEstruturaAmazon(limiteCruzadinha) {
    let anuncio = document.createElement('div');
    anuncio.classList.add("container-card", "anuncio-estatico");
    anuncio.style.setProperty('--random-order', Math.floor(Math.random() * limiteCruzadinha));

    const randomNum = Math.floor(Math.random() * linksAmazon.length);

    anuncio.innerHTML = `
      <div class="card">
        <div class="linkJogar" id="card-area">
          <a href="${linksAmazon[randomNum]}" target="_blank" class="card slide">
            <img src="${imgsAmazon[randomNum]}" alt="Anúncio">
          </a>
        </div>
        <div class="card-botoes">
          <button>
            <a class="icon-link blue" href="${linksAmazon[randomNum]}" target="_blank" id="icon-card">
              <i class="fa-solid fa-cart-shopping"></i>
            </a>
          </button>
        </div>
      </div> 
      <div class="card-infos">
        <div class="header-card-infos header-card-infos-ad">
          <a class="blue button-topico comprar-btn" href="${linksAmazon[randomNum]}" target="_blank">
            <i class="fa-solid fa-cart-shopping"></i> 
            <span>Detalhes</span> 
            <i class="fa-solid fa-arrow-up-right-from-square end-topic blue end-topic-btn"></i>
          </a>
          <p class="ad blue no-break-lines text-advertisement">
            <span class="icone-pequeno">●</span> ${t.Advertisement || t.advertisement}
          </p>
        </div>
        <p class="ad aviso-ad">
          ${t.advice} - <a href="/politics" target="_blank" class="blue">${t.read_more}</a>
        </p>
      </div>`;
    return anuncio;
}


export function NovoAnuncioYandex(limiteCruzadinha, id, fallbackAmazon) {
    const adUnitId = `R-A-19064633-7`;
    let anuncioContainer = document.createElement('div');
    anuncioContainer.classList.add("container-card", "anuncio-estatico");
    
    const randomOrder = Math.floor(Math.random() * limiteCruzadinha);
    anuncioContainer.style.setProperty('--random-order', randomOrder);

    // ID único para o Yandex renderizar dentro
    const uniqueId = `yandex_ad_${Math.random().toString(36).substr(2, 9)}`;
    
    // Estrutura inicial "Skeleton" ou temporária do Yandex
    anuncioContainer.innerHTML = `
      <div class="card linkJogar" id=${uniqueId}>
      
      </div> 
      <div class="card-infos">
         <div class="header-card-infos header-card-infos-ad">
          <a class="blue button-topico comprar-btn" href="${linksAmazon[0]}" target="_blank">
            <i class="fa-solid fa-cart-shopping"></i> 
            <span>${t.details}</span> 
            <i class="fa-solid fa-arrow-up-right-from-square end-topic blue end-topic-btn"></i>
          </a>
          <p class="ad blue no-break-lines text-advertisement">
            <span class="icone-pequeno">●</span> ${t.Advertisement || t.advertisement}
          </p>
        </div>
        <p class="ad aviso-ad">
          ${t.advice} - <a href="/politics" target="_blank" class="blue">${t.read_more}</a>
        </p>
      </div>`;
    
    const dispararRender = () => {
        window.yaContextCb = window.yaContextCb || [];
        window.yaContextCb.push(() => {
            Ya.Context.AdvManager.render({
                blockId: adUnitId,
                renderTo: uniqueId,
                onRender: (data) => {
                    console.log(`✅ Yandex carregado em ${uniqueId}`);
                },
                onError: (error) => {
                    console.warn(`❌ Yandex falhou (${error.type}). Trocando para Amazon...`);
                    
                    // O PULO DO GATO REVISADO:
                    // Substituímos o 'anuncioContainer' inteiro pelo card da Amazon
                    if (anuncioContainer.parentNode) {
                        const cardAmazon = fallbackAmazon();
                        // Mantém a ordem do grid (CSS Order) se necessário
                        cardAmazon.style.setProperty('--random-order', randomOrder);
                        anuncioContainer.parentNode.replaceChild(cardAmazon, anuncioContainer);
                    }
                }
            });
        });
    };

    // Monitora a inserção no DOM (Importante porque você usa Promise.all + append)
    let tentativas = 0;
    const verificarNoDOM = setInterval(() => {
        tentativas++;
        if (document.getElementById(uniqueId)) {
            clearInterval(verificarNoDOM);
            dispararRender();
        } else if (tentativas > 50) {
            clearInterval(verificarNoDOM);
        }
    }, 100);

    return anuncioContainer;
}

export function iniciarContadorProximaCruzadinha() {
    const display = document.getElementById('tempoProximaCruzadinha');

    setInterval(() => {
        const agora = new Date();
        
        // Criamos uma data para "amanhã" às 00:00:00
        const amanha = new Date();
        amanha.setDate(agora.getDate() + 1);
        amanha.setHours(0, 0, 0, 0);

        // Diferença em milissegundos
        const diferenca = amanha - agora;

        // Se por algum motivo a diferença for negativa (ex: o dia virou), resetamos
        if (diferenca <= 0) {
            display.innerText = "00:00:00";
            // Aqui você pode disparar um window.location.reload() se quiser que a página atualize
            return;
        }

        // Cálculos de horas, minutos e segundos
        const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
        const segundos = Math.floor((diferenca / 1000) % 60);

        // Formatando com zero à esquerda (00:00:00)
        display.innerText = 
            String(horas).padStart(2, '0') + ":" + 
            String(minutos).padStart(2, '0') + ":" + 
            String(segundos).padStart(2, '0');

    }, 1000);
}