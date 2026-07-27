const STORAGE_KEY = "stopwatch";

import { _startTime, _elapsedTime, _estado } from "./stopwatch.js";
import { squares } from "./cartao_volta.js";

// Função para salvar o tempo
function SaveTimer() {
    // Certifica-se de que o estado atual seja salvo
    let timeToSave = _elapsedTime;
    
    // Se o cronômetro estiver rodando, calculamos o tempo atualizado
    if (_estado) {
        timeToSave = performance.now() - _startTime;
    }

    const state = {
        elapsedTime: timeToSave,
        // Assumindo que você tem uma função GetLaps que retorna o array de voltas
        laps: squares ? squares : [] 
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

window.addEventListener("beforeunload", SaveTimer); 