export class Lista
{
    // #region variaveis
    private _lista: string[];
    private _separador: string; 
    private _locale: string; // Nova variável
    // #endregion

    // #region construtores
    constructor();
    constructor(lista?: string, locale: string = 'en')
    {
        this._lista = [];
        this._separador = ' '; 
        this._locale = locale; // Armazena o idioma da página
        
        if (lista !== undefined) {
            this.SetLista(lista);
        }
    }
    // #endregion

    // #region Métodos
    /**
     * Ordena a lista internamente e a retorna como uma única string,
     * usando o separador original da entrada.
     * @returns string ordenada da lista
     */
    public OrdenarLista(): string
    {
        const listaLimpa = this._lista.filter(item => item.length > 0);
        listaLimpa.sort((a, b) => a.localeCompare(b, this._locale, { numeric: true  }));
        return listaLimpa.join(this._separador);
    }

     /**
     * Ordena a lista internamente em ordem reversa (Z-A) e a retorna 
     * como uma única string, usando o separador original da entrada.
     * @returns string ordenada reversamente (Z-A) da lista
     */
    public OrdenarListaReversa(): string
    {
        // Cria uma cópia limpa do array para trabalhar
        const listaLimpa = this._lista.filter(item => item.length > 0);
        
        // 1. Ordenação Z-A: Inverte a ordem dos argumentos no localeCompare!
        listaLimpa.sort((a, b) => b.localeCompare(a, this._locale, { numeric: true }));
        
        // 2. Não é necessário o .reverse()
        
        return listaLimpa.join(this._separador);
    }
    // #endregion

    // #region Setters e Getters
    public SetLista(lista: string): void {
    // Se tiver quebra de linha, priorizamos ela
        if (lista.includes('\n')) {
            this._separador = '\n';
            this._lista = lista.split(/\r?\n/);
        } 
        // Se tiver vírgula, aceita com ou sem espaço depois dela
        else if (lista.includes(',')) {
            this._separador = lista.includes(', ') ? ', ' : ',';
            this._lista = lista.split(/,\s*/);
        }
        else {
            this._separador = ' ';
            this._lista = lista.split(/\s+/); // Separa por qualquer quantidade de espaços
        }
    }  
    public GetLista(): string {
    // O .filter(item => item.trim().length > 0) remove linhas que só tem espaços
        return this._lista
        .map(item => item.trim()) // Limpa espaços nas bordas de cada item
        .filter(item => item.length > 0) 
        .join(this._separador);
    }
    // #endregion
}