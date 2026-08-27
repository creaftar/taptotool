let containerblocoerrorEl = document.getElementById('container-bloco-error');

let _isShowingError = false;

/**
 * Função para exibir a mensagem de erro quando o usuário não habilitar a área de transferência
 * @returns void
 */
export async function ErroTransferencia(){
    if (_isShowingError)
        return;

    _isShowingError = true;

    containerblocoerrorEl.style.opacity = "1";
    containerblocoerrorEl.style.height = "15%";
    containerblocoerrorEl.style.zIndex = "2";
    setTimeout(async () => {
        containerblocoerrorEl.style.opacity = "0";
        containerblocoerrorEl.style.height = "0%";
        await Delay(900);
        containerblocoerrorEl.style.zIndex = "0";
        _isShowingError = false;
    }, 3000);
}

function Delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}