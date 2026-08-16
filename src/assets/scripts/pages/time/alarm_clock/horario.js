import { alarmes } from "./GerenciadorAlarmes.js";
let relogioEl = document.getElementById("horario");
let titleTag = document.querySelector("title");

const lang = relogioEl?.dataset.lang || 'pt-BR';

const timeFormatter = new Intl.DateTimeFormat(lang, {
    hour: '2-digit',
    minute: '2-digit',
    second: (lang.startsWith('en') ? undefined : '2-digit'),
    hour12: (lang.startsWith('en'))
});

// Função para disparar a notificação no sistema
function EnviarNotificacaoAlarme(alarme) {
    if ("Notification" in window && Notification.permission === "granted") {
        const nomeAlarme = alarme.GetNome();
        const textoCorpo = nomeAlarme?.trim() ? `"${nomeAlarme}"` : "⏰";

        const notificacao = new Notification("Tap to Tool", {
            body: textoCorpo,
            requireInteraction: true // Mantém a notificação visível na tela até ser fechada
        });

        // 1. Clicou no corpo da notificação -> Apenas foca a janela/aba (o alarme CONTINUA tocando)
        notificacao.onclick = () => {
            window.focus();
        };

        // 2. Fechou/dispensou a notificação (clicou no X ou deslizou para fechar) -> Para o alarme
        notificacao.onclose = () => {
            alarme.Parar(); // Interrompe o áudio
        };
    }
}

// Função para destravar o contexto de áudio do navegador
function inicializarPermissaoAudio() {
    // Cria um AudioContext e o inicializa
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    // Toca um micro-som mudo usando um Audio elemento para garantir no Chrome/Safari
    const audioSilencioso = new Audio();
    // Um arquivo de áudio mudo em formato base64
    audioSilencioso.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    audioSilencioso.play().catch(() => {
        // Ignora se o navegador ainda barrar
    });

    // Remove os eventos assim que o usuário clicar 1 única vez
    document.removeEventListener('click', inicializarPermissaoAudio);
    document.removeEventListener('keydown', inicializarPermissaoAudio);
}

// Registra os ouvintes para destravar o áudio no PRIMEIRO clique ou tecla pressionada
document.addEventListener('click', inicializarPermissaoAudio);
document.addEventListener('keydown', inicializarPermissaoAudio);

function atualizarHoraLocal() {
    const agora = new Date(); 
    const horaLocal = timeFormatter.format(agora);

    if (relogioEl) {
        relogioEl.textContent = horaLocal;
    }

    alarmes.forEach((alarme) => {
        alarme.SetTempoFaltante();
        
        if (alarme.GetTempoFaltante() <= 0 && !alarme._tocando) {
            alarme.Disparar();
            
            // Passamos o objeto 'alarme' inteiro para a função de notificação
            EnviarNotificacaoAlarme(alarme);

            if (titleTag) titleTag.textContent = alarme.GetNome() + " - Tap to Tool";
            alarme.GetDiv().scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'center' });
        }
    });
}

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