const currentLang = document.documentElement.lang || 'en';
const graphemeSegmenter = new Intl.Segmenter(currentLang, { granularity: 'grapheme' });

export class TextoInvertido
{
    //#region variaveis
    private _texto: string;
    //#endregion
    
    //#region construtores
    constructor();
    constructor(texto?: string)
    {
        if(texto === undefined){
            this._texto = '';
        }
        else{
            this._texto = texto;
        }
    }
    //#endregion

    //#region Métodos
    /**
     * Inverte o texto tratando corretamente caracteres complexos (Hindi, Emojis, etc.)
     * @returns Texto invertido
     */
    public InverterTexto(): string {
        if (!this._texto) return '';

        // Usamos o segmentador por "grapheme" (unidade visual)
        const segments = graphemeSegmenter.segment(this._texto);

        // Transformamos os segmentos em um array, invertemos e juntamos
        return Array.from(segments)
            .map(s => s.segment)
            .reverse()
            .join('');
    }
    //#endregion

    //#region Setters e Getters
    public SetTexto(texto: string): void
    {
        this._texto = texto;
    }
    public GetTexto(): string{
        return this._texto;
    }
    //#endregion
}