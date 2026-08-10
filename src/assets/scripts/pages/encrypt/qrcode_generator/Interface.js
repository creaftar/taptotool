import { Manager } from "./Manager";

const containerQrcodes = document.getElementById("container-all-qrcode");
const novoqrcodeBtn = document.getElementById("novo-qr-code");

const manager = new Manager();

async function InicializarApp() {
    if (!containerQrcodes) return;

    // 1. Busca todos os QR Codes salvos no IndexedDB e desenha na tela
    await manager.CarregarDoBanco(containerQrcodes);

    // 2. Se for o primeiro acesso (nenhum QR Code salvo no banco), cria um inicial por padrão
    if (containerQrcodes.children.length === 0) {
        const primeiroQRCode = await manager.CriarQRCode();
        containerQrcodes.append(primeiroQRCode);
    }
}

// Executa o carregamento ao abrir/recarregar a página
InicializarApp();

// Evento do botão de criar novo QR Code
novoqrcodeBtn?.addEventListener("click", async () => {
    const novoCard = await manager.CriarQRCode();
    containerQrcodes.append(novoCard);
});