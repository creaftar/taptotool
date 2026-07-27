import { WheelRenderer } from "./renderer";

interface WheelState {
    currentRotation: number;
    isSpinning: boolean;
}

export class WheelInstance {
    public readonly id: string;
    private items: string[];
    private state: WheelState = { currentRotation: 0, isSpinning: false };
    public readonly element: HTMLElement;
    private lastFrameEscaped: boolean = false;
    
    // Propriedades de áudio
    private audioCtx: AudioContext;
    private tickBuffer: AudioBuffer | null = null;
    
    private wheelDOM!: HTMLDivElement;
    private idleRequestId: number | null = null; // Para cancelar o giro infinito

    constructor(id: string, initialItems: string[]) {
        this.id = id;
        this.items = [...initialItems];
        
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.loadTickSound();

        this.element = this.createDOM();
        
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
        card.innerHTML = `
            <div class="wheel-container">
                <div class="marker"><i class="fa-solid fa-paper-plane"></i></div>
                <div class="wheel-canvas-target"></div>
            </div>
        `;
        this.wheelDOM = card.querySelector('.wheel-canvas-target') as HTMLDivElement;
        this.wheelDOM.addEventListener('click', () => this.spin());
        return card;
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

        // 2. Aguarda a textura
        const texture = await carregarImagem('/assets/textures/metal.png');

        // 3. Gera a imagem da roleta (o disco colorido com a textura)
        // O Renderer cospe uma string gigante (DataURL) que representa a imagem final
        const textureWheelDataUrl = WheelRenderer.generateTexture(this.items, texture as HTMLImageElement);

        // 4. Aplica o DataURL no DOM
        this.wheelDOM.style.backgroundImage = `url(${textureWheelDataUrl})`;
    }

        
    private startIdleAnimation() {
        this.stopIdleAnimation();

        const segmentAngle = 360 / this.items.length;
        const colorOffset = 45;

        const rotate = () => {
            if (!this.state.isSpinning) {
                // Guardamos a rotação anterior para comparar a passagem do pino
                const lastRotation = this.state.currentRotation;
                
                // Incremento da rotação (velocidade do idle)
                this.state.currentRotation = (this.state.currentRotation + 0.2) % 360;
                this.wheelDOM.style.transform = `rotate(${this.state.currentRotation}deg)`;
                
                // 1. Atualiza Cor e Movimento da Seta
                this.updateMarkerPhysics(this.state.currentRotation);

                // 2. GATILHO DO "TICK" NO IDLE
                // Calculamos se cruzou a linha de um segmento entre o frame passado e o atual
                const totalSegmentsPassedCurrent = Math.floor((this.state.currentRotation + colorOffset) / segmentAngle);
                const totalSegmentsPassedLast = Math.floor((lastRotation + colorOffset) / segmentAngle);

                if (totalSegmentsPassedCurrent !== totalSegmentsPassedLast) {
                    // No idle, a velocidade é constante e baixa (usamos 0.1 como valor fixo)
                    // Isso garante um som suave e grave, sem estourar o áudio
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
    const marker = this.element.querySelector('.marker') as HTMLElement;
    const iconMarker = marker.querySelector('i')!;
    const segmentAngle = 360 / this.items.length;
    const colorOffset = 45; // Alinhado com seu CSS

    // 1. Atualiza a Cor do marcador baseado no segmento atual
    const normalizedRotation = (360 - ((rotation + colorOffset) % 360)) % 360;
    const safeIndex = Math.floor(normalizedRotation / segmentAngle) % this.items.length;
    marker.style.color = `hsl(${(safeIndex * 360) / this.items.length}, 70%, 50%)`;

    // 2. Física do Movimento (O "balanço" da seta)
    let relativePos = ((rotation + colorOffset) % segmentAngle) / segmentAngle;
    if (relativePos > 0.5) relativePos -= 1;

    const hitZone = 0.25;
    let iconRotation = 134; // O ângulo base que você definiu no CSS (.marker > i)

    if (Math.abs(relativePos) < hitZone) {
        const normalizedHit = relativePos / hitZone;
        // Adiciona um deslocamento de até 30 graus no impacto
        const swing = -30 * Math.cos(normalizedHit * (Math.PI / 2));
        iconMarker.style.transform = `rotate(${iconRotation + swing}deg)`;
        iconMarker.style.transition = "none";
    } else {
        // Volta suavemente para o ângulo base de 134deg
        iconMarker.style.transform = `rotate(${iconRotation}deg)`;
        iconMarker.style.transition = "transform 0.1s ease-out";
    }
}

    public spin() {
        if (this.state.isSpinning) return;
        this.stopIdleAnimation();
        this.state.isSpinning = true;
        
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

                const marker = this.element.querySelector('.marker') as HTMLElement;
                const iconMarker = marker.querySelector('i')!;

                // Reset suave para o ângulo de repouso definido no seu CSS
                iconMarker.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                iconMarker.style.transform = `rotate(134deg)`; 

                this.dispatchResult();
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
                color: winnerColor // Agora a cor vai aqui!
            } 
        });

        this.element.dispatchEvent(event);
    }

    public async updateItems(newItems: string[]): Promise<void> {
        this.items = [...newItems];
        await this.updateVisual(); // Isso gera o novo DataURL e aplica ao background
    }
}