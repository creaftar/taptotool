import { db } from "../../ferramentas/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore/lite";

export let latestVersion = "16.13.1"; // Versão padrão inicial (fallback)

export async function CarregarVersao() {
    try {
        const resVersion = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await resVersion.json();
        latestVersion = versions[0];
    } catch (e) {
        console.error("Erro ao obter versão do DDragon:", e);
    }
}

export let _lastUpdate;

export async function BuscarPerfil() {
    const snap = await getDoc(doc(db, "account", "jiyuuwo-br1"));
    
    if (snap.exists()) {
        _lastUpdate = snap.data().ultimaAtualizacao;
        return snap.data();
    }

    return null;
}

export async function AtualizarPerfil(){
    try {
        const res = await fetch("https://crivras.vercel.app/api/riot?nome=jiyuu%20wo&tag=BR1");
        const perfil = await res.json();
        _lastUpdate = new Date().toISOString(); 
        
        await SalvarPerfil(perfil);
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
    }
}

async function SalvarPerfil(perfil){
    const idDocumento = perfil.puuid || `${perfil.nome.replace(/\s+/g, '').toLowerCase()}-${perfil.tag.toLowerCase()}`;
    try {
        const usuarioRef = doc(db, "account", idDocumento);
        await setDoc(usuarioRef, {
            nome: perfil.nome,
            tag: perfil.tag,
            nivel: perfil.nivel,
            iconeId: perfil.iconeId,
            ranking: perfil.ranking,
            ultimaAtualizacao: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error(error);
    }
}