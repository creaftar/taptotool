// Nome do banco e versão
const DB_NAME = "AlarmeDB";
const DB_VERSION = 1;
const STORE_NAME = "alarmes";

export function AbrirBanco(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Este evento só roda na primeira vez (ou quando a versão muda)
        // É aqui que criamos a "tabela"
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // keyPath: "id" com autoIncrement gera um número automático para cada registro
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}