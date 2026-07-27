export abstract class WheelRenderer {
    private static readonly canvas: HTMLCanvasElement = document.createElement('canvas');
    private static readonly ctx = WheelRenderer.canvas.getContext('2d')!;

    static {
        this.canvas.width = 800;
        this.canvas.height = 800;
    }

    public static generateTexture(items: string[], textureImage?: HTMLImageElement): string {
        const { canvas, ctx } = this;
        const radius = canvas.width / 2;
        const arc = (2 * Math.PI) / items.length;

        // Limpa o canvas para um novo desenho
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- CAMADA 1: CORES DAS FATIAS (BASE) ---
        items.forEach((_, i) => {
            const angle = i * arc;
            ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 50%)`;
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, angle, angle + arc);
            ctx.fill();
            ctx.strokeStyle = `hsl(${(i * 360) / items.length}, 30%, 30%)`;
            ctx.lineWidth = 2;
        });

        // --- CAMADA 2: TEXTURA EXTERNA ---
        // Só desenha se a imagem existir E estiver carregada
        if (textureImage && textureImage.complete && textureImage.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.clip();

            // 'overlay' mistura a textura com a cor; 'source-over' apenas pinta por cima
            //ctx.globalCompositeOperation = 'multiply';
            ctx.globalCompositeOperation = 'overlay';  
            ctx.globalAlpha = 1; // Ajuste de 0.1 a 1.0 para ver mais ou menos a textura
            //ctx.globalAlpha = 0.5; // Ajuste de 0.1 a 1.0 para ver mais ou menos a textura

            const pattern = ctx.createPattern(textureImage, 'repeat');
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.restore();
        }

        // --- CAMADA 3: LUZES, BORDAS E TEXTO ---
        items.forEach((text, i) => {
            const angle = i * arc;

            // 3.1 Gradiente de Profundidade
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, angle, angle + arc);
            ctx.clip();

            const grad = ctx.createRadialGradient(radius, radius, radius * 0.7, radius, radius, radius);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(255,255,255,0.15)');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();

            // 3.2 Borda da Fatia
            ctx.stroke();

            // --- 3.3 O TEXTO REVISADO ---
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";

            // Ajuste de margens: 
            // radius - 80 evita que o texto encoste na borda externa
            // radius * 0.2 evita que o texto entre no círculo central (eixo da roleta)
            const paddingExterno = 30;
            const limiteInterno = radius * 0.3; 
            const maxWidth = radius - paddingExterno - limiteInterno;

            let fontSize = 32; 
            ctx.font = `600 ${fontSize}px texto`;

            let textoParaExibir = text;

            // Loop de redimensionamento (Limite mínimo de 16px para não ficar ilegível)
            while (ctx.measureText(textoParaExibir).width > maxWidth && fontSize > 24) {
                fontSize -= 1;
                ctx.font = `600 ${fontSize}px texto`;
            }

            // Lógica de Reticências (Truncar se não couber nem com 16px)
            if (ctx.measureText(textoParaExibir).width > maxWidth) {
                while (ctx.measureText(textoParaExibir + "...").width > maxWidth && textoParaExibir.length > 0) {
                    textoParaExibir = textoParaExibir.slice(0, -1);
                }
                textoParaExibir += "...";
            }

            // Posição X: Agora subtraímos o padding externo para ele não encostar na borda
            const xPos = radius - 30; 
            const yPos = fontSize / 3;

            // Desenho
            ctx.strokeStyle = "rgba(0,0,0,0.4)";
            ctx.lineWidth = 4;
            ctx.strokeText(textoParaExibir, xPos, yPos);

            ctx.fillStyle = "white";
            ctx.fillText(textoParaExibir, xPos, yPos);

            ctx.restore();

            // Configurações comuns
            /*const textoCortado = text.slice(0, 15);
            const xPos = radius - 40;
            const yPos = 10;
            ctx.font = '600 30px texto'; 

            // 1. A BORDA (Stroke)
            ctx.strokeStyle = "rgba(0,0,0,0.3)";    // Cor da borda
            ctx.lineWidth = 5;            // Grossura da borda
            ctx.lineJoin = "round";       // Suaviza os cantos da borda
            ctx.strokeText(textoCortado, xPos, yPos);

            // 2. O PREENCHIMENTO (Fill)
            ctx.fillStyle = "white";      // Cor do texto
            ctx.shadowColor = "rgba(0,0,0,0.1)";
            ctx.shadowBlur = 4;
            ctx.fillText(textoCortado, xPos, yPos);

            ctx.restore();*/
        });


        return canvas.toDataURL('image/png');
    }
}