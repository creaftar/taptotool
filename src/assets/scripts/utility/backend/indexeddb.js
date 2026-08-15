let DB_NAME = 'AppBancoPadrao';
const DB_VERSION = 1;
const STORE_NAME = 'dados_gerais';
let dbInstance = null;

// Armazena os timers e também o ÚLTIMO valor pendente (cache de memória)
const timersSalvar = {};
const cacheMemoria = {};

function abrirBanco(nomePagina) {
    if (nomePagina) DB_NAME = nomePagina;
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(new Error('Erro crítico ao abrir o IndexedDB.'));
        
        request.onsuccess = () => {
            dbInstance = request.result;
            
            // Tratamento de segurança caso a conexão caia repentinamente
            dbInstance.onclose = () => { dbInstance = null; };
            dbInstance.onversionchange = () => {
                dbInstance.close();
                dbInstance = null;
            };

            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

window.idb = {
    configurar(nomePagina) {
        DB_NAME = nomePagina;
        // Limpa o cache ao mudar de página/banco por segurança
        Object.keys(cacheMemoria).forEach(k => delete cacheMemoria[k]);
        Object.keys(timersSalvar).forEach(k => clearTimeout(timersSalvar[k]));
    },

    salvar(chave, valor, delay = 500) {
        // Atualiza o cache de memória instantaneamente
        cacheMemoria[chave] = valor;

        // Se o delay for 0, salva IMEDIATAMENTE sem setTimeout (perfeito para F5 rápido)
        if (delay === 0) {
            if (timersSalvar[chave]) {
                clearTimeout(timersSalvar[chave]);
                delete timersSalvar[chave];
            }
            // Executa a gravação no banco de forma síncrona/direta
            return (async () => {
                try {
                    const db = await abrirBanco();
                    const transaction = db.transaction(STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.put(valor, chave);
                    
                    return new Promise((resolve, reject) => {
                        request.onsuccess = () => resolve(true);
                        request.onerror = () => reject(request.error);
                        transaction.onerror = () => reject(transaction.error);
                    });
                } catch (err) {
                    console.error("Erro ao salvar imediatamente:", err);
                    return false;
                }
            })();
        }

        // Caso contrário, continua usando o Debounce normal com delay
        return new Promise((resolve, reject) => {
            if (timersSalvar[chave]) {
                clearTimeout(timersSalvar[chave]);
            }

            timersSalvar[chave] = setTimeout(async () => {
                try {
                    const db = await abrirBanco();
                    const transaction = db.transaction(STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.put(valor, chave);

                    request.onsuccess = () => {
                        delete timersSalvar[chave];
                        resolve(true);
                    };
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (err) {
                    reject(err);
                }
            }, delay);
        });
    },

    async obter(chave) {
        // 1. BLindagem Máxima: Se o dado foi alterado agorinha e está no timer (cache),
        // retorna ele direto da memória para evitar ler uma versão desatualizada do disco!
        if (cacheMemoria[chave] !== undefined) {
            return cacheMemoria[chave];
        }

        try {
            const db = await abrirBanco();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(chave);

                request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
                request.onerror = () => reject(request.error);
                transaction.onerror = () => reject(transaction.error);
            });
        } catch (err) {
            console.error("Erro ao obter dado do IndexedDB:", err);
            return null;
        }
    },

    async excluir(chave) {
        // Limpa da memória e cancela timer pendente
        if (timersSalvar[chave]) {
            clearTimeout(timersSalvar[chave]);
            delete timersSalvar[chave];
        }
        delete cacheMemoria[chave];

        try {
            const db = await abrirBanco();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(chave);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
                transaction.onerror = () => reject(transaction.error);
            });
        } catch (err) {
            console.error("Erro ao excluir dado do IndexedDB:", err);
            return false;
        }
    }
};