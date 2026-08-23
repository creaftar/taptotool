export class Menu{
    private _menu: HTMLElement | null;
    private _passarPagina: HTMLElement | null;
    private _voltarPagina: HTMLElement | null;
    private _paginas: number;
    private _paginaAnterior: number;
    private _paginaAtual: number;
    private _paginaSeguinte: number;
    private _MAX_ICONES: number;

    public signal: EventTarget;

    constructor(iconesTotais: number, MAX_ICONES: number){
        this._menu = document.getElementById("menu-paginas-icones");
        this._paginas = 0;
        this._passarPagina = document.getElementById("passar-pagina-icones");
        this._passarPagina?.addEventListener("click",  () => this.PaginaSeguinte());
        this._voltarPagina = document.getElementById("voltar-pagina-icones");
        this._voltarPagina?.addEventListener("click", () => this.PaginaAnterior());
        this._paginaAnterior = 0;
        this._paginaAtual = 1;
        this._paginaSeguinte = 2;
        this.signal = new EventTarget();
        this._MAX_ICONES = MAX_ICONES;
        this.CalcularNroPaginas(iconesTotais);
        this.GerarMenu();
    }

    public PaginaSeguinte(){
        this._paginaAtual++;
        this._paginaAnterior = this._paginaAtual - 1;
        this._paginaSeguinte = this._paginaAtual + 1;
        if(this._paginaAtual > this._paginas){
            this._paginaAnterior = this._paginas - 1;
            this._paginaAtual = this._paginas;
            this._paginaSeguinte = this._paginaAtual;
        }

        this.GerarMenu();
    }
    
    public PaginaAnterior(){
        this._paginaAtual--;
        this._paginaAnterior = this._paginaAtual - 1;
        this._paginaSeguinte = this._paginaAtual + 1;
        if(this._paginaAtual < 1){
            this._paginaAnterior = 1;
            this._paginaAtual = 1;
            this._paginaSeguinte = 2;
        }
        
        this.GerarMenu();
    }
    
    public PaginaEspecifica(id: number){
        this._paginaAnterior = id - 1;
        this._paginaAtual = id;
        this._paginaSeguinte = id + 1;
        if(id === 1){
            this._paginaAnterior = id;
            this._paginaAtual = id;
            this._paginaSeguinte = id + 1;
        }
        else if(id === this._paginas){
            
            this._paginaAnterior = id - 1;
            this._paginaAtual = id;
            this._paginaSeguinte = id;
        }
        
        this.GerarMenu();
    }

    public RecalcularPaginas(iconesTotais:number, MAX_ICONES: number): void {
        const iconesCarregados = ((this._paginaAtual * this._MAX_ICONES) - this._MAX_ICONES) + 1; 
        
        this.SetMAXICONES(MAX_ICONES);
        this.CalcularNroPaginas(iconesTotais);
        
        this._paginaAtual = Math.ceil(iconesCarregados / this._MAX_ICONES);
        if(this._paginaAtual > this._paginas)
            this._paginaAtual = 1;
        this._paginaAnterior = this._paginaAtual - 1 < 1 ? 1 : this._paginaAtual - 1;
        this._paginaSeguinte = this._paginaAtual + 1 > this._paginas ? this._paginas : this._paginaAtual + 1;
        
        this.GerarMenu();
    }

    private GerarMenu(): void{
        this._menu!.innerHTML = "";
        for(let i = this._paginaAnterior; i <  this._paginaAtual + 3; i++){
            if(i === 0 || i > this._paginas)
                continue;
            const li = document.createElement("li");
            li.textContent = String(i);
            if(i === this._paginaAtual)
                li.classList.add("pagina-ativa-icons");
            else
                li.addEventListener("click", () => this.PaginaEspecifica(i));
            this._menu!.append(li);
        }
        this.OcultarChevron();
        if(this.AdicionarReticencias()){
            const reticencias = document.createElement("li");
            reticencias.textContent = "...";
            this._menu!.append(reticencias);
        }
        const evt = new CustomEvent("PaginaAlterada", {
            detail: this._paginaAtual
        });
        this.signal.dispatchEvent(evt);
    }
    
    private CalcularNroPaginas(iconesTotais: number){
        this._paginas = Math.ceil(iconesTotais / this._MAX_ICONES);
        return this._paginas;
    }
    
    private OcultarChevron(){
        if(this._paginaAtual >= this._paginas)
            this._passarPagina!.style.visibility = "hidden";
        else
            this._passarPagina!.style.visibility = "visible";

        if(this._paginaAtual <= 1)
            this._voltarPagina!.style.visibility = "hidden";
        else
            this._voltarPagina!.style.visibility = "visible";
    }

    private AdicionarReticencias(): boolean{
        if(this._paginaAtual < this._paginas - 2)
            return true;
        return false;
    }

    public GetPaginaAtual(): number{
        return this._paginaAtual;
    }
    public SetMAXICONES(max: number){
        this._MAX_ICONES = max;
    }
}