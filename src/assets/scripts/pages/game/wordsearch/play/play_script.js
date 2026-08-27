export let uid = null;

export async function Inicializa_jogar(){
	const [ 
		removerZMod, anuncioMod, tradMod, menuMod, 
		fs_dadosMod, gridMod, palavrasMod
	] = await Promise.all([
		import("../../crossword/ferramentas/remover_zoom_mobile.js"), import("../../crossword/ferramentas/anuncio.js"),
        import("../../crossword/ferramentas/traducao/traducao.js"), import("./menulateral/menulateral_jogar.js"),
		import("./dados/firestore_dados.js"), import("./grid/grid.js"),
		import("./cartoes/palavras.js")
	]);
	const { ConfigurarZoom } = removerZMod;
	const { GerarAnuncios } = anuncioMod;
    const { EsconderLoading } = tradMod;
	const { SetupMenuEvents } = menuMod;
    const { SetDados } = fs_dadosMod;
	const { GerarGrid } = gridMod;
	const { GerarPalavras } = palavrasMod;

	await SetDados();
	GerarGrid();
	GerarPalavras();

    await MonitorarUsuario();
	ConfigurarZoom("wordsearch");
	SetupMenuEvents();
    //await set_dados();
	
	//import("../../ferramentas/remover_zoom_mobile.js")
    EsconderLoading();
	GerarAnuncios();
}

async function MonitorarUsuario(){
	const { IniciarMonitoramento } = await import("../../crossword/menu/usuario.js");
	   
	IniciarMonitoramento((user) => {
		if (user) {
			uid = user.uid;
		} else {
			uid = null;
		}
	});
}