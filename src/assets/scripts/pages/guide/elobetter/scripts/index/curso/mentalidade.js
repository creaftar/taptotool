const container = document.getElementById("traducao-mentalidade");
const t = container && container.dataset.translations 
  ? JSON.parse(container.dataset.translations) 
  : {};

const textos = [...t];

const quadrados = document.querySelectorAll(".quadrado-mentalidade");
const nextBtn = document.getElementById("next-step-mentalidade");
const resetBtn = document.getElementById("reset-step-mentalidade");

let _estaDigitando = false; 

// CHAMA A FUNÇÃO PARA RESTAURAR O ESTADO SALVO ASSIM QUE O SCRIPT CARREGAR
CarregarProgressoSalvo();

quadrados.forEach((quadrado, i) => {
    quadrado.addEventListener("click", async () => {
        if (_estaDigitando) return; 

        if (quadrado.classList.contains("mentalidade-ativa") && i !== quadrados.length - 1)
            ProximoQuadrado(i, quadrado);
        else if (quadrado.classList.contains("mentalidade-ativa") && i == quadrados.length - 1) {
            const { ProximaSecao } = await import("./curso");
            ProximaSecao("aviso-mentalidade");
            quadrado.classList.remove("mentalidade-ativa");
            
            // Salva que o usuário concluiu o último passo
            localStorage.setItem("indiceMentalidade", i + 1); 
        }
    });
});

async function ProximoQuadrado(i, quadrado) {
    const proximoIndice = i + 1;
    const pEl = quadrados[proximoIndice].querySelector(".texto-quadrado-mentalidade");
    
    GerarLetras(proximoIndice, pEl);
    quadrado.classList.remove("mentalidade-ativa");
    quadrados[proximoIndice].classList.add("mentalidade-ativa");

    quadrados[proximoIndice].scrollIntoView({
        behavior: 'smooth',
        block: 'center' // Alinha o elemento no centro vertical da tela
    });

    localStorage.setItem("indiceMentalidade", proximoIndice);
}

function GerarLetras(i, pEl) {
    let letrasDigitadas = 0;
    
    _estaDigitando = true;
    resetBtn.classList.add("disabled");
    resetBtn.disabled = true; 

    function digitar() {
        if (letrasDigitadas < textos[i].length) {
            pEl.innerHTML = textos[i].slice(0, letrasDigitadas + 1);
            letrasDigitadas++;
            setTimeout(digitar, 20);
        } else {
            _estaDigitando = false;
            resetBtn.classList.remove("disabled");
            resetBtn.disabled = false;
        }
    }

    digitar();
}

resetBtn.addEventListener("click", () => {
    if (!_estaDigitando) {
        ResetarMentalidade();
    }
});

function ResetarMentalidade() {
    const ativo = document.querySelector(".mentalidade-ativa");
    if (ativo) ativo.classList.remove("mentalidade-ativa");
    
    quadrados[0].classList.add("mentalidade-ativa");

    quadrados.forEach((quadrado, i) => {
        const pEl = quadrado.querySelector(".texto-quadrado-mentalidade");
        if (pEl) pEl.textContent = "";
    });

    // LIMPA O LOCALSTORAGE AO RESETAR
    localStorage.removeItem("indiceMentalidade");
}

// NOVA FUNÇÃO: RECUPERA O ESTADO AO RECARREGAR A PÁGINA
function CarregarProgressoSalvo() {
    const indiceSalvo = localStorage.getItem("indiceMentalidade");

    // Se houver algo salvo, reconstrói o estado
    if (indiceSalvo !== null) {
        const indiceInt = parseInt(indiceSalvo);

        // Remove a classe ativa inicial do primeiro quadrado
        quadrados[0].classList.remove("mentalidade-ativa");

        // Preenche os textos de todos os quadrados que o usuário já abriu
        for (let i = 1; i <= indiceInt; i++) {
            // Garante que não vai tentar acessar um quadrado fora do limite da tela
            if (quadrados[i]) {
                const pEl = quadrados[i].querySelector(".texto-quadrado-mentalidade");
                if (pEl && textos[i]) {
                    pEl.innerHTML = textos[i]; // Injeta o texto direto, sem animação
                }
            }
        }

        // Coloca a classe ativa no quadrado onde ele parou (se ele não tiver terminado tudo)
        if (indiceInt < quadrados.length) {
            quadrados[indiceInt].classList.add("mentalidade-ativa");
        }
    }
}

nextBtn.addEventListener("click", async ()=>{
    const { ProximaSecao } = await import("./curso");
    ProximaSecao("quantidadexqualidade");
});