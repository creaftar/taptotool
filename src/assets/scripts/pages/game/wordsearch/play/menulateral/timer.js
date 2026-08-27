let startTime;
let timerInterval;
let elapsedTime = 0;

let timer = document.getElementById("timer");

let starttimer = document.getElementById("starttimer");
let stoptimer = document.getElementById("stoptimer");
let resettimer = document.getElementById("resettimer");
export let timerstamp = document.getElementById("timerstamp");
let clockIco = document.getElementById("clock");

starttimer.addEventListener('click', StartTimer);
stoptimer.addEventListener('click', StopTimer);
resettimer.addEventListener('click', ResetTimer);
clockIco.addEventListener('click', HiddeTimer);

export function FirstStartTimer(){
    elapsedTime = convertTimeToMilliseconds(timerstamp.textContent);
    startTime = performance.now() - elapsedTime;
    timerInterval = requestAnimationFrame(UpdateTimer);
}

export function StartTimer() {
    startTime = performance.now() - elapsedTime;
    timerInterval = requestAnimationFrame(UpdateTimer);
}

function UpdateTimer() {
    elapsedTime = performance.now() - startTime;
    timerstamp.textContent = FormatTimer(elapsedTime); // Exibe em segundos com 3 casas decimais
    timerInterval = requestAnimationFrame(UpdateTimer);
}

export function StopTimer() {
    cancelAnimationFrame(timerInterval);
}

function ResetTimer() {
    cancelAnimationFrame(timerInterval);
    elapsedTime = 0;
    timerstamp.textContent = "00:00:00";
/*.000*/
}

function FormatTimer(ms) {
    let milliseconds = Math.floor(ms % 1000);
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${Pad(hours)}:${Pad(minutes)}:${Pad(seconds)}`;
/*.${Pad(milliseconds, 3)}*/
}

function Pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

var click_clock = true;
export function HiddeTimer(){
    if(!click_clock){
        timer.style.left = "12px"; 
        timer.style.opacity = "1";
        click_clock = !click_clock;
    }
    else{
        timer.style.left = "0";
        timer.style.opacity = "0"; 
        click_clock = !click_clock;
    }
}

// Função para converter o texto do timer para milissegundos 
function convertTimeToMilliseconds(timeString) { 
    const parts = timeString.split(":").map(Number); 
    const hours = parts[0] || 0; const minutes = parts[1] || 0; 
    const seconds = parts[2] || 0; 
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000); 
} 