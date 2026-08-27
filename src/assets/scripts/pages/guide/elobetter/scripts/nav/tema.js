function SetaTema() {
    var tema = localStorage.getItem('tema');
    const htmlEl = document.documentElement;
    htmlEl.classList.remove('claro', 'escuro');

    switch (tema) {
        case "claro":
            localStorage.setItem('tema', 'escuro');
            htmlEl.classList.add('escuro');
            UpdateThemeUI();
            break;
        case "escuro":
            localStorage.setItem('tema', 'claro');
            htmlEl.classList.add('claro');
            UpdateThemeUI();
            break;
        default:
            localStorage.setItem('tema', 'claro');
            htmlEl.classList.add('claro');
            UpdateThemeUI();
            break;
    }
}

function UpdateThemeUI() {
    const currentTheme = localStorage.getItem('tema') || 'claro';
    const toggeThemeEl = document.getElementById("container-lampada");
    
    if (!toggeThemeEl) return;

    const icons = {
        'claro': '<i class="fa-solid fa-sun"></i>',
        'escuro': '<i class="fa-solid fa-moon"></i>'
    };

    toggeThemeEl.innerHTML = icons[currentTheme];
}


window.addEventListener('DOMContentLoaded', () => {
    let toggeThemeEl = document.getElementById("container-lampada");

    toggeThemeEl.addEventListener("click", SetaTema);
    UpdateThemeUI();
});