const volumeSlider = document.getElementById('volume-slider');
export const somDigitar = document.getElementById('typing-sound');
export const somDeletar = document.getElementById('delete-sound');
export const somAcerto = document.getElementById('correct-sound');
export const somErro = document.getElementById('wrong-sound');
export const somVitoria = document.getElementById('win-sound');

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

//caracteresDigitados = (Array.isArray(caracteresDigitados) && caracteresDigitados.length === 0) ? 0 : ;
AjustarVolume(); 

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

function AjustarVolume(){
    //somErro.load();
    var vol = localStorage.getItem("volume");
    if(vol != null){
        vol = vol.replace(/"/g, ''); // Remove as aspas
        vol = parseFloat(vol);
        volumeSlider.value = vol;
        somDigitar.volume = vol;
        somDeletar.volume = vol;
        somAcerto.volume = vol;
        somErro.volume = vol;
        somVitoria.volume = vol;
    }
    else{
        volumeSlider.value = 0.7;
        somDigitar.volume = 0.7;
        somDeletar.volume = 0.7;
        somAcerto.volume = 0.7;
        somErro.volume = 0.7;
        somVitoria.volume = 0.7;        
    }
    volumeSlider.addEventListener('input', function() {
        // Atualize o volume do áudio com base no valor do slider (entre 0 e 1)
        somDigitar.volume = volumeSlider.value;
        somDeletar.volume = volumeSlider.value;
        somAcerto.volume = volumeSlider.value;
        somErro.volume = volumeSlider.value;
        somVitoria.volume = volumeSlider.value;
    
        localStorage.setItem('volume', JSON.stringify(volumeSlider.value));
    });
}

import { qtdePalavras } from "./preload.js";
import { zoomIn, zoomOut  } from "./redimensionar_jogar.js";
let zoomAdd = document.getElementById('zoomadd');
let zoomRmv = document.getElementById('zoomrmv');

if(!zoomAdd.haszoomIn){
    zoomAdd.addEventListener('click', zoomIn);
    zoomAdd.haszoomIn = true;
}
if(!zoomRmv.zoomOut){
    zoomRmv.addEventListener('click', zoomOut);
    zoomRmv.haszoomOut = true;
}


let gabaritoEl = document.getElementById("gabarito");
var revelarEl = document.getElementById("revelar");

gabaritoEl.addEventListener('click', ExibirGabarito);
export var respostasExibidas = false;
let gridModule = null;
let areaModule = null;
var grid;
var ocultar = false;

export function AtualizarDisplay(gbrt, dica){
    if(gbrt === false){
        gabaritoEl.style.display = 'none';
    }
    if(dica === false){    
	    revelarEl.style.display = 'none';
    }
}

async function ExibirGabarito(){
    respostasExibidas = true;
    
    if(ocultar){
        OcultarGabarito();
        return;
    }
    
	const { bauPALAVRAS } = await import("./preload.js");

				
	requestAnimationFrame(() => {
        for(var i = 0; i < qtdePalavras; i++){
            for(var j = 0; j < bauPALAVRAS[i].letras.length; j++){
                bauPALAVRAS[i].letras[j].placeholder.textContent = bauPALAVRAS[i].letras[j].texto; 
            }
        }
	});
    ocultar = true;
}

async function OcultarGabarito(){
	const { bauPALAVRAS } = await import("./preload.js");
    requestAnimationFrame(() => {
        for(var i = 0; i < qtdePalavras; i++){
            for(var j = 0; j < bauPALAVRAS[i].letras.length; j++){
                bauPALAVRAS[i].letras[j].placeholder.textContent = ' '; 
            }
        }
	});
    ocultar = false;
}

let impressoraEl = document.getElementById("impressora");
impressoraEl.addEventListener('click', ImprimirCruzadinha);

async function ImprimirCruzadinha(){
    window.print();
}

export function SetupMenuEvents() {
    const liiconsEl = document.querySelectorAll('.menu-icones li');

    liiconsEl.forEach(li => {
        li.addEventListener('mouseover', function() {
            const icons_mensagemEl = this.querySelector('.info-icons');
            if (icons_mensagemEl) {
                icons_mensagemEl.style.display = 'flex';
            }
        });

        li.addEventListener('mouseout', function() {
            const icons_mensagemEl = this.querySelector('.info-icons');
            if (icons_mensagemEl) {
                icons_mensagemEl.style.display = 'none';
            }
        });
    });

    // 2. Gerencia a visibilidade da lista absoluta (Menu Dropdown)
    const liabsEl = document.getElementById("lista-absoluta");
    const divrelatEl = document.getElementById("div-relativa");

    if (liabsEl && divrelatEl) {
        liabsEl.addEventListener('mouseover', () => {
            divrelatEl.style.visibility = 'visible';
        });

        liabsEl.addEventListener('mouseout', () => {
            divrelatEl.style.visibility = 'hidden';
        });
    }
}