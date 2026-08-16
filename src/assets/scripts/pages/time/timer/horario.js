import { temporizadores } from "./GerenciadorTemporizadores.js";
let relogioEl = document.getElementById("horario");
let titleTag = document.querySelector("title");

let _timerInterval; 

const lang = relogioEl.dataset.lang;

const timeFormatter = new Intl.DateTimeFormat(lang, {
    hour: '2-digit',
    minute: '2-digit',
    second: (lang.startsWith('en') ? undefined : '2-digit'),
    hour12: (lang.startsWith('en'))
});

// Substitua sua função StartRelogio por esta:
/*export function StartRelogio() {
    function loop() {
        atualizarHoraLocal();
        requestAnimationFrame(loop); // O navegador chama isso no momento perfeito para o monitor
    }
    requestAnimationFrame(loop);
}*/
export function StartRelogio() {
    // Pedir permissão ao carregar o relógio
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    atualizarHoraLocal();

    if (window.Worker) {
        const worker = new Worker(new URL('../timerWorker.js', import.meta.url), { type: 'module' });
        
        worker.onmessage = function (e) {
            if (e.data === 'tick') {
                atualizarHoraLocal();
            }
        };

        worker.onerror = function (err) {
            console.error("Erro no Web Worker:", err);
        };
    } else {
        setInterval(atualizarHoraLocal, 1000);
    }
}

function atualizarHoraLocal() {
    const agora = new Date();
    const agoraMs = Date.now();

    // Só atualiza o texto do relógio principal se o segundo mudou (para economizar processamento)
    const horaLocal = timeFormatter.format(agora);
    if (relogioEl && relogioEl.textContent !== horaLocal) {
        relogioEl.textContent = horaLocal;
    }

    temporizadores.forEach((temporizador) => {
        if (temporizador.IsRodando()) {
            // Agora atualizamos o visor em tempo real
            temporizador.SetTempoFaltante();

            const faltante = temporizador.GetTempoFaltante();

            // DISPARO: usamos uma margem pequena (50ms) para garantir o disparo imediato
            if (faltante <= 0 && !temporizador.IsTocando()) {
                temporizador.Disparar();
                titleTag.textContent = temporizador.GetNome() + " - Tap to Tool";
                temporizador.GetDiv().scrollIntoView({block: 'nearest', behavior: 'smooth'});
            }
        }
    });
}