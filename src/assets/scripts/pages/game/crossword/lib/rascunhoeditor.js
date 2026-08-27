import { i_db } from "./db";

var _chave = "projeto_atual";

export function SetChave(chave){
    _chave = chave;
}

export async function GetRascunhoLocal(){
    return await i_db.rascunhosEditor.get(_chave);
}

export async function GarantirRascunhoExistente(titulo = "", resposta = "", conteudodb = "", vhdb = "", vwdb = "", flexdir = "") {
    try {
        const rascunho = await i_db.rascunhosEditor.get(_chave);
        
        if (!rascunho) {
            await i_db.rascunhosEditor.put({
                chave: _chave,
                titulo: titulo,
                resposta: resposta,    // String vazia ou Array [] conforme seu padrão
                conteudodb: conteudodb,
                vhdb: vhdb,
                vwbd: vwdb,
                flexdir: flexdir,
                quadro: 34/*,
                remover: false*/
            });
        }/*else {
            console.log("Rascunho já existente encontrado: ");
            console.log(rascunho);
        }*/
    } catch (error) {
        console.error("Erro ao verificar/iniciar rascunho:", error);
    }
}

export async function SalvarRascunhoEditor_i_db(titulo, palavras, conteudos, vh, vw, flexdir, quadro) {
    try {
        await i_db.rascunhosEditor.put({
            chave: _chave,
            titulo: titulo,
            resposta: palavras,
            conteudodb: conteudos,
            vhdb: vh,
            vwbd: vw,
            flexdir: flexdir,
            quadro: quadro
        });
    } catch (error) {
        console.error("Erro ao salvar na Dexie:", error);
    }
}

export async function LimparRascunhoEditor_i_db() {
    try {
        await i_db.rascunhosEditor.delete(_chave);
    } catch (error) {
        console.error("Erro ao limpar rascunho:", error);
    }
}

export async function SalvarTitulo_i_db(novoTitulo) {
    if(!novoTitulo)
        return;
    await i_db.rascunhosEditor.update(_chave, {
        titulo: novoTitulo
    });
}

export async function SalvarPalavra_i_db(novaPalavra) {
    if(!novaPalavra)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    const listaAtualizada = [...(rascunho.resposta || []), novaPalavra];
    //const listaAtualizadaRemover = [...(rascunho.remover || []), false];
    await i_db.rascunhosEditor.update(_chave, {
        resposta: listaAtualizada//,
        //remover: listaAtualizadaRemover
    });
}

export async function EditarPalavra_i_db(index, palavraEditada) {
    if(!palavraEditada)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    
    if (rascunho && rascunho.resposta) {
        const novasRespostas = [...rascunho.resposta];
        novasRespostas[index] = palavraEditada; // Substitui apenas naquele índice

        await i_db.rascunhosEditor.update(_chave, {
        resposta: novasRespostas
        });
    }
}

export async function SalvarConteudo_i_db(novoConteudo) {
    if(!novoConteudo)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    const listaAtualizada = [...(rascunho.conteudodb || []), novoConteudo];
    await i_db.rascunhosEditor.update(_chave, {
        conteudodb: listaAtualizada
    });
}

export async function EditarConteudo_i_db(index, contEditado) {
    if(!contEditado)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    
    if (rascunho && rascunho.conteudodb) {
        const novosConteudos = [...rascunho.conteudodb];
        novosConteudos[index] = contEditado;

        await i_db.rascunhosEditor.update(_chave, {
        conteudodb: novosConteudos
        });
    }
}

export async function SalvarVh_i_db(novoVh) {
    if(!novoVh)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    const listaAtualizada = [...(rascunho.vhdb || []), novoVh];
    await i_db.rascunhosEditor.update(_chave, {
        vhdb: listaAtualizada
    });
}

export async function EditarVh_i_db(index, vhEditado){
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    if (rascunho && rascunho.vhdb) {
        const novosVh = [...rascunho.vhdb];
        novosVh[index] = vhEditado;

        await i_db.rascunhosEditor.update(_chave, {
            vhdb: novosVh
        });
    }
}

export async function SalvarVw_i_db(novoVw) {
    if(!novoVw)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    const listaAtualizada = [...(rascunho.vwbd || []), novoVw];
    await i_db.rascunhosEditor.update(_chave, {
        vwbd: listaAtualizada
    });
}

export async function EditarVw_i_db(index, vwEditado){
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    if (rascunho && rascunho.vwbd) {
        const novosVw = [...rascunho.vwbd];
        novosVw[index] = vwEditado;

        await i_db.rascunhosEditor.update(_chave, {
            vwbd: novosVw
        });
    }
}

export async function SalvarFlexdir_i_db(novoFlexdir) {
    if(!novoFlexdir)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    const listaAtualizada = [...(rascunho.flexdir || []), novoFlexdir];
    await i_db.rascunhosEditor.update(_chave, {
        flexdir: listaAtualizada
    });
}

export async function EditarFlexdir_i_db(index, flexdirEditado){
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    if (rascunho && rascunho.flexdir) {
        const novosFlexdir = [...rascunho.flexdir];
        novosFlexdir[index] = flexdirEditado;

        await i_db.rascunhosEditor.update(_chave, {
            flexdir: novosFlexdir
        });
    }
}

export async function SalvarQuadro_i_db(novoQuadro) {
    if(!novoQuadro)
        return;
    await i_db.rascunhosEditor.update(_chave, {
        quadro: novoQuadro
    });
}

export async function SalvarArraysPosicao_i_db(vw, vh, flexdir) {
    if(!vw || !vh || !flexdir)
        return;
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    
    if (rascunho) {
        const novasFlex = [...(rascunho.flexdir || []), flexdir];
        const novosVh = [...(rascunho.vhdb || []), vh];
        const novosVw = [...(rascunho.vwbd || []), vw];

        await i_db.rascunhosEditor.update(_chave, {
            flexdir: novasFlex,
            vhdb: novosVh,
            vwbd: novosVw
        });
    }
}

export async function LimparArraysPosicao_i_db() {
    await i_db.rascunhosEditor.update(_chave, {
        vhdb: [],
        vwbd: [],
        flexdir: []
    });
}

export async function ExcluirPalavraNoIndice_i_db(index) {
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    
    if (rascunho && rascunho.resposta) {
        // Criamos cópias seguras
        const novasRespostas = [...rascunho.resposta];
        const novosVh = [...(rascunho.vhdb || [])];
        const novosVw = [...(rascunho.vwbd || [])];
        const novasFlex = [...(rascunho.flexdir || [])];

        // Removemos o item no índice especificado
        novasRespostas.splice(index, 1);
        if (novosVh[index] !== undefined) novosVh.splice(index, 1);
        if (novosVw[index] !== undefined) novosVw.splice(index, 1);
        if (novasFlex[index] !== undefined) novasFlex.splice(index, 1);

        // GARANTIA: Se não sobrou nenhuma palavra, limpamos os arrays
        if (novasRespostas.length === 0) {
            await i_db.rascunhosEditor.update(_chave, {
                resposta: [],
                vhdb: [],
                vwbd: [],
                flexdir: []
            });
        } else {
            await i_db.rascunhosEditor.update(_chave, {
                resposta: novasRespostas,
                vhdb: novosVh,
                vwbd: novosVw,
                flexdir: novasFlex
            });
        }
    }
}

export async function ExcluirConteudoNoIndice_i_db(index) {
    const rascunho = await i_db.rascunhosEditor.get(_chave);
    
    if (rascunho && rascunho.conteudodb) {
        const novoArray = [...rascunho.conteudodb];
        novoArray.splice(index, 1);
        
        // GARANTIA: Se o array de conteúdo esvaziou, setamos como array vazio limpo
        if (novoArray.length === 0) {
            await i_db.rascunhosEditor.update(_chave, {
                conteudodb: []
            });
        } else {
            await i_db.rascunhosEditor.update(_chave, {
                conteudodb: novoArray
            });
        }
    }
}
/**
 * Limpa EXCLUSIVAMENTE os campos relacionados às PALAVRAS
 * (resposta, vhdb, vwbd, flexdir)
 */
export async function LimparApenasPalavras_i_db() {
    try {
        await i_db.rascunhosEditor.update(_chave, {
            resposta: [],
            vhdb: [],
            vwbd: [],
            flexdir: []
        });
        // console.log("Dados de palavras e posições limpos com sucesso.");
    } catch (error) {
        console.error("Erro ao limpar palavras no IndexedDB:", error);
    }
}

/**
 * Limpa EXCLUSIVAMENTE o campo relacionado aos CONTEÚDOS (dicas)
 */
export async function LimparApenasConteudos_i_db() {
    try {
        await i_db.rascunhosEditor.update(_chave, {
            conteudodb: []
        });
        // console.log("Dados de conteúdos/dicas limpos com sucesso.");
    } catch (error) {
        console.error("Erro ao limpar conteúdos no IndexedDB:", error);
    }
}