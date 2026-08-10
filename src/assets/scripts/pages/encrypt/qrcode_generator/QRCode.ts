import QRCodeStyling from 'qr-code-styling';

export interface IQRCodeDTO {
    id: string;
    titulo: string;
    link: string;
    width: number;
    height: number;
    color: string;
    bgcolor: string;
    transparente: boolean;
}

// Interface auxiliar para os dados dinamicos do JSON
interface I18nDynamic {
    remove_bg?: string;
    default_title?: string;
    placeholder_link?: string;
    download_btn?: string;
}

export class QRCode {

    private _qrcode: QRCodeStyling;
    private _container: HTMLDivElement;
    private _id: string;
    private _titulo: string;
    private _debounceTimer: number | null = null;
    
    private _width: number;
    private _height: number;
    private _link: string;
    private _color: string;
    private _bgcolor: string;
    private _transparente: boolean;
    private _onDelete?: (id: string) => void;
    private _onUpdate?: (qrcode: QRCode) => void;

    // Helper para buscar as traducoes salvas no data-i18n do container pai
    private get _i18n(): I18nDynamic {
        const containerPai = document.getElementById("container-all-qrcode");
        if (containerPai && containerPai.dataset.i18n) {
            try {
                return JSON.parse(containerPai.dataset.i18n);
            } catch (e) {
                console.error("Erro ao ler JSON de traducao", e);
            }
        }
        return {};
    }

    constructor(id: string, width: number, height: number, link: string | undefined, color: string, bgcolor: string,
        titulo?: string,
        transparente?: boolean,
        onDelete?: (id: string) => void,
        onUpdate?: (qrcode: QRCode) => void
    ){
        this._id = id;
        this._width = width;
        this._height = height;
        
        const defaultTitle = this._i18n.default_title + '✏️' || "Meu QR Code ✏️";
        const defaultLink = this._i18n.placeholder_link || "https://seu-link-aqui.com";

        this._link = link || defaultLink;
        this._color = color;
        this._titulo = titulo || defaultTitle;
        this._transparente = transparente || false;
        this._bgcolor = bgcolor;
        this._qrcode = new QRCodeStyling({
            width: width,
            height: height,
            type: "svg",
            data: this._link,
            margin: 3,
            qrOptions: {
                errorCorrectionLevel: 'H'
            },
            dotsOptions: {
                color: color,
                type: "rounded"
            },
            backgroundOptions: {
                color: this._transparente ? "rgba(0,0,0,0)" : this._bgcolor,
            }
        });
        this._container = document.createElement("div");
        this._onDelete = onDelete;
        this._onUpdate = onUpdate;
        this.CriarContainer();
    }    

    private NotificarAlteracao(): void {
        if (this._onUpdate) {
            this._onUpdate(this);
        }
    }

    /**
     * Cria o HTML do qrcode durante sua inicialização
     */
    private CriarContainer(): void {
        this._container.classList.add("qrcode-container");
        
        const min = 30;
        const max = 230;
        const passo = 10;

        // Textos Dinâmicos obtidos das traduções
        const textRemoveBg = this._i18n.remove_bg || "Remover fundo";
        const defaultTitle = this._i18n.default_title || "Meu QR Code";

        this._container.innerHTML = `
            <div class="qr-card">
                <i class="fa-solid fa-xmark end-icon"></i>
                <div contenteditable=true id="titulo-${this._id}" class="titulo-qrcode">${this._titulo}</div>
                <div contenteditable=true id="link-${this._id}" class="link-qrcode">${this._link}</div>
                <div class="canvas-qrcode" id="qrcodebaixavel-${this._id}">
                </div>
                <input 
                    type="range" 
                    id="range-${this._id}" 
                    min="${min}" 
                    max="${max}" 
                    step="${passo}"
                    value="${this._width}"
                    class="slider"
                >
            </div>
            <div class="container-opcoes">
                <div class="container-cores">
                    <input type="color" id="seletor-${this._id}" name="seletor" value="${this._color}">
                    <input type="color" id="seletor-fundo-${this._id}" name="seletor-fundo" value="${this._bgcolor}">
                </div>
                <div class="checkbox-transparencia">
                    <input type="checkbox" id="transparencia-${this._id}" ${this._transparente ? 'checked' : ''}>
                    <label for="transparencia-${this._id}" class="label-transparencia">${textRemoveBg}</label>
                </div>
            </div>`;
            
        const canvasElement = this._container.querySelector('.canvas-qrcode');
        this._qrcode.append(canvasElement as HTMLElement);
        this.ConectarListenners();
    }

    private ConectarListenners(): void {
        const titulo = this._container.querySelector(`#titulo-${this._id}`);
        const link = this._container.querySelector(`#link-${this._id}`);
        const checkbox = this._container.querySelector(`#transparencia-${this._id}`);
        const sliderTamanho = this._container.querySelector<HTMLInputElement>(`#range-${this._id}`);
        const seletorCor = this._container.querySelector(`#seletor-${this._id}`);
        const seletorBgCor = this._container.querySelector(`#seletor-fundo-${this._id}`);
        const qrCodeDownload = this._container.querySelector(`#qrcodebaixavel-${this._id}`);
        
        titulo?.addEventListener("input", () => {
            this.ExecutarComDebounce(() => {
                this._titulo = titulo.textContent || "";
                this.NotificarAlteracao();
            }, 100);
        });

        link?.addEventListener("input", () => {
            this.ExecutarComDebounce(() => {
                this._link = link.textContent || "";
                const novoLink = link.textContent || "";
                this.AtualizarLink(novoLink);
                this.NotificarAlteracao();
            });
        });

        checkbox?.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this._transparente = target.checked;
            this.AtualizarTransparencia();
            this.AtualizarCorBackground();
            this.NotificarAlteracao();
        });

        sliderTamanho?.addEventListener("input", () => {
            const novoTamanho = Number(sliderTamanho.value);

            this.ExecutarComDebounce(() => {
                this._width = novoTamanho;
                this._height = novoTamanho;
                this.AtualizarDimensoes(novoTamanho);
                this.NotificarAlteracao();
            }, 100);
        });

        seletorCor?.addEventListener("input", (e) => {
            const novaCor = (e.target as HTMLInputElement).value;
            this._color = novaCor;
            
            this.ExecutarComDebounce(() => {
                this.AtualizarCorPontos(novaCor);
                this.NotificarAlteracao();
            }, 100);
        });

        seletorBgCor?.addEventListener("input", (e) => {
            const novaCor = (e.target as HTMLInputElement).value;
            this._bgcolor = novaCor;
            
            this.ExecutarComDebounce(() => {
                this.AtualizarCorBackground(novaCor);
                this.NotificarAlteracao();
            }, 100);
        });

        qrCodeDownload?.addEventListener("click", () => {
            const nomeFormatado = this._titulo.replace(/[^\w\s-]/gi, '').trim() || `qrcode-${this._id}`;
            this.BaixarQRCode(nomeFormatado, "png");
            this.NotificarAlteracao();
        });

        const btnExcluir = this._container.querySelector('.end-icon');
        btnExcluir?.addEventListener("click", () => {
            this.Destruir();
        });
    }

    /**
     * Remove o elemento do HTML e notifica o Manager
     */
    public Destruir(): void {
        this._container.remove();
        if (this._onDelete) {
            this._onDelete(this._id);
        }
    }

    /**
     * Executa uma função após um determinado tempo de espera, 
     * cancelando execuções anteriores no mesmo intervalo.
     */
    private ExecutarComDebounce(acao: () => void, delay = 2000): void {
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        this._debounceTimer = window.setTimeout(acao, delay);
    }

    /**
     * Atualiza largura e altura com a mesma dimensão para o qrcode
     */
    public async AtualizarDimensoes(tamanho: number): Promise<void> {
        this._qrcode.update({
            width: tamanho,
            height: tamanho
        });
    }

    /**
     * Atualiza o link do qrCode
     */
    public async AtualizarLink(novoLink: string): Promise<void> {
        this._qrcode.update({
            data: novoLink
        });
    }

    /**
     * Atualiza a cor do qrCode
     */
    public async AtualizarCorPontos(novaCor: string): Promise<void> {
        this._qrcode.update({
            dotsOptions: {
                color: novaCor
            }
        });
    }

    /**
     * Atualiza a cor do background
     */
    public async AtualizarCorBackground(bgcolor = this._bgcolor): Promise<void>{
        this._bgcolor = bgcolor;
        if(this._transparente) return;
        this._qrcode.update({
            backgroundOptions: { 
                color: `${this._bgcolor}`, 
            }
        });
    }

    /**
     * Define se o qrcode terá ou não fundo
     */
    public async AtualizarTransparencia(): Promise<void>{
        this._qrcode.update({
            backgroundOptions: { 
                color: `${this._transparente ? "rgba(0,0,0,0)" : this._bgcolor}`, 
            }
        });
    }

    /**
     * Baixa o QR Code direto pela biblioteca
     */
    public async BaixarQRCode(nomeArquivo = "qrcode", formato: "png" | "svg" | "jpeg" = "png"): Promise<void> {
        const svgElement = this._container.querySelector<SVGElement>('.canvas-qrcode svg');

        if (!svgElement) {
            await this._qrcode.download({ name: nomeArquivo, extension: formato });
            return;
        }

        const xml = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        if (formato === 'svg') {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${nomeArquivo}.svg`;
            a.click();
            URL.revokeObjectURL(url);
            return;
        }

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = svgElement.clientWidth || this._width;
            canvas.height = svgElement.clientHeight || this._height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL(`image/${formato}`);
                
                const a = document.createElement('a');
                a.href = imgData;
                a.download = `${nomeArquivo}.${formato}`;
                a.click();
            }
            URL.revokeObjectURL(url);
        };

        img.src = url;
    }

    public GetQRCode(): HTMLDivElement{
        return this._container;
    }

    public GetDados(): IQRCodeDTO {
        return {
            id: this._id,
            titulo: this._titulo,
            link: this._link,
            width: this._width,
            height: this._height,
            color: this._color,
            bgcolor: this._bgcolor,
            transparente: this._transparente
        };
    }
}