import("./salvar.js");
let cronometroEl = document.getElementById("cronometro");
let toggleTimerEl = document.getElementById("toggleTimer");
import { ResetLaps, LoadLaps } from './cartao_volta';
let resetTimerEl = document.getElementById("resetTimer");
let tituloEl = document.querySelector("title");

export let _estado = false;
export let _elapsedTime = 0;
export let _startTime;
let _timerInterval;
let _titleInterval;

toggleTimerEl.addEventListener('click', ToggleTimer);
resetTimerEl.addEventListener('click', ResetTimer);


function ToggleTimer() {
    if(_estado == false)
    {
        toggleTimerEl.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        StartTimer();
    }
    else
    {
        toggleTimerEl.innerHTML = `<i class="fa-solid fa-play"></i>`;
        StopTimer();
    }
}

function StartTimer() {
    _startTime = performance.now() - _elapsedTime;
    _timerInterval = requestAnimationFrame(UpdateTimer);
    UpdateTitle();
    _titleInterval = setInterval(UpdateTitle, 1000);
    _estado = true;
}

function UpdateTimer() {
    _elapsedTime = performance.now() - _startTime;
    cronometroEl.textContent = FormatTimer(_elapsedTime); // Exibe em segundos com 3 casas decimais
    _timerInterval = requestAnimationFrame(UpdateTimer);
}

// Nova função para atualizar o título
function UpdateTitle() {
    // Calcula o tempo decorrido REAL usando a hora atual e a hora de início
    let current_ms = performance.now() - _startTime;
    
    // Garante que o título não exiba lixo, usando _elapsedTime caso o timer não esteja ativo
    let timeToDisplay = _estado ? current_ms : _elapsedTime;

    tituloEl.textContent = `${FormatTimerTitle(timeToDisplay)} - Tap to Tool`; 
}

function StopTimer() {
    cancelAnimationFrame(_timerInterval);
    clearInterval(_titleInterval);
    _estado = false;
}

function ResetTimer() {
    if(_estado == true)
        ToggleTimer();
    clearInterval(_titleInterval);
    _elapsedTime = 0;
    cronometroEl.textContent = "00:00:00.00";
    tituloEl.textContent = `Cronometro Online - Tap to Tool`;
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
                tituloEl.textContent = `${FormatTimerTitle(_elapsedTime)} - Tap to Tool`;  
            }
            if (savedState.laps && savedState.laps.length > 0) {
                LoadLaps(savedState.laps); 
            }
            
            return true;
            
        } catch (e) {
            console.error("Erro ao carregar ou analisar o LocalStorage:", e);
        }
    }
    return false;
}