import { WheelInstance } from "./spin_wheel";
import { textoItens } from "./main";
import { Pagina } from "./Pagina";
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
    private _resultados: any[];

    private wheels: Map<number, WheelInstance> = new Map();
    private container: HTMLElement;
    private qtdeWheels: number;
    private wheelsFinished: number;

    private _paginas: Pagina;

    constructor(containerId: HTMLElement) {
        this._confeteSfx = new Audio('/assets/audios/random/spinwheel/confete-sfx.mp3');
        this._tabuaSfx = new Audio('/assets/audios/random/spinwheel/tabua.mp3');
        this._aplausosSfx = new Audio('/assets/audios/random/spinwheel/aplausos.mp3');
        this.container = containerId || document.body;
        this.qtdeWheels = 0;
        this.wheelsFinished = 0;
        this._lastWinner = "";
        this._resultados = [];
        this._paginas = new Pagina(0);
    }

    public createWheel(items: string[]): WheelInstance {
        const wheel = this.addWheel(items);
        wheel.element.classList.add("first-roullete");
        this.container.appendChild(wheel.element);

        return wheel;
    }

    public addWheel(items: string[]): WheelInstance {
        const id = this.wheels.size;
        const newWheel = new WheelInstance(
            id, 
            items, 
            (targetId) => this.removeWheel(targetId), 
            this._paginas
        );
        this.qtdeWheels++;

        newWheel.element.addEventListener('wheelFinished', (e: any) => {
            this.VerificarResultado(e);
        });
        
        newWheel.updateItems(items);
        this.wheels.set(id, newWheel);
        this._paginas.SetPaginaAtual(id);

        return newWheel;
    }

    public spinAll(): void {
        this.wheelsFinished = 0;
        this.wheels.forEach((wheel) => {
            wheel.spin();
        });
    }

    public removeWheel(id: number): void {
        const wheel = this.wheels.get(id);
        if (wheel) {
            wheel.destroy(id); // Remove do DOM e fecha áudio
            this.wheels.delete(id);
            
            // 🔄 Reorganiza os IDs das roletas que sobraram
            this.reindexWheels();
            
            this.qtdeWheels = this.wheels.size;
        }
    }

    private reindexWheels(): void {
        const remainingWheels = Array.from(this.wheels.values());
        this.wheels.clear(); // Limpa o mapa atual

        remainingWheels.forEach((wheel, newIndex) => {
            // Atualiza o ID interno da roleta e o DOM correspondente
            wheel.updateId(newIndex);
            
            // Reinsere no Map com a chave/index correto
            this.wheels.set(newIndex, wheel);
        });
    }

    public updateFirstWheel(items: string[]): void {
        const firstWheel = this.updateCurrentWheel(items);
        firstWheel.element.classList.add("roleta-principal");
        firstWheel.element.addEventListener('click', () => this.spinAll());
    }

    public updateCurrentWheel(items: string[], armazenar = true): WheelInstance {
        const wheel = this.wheels.get(this._paginas.GetPaginaAtual());
        if (wheel) {
            wheel.updateItems(items);
            this._paginas.ArmazenarTexto(this._paginas.GetPaginaAtual(), items, armazenar);
        } else {
            return this.createWheel(items);
        }

        return wheel;
    }

    public VerificarResultado(e: any): void{
        this.wheelsFinished++;
        this._resultados.push(e);
        if(this.qtdeWheels == this.wheelsFinished){
            this.wheelsFinished = 0;
            this._aplausosSfx.play();
            this._confeteSfx.play();
            this._tabuaSfx.play();
            this.lancarConfete();
            this.ExibirVencedor(this._resultados);
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

    private onRemoveClick = () => {
        this.RemoverVencedor(this._resultados);
        this._resultados = [];
    };
    
    private ExibirVencedor(resultados: any) {   
        resultados.forEach((e: any) => {
            this._lastWinner = e.detail.winner;
            bannerWinnerEl!.style.backgroundColor = `${e.detail.color}`; 
            textWinnerEl!.textContent += `${e.detail.winner}\n`;
        });
        containerWinnerEl!.style.visibility = "visible";
        containerWinnerEl!.style.opacity = "1";
        bgWinnerEl!.style.visibility = "visible";
        bgWinnerEl!.style.opacity = "1";
        fecharWinnerEl!.addEventListener('click', this.FecharVencedor);
        bgWinnerEl!.addEventListener('click', this.FecharVencedor);
        removeWinnerEl!.addEventListener('click', this.onRemoveClick);
    }

    private RemoverVencedor(resultados: any[]) {
    // 1. Processa a remoção de CADA roleta com o SEU RESPECTIVO vencedor
    resultados.forEach((e: any) => {
        const idRoleta = e.detail.id;          // ID único da roleta
        const vencedorDestaRoleta = e.detail.winner; // Vencedor ESPECÍFICO desta roleta

        // Remove APENAS o vencedor desta roleta no array de textos dela
        const textosRestantes = this._paginas.RemoverVencedor(idRoleta, vencedorDestaRoleta);

        // Atualiza a roleta específica
        this._paginas.SetPaginaAtual(idRoleta);
        if (textosRestantes && textosRestantes.length > 0) {
            this.updateCurrentWheel(textosRestantes);
        } else {
            this.updateCurrentWheel(textoItens);
        }
    });

    this.FecharVencedor();
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
        removeWinnerEl!.removeEventListener('click', this.onRemoveClick);
    }
}