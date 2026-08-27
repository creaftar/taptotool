import { uid } from "../../menu/usuario";

export function RecuperarDadosLS(chave, id) {
    let eDadosLS = JSON.parse(localStorage.getItem('estadoDadosLS')) || {};
    if (eDadosLS[chave] && eDadosLS[chave][id]) {
        return eDadosLS[chave][id];
    } else {
        return []; // Retorna um array vazio se o usuário não existir
    }
}

export function RecuperarEstadoLS(chave){
    let eCruzadinhasLS = JSON.parse(localStorage.getItem('estadoCruzadinhasLS')) || {};
    return eCruzadinhasLS[chave] || {}; // Retorna um array vazio se o usuário não existir
}

export function RecuperarCruzadinhasLS() {
    let usuarios = JSON.parse(localStorage.getItem('cruzadinhasVencidas')) || {};
    return usuarios[uid] || []; // Retorna um array vazio se o usuário não existir
}

export function RecuperarJogandoLS() {
    let usuarios = JSON.parse(localStorage.getItem('cruzadinhasEmProgresso')) || {};
    return usuarios[uid] || []; // Retorna um array vazio se o usuário não existir
}

export function RecuperarDicasLS(chave){
    let eCruzadinhasLS = JSON.parse(localStorage.getItem('estadoDicasLS')) || {};
    return eCruzadinhasLS[chave] || 0;
}