//import { SalvarRascunhoEditor_i_db } from '../lib/rascunhoeditor.js';
import { Getnumeditavel } from "./menulateral.js";
import { langURL } from "../ferramentas/traducao/traducao.js";
const containerPEl = document.getElementById('container-p-el');
const containerCEl = document.getElementById('container-c-el');

var conteudoEl;
let menuModule = null;
let areacruzadinhasModule = null;

export var respostasString = [], conteudosString = [];
export var qtdePalavras = 0, qtdeConteudos = 0;
export var bauPALAVRAS = {}

class Palavra {
    constructor(texto, x, y, flexdir = null, ligacoes = 0, posicionada = false, section) {
        this.texto = texto;
        this.x = x;
        this.y = y;
        this.flexdir = flexdir;

		//variavel para ver quantas palavras estão ligando uma nas outras
		this.ligacoes = ligacoes;

		//variavel para ver se a palavra foi posicionada
		this.posicionada = posicionada;

        this.section = section;
    }
}

var clickMagicWand = false;
//var clickMinimizar = true;

let traducoesEl = document.getElementById("traducoes-create"); 
let t = JSON.parse(traducoesEl.dataset.i18n);

//const minimizar_cartoesBtn = document.getElementById('minimizar');
const inputpEl = document.getElementById('palavra');
const palavraBtn = document.getElementById('palavraBtn');
const btnUpperCase = document.getElementById("palavra-to-upper-case");
const btnLowerCase = document.getElementById("palavra-to-lower-case");
const inputcEl = document.getElementById('conteudo');
const conteudoBtn = document.getElementById('conteudoBtn');
const btnMagicWand = document.getElementById("gerar-conteudo");

//minimizar_cartoesBtn.addEventListener('click', hide_verthorz);
btnUpperCase.addEventListener('click', UpperCaseTextPEl);
btnLowerCase.addEventListener('click', LowerCaseTextPEl);
palavraBtn.addEventListener('click', AdicionarPosicionarPalavra);
conteudoBtn.addEventListener('click', AdicionarPosicionarConteudo);
btnMagicWand.addEventListener('click', ConteudoMagico);

const removerAllPalavrasEl = document.getElementById("remover-all-palavras");
const removerAllConteudosEl = document.getElementById("remover-all-conteudos");

removerAllPalavrasEl.addEventListener("click", ResetarPalavras);

removerAllConteudosEl.addEventListener("click", ResetarConteudos);

export async function ResetarPalavras() {
    const { LimparApenasPalavras_i_db } = await import("../lib/rascunhoeditor.js");
    LimparApenasPalavras_i_db();
    const container_cruzadinhasEl = document.getElementById('container-cruzadinhas');
    container_cruzadinhasEl.innerHTML = "";
    containerPEl.innerHTML = "";
    respostasString = [];
    qtdePalavras = 0;
    bauPALAVRAS = {};

    if(qtdePalavras == 0 && qtdeConteudos == 0){
        const { AlternarVisibilidadeBotao } = await import("./copy/copytext.js");
        AlternarVisibilidadeBotao();
    }
    AlternarCopyTrash();
}
export async function ResetarConteudos() {
    const { LimparApenasConteudos_i_db } = await import("../lib/rascunhoeditor.js");
    LimparApenasConteudos_i_db();
    conteudosString = [];
    containerCEl.innerHTML = "";
    qtdeConteudos = 0;
    
    if(qtdePalavras == 0 && qtdeConteudos == 0){
        const { AlternarVisibilidadeBotao } = await import("./copy/copytext.js");
        AlternarVisibilidadeBotao();
    }
    AlternarCopyTrashCont();
}

inputpEl.addEventListener('keydown', async function verifica_enterPEl(botao) {
    if(botao.key === 'Enter'){
       await AdicionarPosicionarPalavra();
    }
});
inputcEl.addEventListener('keydown', async function verifica_enterCEl(botao) {
    if(botao.key === 'Enter'){
        await AdicionarPosicionarConteudo();
    }
});

async function AdicionarPosicionarConteudo(){
    const contagem = contarPalavrasUniversal(inputcEl.value, langURL);

    if (contagem > 3) {
        const { TratarEvento } = await import("./copy/copytext.js");
        TratarEvento();
    }

    else {
        const { SalvarConteudo_i_db } = await import("../lib/rascunhoeditor.js");
        await adiciona_conteudo();
        SalvarConteudo_i_db(conteudosString[qtdeConteudos - 1]);   
    }
}

async function AdicionarPosicionarPalavra(){
    const contagem = contarPalavrasUniversal(inputpEl.value, langURL);

    if (contagem > 3) {
        const { TratarEvento } = await import("./copy/copytext.js");
        TratarEvento();
    }
    else{
        const { SalvarPalavra_i_db } = await import("../lib/rascunhoeditor.js");
        if(!menuModule){
            menuModule = await import('./menulateral.js');
        }
        const { autopos_cruzadinha } = menuModule;
        await adiciona_palavra();
        autopos_cruzadinha();
        SalvarPalavra_i_db(respostasString[qtdePalavras - 1]);
    }
}

function contarPalavrasUniversal(texto, lang) {
    if (!texto) return 0;

    // 1. Tenta usar o Intl.Segmenter (O padrão ouro moderno)
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
            const segmenter = new Intl.Segmenter(lang, { granularity: 'word' });
            const segmentos = segmenter.segment(texto);
            return Array.from(segmentos).filter(s => s.isWordLike).length;
        } catch (e) {
            // Se der erro de localidade, segue para a regex
        }
    }

    const palavras = texto.match(/\p{L}+/gu) || [];
    return palavras.length;
}

/*function hide_verthorz(){
    const containerMinimizar = document.getElementById('container-minimizar_conteudos');
    const containerPalConEl = document.getElementById('container-palavras_conteudos');
    const area_cruzadinhasEl = document.getElementById('area-cruzadinhas');
    if(clickMinimizar){
        minimizar_cartoesBtn.innerHTML = '<i class="fa-solid fa-caret-up"></i>';
        containerPalConEl.style.bottom ='calc(var(--vh)*-21)';
        containerMinimizar.style.bottom ='calc(var(--vh)*0)';
        area_cruzadinhasEl.style.height = '100%';
        clickMinimizar = !clickMinimizar;
    }
    else{
        minimizar_cartoesBtn.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
        containerPalConEl.style.bottom = 'calc(var(--vh)*0)';
        containerMinimizar.style.bottom = 'calc(var(--vh)*21)';
        area_cruzadinhasEl.style.height = 'calc(var(--vh)*79)';
        clickMinimizar = !clickMinimizar;
    }
}*/

//funcao para deixar todas as palavras Upper Case
function UpperCaseTextPEl(){
    for(var i = 0; i < qtdePalavras; i++){
        var sectionUpperCase = document.getElementById('PALAVRA'+(i+1));
        var textPElUpperCase = document.getElementById('textPEl'+(i+1));
        sectionUpperCase.classList.add('uppercase');
        sectionUpperCase.classList.remove('lowercase');
        textPElUpperCase.textContent = textPElUpperCase.textContent.toUpperCase();
        respostasString[i] = textPElUpperCase.textContent;
    }
    btnUpperCase.style.display = "none";
    btnLowerCase.style.display = "initial";
}

export function LowerCaseTextPEl(){
    for(var i = 0; i < qtdePalavras; i++){
        var sectionLowerCase = document.getElementById('PALAVRA'+(i+1));
        var textPElLowerCase = document.getElementById('textPEl'+(i+1));
        sectionLowerCase.classList.add('lowercase');
        sectionLowerCase.classList.remove('uppercase');
        textPElLowerCase.textContent = textPElLowerCase.textContent.toLowerCase();
        respostasString[i] = textPElLowerCase.textContent;
    }
    btnLowerCase.style.display = "none";
    btnUpperCase.style.display = "initial";
}

export async function adiciona_palavra(e, texto = null){
    //atualiza_dados();
    if(texto){
        inputpEl.value = texto;
    }
    if(inputpEl.value != ""){
        const promises = [
            import("./areacruzadinhas.js"),
            import("./menulateral.js"),
            import("./copy/copytext.js")
        ];
        const [ areaMod, menulateralMod, copyMod] = await Promise.all(promises);
        
        const { gerarSection, posTela } = areaMod;
        const { Setnumeditavel, SetsectionEditavel } = menulateralMod;
        const { AlternarVisibilidadeBotao } = copyMod;

        AlternarVisibilidadeBotao();

        let palavraEl;
        
        palavraEl = inputpEl.value;
        palavraEl = palavraEl.replace(/\s+/g, '');
        inputpEl.value ='';

        respostasString[qtdePalavras] = palavraEl;
        qtdePalavras++;
        
        let pEl = document.createElement('p');	
        pEl.setAttribute('id', 'paragrafo'+qtdePalavras);
        let sectionEl = document.createElement("section");
        sectionEl.setAttribute('id', 'PALAVRA'+qtdePalavras);
        sectionEl.classList.add ("sections");
        
        
        await gerarSection(palavraEl, sectionEl);

        containerPEl.appendChild(pEl);
        pEl.innerHTML = `<span class="roxo">${qtdePalavras}</span>
        <span id="textPEl${qtdePalavras}" class="no-break" contenteditable="true">${palavraEl}</span>
        <div class="container-remove-edit-btn">
            <button id="editBtn${qtdePalavras}"><i class="fa-solid fa-pen-to-square edit-green"></i></button>
            <button id="removeBtn${qtdePalavras}"><i class="fa-solid fa-trash-can trash-red"></i></button>
        </div>    
        `;
        pEl.addEventListener('keydown', remove_focus)
        
        let textPEl = document.getElementById('textPEl'+qtdePalavras);
        textPEl.addEventListener('focusout', EditTextPEl);
        
        let removeBtn = document.getElementById('removeBtn'+qtdePalavras);
        removeBtn.addEventListener('click', remove_palavra);
        
        let editBtn = document.getElementById('editBtn'+qtdePalavras);
        editBtn.addEventListener('click', () => {
            textPEl.focus();
            // Opcional: Colocar o cursor no final do texto ao clicar em editar
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(textPEl);
            range.collapse(false); // false coloca o cursor no final
            sel.removeAllRanges();
            sel.addRange(range);
        });

        bauPALAVRAS[qtdePalavras] = new Palavra(palavraEl.toLowerCase().split(''), 0, 0, "row", 0, false, sectionEl);
        
        GerarConteudoMagico(palavraEl);
        Setnumeditavel(qtdePalavras);
        SetsectionEditavel(bauPALAVRAS[Getnumeditavel(true)].section);

        const { sectionEditavel } = menulateralMod;
        
        SetarCrosshairSection(sectionEditavel);
        posTela();

        AlternarCopyTrash();
    }
}

//funcao para editar o texto do PEl
async function EditTextPEl(evt){
    const { EditarPalavra_i_db } = await import("../lib/rascunhoeditor.js");
    var target, id;
    if(!id){
        target = evt.target;
        id = (target.id.split("textPEl")[1]);
    }
    else{
        id = id_;
    }

    var textoLimpo = target.textContent.replace(/\s+/g, '');
    
    target.textContent = textoLimpo; 

    respostasString[id-1] = textoLimpo;
    EditarPalavra_i_db(id - 1, textoLimpo);

    if(!areacruzadinhasModule){
        areacruzadinhasModule = await import("./areacruzadinhas.js");
    }
    const { EditSection } = areacruzadinhasModule;
    EditSection(id, textoLimpo);
}

//funcao para remover palavra//
async function remove_palavra(evt, identificador){
    var id;
    if(identificador)
        id = identificador;
    else{
        id = evt.currentTarget.id.split('n');   
        id = parseInt(id[1]);
    }
    
    const [
        { Setnumeditavel, SetsectionEditavel, sectionEditavel },
        { remove_section },
        { AlternarVisibilidadeBotao }
    ] = await Promise.all([
        import("./menulateral.js"),
        import("./areacruzadinhas.js"),
        import("./copy/copytext.js")
    ]);
    
	let paragrafoEl = document.getElementById('paragrafo'+id);
    let sectionEl = document.getElementById('PALAVRA'+id);

    for(var j = id; j <= qtdePalavras; j++){
        let paragrafoAnt = document.getElementById('paragrafo'+ j);
        paragrafoAnt.innerHTML = `<span class="roxo">${(j - 1) } - </span>
        <span id="textPEl${(j-1)}" class="no-break" contenteditable="true">${respostasString[j - 1]}</span>
        <div class="container-remove-edit-btn">
            <button id="editBtn${(j-1)}"><i class="fa-solid fa-pen-to-square edit-green"></i></button>
            <button id="removeBtn${(j-1)}"><i class="fa-solid fa-trash-can trash-red"></i></button>
        </div>
        `;
        paragrafoAnt.addEventListener('keydown', remove_focus);
        let textPEl = document.getElementById('textPEl'+(j-1));
        textPEl.addEventListener('focusout', EditTextPEl);
        
        let removeBtn = document.getElementById('removeBtn'+(j-1));
        removeBtn.addEventListener('click', remove_palavra);

        let editBtn = document.getElementById('editBtn'+(j-1));
        editBtn.addEventListener('click', () => {
            textPEl.focus();
            // Opcional: Colocar o cursor no final do texto ao clicar em editar
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(textPEl);
            range.collapse(false); // false coloca o cursor no final
            sel.removeAllRanges();
            sel.addRange(range);
        });

        paragrafoAnt.id = 'paragrafo'+ (j - 1);

        remove_section(id, j);
    } 
    
    sectionEl.remove();
	respostasString.splice((id - 1), 1);
	containerPEl.removeChild(paragrafoEl);
	qtdePalavras--;

    if(qtdePalavras > 0){
        Setnumeditavel(qtdePalavras);
        SetsectionEditavel(bauPALAVRAS[Getnumeditavel(true)].section);
        SetarCrosshairSection(sectionEditavel);
    }
    else{
        AlternarVisibilidadeBotao();
        Setnumeditavel(qtdePalavras);
    }

    const { ExcluirPalavraNoIndice_i_db } = await import("../lib/rascunhoeditor.js");  
    ExcluirPalavraNoIndice_i_db(id - 1);
    AlternarCopyTrash();
}

var pastSection = null;
export async function SetarCrosshairSection(section){
    if(pastSection){pastSection.style.cursor = 'no-drop'};    
    if(!menuModule){
        menuModule = await import(/* webpackChunkName: "menulateral" */ './menulateral.js');
    }
    const { interruptor } = menuModule;
    if(interruptor(false)){
        section.style.cursor = 'crosshair';
    }
    else{
        section.style.cursor = 'no-drop';
    }
    pastSection = section;
}

export function remove_focus(evt){
	if(evt.key === 'Enter'){
		evt.preventDefault(); // Impede a quebra de linha
		evt.target.blur(); // Remove o foco do elemento
	}
}

//funcao para gerar automaticamente um conteudo quando adicionado palavra
async function GerarConteudoMagico(palavraMagica){
    if(clickMagicWand && qtdePalavras == (qtdeConteudos + 1)){
        const { SalvarConteudo_i_db } = await import("../lib/rascunhoeditor.js");
        inputcEl.value = `${t.js_messages.describe_prefix}"${palavraMagica}"`;
		await adiciona_conteudo();
        SalvarConteudo_i_db(conteudosString[qtdeConteudos - 1]);
		inputcEl.value = '';
	}
}

//funcao para adicionar conteudo da palavra//
export async function adiciona_conteudo(e, texto = null){
    if(texto){
        inputcEl.value = texto; 
    }
    if(inputcEl.value != ''){
        const { AlternarVisibilidadeBotao } = await import("./copy/copytext.js");
        conteudoEl = inputcEl.value;
        inputcEl.value ='';

        conteudosString[qtdeConteudos] = conteudoEl;
        qtdeConteudos++;
        
        let pEl = document.createElement('p');	
        pEl.setAttribute('id', 'cont'+qtdeConteudos);
        let sectionEl = document.createElement("section");

        sectionEl.setAttribute('id', 'CONTEUDO'+qtdeConteudos);
        containerCEl.appendChild(pEl);
        pEl.innerHTML = `<span class="roxo">${qtdeConteudos}</span>
        <span id="contPEl${qtdeConteudos}" class="no-break" contenteditable="true">${conteudoEl}</span>
        <div class="container-remove-edit-btn">
            <button id="editBtnC${qtdeConteudos}"><i class="fa-solid fa-pen-to-square edit-green"></i></button>
            <button id="removeBtnC${qtdeConteudos}"><i class="fa-solid fa-trash-can trash-red"></i></button>
        </div>`;

        pEl.addEventListener('keydown', remove_focus)

        let contPEl = document.getElementById('contPEl'+qtdeConteudos);
        contPEl.addEventListener('focusout', EditContPEl);

        let removeBtnC = document.getElementById('removeBtnC'+qtdeConteudos);
        removeBtnC.addEventListener('click', remove_conteudo);

        let editBtn = document.getElementById('editBtnC'+qtdeConteudos);
        editBtn.addEventListener('click', () => {
            contPEl.focus();
            // Opcional: Colocar o cursor no final do texto ao clicar em editar
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(contPEl);
            range.collapse(false); // false coloca o cursor no final
            sel.removeAllRanges();
            sel.addRange(range);
        });

        AlternarVisibilidadeBotao();
        AlternarCopyTrashCont();
    }
}

export async function EditContPEl(evt){
    const { EditarConteudo_i_db } = await import("../lib/rascunhoeditor.js");
	var target = evt.target;
	var id = (target.id.split("contPEl")[1]);
	conteudosString[id-1] = target.textContent;
    EditarConteudo_i_db(id - 1, target.textContent);
}

//funcao para remover conteudo//
async function remove_conteudo(evt, identificador){
    var id;
    if(identificador)
        id = identificador;
    else{
        id = evt.currentTarget.id.split('C');
        id = parseInt(id[1]);        
    }
    
    const promises = [
        import("../lib/rascunhoeditor.js"),
        import("./copy/copytext.js"),
    ]
    const [rascunhoMod, copyMod] = await Promise.all(promises);
    const { ExcluirConteudoNoIndice_i_db } = rascunhoMod;
    const { AlternarVisibilidadeBotao } = copyMod;
    
    let conteudoEl = document.getElementById('cont'+id);
    
    for(var i = id; i <= qtdeConteudos; i++){
        let conteudoAnt = document.getElementById('cont'+ i);
        conteudoAnt.innerHTML = `<span class="roxo">${(i - 1)} - </span>
        <span id="contPEl${(i-1)}" class="no-break" contenteditable="true">${conteudosString[i - 1]}</span>
        <div class="container-remove-edit-btn">
            <button id="editBtnC${(i-1)}"><i class="fa-solid fa-pen-to-square edit-green"></i></button>
            <button id="removeBtnC${(i-1)}"><i class="fa-solid fa-trash-can trash-red"></i></button>
        </div>`;		
        conteudoAnt.id = 'cont'+ (i - 1);	
        
        conteudoAnt.addEventListener('keydown', remove_focus);
        let contPEl = document.getElementById('contPEl'+(i-1));
        contPEl.addEventListener('focusout', EditContPEl);
     
        let editBtn = document.getElementById('editBtnC'+(i-1));
            editBtn.addEventListener('click', () => {
            contPEl.focus();
            // Opcional: Colocar o cursor no final do texto ao clicar em editar
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(contPEl);
            range.collapse(false); // false coloca o cursor no final
            sel.removeAllRanges();
            sel.addRange(range);
        });
    }

    conteudosString.splice((id - 1), 1);
    containerCEl.removeChild(conteudoEl);
    qtdeConteudos--;
    for(var i = 0; i < qtdeConteudos; i++){
        let removeBtnC = document.getElementById('removeBtnC'+(i+1));
        removeBtnC.addEventListener('click', remove_conteudo);
    }

    if(qtdeConteudos == 0){
        AlternarVisibilidadeBotao();
    }
    
    ExcluirConteudoNoIndice_i_db(id - 1);
    AlternarCopyTrashCont();
}

//funcao interruptora para magic wand
export function ConteudoMagico(evt, forceFlag = undefined){
    clickMagicWand = !clickMagicWand;
    if(forceFlag !== undefined){
        clickMagicWand = forceFlag;
    }
    if(clickMagicWand){
        btnMagicWand.style.color = "var(--aside-voce)";
    }
    else{
        btnMagicWand.style.color = "var(--feedback-negativo)";
    }
}

const containerPasteTextEl = document.getElementById("palavra-copy");
const containerRemoveTextEl = document.getElementById("remover-all-palavras");

export async function AlternarCopyTrash(){
    if(qtdePalavras === 0){
        containerPasteTextEl.style.display = "unset";
        containerRemoveTextEl.style.display = "none";
    }
    else{
        containerPasteTextEl.style.display = "none";
        containerRemoveTextEl.style.display = "unset";
    }
}

const containerPasteContEl = document.getElementById("conteudo-copy");
const containerRemoveContEl = document.getElementById("remover-all-conteudos");

export async function AlternarCopyTrashCont(){
    if(qtdeConteudos === 0){
        containerPasteContEl.style.display = "unset";
        containerRemoveContEl.style.display = "none";
    }
    else{
        containerPasteContEl.style.display = "none";
        containerRemoveContEl.style.display = "unset";
    }
}
