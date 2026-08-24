import { Alarme } from './Alarme.ts';
import { AbrirBanco } from './DB.ts'; // Certifique-se de que o caminho está correto

export const alarmes = new Map();

// Seleção de elementos do DOM
const addAlarmEl = document.getElementById("addAlarm");
const addAlarmContainerEl = document.getElementById("addAlarm-container");
const containerAlarmesEl = document.getElementById("container-alarmes");
const STORE_NAME = "alarmes";

// Evento para novo alarme
if (addAlarmEl) {
    addAlarmEl.addEventListener("click", NovoAlarme);
}

function NovoAlarme(){
    let id = Alarme._contadorAlarme; 
    // No Map, usamos .set(chave, valor)
    alarmes.set(id, new Alarme());
    
    containerAlarmesEl.appendChild(alarmes.get(id).CriarDiv());
    alarmes.get(id).GetDiv().scrollIntoView({block: 'nearest', behavior: 'smooth', inline: 'center'});
}

// FUNÇÃO 1: Carregar os alarmes ao abrir a página
export async function GerarAlarmesSalvos() {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const listaDeDados = request.result;
            listaDeDados.sort((a, b) => {
                // Se a posição não existir (alarmes antigos), tratamos como 0
                const posA = a.posicao ?? 0;
                const posB = b.posicao ?? 0;
                return posA - posB;
            });
            listaDeDados.forEach(dados => {
                const novoAlarme = new Alarme(dados);
                alarmes.set(novoAlarme.GetId(), novoAlarme);
                if (containerAlarmesEl) {
                    containerAlarmesEl.appendChild(novoAlarme.CriarDiv());
                }
                novoAlarme.SetColorLooping();
            });
        };
    } catch (erro) {
        console.error("Erro ao carregar alarmes do IndexedDB:", erro);
    }
}

// FUNÇÃO 2: Salvar ou Atualizar um alarme
export async function SalvarAlarmeNoBanco(alarme) {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // Transforma a classe em objeto simples (dados puros)
        const dados = alarme.toObject();
        console.log(dados);
        store.put(dados); 
    } catch (erro) {
        console.error("Erro ao salvar no IndexedDB:", erro);
    }
}

// FUNÇÃO 3: Deletar um alarme
export async function DeletarAlarmeDoBanco(id) {
    try {
        const db = await AbrirBanco();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.delete(id);
    } catch (erro) {
        console.error("Erro ao deletar do IndexedDB:", erro);
    }
}