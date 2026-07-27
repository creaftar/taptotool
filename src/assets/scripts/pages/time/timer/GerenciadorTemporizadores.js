import { Temporizador } from './Temporizador.ts';
import { AbrirBanco } from './DB.ts'; // Certifique-se de que o caminho está correto

export const temporizadores = new Map();

// Seleção de elementos do DOM
const addTemporizadorEl = document.getElementById("addTimer");
const addTimerContainerEl = document.getElementById("addTimer-container");  
const containerTemporizadoresEl = document.getElementById("container-temporizadores");
const STORE_NAME = "temporizadores";

// Evento para novo temporizador
if (addTemporizadorEl) {
    addTemporizadorEl.addEventListener("click", NovoTemporizador);
}

function NovoTemporizador(){
    let id = Temporizador._contadorTemporizador; 
    // No Map, usamos .set(chave, valor)
    temporizadores.set(id, new Temporizador());
    
    containerTemporizadoresEl.appendChild(temporizadores.get(id).CriarDiv());
    temporizadores.get(id).GetDiv().scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'center'});
}

// FUNÇÃO 1: Carregar os temporizadores ao abrir a página
export async function GerarTemporizadoresSalvos() {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const listaDeDados = request.result;
            listaDeDados.sort((a, b) => {
                // Se a posição não existir (temporizadores antigos), tratamos como 0
                const posA = a.posicao ?? 0;
                const posB = b.posicao ?? 0;
                return posA - posB;
            });
            listaDeDados.forEach(dados => {
                const NovoTemporizador = new Temporizador(dados);
                temporizadores.set(NovoTemporizador.GetId(), NovoTemporizador);
                if (containerTemporizadoresEl) {
                    containerTemporizadoresEl.appendChild(NovoTemporizador.CriarDiv());
                }
                NovoTemporizador.SetColorLooping();
            });
        };
    } catch (erro) {
        console.error("Erro ao carregar temporizadores do IndexedDB:", erro);
    }
}

// FUNÇÃO 2: Salvar ou Atualizar um temporizador
export async function SalvarTemporizadorNoBanco(temporizador) {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // Transforma a classe em objeto simples (dados puros)
        const dados = temporizador.toObject();
        store.put(dados); 
    } catch (erro) {
        console.error("Erro ao salvar no IndexedDB:", erro);
    }
}

// FUNÇÃO 3: Deletar um temporizador
export async function DeletarTemporizadorDoBanco(id) {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.delete(id);
    } catch (erro) {
        console.error("Erro ao deletar do IndexedDB:", erro);
    }
}