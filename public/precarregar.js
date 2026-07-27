
/*(function() {
    // Captura os parâmetros atuais da URL.
    const currentParams = new URLSearchParams(window.location.search);
    const newParams = new URLSearchParams();
    let paramsChanged = false;

    // Itera sobre cada parâmetro
    for (let [key, value] of currentParams.entries()) {
      // Ignora os parâmetros que começam com "usr"
      if (key.startsWith("usr")) {
        paramsChanged = true;
        continue;
      }
      // Se o parâmetro começa com "cr" mas não for exatamente "cr",
      // extrai o valor removendo os dois primeiros caracteres e usa "cr" como chave.
      if (key.startsWith("cr") && key !== "cr") {
        newParams.set("cr", key.substring(2));
        paramsChanged = true;
      } else {
        // Caso contrário, mantém o parâmetro original.
        newParams.set(key, value);
      }
    }

    // Ajusta o domínio: se o host contém "web.app", troca para "com"
    let newHost = window.location.host;
    if(newHost.includes("web.app")){
      newHost = newHost.replace("web.app", "com");
    }
    
    // Constrói a nova query string
    const newQueryString = newParams.toString();

    // Reconstrói a URL completa com o novo domínio e os parâmetros ajustados.
    const newUrl = window.location.protocol +
                   "//" +
                   newHost +
                   window.location.pathname +
                   (newQueryString ? "?" + newQueryString : "") +
                   window.location.hash;

    // Se detectarmos mudança nos parâmetros ou no host, redireciona.
    if (paramsChanged || window.location.host !== newHost) {
      window.location.replace(newUrl);
    }
  })();

  */
ConfigTheme();
/**
 * Função para definir o tema instantâneamente quando carregar a página e evitar FOUC (Flash of Unstyled Content)
 * @returns void
 */
function ConfigTheme(){
    let htmlEl = document.documentElement; // Mais performático que querySelector
    var themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    let temaSalvo = localStorage.getItem('tema');
    
    // Define qual tema aplicar
    let temaParaAplicar = temaSalvo;
    if (!temaSalvo) {
        temaParaAplicar = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
        localStorage.setItem('tema', temaParaAplicar);
    }

    // EM VEZ DE htmlEl.className = '', use classList.remove e add:
    if (temaParaAplicar === "claro") {
        htmlEl.classList.remove('escuro');
        htmlEl.classList.add('claro');
        if(themeColorMetaTag) themeColorMetaTag.setAttribute('content', 'rgb(255, 255, 255)');
    } else {
        htmlEl.classList.remove('claro');
        htmlEl.classList.add('escuro');
        if(themeColorMetaTag) themeColorMetaTag.setAttribute('content', '#0f0f0f');
    }
}