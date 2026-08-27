const containerIdiomas = document.getElementById("container-idiomas");
const menuIdiomas = document.getElementById("menu-idiomas");

containerIdiomas.addEventListener("click", ExibirMenu);

async function ExibirMenu(){
    const { AdicionarVisibilidade } = await import("../ferramentas/el_visibilidade");

    AdicionarVisibilidade(menuIdiomas);
}