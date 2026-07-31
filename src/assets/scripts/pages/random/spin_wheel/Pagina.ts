
import { 
  MostrarPasteText, 
  OcultarPasteText,
} from '../../../utility/copytext/copytext.js'

export class Pagina {
    private paginacao!: HTMLElement;
    private _paginaAtual: number;
    private _textos: string[][];
    private areaTextEl: HTMLTextAreaElement;

    constructor(paginaAtual: number) {
        this.paginacao = document.getElementById("paginacao") as HTMLElement;
        this.areaTextEl = document.getElementById("textTip") as HTMLTextAreaElement;
        this._paginaAtual = paginaAtual;
        this._textos = [];
    }
    
    public CriarPagina(id: number): void {
        const pagina = document.createElement('li');
        pagina.classList.add('paginas-roleta');
        pagina.id = `pagina-${id}`;
        pagina.textContent = `${id + 1}`;
        pagina.addEventListener("click", () =>{
            this.AtualizarPaginaAtiva(id);
        });
        
        this.paginacao.appendChild(pagina);
        this.paginacao.scrollTo({
            left: this.paginacao.scrollWidth,
            behavior: 'smooth'
        });
        this.AtualizarPaginaAtiva(id);
    }

    private AtualizarPaginaAtiva(id: number){
        const pagina = document.getElementById(`pagina-${id}`);
        document.querySelector(".pagina-active")?.classList.remove("pagina-active");
        pagina?.classList.add('pagina-active');
        this.SetPaginaAtual(id);
        this.AtualizarTextArea(id);
    }

    public ArmazenarTexto(id: number, items: string[], armazenar: boolean): void {
        if (armazenar)
            this._textos[id] = [...items];
        else
            this._textos[id] = [];
    }
    private AtualizarTextArea(id: number): void {
        const textoDoId = this._textos[id] || [];
        let textoFinal = "";
        textoDoId.forEach((texto)=>{
            textoFinal += texto + '\n';
        })
        this.areaTextEl.value = textoFinal;
        this.areaTextEl.value.length > 0 ? OcultarPasteText() : MostrarPasteText();
    }

    public RemoverPagina(id: number): void {
        const pagina = document.getElementById(`pagina-${id}`);
        if (pagina) {
            this.paginacao.removeChild(pagina);
        }
        this._textos.splice(id, 1);
        this.AtualizarPaginaAtiva(id - 1);
    }

    public UpdatePagina(oldId: number, newId: number): void {
        const pagina = document.getElementById(`pagina-${oldId}`);
        if (pagina) {
            pagina.id = `pagina-${newId}`;
            pagina.textContent = `${newId + 1}`;
            
            // Substitui o listener antigo com o novo ID
            const clone = pagina.cloneNode(true) as HTMLElement;
            clone.addEventListener("click", () => {
                this.AtualizarPaginaAtiva(newId);
            });
            pagina.parentNode?.replaceChild(clone, pagina);
        }
    }

    public RemoverVencedor(id: number, texto: string): string[] | null {
        const listaAtual = this._textos[id];
        
        if (listaAtual) {
            const index = listaAtual.indexOf(texto);
            if (index > -1) {
                listaAtual.splice(index, 1);
            }
            return listaAtual;
        }
        return null;
    }

    public SetPaginaAtual(id: number): void{
        this._paginaAtual = id;
    }
    public GetPaginaAtual(): number{
        return this._paginaAtual;
    }
}