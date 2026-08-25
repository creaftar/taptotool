import { alarmes, DeletarAlarmeDoBanco, SalvarAlarmeNoBanco } from "./GerenciadorAlarmes.js";
import { AlternarVisibilidade } from "../../../utility/config/el_visibilidade.js";
const container = document.getElementById('container-geracao-alarmes');
const traducao = JSON.parse(container?.dataset.i18n || '{}');

export class Alarme{    
    private _nome: string;
    private _horas: number;
    private _minutos: number;
    private _tempoDisparoMs: number;
    private static _contadorAlarme: number = 0;
    private static _qtdeAlarme: number = 0;
    private _posicao: number;
    private _id: number; // NOVO: ID de instância
    private agora: Date;
    private divEl: HTMLDivElement;
    private audio: HTMLAudioElement;
    private _looping: boolean;
    private _tocando: boolean;
    private _audioFile: File | Blob | null = null; // Guardará o binário do áudio
    private _audioName: string; // Nova propriedade
    private static placeholder: HTMLDivElement = Alarme.CriarPlaceholder();
    
    constructor(dadosRecuperados?: any) {
        if(dadosRecuperados?.id && dadosRecuperados.id > Alarme._contadorAlarme){
            Alarme._contadorAlarme = dadosRecuperados?.id + 1;
        }
        else
            Alarme._contadorAlarme++;
        this._posicao = Alarme._qtdeAlarme;
        Alarme._qtdeAlarme++;
        
        this._id = dadosRecuperados?.id ?? Alarme._contadorAlarme;
        
        this._tempoDisparoMs = 0;
        this._nome = dadosRecuperados?.nome ?? traducao.default_alarm_name;
        this.agora = new Date();
        this._horas = dadosRecuperados?.horas ?? (this.agora.getHours() + 1) % 24;
        this._minutos = dadosRecuperados?.minutos ?? this.agora.getMinutes();
        
        this._looping = dadosRecuperados?.looping ?? true;

        this.SetTempoDisparo();
        this.divEl = document.createElement("div");
        this.divEl.classList.add("square-alarme");
        this.divEl.id = `al-${this._id}`;
        
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
    }

    public SetAudioFile(arquivo: File): void {
        this._audioFile = arquivo;
        // Revoga a URL antiga para não vazar memória
        if (this.audio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.audio.src);
        }
        this.audio.src = URL.createObjectURL(arquivo);
        SalvarAlarmeNoBanco(this);
    }

        
    public Disparar(deuOHorario = true): void {
        this._tocando = true;
        const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);

        if(tocarPausar){
            tocarPausar.innerHTML = `<i class="fa-solid fa-pause"></i>`;         
        }

        let vezesTocadas = 1;
        let limiteDeVezes = 5;

        this.audio.loop = false;
        
        this.audio.play();
        if(deuOHorario){
            this.ReagendarParaAmanha();
            this.SetTempoFaltante(); // Atualiza a contagem regressiva imediatamente
        }
        this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--padrao), 0.3)";
        this.GetDiv().style.margin = "0px 32px 15px 0px";

        const verificarFim = () => {
            if (this._looping && vezesTocadas < limiteDeVezes) {
                vezesTocadas++;
                this.audio.play(); 
            } else {
                // Se atingiu o limite ou o usuário não quer loop
                this.Parar();
                this.audio.removeEventListener('ended', verificarFim);
            }
        };

        this.audio.addEventListener('ended', verificarFim);
    }

    public Parar(): void{
        this._tocando = false;
        const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${this._id}`);

        if(tocarPausar){
            tocarPausar.innerHTML = `<i class="fa-solid fa-play"></i>`;         
        }
        
        this.GetDiv().style.boxShadow = "0px 0px 9px rgba(var(--padrao), 0.1)";
        this.GetDiv().style.margin = "0 32px 6px 0";
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    public SetNome(nome: string){
        this._nome = nome;
        SalvarAlarmeNoBanco(this);
    }
    public SetAudio(caminhoAudio: string){
        this.audio = new Audio(caminhoAudio);
        SalvarAlarmeNoBanco(this);
    }

    public SetHoras(horas: number): void{
        this._horas = horas;
        this.SetTempoDisparo();
        SalvarAlarmeNoBanco(this);
    }

    public SetMinutos(minutos: number): void{
        this._minutos = minutos;
        this.SetTempoDisparo();
        SalvarAlarmeNoBanco(this);
    }

    public SetTempoDisparo(): void {
        
        const horarioAlarme = new Date(
            this.agora.getFullYear(), 
            this.agora.getMonth(), 
            this.agora.getDate(),
            this._horas,
            this._minutos,   
            0, 0 
        );

        if (horarioAlarme.getTime() <= this.agora.getTime()) {
            horarioAlarme.setDate(horarioAlarme.getDate() + 1);
        }

        this._tempoDisparoMs = horarioAlarme.getTime();
    }

    public SetTempoFaltante(): void{
        const tempoFaltante = this.divEl.querySelector<HTMLSelectElement>(`#tempo-faltante-${this._id}`);
        if (tempoFaltante) 
            tempoFaltante.textContent = this.GetTempoFaltanteFormatado();
    }
    public GetId(): number {
        return this._id;
    }
    public GetTempoFaltante(): number {
        return this._tempoDisparoMs - new Date().getTime();
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
                <div><i class="fa-solid fa-xmark x-sq" id="x-sq-${idUnico}" data-alarm-id="${idUnico}"></i></div>
                <div class="titulo-alarme" contenteditable id="nome-alarme-${idUnico}">${this._nome}</div>
                <div class="container-horario-despertar">
                    <div class="horario-editavel" id="horas-${idUnico}">
                        ${String(this._horas).padStart(2, '0')}
                        <ul class="lista-opcoes elemento-invisivel">
                            ${this.gerarOpcoes(0, 23, this._horas)} 
                        </ul>
                    </div>
                    :
                    <div class="horario-editavel" id="minutos-${idUnico}">
                        ${String(this._minutos).padStart(2, '0')}
                        <ul class="lista-opcoes elemento-invisivel">
                            ${this.gerarOpcoes(0, 59, this._minutos)}
                        </ul>
                    </div>
                </div>

                <div class="musica-escolhida">
                    <input type="file" id="inputAudio-${idUnico}" name="audioFile" accept="audio/*">
                    <label for="inputAudio-${idUnico}" class="custom-button">
                        ${this._audioName ? this._audioName : traducao.choose_audio}
                    </label>
                    <div class="opcoes-icones-alarmes">
                        <div class="opcoes-icones" id="tocar-pausar-${idUnico}"><i class="fa-solid fa-play"></i></div>
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
            alarmes.delete(this._id-1);
            
            //Alarme._contadorAlarme--;
            await DeletarAlarmeDoBanco(this._id); 
        }
    }
    
    private ConectarListeners(): void {
        if (!this.divEl) return; 
        
        const idUnico = this._id;
        const listasContainer = this.divEl.querySelectorAll('.horario-editavel');
        const listas = this.divEl.querySelectorAll('.lista-opcoes');

        listas.forEach((lista) => {
            
            ['mousedown', 'touchstart', 'wheel'].forEach(evento => {
                lista.addEventListener(evento, (e) => e.stopPropagation());
            });

            lista.addEventListener("click", (e) => {
                e.stopPropagation();
                
                const alvo = e.target as HTMLElement;

                if (alvo.tagName === 'LI') {
                    const novoValor = parseInt(alvo.getAttribute('data-value') || alvo.textContent || '0', 10);
                    const paiHorario = lista.parentElement as HTMLElement;
                    const isHoras = paiHorario?.id.startsWith('horas-');

                    paiHorario.childNodes[0].nodeValue = String(novoValor).padStart(2, '0');
                    isHoras ? this.SetHoras(novoValor) : this.SetMinutos(novoValor);
                    this.SetTempoFaltante();
                    AlternarVisibilidade(lista as HTMLBodyElement);
                }
            });
        });

        // Clique no container do horário para abrir/fechar o menu dropdown
        listasContainer.forEach((container) => {
            container.addEventListener("click", (e) => {
                const listaInterna = container.querySelector(".lista-opcoes") as HTMLElement;
                if (listaInterna) {
                    AlternarVisibilidade(listaInterna as HTMLBodyElement);
                }
            });
        });
        
        const nomeAlarme = this.divEl.querySelector<HTMLSelectElement>(`#nome-alarme-${idUnico}`);
        const selectHoras = this.divEl.querySelector<HTMLSelectElement>(`#horas-${idUnico}`);
        const selectMinutos = this.divEl.querySelector<HTMLSelectElement>(`#minutos-${idUnico}`);
        const botaoExcluir = this.divEl.querySelector<HTMLElement>(`.x-sq`);
        const inputAudio = this.divEl.querySelector<HTMLInputElement>(`#inputAudio-${idUnico}`);
        const tocarPausar = this.divEl.querySelector<HTMLDivElement>(`#tocar-pausar-${idUnico}`);
        const repetir = this.divEl.querySelector<HTMLDivElement>(`#repetir-${idUnico}`);
        
        if(nomeAlarme){
            nomeAlarme.addEventListener('input', () =>{
                this.SetNome(nomeAlarme.textContent);
            });
            nomeAlarme.addEventListener('paste', () => {
                setTimeout(() => {
                    this.SetNome(nomeAlarme.textContent || nomeAlarme.value);
                }, 0);
            });
            nomeAlarme.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Impede a quebra de linha
                    nomeAlarme.blur();  // Opcional: tira o foco ao apertar enter (como um input)
                }
            });
            nomeAlarme.addEventListener('paste', (e) => {
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
            tocarPausar.addEventListener('click', ()=>{
                if(this._tocando)
                    this.Parar();
                else
                    this.Disparar(false);
            });
        }
        if(repetir){
            repetir.addEventListener("click", ()=>{
                this._looping = !this._looping;
                this.SetColorLooping();
                SalvarAlarmeNoBanco(this);
            });
        }
        
        const card = this.divEl;
        let offsetX = 0;
        let offsetY = 0;
        let ultimoX = 0;
        const containerAlarmes = document.getElementById('container-alarmes');

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
            if (containerAlarmes) {
                const outrosCards = [...containerAlarmes.querySelectorAll('.square-alarme:not(.arrastando)')] as HTMLElement[];
                const proximoCard = outrosCards.find(cardAlvo => {
                    const box = cardAlvo.getBoundingClientRect();
                    return e.clientX < (box.left + box.width / 2);
                });

                if (proximoCard) containerAlarmes.insertBefore(Alarme.placeholder, proximoCard);
                else containerAlarmes.appendChild(Alarme.placeholder);
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if (card.hasPointerCapture(e.pointerId)) {
                card.releasePointerCapture(e.pointerId);
            }
            if (Alarme.placeholder && Alarme.placeholder.parentNode) {
                Alarme.placeholder.parentNode.insertBefore(card, Alarme.placeholder);
            }
            container?.classList.remove('stop-scroll');
            Alarme.placeholder.remove();
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
            
            Alarme.AtualizarOrdemGlobal();
        };

        let timerPressao: number | null = null;
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

                card.insertAdjacentElement('beforebegin', Alarme.placeholder);
                document.documentElement.style.cursor = 'grabbing';
                
                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
                
                if (isTouch && navigator.vibrate) navigator.vibrate(40);
                
            };

            if (isTouch) {
                    timerPressao = window.setTimeout(iniciarArrasto, 150);

                    // Se o usuário mover o dedo ANTES dos 150ms, 
                    // o navegador vai iniciar o scroll horizontal nativo.
                    // Nós cancelamos o nosso timer para não bugar.
                    const cancelarSeForScroll = (moveEvent: PointerEvent) => {
                        const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
                        if (dist > 10) { // Se moveu 10px antes de dar o tempo de segurar
                            if (timerPressao) {
                                clearTimeout(timerPressao);
                                timerPressao = null;
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
        const container = document.getElementById('container-alarmes');
        if (!container) return;

        // 1. Pega todos os IDs dos cards na ordem em que aparecem na tela agora
        const cardsNoDom = [...container.querySelectorAll('.square-alarme')] as HTMLElement[];

        cardsNoDom.forEach((cardEl, index) => {
            // 2. Extrai o ID numérico do ID da Div (ex: "al-5" vira 5)
            const idAlarme = parseInt(cardEl.id.replace('al-', ''));
            
            // 3. Encontra o objeto alarme correspondente na sua lista/map
            // (Aqui assumo que sua lista global se chama 'alarmes')
            const alarmeObj = [...alarmes.values()].find(al => al.GetId() === idAlarme);

            if (alarmeObj) {
                alarmeObj.SetPosicao(index); // Atualiza a posição interna
                SalvarAlarmeNoBanco(alarmeObj); // Salva a nova ordem no IndexedDB/Banco
            }
        });
    }

    public SetPosicao(index: number): void{
        this._posicao = index;
    }
    public GetPosicao(): number{
        return this._posicao;
    }

    private static CriarPlaceholder(): HTMLDivElement {
        const p = document.createElement('div');
        p.classList.add('placeholder-alarme');
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
            // Se o número atual do loop for igual ao valor que o alarme já tem, adicionamos 'selected'
            const selecionado = i === valorSelecionado ? 'selected' : '';
            
            opcoes += `<li value="${i}" class="${selecionado}">${valorFormatado}</li>`;
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