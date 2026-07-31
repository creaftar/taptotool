import { WheelRenderer } from "./renderer";
import { Pagina } from "./Pagina";

interface WheelState {
    currentRotation: number;
    isSpinning: boolean;
}

export class WheelInstance {
    private id: number;
    private _paginas: Pagina;
    private items: string[];
    private state: WheelState = { currentRotation: 0, isSpinning: false };
    public readonly element: HTMLElement;
    
    // Propriedades de áudio
    private audioCtx: AudioContext;
    private tickBuffer: AudioBuffer | null = null;
    
    private wheelDOM!: HTMLDivElement;
    private idleRequestId: number | null = null; // Para cancelar o giro infinito
    
    private marker!: HTMLElement;
    private iconMarker!: HTMLElement;
    private closeWheel!: HTMLElement;
    private onRemove: (id: number) => void;

    constructor(id: number, initialItems: string[], onRemove: (id: number) => void, pagina: Pagina) {
        this._paginas = pagina;
        this.id = id;
        this.items = [...initialItems];
        this.onRemove = onRemove;

        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.loadTickSound();

        this.element = this.createDOM();
        this.marker = this.element.querySelector('.marker') as HTMLElement;
        this.iconMarker = this.marker?.querySelector('i') as HTMLElement;
        this.closeWheel = this.element.querySelector('.fechar-roleta') as HTMLElement;

        console.log(this.closeWheel);

        this.startIdleAnimation();
    }

    private async loadTickSound() {
        try {
            const response = await fetch('/assets/audios/random/spinwheel/tickCortado.mp3'); 
            if (!response.ok) throw new Error("Áudio não encontrado.");
            const arrayBuffer = await response.arrayBuffer();
            this.tickBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        } catch (err) {
            console.error("Erro ao carregar áudio:", err);
        }
    }

    private createDOM(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'wheel-card';
        card.dataset.id = `${this.id}`; // Facilita encontrar/mudar via JS
        card.innerHTML = `
            <div class="fechar-roleta enabled"><i class="fa-solid fa-xmark"></i></div>
            <div class="wheel-container">
                <div class="marker"><i class="fa-solid fa-paper-plane"></i></div>
                <div class="wheel-canvas-target"></div>
            </div>
        `;
        this.wheelDOM = card.querySelector('.wheel-canvas-target') as HTMLDivElement;
        
        // Escuta o clique de fechar sem depender do ID na string da classe
        card.querySelector('.fechar-roleta')?.addEventListener("click", (evt) => {
            evt.preventDefault();
            if (this.state.isSpinning) return;
            this.onRemove(this.id); 
        });

        this.wheelDOM.addEventListener('click', () => this.spin());

        this._paginas.CriarPagina(this.id);
        return card;
    }

    // Método novo para reindexar ID e Paginação de forma limpa
    public updateId(newId: number): void {
        const oldId = this.id;
        this.id = newId;

        // 1. Atualiza o atributo no DOM do Card
        this.element.dataset.id = `${newId}`;

        // 2. Atualiza o elemento da Paginação
        this._paginas.UpdatePagina(oldId, newId);
    }

    public destroy(id: number): void {
        this.stopIdleAnimation();
        this._paginas.RemoverPagina(id); // Remove a página correta antes do destroy
        this.element.remove();
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            this.audioCtx.close();
        }
    }

    public async updateVisual(): Promise<void> {
        const carregarImagem = (url: string): Promise<HTMLImageElement | null> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => {
                    console.error("Não foi possível carregar a textura em:", url);
                    resolve(null);
                };
                img.src = url;
            });
        };

        const texture = await carregarImagem('/assets/textures/metal.png');
        const textureWheelDataUrl = WheelRenderer.generateTexture(this.items, texture as HTMLImageElement);
        this.wheelDOM.style.backgroundImage = `url(${textureWheelDataUrl})`;
    }

    private startIdleAnimation() {
        this.stopIdleAnimation();

        const segmentAngle = 360 / this.items.length;
        const colorOffset = 45;

        const rotate = () => {
            if (!this.state.isSpinning) {
                const lastRotation = this.state.currentRotation;
                
                this.state.currentRotation = (this.state.currentRotation + 0.2) % 360;
                this.wheelDOM.style.transform = `rotate(${this.state.currentRotation}deg)`;
                
                this.updateMarkerPhysics(this.state.currentRotation);

                const totalSegmentsPassedCurrent = Math.floor((this.state.currentRotation + colorOffset) / segmentAngle);
                const totalSegmentsPassedLast = Math.floor((lastRotation + colorOffset) / segmentAngle);

                if (totalSegmentsPassedCurrent !== totalSegmentsPassedLast) {
                    this.playTick(0.1); 
                }

                this.idleRequestId = requestAnimationFrame(rotate);
            }
        };
        
        this.idleRequestId = requestAnimationFrame(rotate);
    }
    
    public stopIdleAnimation() {
        if (this.idleRequestId !== null) {
            cancelAnimationFrame(this.idleRequestId);
            this.idleRequestId = null;
        }
    }

    private updateMarkerPhysics(rotation: number) {
        const segmentAngle = 360 / this.items.length;
        const colorOffset = 45;

        const normalizedRotation = (360 - ((rotation + colorOffset) % 360)) % 360;
        const safeIndex = Math.floor(normalizedRotation / segmentAngle) % this.items.length;
        
        // Atualização da cor
        this.marker.style.color = `hsl(${(safeIndex * 360) / this.items.length}, 70%, 50%)`;

        let relativePos = ((rotation + colorOffset) % segmentAngle) / segmentAngle;
        if (relativePos > 0.5) relativePos -= 1;

        const hitZone = 0.25;
        const iconRotation = 134;

        if (Math.abs(relativePos) < hitZone) {
            const normalizedHit = relativePos / hitZone;
            const swing = -30 * Math.cos(normalizedHit * (Math.PI / 2));
            
            if (this.iconMarker.style.transition !== "none") {
                this.iconMarker.style.transition = "none";
            }
            this.iconMarker.style.transform = `rotate(${iconRotation + swing}deg)`;
        } else {
            if (this.iconMarker.style.transition !== "transform 0.1s ease-out") {
                this.iconMarker.style.transition = "transform 0.1s ease-out";
            }
            this.iconMarker.style.transform = `rotate(${iconRotation}deg)`;
        }
    }

    public spin() {
        if (this.state.isSpinning) return;
        this.stopIdleAnimation();
        this.state.isSpinning = true;
        this.closeWheel.classList.add("disabled");
        this.closeWheel.classList.remove("enabled");
        
        const duration = 10000;
        const startTime = performance.now();
        const startRotation = this.state.currentRotation; 
        const segmentAngle = 360 / this.items.length;
        const totalRotationToGain = (12 * 360) + Math.floor(Math.random() * 360);
        const colorOffset = 45;

        let lastRotation = startRotation;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentRotation = startRotation + (totalRotationToGain * ease);
            
            this.wheelDOM.style.transform = `rotate(${currentRotation}deg)`;

            // CHAMA A FÍSICA CENTRALIZADA
            this.updateMarkerPhysics(currentRotation);

            // ÁUDIO (Mantemos aqui porque só toca no spin real)
            const totalSegmentsPassedCurrent = Math.floor((currentRotation + colorOffset) / segmentAngle);
            const totalSegmentsPassedLast = Math.floor((lastRotation + colorOffset) / segmentAngle);
            if (totalSegmentsPassedCurrent !== totalSegmentsPassedLast) {
                const velocity = Math.pow(1 - progress, 2);
                if (velocity > 0.005) this.playTick(velocity);
            }
            
            lastRotation = currentRotation;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.state.isSpinning = false;
                this.state.currentRotation = currentRotation % 360;
                
                this.closeWheel.classList.add("enabled");
                this.closeWheel.classList.remove("disabled");

                // Reset suave para o ângulo de repouso definido no seu CSS
                this.iconMarker.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                this.iconMarker.style.transform = `rotate(134deg)`; 

                this.dispatchResult();

                setTimeout(()=>{
                    this.startIdleAnimation();
                }, 10000);
            }
        };

        requestAnimationFrame(animate);
    }

    private playTick(velocity: number) {
        if (!this.tickBuffer) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.tickBuffer;
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.value = Math.max(0.02, 0.15 * velocity); 
        source.playbackRate.value = 0.8 + (0.4 * velocity); 
        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        source.start(0);
    }

    private dispatchResult(): void {
        const colorOffset = 45; 
        const totalItems = this.items.length;
        const segmentAngle = 360 / totalItems;
        const finalRotation = this.state.currentRotation;
        
        const normalizedRotation = (360 - ((finalRotation + colorOffset) % 360)) % 360;
        const winnerIndex = Math.floor(normalizedRotation / segmentAngle);
        const safeIndex = ((winnerIndex % totalItems) + totalItems) % totalItems;
        
        // --- LÓGICA DA COR REPLICADA DO RENDERER ---
        // Usamos a mesma fórmula: (index * 360) / total
        const hue = (safeIndex * 360) / totalItems;
        const winnerColor = `hsl(${hue}, 70%, 50%)`;
        
        const event = new CustomEvent('wheelFinished', { 
            detail: { 
                id: this.id, 
                winner: this.items[safeIndex],
                color: winnerColor
            } 
        });

        this.element.dispatchEvent(event);
    }

    public async updateItems(newItems: string[]): Promise<void> {
        this.items = [...newItems];
        await this.updateVisual();
    }
}