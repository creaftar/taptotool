export let uid = null;
let conexaoEl = document.getElementById('conexao');
let conexaoEnt = document.getElementById('conexaoEnt');
let navEl = document.getElementById('navegacao');
let t = JSON.parse(navEl.dataset.translations);

export async function IniciarMonitoramento(callbackDePagina) {
    const { getFirebase } = await import ("../ferramentas/firebase.js");
    
    const fb = await getFirebase();

    const { auth, onAuthStateChanged } = fb;
    
    onAuthStateChanged(auth, async (user) => {
        uid = user ? user.uid : null;
        
        GerarImagemUsuario(user);
        
        if (callbackDePagina) {
            callbackDePagina(user);
        }
    });
}

export function GerarImagemUsuario(user) {
    let conectarEl = document.getElementById('conectar');
    if (!user) {
        conectarEl.innerHTML = `
            <div class="container-foto-perfil">
                <i class="icons fa-solid fa-user" id="userIcon"></i>
            </div>`;
        conexaoEl.textContent = t.nav.disconnected;
        conexaoEnt.textContent = t.nav.disconnected;
        return;
    }

    conexaoEl.style.cssText = 'color:var(--aside-voce);';
    conexaoEnt.style.cssText = 'color:var(--aside-voce);';
    conexaoEl.textContent = t.nav.connected;
    conexaoEnt.textContent = t.nav.connected;

    if (user.photoURL) {
        conectarEl.innerHTML = `
            <div class="container-foto-perfil">
                <img src="${user.photoURL}" alt="user icon">
            </div>`;
    }
}