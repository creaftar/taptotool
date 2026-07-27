let relogioEl = document.getElementById("horario");
const dataAtual = new Date();

const lang = horario.dataset.lang || en;

// 2. Define as opções de formatação da data e hora
const opcoesFormatacao = {
    weekday: 'long', // Nome completo do dia da semana (ex: Segunda)
    year: 'numeric', // O ano (ex: 2025)
    month: 'long',   // Nome completo do mês (ex: dezembro)
    day: 'numeric',  // O dia do mês (ex: 15)
};

// 3. Formata a data usando o método toLocaleDateString()
// O primeiro argumento (undefined) usa a localidade/idioma do navegador do usuário.
const dataFormatada = dataAtual.toLocaleDateString(lang, opcoesFormatacao);

// 4. Encontra o elemento HTML e insere a data formatada
const elementoData = document.getElementById('data');
if (elementoData) {
    elementoData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);;
}
