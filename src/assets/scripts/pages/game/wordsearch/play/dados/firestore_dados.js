export let fb;
export let gridFirestore;
export let bauPalavrasFirestore;
export let podeDica;
export let podeGbrt;
export let gridHeight;
export let gridWidth;
export let titulo;

let cpRef;

export async function SetDados() {
    const [
        { getFirebase },
    ] = await Promise.all([
        import("../../../crossword/ferramentas/firebase.js"),
    ]);

    fb = await getFirebase();
    cpRef = fb.collection(fb.db, 'cruzadas_WS');

    const url = window.location.href;
    const cdg = url.split("?ws=");
    if (cdg[1]) {
        try {
            const refDB = fb.doc(cpRef, cdg[1]);
            const item = await fb.getDoc(refDB);
            if(!item.data()){
                await RedirecionarUsuario();
            }
            const data = item.data();
            titulo = data.titulo;
            gridFirestore = data.gridLetras;
            bauPalavrasFirestore = data.bauSimplificado; 
            podeDica = data.dica;
            podeGbrt = data.gbrt;
            gridHeight = data.gridHeight;
            gridWidth = data.gridWidth;
            //import("./seo.js");
        }
        catch (error) {
            console.error(error);
        }
    }
}