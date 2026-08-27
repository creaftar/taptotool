export let uid = null;

export async function Inicializa_jogar(set_dados){
	const [ removerZMod, anuncioMod] = await Promise.all([
		import("../ferramentas/remover_zoom_mobile.js"),
		import("../ferramentas/anuncio.js")
	]);
	const { ConfigurarZoom } = removerZMod;
	const { GerarAnuncios } = anuncioMod;
	
    await MonitorarUsuario();
	ConfigurarZoom("jogar");
	await set_dados();
	
	import("./menulateral_jogar.js"),
	import("../ferramentas/remover_zoom_mobile.js")

	GerarAnuncios();
}

async function MonitorarUsuario(){
	const { IniciarMonitoramento } = await import("../menu/usuario.js");
	   
	IniciarMonitoramento((user) => {
		if (user) {
			uid = user.uid;
		} else {
			uid = null;
		}
	});
}