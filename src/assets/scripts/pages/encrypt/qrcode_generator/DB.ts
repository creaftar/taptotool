import { openDB, type IDBPDatabase } from 'idb';
import { type IQRCodeDTO } from './QRCode';

export class QRCodeDB {
    private dbName = "QRCodeAppDB";
    private storeName = "qrcodes";
    private version = 1;

    /**
     * Abre/Conecta ao banco IndexedDB usando a biblioteca 'idb'
     */
    private async GetDB(): Promise<IDBPDatabase> {
        return openDB(this.dbName, this.version, {
            upgrade(db) {
                // Cria a tabela (object store) com chave primária 'id', se não existir
                if (!db.objectStoreNames.contains("qrcodes")) {
                    db.createObjectStore("qrcodes", { keyPath: "id" });
                }
            },
        });
    }

    /**
     * Salva um novo QR Code ou atualiza um existente
     */
    public async Salvar(data: IQRCodeDTO): Promise<void> {
        const db = await this.GetDB();
        await db.put(this.storeName, data);
    }

    /**
     * Deleta um QR Code do banco usando o ID único
     */
    public async Deletar(id: string): Promise<void> {
        const db = await this.GetDB();
        await db.delete(this.storeName, id);
    }

    /**
     * Retorna a lista de todos os QR Codes salvos para restaurar na tela ao recarregar a página
     */
    public async ListarTodos(): Promise<IQRCodeDTO[]> {
        const db = await this.GetDB();
        return await db.getAll(this.storeName);
    }
}