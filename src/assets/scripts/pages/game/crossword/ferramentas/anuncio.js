import { langURL } from "./traducao/traducao";
export function GerarAnuncios() {
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
	if(isMobile)
		return;
    
	const adRight = document.querySelector('#ad-right ins');
	const adLeft = document.querySelector('#ad-left ins');
	
    if(langURL == "ru"){
        window.yaContextCb = window.yaContextCb || [];

        if (adRight) {
            adRight.innerHTML = '<div id="yandex_rtb_R-A-19064633-1"></div>';
            window.yaContextCb.push(() => {
                Ya.Context.AdvManager.render({
                    "blockId": "R-A-19064633-1",
                    "renderTo": "yandex_rtb_R-A-19064633-1"
                });
            });
        }

        if (adLeft) {
            adLeft.innerHTML = '<div id="yandex_rtb_R-A-19064633-2"></div>';
            window.yaContextCb.push(() => {
                Ya.Context.AdvManager.render({
                    "blockId": "R-A-19064633-2",
                    "renderTo": "yandex_rtb_R-A-19064633-2"
                });
            });
        }
    }
    else{
        window.adsbygoogle = window.adsbygoogle || [];
        
        if (adRight) {
            (window.adsbygoogle).push({});
        }
        if (adLeft) {
            (window.adsbygoogle).push({});
        }
    }
}

export function GerarAnunciosCopy() {
    // Seleciona o container específico do overlay de loading
    const adCenter = document.querySelector('#container-ad-copy');
    
    // Se o container não existir no DOM (ex: o overlay ainda não abriu), interrompe a função
    if (!adCenter) return;

    if (langURL === "ru") {
        // Configuração para o Yandex (Público Russo)
        window.yaContextCb = window.yaContextCb || [];
        
        // Limpa o conteúdo atual e insere a div de renderização do Yandex
        adCenter.innerHTML = '<div id="yandex_rtb_R-A-19064633-3"></div>';
        
        window.yaContextCb.push(() => {
            Ya.Context.AdvManager.render({
                "blockId": "R-A-19064633-3",
                "renderTo": "yandex_rtb_R-A-19064633-3"
            });
        });
        setInterval(refreshYandexAds, 60000);
    } 
    else {
        // Lógica do Google AdSense
        // FORÇAMOS a criação de um elemento novo para resetar o status do Google
        adCenter.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:inline-block;width:600px;height:300px;max-width: 90vw; max-height: 90vh;"
                 data-ad-client="ca-pub-3201959726673479"
                 data-ad-slot="5522865584"></ins>
        `;

        // Pequeno delay (100ms) para garantir que o DOM renderizou o novo <ins>
        setTimeout(() => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("Erro no push do AdSense:", e);
            }
        }, 100);
    }
}

// Função para atualizar especificamente os anúncios do Yandex
function refreshYandexAds() {
    if (langURL !== "ru") return;

    window.yaContextCb = window.yaContextCb || [];
    
    // Refresh no bloco da Direita
    window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
            "blockId": "R-A-19064633-1",
            "renderTo": "yandex_rtb_R-A-19064633-1"
        });
    });

    // Refresh no bloco da Esquerda
    window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
            "blockId": "R-A-19064633-2",
            "renderTo": "yandex_rtb_R-A-19064633-2"
        });
    });
}