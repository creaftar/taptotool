const palavrasCartao = document.getElementById("respostas");

export async function GerarPalavras(){
    const { bauPalavras } = await import("../grid/grid");
    const fragmento = document.createDocumentFragment();
    bauPalavras.forEach(palavra => {
        const text = palavra.inverso ? palavra.text.split('').reverse().join('') : palavra.text;
        palavra.textoCorreto = text;
        const pEl = CriarPalavra(text, palavra.id);
        palavra.div = pEl;
        fragmento.append(pEl);
    });

    palavrasCartao.append(fragmento);
}

export function CriarPalavra(texto, id){
    let pEl = document.createElement('p');	

    pEl.classList.add("paragrafos");
    pEl.id = 'paragrafo'+id;
    
    pEl.innerHTML = `<span class="roxo">${id + 1} - </span>
    <span id="textPEl${id}" class="no-break">${texto}</span>
    `;

    return pEl;
}

export function MarcarCorreta(pEl){
    pEl.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
    setTimeout(()=>{
        pEl.classList.add("checked");
    }, 300);
}