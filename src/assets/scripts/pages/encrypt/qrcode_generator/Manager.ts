import { QRCode } from "./QRCode";
import { QRCodeDB } from "./DB";
import { type IQRCodeDTO } from "./QRCode";

export class Manager {
    private _qrcodes_dic: Map<string, QRCode>;
    private _db: QRCodeDB;

    constructor(){
        this._qrcodes_dic = new Map<string, QRCode>();
        this._db = new QRCodeDB();
    }
    
    /**
     * Instancia um novo QRCode na memória e no IndexedDB
     */
    public async CriarQRCode(dadosIniciais?: Partial<IQRCodeDTO>): Promise<HTMLDivElement> {        
        const idUnico = dadosIniciais?.id || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        
        const qrcode = new QRCode(
            idUnico,
            dadosIniciais?.width || 130, 
            dadosIniciais?.height || 130, 
            dadosIniciais?.link, 
            dadosIniciais?.color || "#3f3f74", 
            dadosIniciais?.bgcolor || "#ffffff",
            dadosIniciais?.titulo,
            dadosIniciais?.transparente || false,
            (idParaDeletar) => this.ExcluirQRCode(idParaDeletar),
            (qrAlterado) => this.SalvarQRCode(qrAlterado)
        );

        this._qrcodes_dic.set(idUnico, qrcode);
        
        // Salva a versão inicial no IndexedDB
        await this._db.Salvar(qrcode.GetDados());
    
        return qrcode.GetQRCode();
    }

    /**
     * Salva as alterações de um QR Code no banco
     */
    public async SalvarQRCode(qrcode: QRCode): Promise<void> {
        await this._db.Salvar(qrcode.GetDados());
    }

    /**
     * Remove do Map e do IndexedDB
     */
    public async ExcluirQRCode(id: string): Promise<void> {
        if (this._qrcodes_dic.has(id)) {
            this._qrcodes_dic.delete(id);
            await this._db.Deletar(id);
        }
    }

    /**
     * Carrega todos os QR Codes do IndexedDB e recria no DOM ao abrir a página
     */
    public async CarregarDoBanco(containerPai: HTMLElement): Promise<void> {
        const salvos = await this._db.ListarTodos();

        for (const dados of salvos) {
            const elementoHTML = await this.CriarQRCode(dados);
            containerPai.appendChild(elementoHTML);
        }
    }
}