import { titulo } from "./firestore_dados";
import { bauPalavras } from "../grid/grid";

const traducoesEl = document.getElementById('traducoes');

const t = JSON.parse(traducoesEl.dataset.i18n);

const d1 = bauPalavras[0].textoCorreto;
const d2 = bauPalavras[1].textoCorreto;
const d3 = bauPalavras[2].textoCorreto;
const descDinamica = `${t.play.challenge_prefix}${titulo}${t.play.challenge_suffix}"${d1}", "${d2}", "${d3}"${t.play.challenge_footer}`;

UpdateHTML(titulo);

UpdateMeta('meta[property="og:title"]', `${titulo} - Creaftar`);
UpdateMeta('meta[name="description"]', descDinamica);
UpdateMeta('meta[property="og:description"]', descDinamica);
UpdateMeta('meta[name="keywords"]', `${t.play.kw_cruzadinha}${titulo}, ${t.play.kw_jogo}${titulo}`);

UpdateDynamicSEO(titulo, descDinamica);


export function UpdateHTML(titulo){
    const h1El = document.querySelector('h1');
    if (h1El) h1El.innerHTML = titulo;
    document.title = `${titulo} - Creaftar`;
}

export function UpdateMeta(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
}

export async function UpdateDynamicSEO(titulo, descricao) {
    const scriptTag = document.getElementById('ldjson-script');
    if (!scriptTag) return;

    try {
        const data = JSON.parse(scriptTag.textContent);
        const fullTitle = `${titulo} - Creaftar`;
        const currentUrl = window.location.href;

        data["@graph"].forEach(node => {
            if (["WebPage", "Game"].includes(node["@type"])) {
                node.name = fullTitle;
                node.description = descricao;
                node.url = currentUrl;
            }
        });

        scriptTag.textContent = JSON.stringify(data);
    } catch (e) {
        console.error("Erro no JSON-LD:", e);
    }
}