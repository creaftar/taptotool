export async function SetupMenuEvents() {
    const promises = [
        import("./dica.js"),
        import("./gabarito.js"),
        import("./impressao.js"),
        import("./timer.js"),
        import("./volume.js"),
        import("./zoom.js")
    ];

    const modules = await Promise.all(promises);

    const { FirstStartTimer } = modules[3];
    
    FirstStartTimer();

    const liiconsEl = document.querySelectorAll('.menu-icones li');

    liiconsEl.forEach(li => {
        li.addEventListener('mouseover', function() {
            const icons_mensagemEl = this.querySelector('.info-icons');
            if (icons_mensagemEl) {
                icons_mensagemEl.style.display = 'flex';
            }
        });

        li.addEventListener('mouseout', function() {
            const icons_mensagemEl = this.querySelector('.info-icons');
            if (icons_mensagemEl) {
                icons_mensagemEl.style.display = 'none';
            }
        });
    });

    const liabsEl = document.getElementById("lista-absoluta");
    const divrelatEl = document.getElementById("div-relativa");

    if (liabsEl && divrelatEl) {
        liabsEl.addEventListener('mouseover', () => {
            divrelatEl.style.visibility = 'visible';
        });

        liabsEl.addEventListener('mouseout', () => {
            divrelatEl.style.visibility = 'hidden';
        });
    }
}