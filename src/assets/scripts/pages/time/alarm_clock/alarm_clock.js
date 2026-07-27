import('./data.js');
import { GerarAlarmesSalvos } from './GerenciadorAlarmes.js';
import { StartRelogio } from './horario.js';

StartRelogio();

const FATOR_DE_ACELERACAO = 2.5;
const containerScrollHorizontal = document.getElementById('container-geracao-alarmes');

if (containerScrollHorizontal) {
    containerScrollHorizontal.addEventListener('wheel', (evento) => {
        evento.preventDefault(); 
        containerScrollHorizontal.scrollTo({
            left: containerScrollHorizontal.scrollLeft + (evento.deltaY * FATOR_DE_ACELERACAO),
            behavior: 'smooth' 
        });
    });
}

await GerarAlarmesSalvos();