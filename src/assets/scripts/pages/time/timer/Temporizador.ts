    import { temporizadores, DeletarTemporizadorDoBanco, SalvarTemporizadorNoBanco } from "./GerenciadorTemporizadores.js";
    const container = document.getElementById('container-geracao-temporizadores');
    const traducao = JSON.parse(container?.dataset.i18n || '{}');

    export class Temporizador{    
        private _nome: string;
        private _horas: number;
        private _minutos: number;
        private _tempoDisparoMs: number;
        private static _contadortemporizador: number = 0;
        private static _qtdetemporizador: number = 0;
        private _posicao: number;
        private _id: number; // NOVO: ID de instância
        private agora: Date;
        private divEl: HTMLDivElement;
        private audio: HTMLAudioElement;
        private _looping: boolean;
        private _tocando: boolean;
        private _rodando: boolean;
        private _audioFile: File | Blob | null = null; // Guardará o binário do áudio
        private _audioName: string; // Nova propriedade
        private static placeholder: HTMLDivElement = Temporizador.CriarPlaceholder();
        private _restanteMs: number = 0;
        private _intervalo: number | null = null;
        private _vezesTocadas: number = 0;
        private readonly _limiteDeVezes: number = 5;

        constructor(dadosRecuperados?: any) {
            this._rodando = false;
            if(dadosRecuperados?.id && dadosRecuperados.id > Temporizador._contadortemporizador){
                Temporizador._contadortemporizador = dadosRecuperados?.id + 1;
            }
            else
                Temporizador._contadortemporizador++;
            this._posicao = Temporizador._qtdetemporizador;
            Temporizador._qtdetemporizador++;
            
            this._id = dadosRecuperados?.id ?? Temporizador._contadortemporizador;
            
            this._tempoDisparoMs = 0;
            this._nome = dadosRecuperados?.nome ?? traducao.default_timer_name;
            this._horas = 0;
            this._minutos = 0;

            this.agora = new Date();
            this.divEl = document.createElement("div");
            this.divEl.classList.add("square-Temporizador");
            this.divEl.id = `al-${this._id}`;
            
            this.SetHoras(dadosRecuperados?.horas ?? 0);
            this.SetMinutos(dadosRecuperados?.minutos ?? 5);
            this._looping = dadosRecuperados?.looping ?? true;

            this.SetTempoDisparo();
            
            const som = dadosRecuperados?.audioPath ?? '/assets/audios/time/alarm_clock/cuckoo.mp3';
            this.audio = new Audio(som);

            this._audioFile = dadosRecuperados?.audioFile ?? null;
            if (this._audioFile instanceof Blob) { 
                const urlSalva = URL.createObjectURL(this._audioFile);
                this.audio = new Audio(urlSalva);
            } else {
                const somPadrao = dadosRecuperados?.audioPath ?? '/assets/audios/time/alarm_clock/cuckoo.mp3';
                this.audio = new Audio(somPadrao);
            }
            this._audioName = dadosRecuperados?.audioName ?? null;
            this._tocando = false;

            this.SetColorLooping();
            this.Play();
        }

        public SetAudioFile(arquivo: File): void {
            this._audioFile = arquivo;
            if (this.audio.src.startsWith('blob:')) {
                URL.revokeObjectURL(this.audio.src);
            }
            this.audio.src = URL.createObjectURL(arquivo);
            this.audio.load(); // Carrega o novo buffer
            SalvarTemporizadorNoBanco(this);
        }

            
        public Disparar(): void {
            this._tocando = true;
            this._vezesTocadas = 1;

            this.audio.loop = false;
            this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--shadow), 0.3)";
            this.GetDiv().style.margin = "0px 32px 15px 0px";

            this.audio.onended = () => {
                // Adicionamos a verificação de this._rodando e this._tocando
                // Se o usuário pausou o temporizador, _rodando será false.
                if (this._rodando && this._tocando && this._looping && this._vezesTocadas < this._limiteDeVezes) {
                    this._vezesTocadas++;
                    this.audio.play().catch(e => console.warn("Erro ao repetir: ", e)); 
                } else {
                    this.Resetar();
                }
            };

            this.audio.play().catch(e => console.warn("Interrupção do áudio prevenida."));
        }

        /*public Parar(): void {
            this.LimparAudio();
            this._rodando = false;
            this._tocando = false; // Garante que o estado de toque parou

            // Para o contador de tempo
            if (this._intervalo) {
                clearInterval(this._intervalo);
                this._intervalo = null;
            }

            // Atualiza interface
            const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);
            if (tocarPausar) tocarPausar.innerHTML = `<i class="fa-solid fa-play"></i>`;
            
            this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--padrao), 0.1)";
            
            SalvarTemporizadorNoBanco(this);
        }*/

        // DENTRO DO SEU MÉTODO Play()
        public Play(): void {
            this.LimparAudio();
            this._rodando = true;
            this._tocando = false;

            // Se o tempo acabou, reseta para o valor original dos selects
            if (this._restanteMs <= 0) {
                this._restanteMs = (this._horas * 3600000) + (this._minutos * 60000);
            }

            // Define o momento exato no futuro em que deve despertar
            this._tempoDisparoMs = Date.now() + this._restanteMs;

            const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);
            if (tocarPausar) tocarPausar.innerHTML = `<i class="fa-solid fa-pause"></i>`;

            // REMOVIDO: O setInterval interno foi deletado daqui.
            // Apenas chamamos uma vez para atualizar o visual inicial.
            this.SetTempoFaltante();
        }

        // DENTRO DO SEU MÉTODO Parar()
        public Parar(): void {
            this.LimparAudio();
            this._rodando = false;
            this._tocando = false;

            this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--shadow), 0.1)";
            this.GetDiv().style.margin = "0 32px 6px 0";
            // Atualiza o _restanteMs para sabermos onde parou (pausa real)
            this._restanteMs = Math.max(0, this._tempoDisparoMs - Date.now());

            const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);
            if (tocarPausar) tocarPausar.innerHTML = `<i class="fa-solid fa-play"></i>`;
            
            this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--shadow), 0.1)";
            SalvarTemporizadorNoBanco(this);
        }
   
        public Resetar(): void {
            // 1. Para o contador de tempo
            if (this._intervalo) {
                clearInterval(this._intervalo);
                this._intervalo = null;
            }
            
            // 2. Para o som e remove os eventos de repetição
            this.LimparAudio();

            this._rodando = false;

            // 3. Recalcula o tempo original baseado no que está selecionado nos inputs
            this._restanteMs = (this._horas * 3600000) + (this._minutos * 60000);
            
            // 4. Atualiza a interface
            const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);
            if (tocarPausar) {
                tocarPausar.innerHTML = `<i class="fa-solid fa-play"></i>`;
            }

            // Remove sombras de alerta se houver
            this.divEl.style.boxShadow = "0px 0px 9px rgba(var(--shadow), 0.1)";
            
            // Força a atualização do texto (00:00:00) para o tempo inicial
            this.SetTempoFaltante(); 
            
            SalvarTemporizadorNoBanco(this);
        }

        private LimparAudio(): void {
            this.audio.onended = null; // Remove o link de repetição PRIMEIRO
            this._tocando = false;
            this._vezesTocadas = 0;
            this.audio.pause();
            this.audio.currentTime = 0;
            
            // Opcional: apenas use load() se precisar trocar o arquivo, 
            // caso contrário o pause() e currentTime = 0 já bastam.
            // this.audio.load(); 
        }

        public SetNome(nome: string){
            this._nome = nome;
            SalvarTemporizadorNoBanco(this);
        }
        public SetAudio(caminhoAudio: string){
            this.audio = new Audio(caminhoAudio);
            SalvarTemporizadorNoBanco(this);
        }

        public SetHoras(horas: number): void{
            this._horas = horas;
            this.SetTempoDisparo();
            SalvarTemporizadorNoBanco(this);
        }

        public SetMinutos(minutos: number): void{
            this._minutos = minutos;
            this.SetTempoDisparo();
            SalvarTemporizadorNoBanco(this);
        }

        public SetTempoDisparo(): void {
            // Calcula a duração total
            this._restanteMs = (this._horas * 3600000) + (this._minutos * 60000);
            
            if (this._rodando) {
                this._tempoDisparoMs = Date.now() + this._restanteMs;
            }
            
            // NOVO: Atualiza o visor visualmente assim que o tempo é definido
            this.SetTempoFaltante(); 
        }

        public SetTempoFaltante(): void {
            const tempoFaltanteEl = this.divEl.querySelector<HTMLElement>(`#tempo-faltante-${this._id}`);
            if (tempoFaltanteEl) {
                tempoFaltanteEl.textContent = this.GetTempoFaltanteFormatado();
            }
        }
        public GetId(): number {
            return this._id;
        }
        public GetTempoFaltante(): number {
            if (!this._rodando) {
                // Se pausado, retorna exatamente onde parou
                return this._restanteMs;
            }
            
            // Se rodando, calcula a diferença entre agora e o alvo final
            const calculo = this._tempoDisparoMs - Date.now();
            
            // Garante que não retorne números negativos no visor
            return Math.max(0, calculo);
        }

        public GetTempoDisparoMs(): number {
            return this._tempoDisparoMs;
        }

        public GetDiv(): HTMLDivElement {
            return this.divEl;
        }

        public GetNome(): string{
            return this._nome;
        }
        
        public ReagendarParaAmanha(): void {
            const UM_DIA_MS = 24 * 60 * 60 * 1000;
            this._tempoDisparoMs += UM_DIA_MS;
        }

        public GetTempoFaltanteFormatado(): string {
            
            let tempoMs = this.GetTempoFaltante(); 

            if (tempoMs <= 0) {
                return "00:00:00";
            }

            // Lógica de cálculo: horas, minutos, segundos e padStart
            const horas = Math.floor(tempoMs / (1000 * 60 * 60));
            tempoMs %= (1000 * 60 * 60);
            const minutos = Math.floor(tempoMs / (1000 * 60));
            tempoMs %= (1000 * 60);
            const segundos = Math.floor(tempoMs / 1000);

            const hDisplay = String(horas).padStart(2, '0');
            const mDisplay = String(minutos).padStart(2, '0');
            const sDisplay = String(segundos).padStart(2, '0');

            return `${hDisplay}:${mDisplay}:${sDisplay}`;
        }

        public CriarDiv(): HTMLDivElement {
            const idUnico = this._id;
            this.divEl.innerHTML = `
                    <div><i class="fa-solid fa-xmark x-sq" id="x-sq-${idUnico}" data-Temporizador-id="${idUnico}"></i></div>
                    <div class="titulo-Temporizador" contenteditable id="nome-Temporizador-${idUnico}">${this._nome}</div>
                    
                    <div class="container-horario-despertar">
                        <select class="horario-editavel" id="horas-${idUnico}">
                            ${this.gerarOpcoes(0, 23, this._horas)} 
                        </select>
                        :
                        <select class="horario-editavel" id="minutos-${idUnico}">
                            ${this.gerarOpcoes(0, 59, this._minutos)}
                        </select>
                    </div>

                    <div class="musica-escolhida">
                        <input type="file" id="inputAudio-${idUnico}" name="audioFile" accept="audio/*">
                        <label for="inputAudio-${idUnico}" class="custom-button">
                            ${this._audioName ? this._audioName : traducao.choose_audio}
                        </label>
                        <div class="opcoes-icones-temporizadores">
                            <div class="opcoes-icones" id="tocar-pausar-${idUnico}"><i class="fa-solid fa-pause"></i></div>
                            <div class="opcoes-icones" id="repetir-${idUnico}" class="repetir"><i class="fa-solid fa-rotate-left"></i></div>                        
                        </div>
                    </div>
                    <div class="tempo-faltante" id="tempo-faltante-${idUnico}">00:00</div>`;
        
            this.ConectarListeners();
            this.SetTempoFaltante();
        
            return this.divEl; 
        }
        public async Excluir(): Promise<void> {
            if (this.divEl && this.divEl.parentNode) {
                this.divEl.parentNode.removeChild(this.divEl);
                temporizadores.delete(this._id-1);
                
                // Importe essa função do Gerenciadortemporizadores.js
                await DeletarTemporizadorDoBanco(this._id); 
            }
        }
        
        private ConectarListeners(): void {
            if (!this.divEl) return; 
            
            const idUnico = this._id;
            
            const nometemporizador = this.divEl.querySelector<HTMLSelectElement>(`#nome-Temporizador-${idUnico}`);
            const selectHoras = this.divEl.querySelector<HTMLSelectElement>(`#horas-${idUnico}`);
            const selectMinutos = this.divEl.querySelector<HTMLSelectElement>(`#minutos-${idUnico}`);
            const botaoExcluir = this.divEl.querySelector<HTMLElement>(`.x-sq`);
            const inputAudio = this.divEl.querySelector<HTMLInputElement>(`#inputAudio-${idUnico}`);
            const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${idUnico}`);
            const repetir = this.divEl.querySelector<HTMLDivElement>(`#repetir-${idUnico}`);
            
            if(nometemporizador){
                nometemporizador.addEventListener('input', () =>{
                    this.SetNome(nometemporizador.textContent);
                });
                nometemporizador.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Impede a quebra de linha
                        nometemporizador.blur();  // Opcional: tira o foco ao apertar enter (como um input)
                    }
                });
                nometemporizador.addEventListener('paste', (e) => {
                    e.preventDefault();

                    // 1. Pega o texto simples da área de transferência
                    const text = e.clipboardData?.getData('text/plain') ?? "";

                    // 2. Remove quebras de linha e limpa o texto
                    const singleLineText = text.replace(/[\r\n]+/g, " ");

                    // 3. Obtém a seleção atual do usuário
                    const selection = window.getSelection();
                    if (!selection?.rangeCount) return;

                    // 4. Remove qualquer texto que esteja selecionado no momento
                    selection.deleteFromDocument();

                    // 5. Insere o novo texto na posição do cursor
                    selection.getRangeAt(0).insertNode(document.createTextNode(singleLineText));

                    // 6. Coloca o cursor após o texto inserido (opcional, mas recomendado)
                    selection.collapseToEnd();
                });
            }
            if (selectHoras) {
                selectHoras.addEventListener('change', (evento) => {
                    const novoValor = parseInt((evento.target as HTMLSelectElement).value);
                    this.SetHoras(novoValor);
                    this.SetTempoFaltante();
                });
            }
            
            if (selectMinutos) {
                selectMinutos.addEventListener('change', (evento) => {
                    const novoValor = parseInt((evento.target as HTMLSelectElement).value);
                    this.SetMinutos(novoValor);
                    this.SetTempoFaltante();
                });
            }

            if (botaoExcluir) {
                botaoExcluir.addEventListener('click', () => {
                    this.Excluir(); 
                });
            }

            if (inputAudio) {
                inputAudio.addEventListener('change', (evento) => {
                    const target = evento.target as HTMLInputElement;
                    
                    if (target.files && target.files[0]) {
                        const arquivo = target.files[0];
                        
                        // Chama o novo método que cuida do binário e do salvamento
                        this.SetAudioFile(arquivo);
                        
                        const label = this.divEl.querySelector(`label[for="inputAudio-${this._id}"]`);
                        if (label) label.textContent = arquivo.name;
                        this._audioName = arquivo.name; 
                    }
                });
            }

            if(tocarPausar){
                tocarPausar.addEventListener('click', () => {
                    if(this._rodando) {
                        this.Parar();
                    } else {
                        //this.SetTempoDisparo(); // Define o alvo apenas ao dar play
                        this.Play();   // Disparar(false) aqui apenas muda o ícone e estilo
                    }
                });
            }
            if(repetir){
                repetir.addEventListener("click", ()=>{
                    this._looping = !this._looping;
                    this.SetColorLooping();
                    SalvarTemporizadorNoBanco(this);
                });
            }
            
            const card = this.divEl;
            let offsetX = 0;
            let offsetY = 0;
            let ultimoX = 0;
            const containertemporizadores = document.getElementById('container-temporizadores');

            const impedirScrollNativo = (e: TouchEvent) => {
                // Se o card estiver com a classe 'arrastando', a gente mata o scroll
                if (card.classList.contains('arrastando')) {
                    if (e.cancelable) e.preventDefault();
                }
            };

            // Registra o evento no card com passive: false (obrigatório para o preventDefault funcionar)
            card.addEventListener('touchmove', impedirScrollNativo, { passive: false });

            const onPointerMove = (e: PointerEvent) => {
                if (e.cancelable) e.preventDefault(); // Impede o navegador de tentar ser "esperto"
                if (!card.classList.contains('arrastando')) return;

                // 1. Movimentação
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                card.style.left = `${x}px`;
                card.style.top = `${y}px`;

                // 2. Inclinação 3D (Seu efeito antigo)
                const deltaX = e.clientX - ultimoX;
                const inclinacao3D = Math.max(Math.min(deltaX * 1.2, 15), -15);
                card.style.transform = `perspective(3000px) rotateZ(${inclinacao3D}deg)`;
                ultimoX = e.clientX;

                // 3. Scroll Automático do Container
                if (container) {
                    const rectCont = container.getBoundingClientRect();
                    if (e.clientX > rectCont.right - 100) container.scrollLeft += 15;
                    else if (e.clientX < rectCont.left + 100) container.scrollLeft -= 15;
                }

                // 4. Lógica do Placeholder
                if (containertemporizadores) {
                    const outrosCards = [...containertemporizadores.querySelectorAll('.square-Temporizador:not(.arrastando)')] as HTMLElement[];
                    const proximoCard = outrosCards.find(cardAlvo => {
                        const box = cardAlvo.getBoundingClientRect();
                        return e.clientX < (box.left + box.width / 2);
                    });

                    if (proximoCard) containertemporizadores.insertBefore(Temporizador.placeholder, proximoCard);
                    else containertemporizadores.appendChild(Temporizador.placeholder);
                }
            };

            const onPointerUp = (e: PointerEvent) => {
                if (card.hasPointerCapture(e.pointerId)) {
                    card.releasePointerCapture(e.pointerId);
                }
                if (Temporizador.placeholder && Temporizador.placeholder.parentNode) {
                    Temporizador.placeholder.parentNode.insertBefore(card, Temporizador.placeholder);
                }
                container?.classList.remove('stop-scroll');
                Temporizador.placeholder.remove();
                card.classList.remove('arrastando');
                
                // Reset de estilos
                container?.classList.remove('stop-scroll');

                card.classList.remove('arrastando');
                card.style.cssText = '';
                card.style.touchAction = 'pan-x';  
                this.SetColorLooping(); // Garante que a cor do looping volte se o style.cssText limpou
                
                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
                document.documentElement.style.cursor = '';
                
                Temporizador.AtualizarOrdemGlobal();
            };

            let temporizadorPressao: number | null = null;
            let startX = 0;
            let startY = 0;

            card.addEventListener('pointerdown', (e: PointerEvent) => {
                    
                const target = e.target as HTMLElement;
                if (
                    target.isContentEditable || 
                    target.tagName === 'SELECT' || 
                    target.tagName === 'INPUT' || 
                    target.tagName === 'LABEL' || 
                    target.closest('.opcoes-icones') || 
                    target.closest(`#x-sq-${idUnico}`) ||
                    target.closest('.custom-button')
                ) {
                    return; // Sai e deixa o navegador processar o clique normal
                }
                startX = e.clientX;
                startY = e.clientY;
                const isTouch = e.pointerType === 'touch';
                const iniciarArrasto = () => {
                    const rect = card.getBoundingClientRect();
                    card.style.touchAction = 'none';
                    void card.offsetWidth;
                    card.classList.add('arrastando');
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    ultimoX = e.clientX;
                    card.style.left = `${rect.left}px`;
                    card.style.top = `${rect.top}px`;
                    card.style.width = `${rect.width}px`;
                    card.style.height = `${rect.height}px`;
                    card.style.zIndex = '3';

                    card.insertAdjacentElement('beforebegin', Temporizador.placeholder);
                    document.documentElement.style.cursor = 'grabbing';
                    
                    document.addEventListener('pointermove', onPointerMove);
                    document.addEventListener('pointerup', onPointerUp);
                    
                    if (isTouch && navigator.vibrate) navigator.vibrate(40);
                    
                };

                if (isTouch) {
                        temporizadorPressao = window.setTimeout(iniciarArrasto, 150);

                        // Se o usuário mover o dedo ANTES dos 150ms, 
                        // o navegador vai iniciar o scroll horizontal nativo.
                        // Nós cancelamos o nosso Temporizador para não bugar.
                        const cancelarSeForScroll = (moveEvent: PointerEvent) => {
                            const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
                            if (dist > 10) { // Se moveu 10px antes de dar o tempo de segurar
                                if (temporizadorPressao) {
                                    clearTimeout(temporizadorPressao);
                                    temporizadorPressao = null;
                                }
                                card.removeEventListener('pointermove', cancelarSeForScroll);
                            }
                        };
                        card.addEventListener('pointermove', cancelarSeForScroll);
                    } else {
                    const verificarMovimentoPC = (moveEvent: PointerEvent) => {
                        const dist = Math.sqrt(Math.pow(moveEvent.clientX - startX, 2) + Math.pow(moveEvent.clientY - startY, 2));
                        if (dist > 5) { // Se moveu mais de 5 pixels, é arrasto
                            iniciarArrasto();
                            card.removeEventListener('pointermove', verificarMovimentoPC);
                        }
                    };
                    card.addEventListener('pointermove', verificarMovimentoPC);
                    card.addEventListener('pointerup', () => card.removeEventListener('pointermove', verificarMovimentoPC), { once: true });
                }
            });
        }

        public static AtualizarOrdemGlobal(): void {
            const container = document.getElementById('container-temporizadores');
            if (!container) return;

            // 1. Pega todos os IDs dos cards na ordem em que aparecem na tela agora
            const cardsNoDom = [...container.querySelectorAll('.square-Temporizador')] as HTMLElement[];

            cardsNoDom.forEach((cardEl, index) => {
                // 2. Extrai o ID numérico do ID da Div (ex: "al-5" vira 5)
                const idtemporizador = parseInt(cardEl.id.replace('al-', ''));
                
                // 3. Encontra o objeto Temporizador correspondente na sua lista/map
                // (Aqui assumo que sua lista global se chama 'temporizadores')
                const temporizadorObj = [...temporizadores.values()].find(al => al.GetId() === idtemporizador);

                if (temporizadorObj) {
                    temporizadorObj.SetPosicao(index); // Atualiza a posição interna
                    SalvarTemporizadorNoBanco(temporizadorObj); // Salva a nova ordem no IndexedDB/Banco
                }
            });
        }

        public SetPosicao(index: number): void{
            this._posicao = index;
        }
        public GetPosicao(): number{
            return this._posicao;
        }
        public IsRodando(): boolean { return this._rodando; }
        public IsTocando(): boolean { return this._tocando; }

        private static CriarPlaceholder(): HTMLDivElement {
            const p = document.createElement('div');
            p.classList.add('placeholder-Temporizador');
            return p;
        }

        public SetColorLooping(): void{
            const repetir = this.divEl.querySelector<HTMLDivElement>(`#repetir-${this._id}`);
            if(repetir){
                if(!this._looping)
                    repetir.style.color = "red";
                else
                    repetir.style.color = "green";
            }
        }

        private gerarOpcoes(inicio: number, fim: number, valorSelecionado: number): string {
            let opcoes = '';
            for (let i = inicio; i <= fim; i++) {
                const valorFormatado = String(i).padStart(2, '0');
                // Se o número atual do loop for igual ao valor que o Temporizador já tem, adicionamos 'selected'
                const selecionado = i === valorSelecionado ? 'selected' : '';
                
                opcoes += `<option value="${i}" ${selecionado}>${valorFormatado}</option>`;
            }
            return opcoes;
        }
        
        public toObject() {
            return {
                id: this._id,
                nome: this._nome,
                horas: this._horas,
                minutos: this._minutos,
                looping: this._looping,
                audioName: this._audioName,
                posicao: this._posicao,
                audioFile: this._audioFile
            };
        }
    }