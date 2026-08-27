const lis = document.querySelectorAll(".li-monochampion");
const nextBtn = document.getElementById("next-step-monochampion");
const resetBtn = document.getElementById("reset-step-monochampion");

let currentActiveIndex;

// Criamos o Observer apenas se não houver um índice ativo salvo
let observer = null;

window.addEventListener('load', () => {
    currentActiveIndex = parseInt(localStorage.getItem("monoIndex")) ?? -1;
    if (currentActiveIndex >= 0) {
        for (let i = 0; i <= currentActiveIndex; i++) {
            if (lis[i]) lis[i].classList.add("active");
        }
    } else {
        AtivarObserver();
    }
}, { once: true });

// Substitui a função VerificarScroll e o listener de scroll manual por uma API performática
function AtivarObserver() {
    if (lis.length === 0) return;

    // Monitora quando o elemento atinge 85% da tela de baixo para cima
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentActiveIndex = 0;
                lis[0].classList.add("active");
                localStorage.setItem("monoIndex", currentActiveIndex);
                
                // Desativa o observer imediatamente após ativar o primeiro item (comportamento original)
                DesativarObserver(); 
            }
        });
    }, {
        rootMargin: "0px 0px -15% 0px" // Equivale ao seu window.innerHeight * 0.85
    });

    observer.observe(lis[0]);
}

function DesativarObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

nextBtn.addEventListener("click", async () => {
    if (currentActiveIndex === -1) {
        currentActiveIndex = 0;
        lis[0].classList.add("active");
        localStorage.setItem("monoIndex", currentActiveIndex);
        DesativarObserver(); // Desliga o observer se clicou antes de rolar a tela
        return;
    }
    if (currentActiveIndex < lis.length - 1) {
        currentActiveIndex++;
        lis[currentActiveIndex].classList.add("active");
        localStorage.setItem("monoIndex", currentActiveIndex);
    }
    else{
        const { ProximaSecao } = await import("./curso");
        ProximaSecao("trintaquarenta");
    }
});

resetBtn.addEventListener("click", () => {
    lis.forEach(li => {
        li.classList.remove("active");
    });

    currentActiveIndex = -1;
    localStorage.setItem("monoIndex", currentActiveIndex);
    
    // Se resetou, reativa a observação inteligente de entrada na tela
    DesativarObserver();
    AtivarObserver();
});