import { uid } from "../../menu/usuario";

//Funcao para salvar os dados das cruzadinhas
export function SalvarDadosLS(id, dados, chave) {
	//console.log(dados);
    // Obter os dados existentes do localStorage
    let eDadosLS = JSON.parse(localStorage.getItem('estadoDadosLS')) || {};

    // Se a cruzadinha não existir, inicialize um objeto vazio
    if (!eDadosLS[chave]) {
        eDadosLS[chave] = {};
    }
    
    // Adicionar ou atualizar o objeto com id como chave e palavra como valor
    eDadosLS[chave][id] = dados;

    // Atualizar o localStorage
    localStorage.setItem('estadoDadosLS', JSON.stringify(eDadosLS));
}
export function SalvarEstadoLS(id, palavra, chave) {
	// Obter os dados existentes do localStorage
	let eCruzadinhasLS = JSON.parse(localStorage.getItem('estadoCruzadinhasLS')) || {};
		
	// Se a cruzadinha não existir, inicialize um objeto vazio
	if (!eCruzadinhasLS[chave]) {
		eCruzadinhasLS[chave] = {};
	}
	// Adicionar ou atualizar o objeto com id como chave e palavra como valor
	eCruzadinhasLS[chave][id] = palavra;
	
	// Atualizar o localStorage
    localStorage.setItem('estadoCruzadinhasLS', JSON.stringify(eCruzadinhasLS));
}
export function SalvarVencimentoLS(titulo, novoLink) {
    // Obter os dados existentes do localStorage
    let usuarios = JSON.parse(localStorage.getItem('cruzadinhasVencidas')) || {};

    // Se o usuário não existir, inicialize um array vazio
    if (!usuarios[uid]) {
        usuarios[uid] = [];
    }

    // Verificar se o link já existe
	const normalizarLink = (link) => link.replace(/\/[a-z]{2}-[a-z]{2}\//, '/');
	novoLink = normalizarLink(novoLink);
    const existe = usuarios[uid].some(item => normalizarLink(item.link) === novoLink);

	// Se o link não existir, adicionar o novo objeto com título e link
    if (!existe) {
        usuarios[uid].push({titulo: titulo, link: novoLink});
    }

    // Atualizar o localStorage
    localStorage.setItem('cruzadinhasVencidas', JSON.stringify(usuarios));
}
export function SalvarJogandoLS(titulo, novoLink) {
    // Obter os dados existentes do localStorage
    let usuarios = JSON.parse(localStorage.getItem('cruzadinhasEmProgresso')) || {};

    // Se o usuário não existir, inicialize um array vazio
    if (!usuarios[uid]) {
        usuarios[uid] = [];
    }

    // Verificar se o link já existe
	const normalizarLink = (link) => link.replace(/\/[a-z]{2}-[a-z]{2}\//, '/');
    novoLink = normalizarLink(novoLink);
	const existe = usuarios[uid].some(item => normalizarLink(item.link) === novoLink);

    // Se o link não existir, adicionar o novo objeto com título e link
    if (!existe) {
        usuarios[uid].push({titulo: titulo, link: novoLink});
    }

    // Atualizar o localStorage
    localStorage.setItem('cruzadinhasEmProgresso', JSON.stringify(usuarios));
}

export function SalvarDicasLS(dicas, chave) {
	// Obter os dados existentes do localStorage
	let eCruzadinhasLS = JSON.parse(localStorage.getItem('estadoDicasLS')) || {};
		
	// Se a cruzadinha não existir, inicialize um objeto vazio
	if (!eCruzadinhasLS[chave]) {
		eCruzadinhasLS[chave] = {};
	}
	// Adicionar ou atualizar o objeto com id como chave e palavra como valor
	eCruzadinhasLS[chave] = dicas;
	
	// Atualizar o localStorage
    localStorage.setItem('estadoDicasLS', JSON.stringify(eCruzadinhasLS));
}