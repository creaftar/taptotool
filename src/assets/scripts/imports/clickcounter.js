const NOME_DB = 'Cliques_idb';

async function Inicializar() {
    await import('../utility/backend/indexeddb.js');
    idb.configurar(NOME_DB); 
    
    await import('../pages/performance/Interface.js');
}

Inicializar();