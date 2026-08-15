let toggleThemeEl = document.getElementById("toggleTheme");
let htmlEl = document.documentElement;

toggleThemeEl.addEventListener('click', SetTheme);

function SetTheme(){
    if(localStorage.getItem('tema') == 'claro'){
        localStorage.setItem('tema', 'escuro');
        htmlEl.classList.remove('claro');
        htmlEl.classList.add('escuro');
    }
    else{
        localStorage.setItem('tema', 'claro');
        htmlEl.classList.remove('escuro');
        htmlEl.classList.add('claro');
    }
    ConfigTheme();
}

ConfigTheme();

/**
 * Função para definir o tema instantâneamente quando carregar a página e evitar FOUC (Flash of Unstyled Content)
 * @returns void
 */
function ConfigTheme(){
    if(localStorage.getItem('tema') == "claro"){
        toggleTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    else if(localStorage.getItem('tema') =="escuro"){
        toggleTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    else{
         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            toggleTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } 
        else {
            toggleTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }
}