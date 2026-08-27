import { BuscarPerfil, CarregarVersao, latestVersion, AtualizarPerfil, _lastUpdate } from "./dados";

const imgEl = document.getElementById("container-img-perfil");
const nivelEl = document.getElementById("perfil-nivel");
const nickAccountEl = document.getElementById("nickname");
const tagAccountEl = document.getElementById("tag-br1");
const lastUpdateEl = document.getElementById("atualizacao-perfil");
const atualizarBtn = document.getElementById("atualizar-perfil");
const eloEl = document.getElementById("elo-perfil");

const copiarBtn = document.getElementById("copiar-perfil"); 

const rankEl = document.getElementById("tier-perfil-name");
const divisionEl = document.getElementById("tier-perfil-division");
const lpEl = document.getElementById("tier-perfil-lp");

const winsEl = document.getElementById("tier-perfil-win");
const lossesEl = document.getElementById("tier-perfil-losses");
const winrateEl = document.getElementById("tier-perfil-winrate");

let perfil = null;

const container = document.getElementById("myaccount");
const t = container && container.dataset.translations 
  ? JSON.parse(container.dataset.translations) 
  : {};

const tc = container && container.dataset.translationscurso 
  ? JSON.parse(container.dataset.translationscurso) 
  : {};

copiarBtn.addEventListener("click", CopiarNickname);
atualizarBtn.addEventListener("click", async () => {
    await AtualizarPerfil();
    VerificarEstadoBotao(); 
    AtualizarTextoTempo();
    AtualizarInterface(true);
});

async function AtualizarInterface(botaoChamando = false){
    if (!perfil || botaoChamando){
        if (botaoChamando)
            await AtualizarPerfil();
        perfil = await BuscarPerfil();
    }
    
    if (!perfil) return false;

    imgEl.innerHTML = "";
    imgEl.appendChild(GerarImg());
    
    nivelEl.textContent = perfil.nivel;
    nickAccountEl.textContent = perfil.nome + " "; 
    tagAccountEl.textContent = "#" + perfil.tag;

    AtualizarRank(perfil.ranking[0]);

    const eloContainer = document.getElementById("elo-perfil");
    eloContainer.innerHTML = "";
    eloContainer.appendChild(GerarImgElo(perfil.ranking[0].tier.toLowerCase()));
    
    AtualizarTextoTempo();
    VerificarEstadoBotao();
    
    setInterval(() => {
        VerificarEstadoBotao();
        AtualizarTextoTempo();
    }, 1000);

    return true;
}

function AtualizarRank(ranking){
    const wins = ranking.wins;
    const losses = ranking.losses;
    const totalJogos = wins + losses;

    const tierTraduzido = t[`tier_${ranking.tier.toLowerCase()}`] || ranking.tier;
    rankEl.textContent = tierTraduzido;
    
    if(ranking.tier === "MASTER" || ranking.tier === "GRANDMASTER" || ranking.tier === "CHALLENGER") {
        divisionEl.textContent = "";
    } else {
        divisionEl.textContent = " " + ranking.rank;
    }
    
    lpEl.textContent = `${ranking.leaguePoints} ${t.leaguePoints}`; 
    winsEl.textContent = ranking.wins;
    lossesEl.textContent = ranking.losses;

    const winrateCalculado = Math.ceil((wins / totalJogos) * 100);
    if (t.winrate) {
        winrateEl.textContent = t.winrate.replace("{value}", winrateCalculado);
    } else {
        winrateEl.textContent = `${winrateCalculado}% Winrate`;
    }
}

function GerarImg(){
    const imgDOM = document.createElement("img");
    imgDOM.id = "perfil-img";
    imgDOM.alt = tc.summoner_icon;
    imgDOM.width = 120; // Definido como número
    imgDOM.height = 120; // Definido como número
    imgDOM.loading = "eager";
    
    CarregarVersao();
    const urlOriginal = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${perfil.iconeId}.png`;
    
    // Otimização máxima: Redimensiona para 120x120, converte para webp e qualidade 75
    const urlOtimizada = `https://wsrv.nl/?url=${encodeURIComponent(urlOriginal)}&w=120&h=120&output=webp&q=80`;
    
    imgDOM.src = urlOtimizada;
    
    // Fallback de segurança: se o otimizador falhar, carrega o PNG original
    imgDOM.onerror = () => {
        imgDOM.onerror = null;
        imgDOM.src = urlOriginal;
    };
    
    return imgDOM;
}

async function CopiarNickname() {
    if (!perfil) return;

    const nickCompleto = `${perfil.nome} #${perfil.tag.toLowerCase()}`;

    try {
        await navigator.clipboard.writeText(nickCompleto);
        copiarBtn.innerHTML = `<i class="fa-solid fa-copy"></i>`;
        copiarBtn.classList.add("copiado");
        copiarBtn.classList.remove("nao-copiado");
        
        setTimeout(() => {
            copiarBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
            copiarBtn.classList.remove("copiado");
        copiarBtn.classList.add("nao-copiado");
        }, 2000);

    } catch (err) {
        console.error("Erro ao copiar o nickname: ", err);
    }
}

function AtualizarTextoTempo() {
    if (!_lastUpdate) {
        lastUpdateEl.textContent = t.time_never || "Nunca atualizado";
        return;
    }
    
    const agora = new Date();
    const ultimaData = new Date(_lastUpdate);
    const diferencaMs = agora - ultimaData; 

    const diferencaEmSegundos = Math.floor(diferencaMs / 1000);
    const diferencaEmMinutos = Math.floor(diferencaEmSegundos / 60);
    const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);

    let textoTempo = "";

    if (diferencaEmHoras >= 1) {
        const unit = diferencaEmHoras > 1 ? t.time_hours : t.time_hour;
        textoTempo = `${diferencaEmHoras} ${unit || "hora(s)"}`;
    } 
    else if (diferencaEmMinutos >= 1) {
        const unit = diferencaEmMinutos > 1 ? t.time_minutes : t.time_minute;
        textoTempo = `${diferencaEmMinutos} ${unit || "minuto(s)"}`;
    } 
    else {
        const segundos = diferencaEmSegundos <= 0 ? 1 : diferencaEmSegundos;
        const unit = segundos > 1 ? t.time_seconds : t.time_second;
        textoTempo = `${segundos} ${unit || "segundo(s)"}`;
    }

    if (t.last_update_format) {
        lastUpdateEl.textContent = t.last_update_format.replace("{time}", textoTempo);
    } else {
        lastUpdateEl.textContent = `Última atualização: há ${textoTempo}`;
    }
}

function VerificarEstadoBotao(){
    if (!_lastUpdate) {
        atualizarBtn.disabled = false;
        atualizarBtn.classList.remove("disabled");
        atualizarBtn.classList.add("enabled");
        atualizarBtn.textContent = "A"; // Texto padrão do seu botão
        return;
    }

    const agora = new Date();
    const ultimaData = new Date(_lastUpdate);
    const diferencaEmMinutos = (agora - ultimaData) / 1000 / 60;

    if (diferencaEmMinutos < 5) {
        atualizarBtn.disabled = true;
        atualizarBtn.classList.remove("enabled");
        atualizarBtn.classList.add("disabled");
    } else {
        atualizarBtn.disabled = false;
        atualizarBtn.classList.remove("disabled");
        atualizarBtn.classList.add("enabled");
    }
}

function GerarImgElo(ranking) {
    const imgDOM = document.createElement("img");
    imgDOM.id = "elo-perfil-img";
    
    // 1. Ajuste os atributos nativos de renderização para 64px (o tamanho real de exibição)
    imgDOM.width = 64;  
    imgDOM.height = 64; 
    imgDOM.loading = "eager";
    imgDOM.alt= tc.badge_current_elo;

    let urlOriginal = "";
    if (!ranking || ranking === "unranked") {
        urlOriginal = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png"; 
    } else {
        urlOriginal = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${ranking}.png`;
    }

    // 2. Peça ao wsrv.nl para gerar a imagem exatamente com o tamanho esperado de 96px (64px * 1.5)
    // Isso garante nitidez perfeita para telas de alta densidade sem pesar nada
    const urlOtimizada = `https://wsrv.nl/?url=${encodeURIComponent(urlOriginal)}&w=96&h=96&output=webp&q=80`;

    imgDOM.src = urlOtimizada;

    imgDOM.onerror = () => {
        imgDOM.onerror = null;
        imgDOM.src = urlOriginal;
        console.warn("Fallback acionado para imagem de elo.");
    };

    return imgDOM;
}

window.addEventListener('load', () => {
    AtualizarInterface();
}, { once: true });