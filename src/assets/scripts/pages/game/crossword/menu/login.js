import { EsconderLoading } from "../ferramentas/traducao/traducao.js";

let db, auth, 
    collection, doc, setDoc, increment, getDoc,             // Firestore
    signOut, signInWithPopup,            // Auth Base
    signInWithEmailAndPassword, createUserWithEmailAndPassword, // Auth Email
    GoogleAuthProvider, TwitterAuthProvider, OAuthProvider;  // Providers

let usRef, estRef, qtcRef;
let provider, twitterProvider, yahooProvider;

let navEl = document.getElementById('navegacao');
let t = JSON.parse(navEl.dataset.translations);

const googleLoginBtn = document.querySelectorAll('.googleLoginBtn');
const twitterLoginBtn = document.querySelectorAll('.twitterLoginBtn');
const yahooLoginBtn = document.querySelectorAll('.yahooLoginBtn');

let conexaoEl = document.getElementById('conexao');
let sairEl = document.querySelectorAll('.sair');
let criarBtn = document.getElementById('criarBtn');
let entrarBtn = document.getElementById('entrarBtn');

let tituloEl = document.getElementById('inptitulo');
let senhaEl = document.getElementById('inpsenha');
let confsenhaEl = document.getElementById('confinpsenha');
let userEl = document.getElementById('inpuser');
let passEl = document.getElementById('inppass');
let conexaoEnt = document.getElementById('conexaoEnt');

await garantirFirebase();

entrarBtn.addEventListener('click', async function(event){
    event.preventDefault();
    const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
    MostrarLoading(1.2);
	signInWithEmailAndPassword(auth, userEl.value, passEl.value)
		.then(function loga_acc(){
			conexaoEnt.style.cssText = 'color:var(--aside-voce)';
		})
		.catch(function(error){
			conexaoEnt.style.cssText = 'color:var(--close-modal)';
			conexaoEnt.textContent = GerarMsgErro(error);
            EsconderLoading();
		})
    EsconderLoading();
});

criarBtn.addEventListener('click', async function(event){
	event.preventDefault();
    if(confsenhaEl.value == senhaEl.value){
        const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading(1.2);
        createUserWithEmailAndPassword(auth, tituloEl.value, senhaEl.value)
        .then(async function cria_user(credenciais){
            await Promise.all([
                setDoc(doc(usRef, credenciais.user.uid), {qtdeCruzadinhas: 0}),
                setDoc(qtcRef, { qtdeUsuarios: increment(1) }, { merge: true })
            ]);		
            var acerto = tituloEl.value.split('@');
            conexaoEl.style.cssText = 'color:green';
        })
        .catch(function(error){
            conexaoEl.style.cssText = 'color:var(--close-modal)';
            conexaoEl.textContent = GerarMsgErro(error);
            EsconderLoading();
        })
        EsconderLoading();
    }
    else{
        conexaoEl.textContent = GerarMsgErro("passwords_dont_match");
    }
});

yahooLoginBtn.forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.preventDefault();
        const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading(1.2);
        try {
            var result = await signInWithPopup(auth, yahooProvider);
            var user = result.user;
            var userDocRef = doc(usRef, user.uid);
            var userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, { qtdeCruzadinhas: 0 });
                await setDoc(qtcRef, { qtdeUsuarios: increment(1) }, { merge: true });
            }
        } 
        catch (error) {
            console.error('Erro ao fazer login com Yahoo:', error);
            console.error('Código do erro:', error.code);
            console.error('Mensagem do erro:', error.message);
            conexaoEnt.style.cssText = 'color:var(--close-modal)';
            conexaoEnt.textContent = t.auth_errors.operation_not_allowed;
            EsconderLoading();
        }
        EsconderLoading();
    });
});

googleLoginBtn.forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading(1.2);

        try {
            var result = await signInWithPopup(auth, provider);
            var user = result.user;
            var userDocRef = doc(usRef, user.uid);
            var userDoc = await getDoc(userDocRef);

			if (!userDoc.exists()) {
                await setDoc(userDocRef, { qtdeCruzadinhas: 0 });
                await setDoc(qtcRef, { qtdeUsuarios: increment(1) }, { merge: true });
            }
        } 
		catch (error) {
            conexaoEnt.style.cssText = 'color:var(--close-modal)';
            conexaoEnt.textContent = t.auth_errors.operation_not_allowed;
            EsconderLoading();
        }
        EsconderLoading();
    });
});

twitterLoginBtn.forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.preventDefault();

        const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading(1.2);
        
        try {
            var result = await signInWithPopup(auth, twitterProvider);
            var user = result.user;
            var userDocRef = doc(usRef, user.uid);
            var userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, { qtdeCruzadinhas: 0 });
                await setDoc(qtcRef, { qtdeUsuarios: increment(1) }, { merge: true });
            }
        } 
        catch (error) {
            conexaoEnt.style.cssText = 'color:var(--close-modal)';
            conexaoEnt.textContent = t.auth_errors.operation_not_allowed;
            EsconderLoading();
        }
        EsconderLoading();
    });
});

sairEl.forEach(sair => {
    sair.addEventListener('click', async function(){
        const { MostrarLoading } = await import("../ferramentas/traducao/traducao.js");
        MostrarLoading(1.2);
        
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao sair:", error);
        } finally {
            EsconderLoading();
        }
    });
});

function GerarMsgErro(error){
    var errorCode;
    if(error.code){
        errorCode = error.code.replace('auth/', '').replace(/-/g, '_');
    }
    const mensagem = t.auth_errors[errorCode || error] || error.message;
    return mensagem;
}

export async function garantirFirebase() {
    if (auth) return; // Já inicializado
    
    const { getFirebase } = await import ("../ferramentas/firebase.js");
    
    const fb = await getFirebase();
    
    db = fb.db;
    auth = fb.auth;
    collection = fb.collection;
    doc = fb.doc;
    setDoc = fb.setDoc;
    increment = fb.increment;
    getDoc = fb.getDoc;
    signOut = fb.signOut;
    signInWithPopup = fb.signInWithPopup;
    signInWithEmailAndPassword = fb.signInWithEmailAndPassword;
    createUserWithEmailAndPassword = fb.createUserWithEmailAndPassword;
    GoogleAuthProvider = fb.GoogleAuthProvider;
    TwitterAuthProvider = fb.TwitterAuthProvider;
    OAuthProvider = fb.OAuthProvider;

    // Inicialização dos Refs e Providers
    estRef = collection(db, 'estatisticas');
    qtcRef = doc(estRef, "QtdeTotalCruzadinhas");
    usRef = collection(db, 'usuarios');

    provider = new GoogleAuthProvider();
    twitterProvider = new TwitterAuthProvider();
    yahooProvider = new OAuthProvider('yahoo.com');
}