export class Clique{
    private _cliques: number;

    constructor(valorSalvo = 0){
        this._cliques = valorSalvo;
    }

    public IncrementarCliques(qtde = 1){
        this._cliques += qtde;
    }
    public DecrementarCliques(qtde = 1){
        if(this._cliques > 0)
            this._cliques -= qtde;
    }
    public ResetarCliques(){
        this._cliques = 0;
    }

    public GetCliques(): number{
        return this._cliques;
    }
}