export async function RemoverProgressoLS(url){
	let usuarios = JSON.parse(localStorage.getItem('cruzadinhasEmProgresso')) || {};
	
	const normalizarLink = (link) => link.replace(/\/[a-z]{2}-[a-z]{2}\//, '/');
    
	const { RecuperarJogandoLS } = await import("./recuperar");
	const { uid } = await import ("../../menu/usuario");
	usuarios[uid] = RecuperarJogandoLS().filter(item => normalizarLink(item.link) !== normalizarLink(url));
	localStorage.setItem('cruzadinhasEmProgresso', JSON.stringify(usuarios));
}