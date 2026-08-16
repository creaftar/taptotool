import("./salvar.js");
import { ResetLaps, LoadLaps } from './cartao_volta.js';

let cronometroEl = document.getElementById("cronometro");
let toggleTimerEl = document.getElementById("toggleTimer");
let resetTimerEl = document.getElementById("resetTimer");
//let tituloEl = document.querySelector("title");

export let _estado = false;
export let _elapsedTime = 0;
export let _startTime;

let _rafId; 
let _worker = null;
let _ultimoTitulo = ""; // Guarda o último texto para evitar escritas desnecessárias no DOM

toggleTimerEl.addEventListener('click', ToggleTimer);
resetTimerEl.addEventListener('click', ResetTimer);

// Monitora se a aba está visível ou em segundo plano
document.addEventListener("visibilitychange", () => {
    if (_estado) {
        if (document.hidden) {
            // Cancelamos o rAF imediatamente ao ocultar
            if (_rafId) cancelAnimationFrame(_rafId);
        } else {
            // Ao voltar para a aba, forçamos o cancelamento de qualquer rAF pendente antes de iniciar outro
            if (_rafId) cancelAnimationFrame(_rafId);
            RenderLoop();
        }
    }
});

if (window.Worker) {
    _worker = new Worker(new URL('../timerWorker.js', import.meta.url), { type: 'module' });
    
    _worker.onmessage = function (e) {
        // Checagem rigorosa: só atualiza via worker se a aba REALMENTE continuar oculta e o timer estiver rodando
        if (e.data === 'tick' && _estado && document.hidden) {
            UpdateUI();
        }
    };
}

function ToggleTimer() {
    if (_estado === false) {
        toggleTimerEl.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        StartTimer();
    } else {
        toggleTimerEl.innerHTML = `<i class="fa-solid fa-play"></i>`;
        StopTimer();
    }
}

function StartTimer() {
    _startTime = performance.now() - _elapsedTime;
    _estado = true;
    
    RenderLoop();
}

function RenderLoop() {
    if (!_estado) return;
    
    // Só roda a renderização fluida se a aba estiver visível
    if (!document.hidden) {
        UpdateUI();
        _rafId = requestAnimationFrame(RenderLoop);
    }
}

function UpdateUI() {
    _elapsedTime = performance.now() - _startTime;
    
    if (cronometroEl) {
        cronometroEl.textContent = FormatTimer(_elapsedTime);
    }
    
    const novoTitulo = `${FormatTimerTitle(_elapsedTime)} - Tap to Tool`;
    if (novoTitulo !== _ultimoTitulo) {
        _ultimoTitulo = novoTitulo;
        document.title = novoTitulo; // Atualização nativa
    }
}

function StopTimer() {
    if (_rafId) cancelAnimationFrame(_rafId);
    _estado = false;
}

function ResetTimer() {
    if (_estado === true) ToggleTimer();
    
    _elapsedTime = 0;
    _ultimoTitulo = "";
    cronometroEl.textContent = "00:00:00.00";
    document.title = `Cronometro Online - Tap to Tool`;
    ResetLaps();
}

function FormatTimer(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let centiseconds = Math.floor((ms % 1000) / 10);
    let seconds = Math.floor(totalSeconds % 60);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 3600);

    return `${Pad(hours)}:${Pad(minutes)}:${Pad(seconds)}.${Pad(centiseconds, 2)}`;
}

function FormatTimerTitle(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let seconds = Math.floor(totalSeconds % 60);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 3600);

    return `${Pad(hours)}:${Pad(minutes)}:${Pad(seconds)}`;
}

function Pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

// Carregamento inicial
const STORAGE_KEY = "stopwatch";
LoadTimer();

export function LoadTimer() {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.elapsedTime !== null && savedState.elapsedTime !== 0) {
                _elapsedTime = parseFloat(savedState.elapsedTime);
                cronometroEl.textContent = FormatTimer(_elapsedTime);
                
                const tituloSalvo = `${FormatTimerTitle(_elapsedTime)} - Tap to Tool`;
                _ultimoTitulo = tituloSalvo;
                document.title = tituloSalvo;
            }
            if (savedState.laps && savedState.laps.length > 0) {
                LoadLaps(savedState.laps);
            }
            return true;
        } catch (e) {
            console.error("Erro ao carregar do LocalStorage:", e);
        }
    }
    return false;
}