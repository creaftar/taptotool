let toggeThemeEl = document.getElementById("toggleTheme");

toggeThemeEl.addEventListener("click", SetaTema);

function SetaTema() {
    var tema = localStorage.getItem('tema');
    const htmlEl = document.documentElement; // Referência correta ao <html>

    // Função auxiliar para limpar classes de tema anteriores
    htmlEl.classList.remove('claro', 'dim', 'escuro');

    switch (tema) {
        case "claro":
            localStorage.setItem('tema', 'dim');
            toggeThemeEl.innerHTML = `<i class="fa-solid fa-circle-half-stroke"></i>`;
            htmlEl.classList.add('dim');
            break;
        case "dim":
            localStorage.setItem('tema', 'escuro');
            toggeThemeEl.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            htmlEl.classList.add('escuro');
            break;
        case "escuro":
            localStorage.setItem('tema', 'claro');
            htmlEl.classList.add('claro');
            toggeThemeEl.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            break;
        default:
            localStorage.setItem('tema', 'claro');
            toggeThemeEl.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            htmlEl.classList.add('claro');
            break;
    }
}

function UpdateThemeUI() {
    const currentTheme = localStorage.getItem('tema') || 'claro';
    const toggeThemeEl = document.getElementById("toggleTheme");
    
    if (!toggeThemeEl) return;

    const icons = {
        'claro': '<i class="fa-solid fa-sun"></i>',
        'dim': '<i class="fa-solid fa-circle-half-stroke"></i>',
        'escuro': '<i class="fa-solid fa-moon"></i>'
    };

    toggeThemeEl.innerHTML = icons[currentTheme];
}

UpdateThemeUI();