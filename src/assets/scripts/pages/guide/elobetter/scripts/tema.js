function ApplyTheme() {
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('tema');
    let themeToApply = savedTheme;

    if (!savedTheme) {
        themeToApply = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) 
            ? 'escuro' 
            : 'claro';
        localStorage.setItem('tema', themeToApply);
    }

    // Aplica a classe imediatamente
    htmlEl.className = themeToApply;

    // Opcional: Atualiza a meta tag de cor (é rápido o suficiente para ser crítico)
    const metaColors = {
        'claro': 'rgb(255, 255, 255)',
        'escuro': 'rgb(0, 0, 0)'
    };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', metaColors[themeToApply] || '#ffffff');
}

ApplyTheme();