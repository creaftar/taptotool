const controladores = new Map();

/**
 * Adiciona visibility a um elemento determinado, adicionando um listener pra quando clickar fora do elemento
 * fechar ele
 * @param {HTMLBodyElement} elemento 
 */
export function AdicionarVisibilidade(elemento, pode_fecharAoClicarFora = true) {
    if (!elemento) return;

    // 1. Limpa qualquer espião antigo desse elemento específico
    if (controladores.has(elemento)) {
        controladores.get(elemento).abort();
    }

    // 2. Cria um novo controlador de espião
    const controller = new AbortController();
    controladores.set(elemento, controller);

    elemento.classList.remove("elemento-invisivel");
    elemento.classList.add("elemento-visivel");

    if(pode_fecharAoClicarFora){
        setTimeout(() => {
            const fecharAoClicarFora = (event) => {
                if (!elemento.contains(event.target)) {
                    RemoverVisibilidade(elemento);
                }
            };
            
            // 3. O 'signal' garante que podemos matar esse listener depois
            window.addEventListener("click", fecharAoClicarFora, { 
                signal: controller.signal 
            });
        }, 0);
    }
}

/**
 * Remove a visibility de um elemento determinado (é necessário ter a classe "elemento-invisivel")
 * @param {HTMLBodyElement} elemento 
 */
export function RemoverVisibilidade(elemento){
    if(elemento && elemento.classList.contains("elemento-visivel")){
        elemento.classList.remove("elemento-visivel");
        elemento.classList.add("elemento-invisivel");
        
        // 4. Mata o espião do window para este elemento
        if (controladores.has(elemento)) {
            controladores.get(elemento).abort();
            controladores.delete(elemento);
        }
        
        elemento.style.animation = "";
    }
}

/**
 * Remove todas as visibilidades, função O(n)^2
 */
export function RemoverElementosVisiveis(){
    const elementosVisiveis = document.querySelectorAll(".elemento-visivel");

    elementosVisiveis.forEach(elemento => {
        RemoverVisibilidade(elemento);
    });
}

/**
 * Verifica se o elemento está visivel, retornando um bool
 * @param {HTMLBodyElement} elemento 
 * @returns bool
 */
export function VerificarVisibilidade(elemento){
    //console.log("Classes no momento real:", elemento.className); 
    return elemento.classList.contains("elemento-visivel");
}

/**
 * Altera a visibilidade de um elemento (útil para botões que abrem menus ou elementos pais dos filhos que serão ocultados/abertos)
 * @param {HTMLBodyElement} elemento 
 */
export function AlternarVisibilidade(elemento, pode_fecharAoClicarFora = true){
    //console.log(elemento);
    if(!VerificarVisibilidade(elemento)){
		AdicionarVisibilidade(elemento, pode_fecharAoClicarFora);
	}
	else{
		RemoverVisibilidade(elemento);
	}
}

/**
 * Função para definir o elemento como invisível
 * @param {HTMLBodyElement} elemento 
 */
export function DefinirInvisibilidade(elemento){
	elemento.classList.add("elemento-invisivel");
}

/**
 * Função para exibir as mensagens com uma barra temporizadora em baixo
 * @param {HTMLDivElement} container 
 */
var timeoutMsg;
export async function AparecerMensagem(container, tempo = 6000){

	AdicionarVisibilidade(container);

    var loadBarMsg = container.querySelector(".loadBarMsg");
	//loadBarMsg.style.animation = "";
    clearTimeout(timeoutMsg);
    loadBarMsg.style.animation = `loadCard ${tempo / 1000}s forwards`;
    timeoutMsg = setTimeout(function(){
        RemoverVisibilidade(container);
    }, tempo);
}

/**
 * Função para fechar a mensagem com a barra temporizadora em baixo
 * @param {HTMLDivElement} container 
 */
export async function FecharMensagem(container) {
   	RemoverVisibilidade(container);
}

/**
 * FUnção para fazer surgir a modal com animação
 * @param {HTMLDivElement} modal 
 */
export async function AparecerModal(modal) {
    modal.style.animation = 'surgir 1s forwards';
    AdicionarVisibilidade(modal);
}

/**
 * Função para fechar a modal e resetar a animação
 * @param {HTMLDivElement} modal 
 */
export async function FecharModal(modal) {
    RemoverVisibilidade(modal);
}

var timeoutCard;
/**
 * Função para abrir o card com tempo (em MS) definido
 * @param {HTMLDivElement} card 
 * @param {Milisseconds} tempo 
 */
export async function AbrirCard(card, tempo){

    AdicionarVisibilidade(card);

 	card.style.animation = 'moveCard 1s forwards';    
    var loadCard = card.querySelector('.loadBarCard');

	clearTimeout(timeoutCard);
    if (loadCard) {
        loadCard.style.animation = `loadCard ${tempo / 1000}s forwards`;
    }
    timeoutCard = setTimeout(() => {
        const campoFocado = document.activeElement;
        if (card.contains(campoFocado) && (campoFocado.tagName === 'TEXTAREA' || campoFocado.tagName === 'INPUT')) {
            return; 
        }
        FecharCard(card);
    }, tempo);
}

export async function FecharCard(card){
	RemoverVisibilidade(card);
}