import { LowerCaseTextPEl, adiciona_conteudo, adiciona_palavra } from "./cartoes.js";

const sliderValue = document.getElementById('sliderValue');
const gerarProgressoIa = document.getElementById('gerar_progresso_ia');
const gerarcreaftarIABtn = document.getElementById('gerar-creaftarIA');
const titulocreaftarIAInp = document.getElementById('titulo-creaftarIA');
const numberSlider = document.getElementById('numberSlider');

export async function gerarCruzadinhaViaIa(){
    if(titulocreaftarIAInp.value !== ''){
        const { FecharModal } = await import("../ferramentas/el_visibilidade.js");
        const { AtualizarBarraFake, PararBarraFake } = await import("./copy/copytext.js");
        const { GerarAnunciosCopy } = await import("../ferramentas/anuncio.js");
        const { AlternarVisibilidade } = await import("../ferramentas/el_visibilidade");

        FecharModal(titulocreaftarIAInp.closest(".modal-salvar"));
        AtualizarBarraFake();

        const containerCarregarCopyEl = document.getElementById("container-carregar-copy");
        
        GerarAnunciosCopy();
        AlternarVisibilidade(containerCarregarCopyEl, false);
        containerCarregarCopyEl.style.opacity = "1";

        const { langURL } = await import("../ferramentas/traducao/traducao.js");
        const lang = langURL.toLowerCase().split('-')[0];

        const conteudoGemini = await cruzadinhaGemini(titulocreaftarIAInp.value, sliderValue.textContent, lang);
        
        if(conteudoGemini && Array.isArray(conteudoGemini)) {
            await processFile(conteudoGemini);
            LowerCaseTextPEl();
        } 

        PararBarraFake();
        AlternarVisibilidade(containerCarregarCopyEl, false);
        containerCarregarCopyEl.style.opacity = "1";
    }
}

async function cruzadinhaGemini(tema, quantidade, lang){
    const url = 'https://crivras.vercel.app/api/gemini';
    const data = { tema, quantidade, lang };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Falha na resposta da IA');
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function processFile(dadosIA) {
    const { autopos_cruzadinha } = await import("./menulateral.js");
    const { SalvarPalavra_i_db, SalvarConteudo_i_db } = await import("../lib/rascunhoeditor.js");
    
    for(const item of dadosIA){
        const resp = item.palavra.trim();
        const cont = item.dica.trim();

        if(resp && cont){
            adiciona_conteudo(null, cont);
            await adiciona_palavra(null, resp);
        }
    }

    await autopos_cruzadinha();
    
    for(const item of dadosIA){
        const resp = item.palavra.trim();
        const cont = item.dica.trim();
        await SalvarPalavra_i_db(resp);
        await SalvarConteudo_i_db(cont);
    }   
}

gerarcreaftarIABtn.addEventListener('click', gerarCruzadinhaViaIa);

numberSlider.addEventListener('input', () => {
    setarSlider(numberSlider.value);
});

increaseBtn.addEventListener('click', () => {
    let newValue = parseInt(numberSlider.value) + 1;
    if (newValue <= numberSlider.max) {
        numberSlider.value = newValue;
        setarSlider(newValue);
    }
});

decreaseBtn.addEventListener('click', () => {
    let newValue = parseInt(numberSlider.value) - 1;
    if (newValue >= numberSlider.min) {
        numberSlider.value = newValue;
        setarSlider(newValue);
    }
});

function setarSlider(value) {
    sliderValue.textContent = value;
}