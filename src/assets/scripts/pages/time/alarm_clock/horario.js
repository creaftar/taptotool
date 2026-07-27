import { alarmes } from "./GerenciadorAlarmes.js";
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

function atualizarHoraLocal() {
    const agora = new Date(); 

    const horaLocal = timeFormatter.format(agora);

    if (relogioEl) {
        relogioEl.textContent = horaLocal;
    }
    alarmes.forEach((alarme) => {
        alarme.SetTempoFaltante();
        if (alarme.GetTempoFaltante() <= 0) {
            alarme.Disparar();
            titleTag.textContent = alarme.GetNome() + " - Tap to Tool";
            alarme.GetDiv().scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'center'});
        }
    });
}

export function StartRelogio() {
    atualizarHoraLocal();
    _timerInterval = setInterval(atualizarHoraLocal, 1000);
}