import { supportedLang, tema } from "../VARIAVEIS.mjs";
import { langURL, SetLangUrl } from "../ferramentas/traducao/traducao";
import { ResetarPalavras, ResetarConteudos } from "./cartoes";
import { gerarCruzadinhaViaIa } from "./gemini";
import { salvaBD } from "./menulateral";
const titulocreaftarIAInp = document.getElementById('titulo-creaftarIA');

const STORAGE_KEY = 'controle_datas_daily';
const KEY_LANG_INDEX = 'automacao_lang_indice';
const KEY_TEMA_INDEX = 'automacao_tema_indice';

const urlParams = new URLSearchParams(window.location.search);
const isDaily = urlParams.has('admin'); // Retorna true se houver ?dailycwd na URL
const min = 15;
const max = 20;
const qtdeTentativas = Math.floor(Math.random() * (max - min + 1)) + min;

function SetarIndiceLang() {
    const savedIdx = localStorage.getItem(KEY_LANG_INDEX);
    if (savedIdx !== null) return parseInt(savedIdx);
    
    return 0; 
}

function SetarIndiceTema() {
    const savedIdx = localStorage.getItem(KEY_TEMA_INDEX);
    if (savedIdx !== null) return parseInt(savedIdx);

    return 0;
}

if(isDaily)
    await AutomatizarCriacaoDiaria();

async function AutomatizarCriacaoDiaria(){
    const { CruzadinhaIndexedDB } = await import('./useredit.js');

    const langIndice = SetarIndiceLang();
    const temaIndice = SetarIndiceTema();
    
    const langAtual = supportedLang[langIndice];
    SetLangUrl(langAtual);
        
    await CruzadinhaIndexedDB();
    await ResetarPalavras();
    await ResetarConteudos();        
    
    console.log("Qtde Palavras p/ Gerar: ", qtdeTentativas);
    console.log("-----------------------");
    console.log(langAtual);
    console.log(tema[langIndice]);
    console.log(tema[langIndice][temaIndice]);

    titulocreaftarIAInp.value = tema[langIndice][temaIndice];
    sliderValue.textContent = qtdeTentativas;
    
    await gerarCruzadinhaViaIa();
    await esperarVerificacaoManual();
    const proximoLangTema = AtualizarIndices(langIndice, temaIndice);
    
    if(proximoLangTema.lang === -1 || proximoLangTema.tema === -1){
        localStorage.setItem(KEY_LANG_INDEX, 0);
        localStorage.setItem(KEY_TEMA_INDEX, 0);
    }
    else{
        localStorage.setItem(KEY_LANG_INDEX, proximoLangTema.lang);
        localStorage.setItem(KEY_TEMA_INDEX, proximoLangTema.tema);
    }
        
    obterProximaDataLocal(supportedLang[langIndice], temaIndice);
    await salvaBD(true);
}

function AtualizarIndices(langIndice, temaIndice){
    let proximoLang = langIndice;
    let proximoTema = temaIndice + 1;

    if(proximoTema >= tema[langIndice].length){
        proximoTema = 0;
        proximoLang += 1;
    }
    if(proximoLang >= supportedLang.length){
        proximoLang = 0;
        return { lang: -1, tema: -1 };
    }
    return { lang: proximoLang, tema: proximoTema };
}

function esperarVerificacaoManual() {
    return new Promise((resolve) => {
        const salvardailyBtn = document.getElementById('salvar-daily');
        
        // Define um handler que resolve a promise e limpa o próprio evento
        function onClick() {
            salvardailyBtn.removeEventListener('click', onClick);
            resolve(); // Libera o "await"
        }

        salvardailyBtn.addEventListener('click', onClick);
    });
}

function obterProximaDataLocal(lang, id) {
    const inputDataDiaria = document.getElementById('input-data-diaria');
    let historico = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    let dataReferencia;
    
    // CORREÇÃO: Acessar historico[lang].data em vez de apenas historico[lang]
    if (historico[lang] && historico[lang].data) {
        dataReferencia = new Date(historico[lang].data + "T12:00:00");
        dataReferencia.setDate(dataReferencia.getDate() + 1);
    } else {
        dataReferencia = new Date();
    }
    
    // Verifica se a data é válida antes de prosseguir
    if (isNaN(dataReferencia.getTime())) {
        console.error("Data inválida gerada para:", lang);
        dataReferencia = new Date(); // Fallback para hoje
    }

    const dataFinal = dataReferencia.toISOString().split('T')[0];
    
    console.log("Data: ", dataFinal);
    historico[lang] = { data: dataFinal, idTema: id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
    
    inputDataDiaria.value = dataFinal;
}