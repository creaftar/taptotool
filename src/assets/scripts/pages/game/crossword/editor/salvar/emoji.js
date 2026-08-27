const btnEmojiSalvar = document.getElementById("btn-emoji-salvar");
const tituloInput = document.getElementById("titulo-input");

btnEmojiSalvar.addEventListener("click", CriarSeletor);

let EMOJI_DATA = {};

function CarregarEmojis(){
    EMOJI_DATA = {
        "Populares": ["😂", "❤️", "🤣", "👍", "😭", "🙏", "😘", "🥰", "😍", "😊", "🎉", "😁", "💕", "🥺", "😅", "🔥", "🙄", "✨", "🤷‍♂️", "💔", "💖", "💙", "😢", "🤔", "😆", "😋", "👏", "💓", "😫", "🤞", "😬", "🥵", "😱", "☀️", "🥳", "🤩", "💜", "😜", "😔", "😉", "🥱", "🌈", "💀", "🤡", "🎈", "😇", "🌹", "🤙", "🤪", "🤤", "💩", "🤠", "🤐", "🧐", "😴", "🤫", "🤑", "🤒", "🤨", "🧡", "💛", "💚", "🖤", "🤍", "🤎", "💯", "💢", "💥", "💫", "💦", "💨"],
        "Corpo": ["🕶️", "💣", "💬", "👁️", "👅", "👄", "🧠", "🦾", "🦵", "👣", "👂", "👃", "🦷", "🦴", "🩸", "🩹", "🧬", "🧤", "💍", "💎", "👑", "👔", "👕", "👖", "🧣", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "💄", "💋"],
        "Rostos": ["🤩", "🤯", "🥳", "😎", "🥵", "🥶", "🤢", "🤮", "🤧", "😵‍💫", "🥴", "🥺", "🤠", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "🤞", "🤏", "✋", "🤚", "👋"],
        "Natureza": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷", "🦂", "🐢"],
        "Comida": ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🫑", "🥔", "🍠", "🥐", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓"],
        "Atividades": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒", "🎮", "🕹️", "🎲", "🧩", "🧸", "🎨", "🧵", "🧶", "📱", "💻", "⌨️", "🖱️", "🖨️", "📷", "📸", "📹", "📺", "📻", "🎙️", "🎚️", "🎛️", "⏱️", "⏲️", "⏰", "⏳", "⌛", "📡", "🔋"],
        "Lugares": ["🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅"]
    };
}

async function CriarSeletor(){
    if(Object.keys(EMOJI_DATA).length === 0)
        CarregarEmojis();

    const previewCardEmojis = document.getElementById("preview-card-emojis");
    const { AlternarVisibilidade } = await import("../../ferramentas/el_visibilidade");
    AlternarVisibilidade(previewCardEmojis);
    TrocarPagina("Populares");
}

function TrocarPagina(categoria) {
    const grid = document.getElementById("container-grid-emojis");
    grid.innerHTML = ""; // Limpa os emojis atuais

    const fragment = document.createDocumentFragment();

    EMOJI_DATA[categoria].forEach(emoji => {
        const span = document.createElement("span");
        span.textContent = emoji;
        span.classList.add("emoji-item"); // Use esta classe para estilizar no CSS
        
        // Adiciona o evento de clique para quando o usuário escolher o emoji
        span.addEventListener("click", () => {
            tituloInput.value += emoji;
        });

        fragment.appendChild(span);
    });

    grid.appendChild(fragment);
}

const footerEmojis = document.getElementById("footer-emojis-salvar");

footerEmojis.addEventListener("click", (event) => {
    // Verifica se clicou em um botão de categoria
    const btn = event.target.closest(".tab-btn");
    
    if (btn) {
        const categoria = btn.dataset.categoria;
        TrocarPagina(categoria);
        
        // Opcional: destaque visual na aba ativa
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }
});