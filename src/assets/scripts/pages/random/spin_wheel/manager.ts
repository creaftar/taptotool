import { WheelInstance } from "./spin_wheel";
import { FirstUpdateRoleta } from "./main";
import confetti from 'canvas-confetti';

let containerWinnerEl = document.getElementById('container-winner');
let textWinnerEl = document.getElementById('text-winner');
let bannerWinnerEl = document.getElementById('banner-winner');
let fecharWinnerEl = document.getElementById('fechar-winner');
let removeWinnerEl = document.getElementById('remove-winner');
let bgWinnerEl = document.getElementById('background-winner');

let textTipEl = document.getElementById('textTip');

export class WheelManager {
    private _confeteSfx: HTMLAudioElement;
    private _tabuaSfx: HTMLAudioElement;
    private _aplausosSfx: HTMLAudioElement;
    private _lastWinner: string;

    private wheels: Map<string, WheelInstance> = new Map();
    private container: HTMLElement;
    private qtdeWheels: number;
    private wheelsFinished: number;

    constructor(containerId: HTMLElement) {
        this._confeteSfx = new Audio('/assets/audios/random/spinwheel/confete-sfx.mp3');
        this._tabuaSfx = new Audio('/assets/audios/random/spinwheel/tabua.mp3');
        this._aplausosSfx = new Audio('/assets/audios/random/spinwheel/aplausos.mp3');
        this.container = containerId || document.body;
        this.qtdeWheels = 0;
        this.wheelsFinished = 0;
        this._lastWinner = "";
    }

    public createWheel(items: string[]): void {
        const id = crypto.randomUUID();
        const wheel = new WheelInstance(id, items);
        this.qtdeWheels++;
        
        wheel.element.addEventListener('wheelFinished', (e: any) => {
            this.VerificarResultado(e);
        });

        this.wheels.set(id, wheel);
        this.container.appendChild(wheel.element);
    }

    public spinAll(): void {
        this.wheels.forEach(wheel => wheel.spin());
    }

    public removeWheel(id: string): void {
        const wheel = this.wheels.get(id);
        if (wheel) {
            wheel.element.remove();
            this.wheels.delete(id);
        }
    }
    public updateFirstWheel(items: string[]): void {
        // Pega a primeira roleta do Map (já que você parece ter apenas uma área de texto)
        const firstWheel = this.wheels.values().next().value;
        if (firstWheel) {
            firstWheel.updateItems(items);
        } else {
            // Se não houver roleta ainda, cria a primeira
            this.createWheel(items);
        }
    }

    public VerificarResultado(e: any): void{
        this.wheelsFinished++;
        if(this.qtdeWheels == this.wheelsFinished){
            this.wheelsFinished = 0;
            this._aplausosSfx.play();
            this._confeteSfx.play();
            this._tabuaSfx.play();
            this.lancarConfete();
            this.ExibirVencedor(e);
        }
    }

    
    private lancarConfete() {
        const duracao = 3 * 1000; // 3 segundos
        const fim = Date.now() + duracao;

        const frame = () => {
            // Lança confetes da esquerda
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
                zIndex: 10000
            });
            // Lança confetes da direita
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#ff00ff', '#00ffff', '#ffa500', '#ff0000'],
                zIndex: 10000
            });

            if (Date.now() < fim) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }

    private ExibirVencedor(e: any) {
        this._lastWinner = e.detail.winner;
        bannerWinnerEl!.style.backgroundColor = `${e.detail.color}`; 
        textWinnerEl!.textContent += `${e.detail.winner}\n`;
        containerWinnerEl!.style.visibility = "visible";
        containerWinnerEl!.style.opacity = "1";
        bgWinnerEl!.style.visibility = "visible";
        bgWinnerEl!.style.opacity = "1";
        fecharWinnerEl!.addEventListener('click', this.FecharVencedor);
        bgWinnerEl!.addEventListener('click', this.FecharVencedor);
        removeWinnerEl!.addEventListener('click', this.RemoverVencedor);
    }
   
    private FecharVencedor = () => {
        bgWinnerEl!.style.visibility = "hidden";
        bgWinnerEl!.style.opacity = "0";
        containerWinnerEl!.style.visibility = "hidden";
        containerWinnerEl!.style.opacity = "0";
        bannerWinnerEl!.style.backgroundColor = "var(--fundo-card)"; 
        textWinnerEl!.textContent = "";
        fecharWinnerEl!.removeEventListener('click', this.FecharVencedor);
        bgWinnerEl!.removeEventListener('click', this.FecharVencedor);
        removeWinnerEl!.removeEventListener('click', this.RemoverVencedor);
    }

    private RemoverVencedor = () => {
        if (textTipEl instanceof HTMLTextAreaElement && this._lastWinner) {
            if (textTipEl.value === ""){
                    this.FecharVencedor();
                    return;
                };
            // 1. Limpa o nome do vencedor de espaços extras
            const winnerClean = this._lastWinner.trim();

            // 2. Divide as linhas e já remove espaços em branco de cada uma
            const lines = textTipEl.value.split('\n').map(line => line.trim());
            
            // 3. Procura o índice (agora ambos estão "limpos")
            const index = lines.indexOf(winnerClean);
            
            if (index > -1) {
                lines.splice(index, 1);
                
                // 4. Filtra linhas vazias para evitar buracos na roleta
                const finalLines = lines.filter(line => line !== "");

                // 5. Atualiza o textarea e a roleta
                textTipEl.value = finalLines.join('\n');
                this.updateFirstWheel(finalLines);
            }
            if (textTipEl.value === ""){
                FirstUpdateRoleta();
            };
        }
        this.FecharVencedor();
    }
}