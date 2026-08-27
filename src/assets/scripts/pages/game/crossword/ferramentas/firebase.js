let cache = null; // Vamos guardar o objeto COMPLETO aqui
export async function getFirebase() {
    // Se o cache já existe, retorna o objeto completo com todas as funções
    if (cache) return cache;

    const [
        { initializeApp, getApps },
        firestoreMod,
        authMod
    ] = await Promise.all([
        import("firebase/app"),
        import("firebase/firestore"),
        import("firebase/auth")
    ]);

    const firebaseConfig = {
		apiKey: "AIzaSyDqHDU9xXLRKHOVpDGLY97bwhbXog8sTjs",
		authDomain: "creaftar.firebaseapp.com",
		projectId: "creaftar",
		storageBucket: "creaftar.firebasestorage.app",
		messagingSenderId: "356123794082",
		appId: "1:356123794082:web:88daff777c4e67cf0d15fb"
	};

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    
    const db = firestoreMod.getFirestore(app);
    const auth = authMod.getAuth(app);

    /*if (import.meta.env.DEV) {
        console.log("Tentando conectar aos emuladores...");
        firestoreMod.connectFirestoreEmulator(db, '127.0.0.1', 8080);
        authMod.connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }*/
    // Salvamos TUDO no cache uma única vez
    cache = { 
        db, 
        auth, 
        ...firestoreMod, 
        ...authMod 
    };

    return cache; 
}