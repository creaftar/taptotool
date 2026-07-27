import { 
  MostrarPasteText, 
  OcultarPasteText
 } from '../../../utility/copytext/copytext.js'

import { SetAreaText, SetResultText, SetEventListener } from '../../../utility/copytext/copytext.js';

let areaTextEl = document.getElementById("textTip");
let caracteresEl = document.getElementById("caracteres");
let palavrasEl = document.getElementById("palavras");
let frasesEl = document.getElementById("frases");
let paragrafosEl = document.getElementById("paragrafos");
let caracteresSemEspacoEl = document.getElementById("caracteres-sem-espaco");
let linhasEl = document.getElementById("linhas");

let t = JSON.parse(areaTextEl.dataset.i18n);

areaTextEl.addEventListener('input', AtualizarContagem);

let resultText = `${t.char_no_spaces}: ${caracteresSemEspacoEl.textContent}\n` +
             `${t.characters}: ${caracteresEl.textContent}\n` +
             `${t.words}: ${palavrasEl.textContent}\n` +
             `${t.sentences}: ${frasesEl.textContent}\n` +
             `${t.lines}: ${linhasEl.textContent}\n` +
             `${t.paragraphs}: ${paragrafosEl.textContent}`;   

await SetAreaText(areaTextEl);
await SetResultText(resultText);
await SetEventListener(AtualizarContagem);

const currentLang = document.documentElement.lang || 'en';

// Criamos os motores de segmentação fora da função para ganhar performance
// Assim o navegador não precisa "reaprender" as regras da língua a cada tecla digitada
const wordSegmenter = new Intl.Segmenter(currentLang, { granularity: 'word' });
const sentenceSegmenter = new Intl.Segmenter(currentLang, { granularity: 'sentence' });

async function AtualizarContagem() {
  // .normalize('NFC') garante que caracteres combinados (como acentos) 
  // sejam tratados de forma consistente, evitando bugs em strings complexas.
  const textoRaw = areaTextEl.value || "";
  const texto = textoRaw.normalize('NFC');
  
  // 1. CARACTERES (Unicode-aware)
  const arrayCaracteres = [...texto];
  caracteresEl.textContent = arrayCaracteres.length;

  // 2. CARACTERES SEM ESPAÇO
  // Filtra espaços, quebras de linha e tabs
  const textoSemEspaco = arrayCaracteres.filter(c => !/\s/.test(c));
  caracteresSemEspacoEl.textContent = textoSemEspaco.length;

  // --- LÓGICA INTERNACIONAL ---
  
  // 3. PALAVRAS
  const wordSegments = wordSegmenter.segment(texto);
  const numPalavras = [...wordSegments].filter(s => s.isWordLike).length;
  palavrasEl.textContent = numPalavras;

  // 4. FRASES
  const sentenceSegments = sentenceSegmenter.segment(texto);
  const numFrases = [...sentenceSegments].filter(s => s.segment.trim().length > 0).length;
  frasesEl.textContent = numFrases;

  // --- ESTRUTURA ---

  // 5. PARÁGRAFOS (Melhorado para entender diferentes tipos de quebra)
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  paragrafosEl.textContent = paragrafos.length;

  // 6. LINHAS
  const linhas = texto.length > 0 ? texto.split('\n') : [];
  linhasEl.textContent = linhas.length;
  
  // UI Helpers
  texto.length > 0 ? OcultarPasteText() : MostrarPasteText();

  // Atualiza o texto de cópia
  resultText = `${t.char_no_spaces}: ${caracteresSemEspacoEl.textContent}\n` +
             `${t.characters}: ${caracteresEl.textContent}\n` +
             `${t.words}: ${palavrasEl.textContent}\n` +
             `${t.sentences}: ${frasesEl.textContent}\n` +
             `${t.lines}: ${linhasEl.textContent}\n` +
             `${t.paragraphs}: ${paragrafosEl.textContent}`;

  SetResultText(resultText);
}