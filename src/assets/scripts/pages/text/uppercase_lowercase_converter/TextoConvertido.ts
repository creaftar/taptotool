export class TextoConvertido
{
    //#region variaveis
    private _texto: string;
    private _textoModificado: string;
    //#endregion

    //#region construtores
    constructor();
    constructor(texto?: string)
    {
        if(texto === undefined)
        {
            this._texto = '';
            this._textoModificado= '';
        }
        else{
            this._texto = texto;
            this._textoModificado = '';
        }
    }
    //#endregion


    // Pega o idioma atual do HTML (ex: "pt", "tr", "hi")
    private get _lang(): string {
        return document.documentElement.lang || 'en';
    }

    //#region Métodos Manipuladores
    /**
     * Converte todo o texto passado, todos os caracteres para maiuscula 
     * @returns string contendo o texto formatado
     */
    public ConverterMaiuscula(): string {
        // Usa as regras locais de maiúsculas
        this._textoModificado = this._texto.toLocaleUpperCase(this._lang);
        return this._textoModificado;
    }   
    /**
     * Converte todo o texto passado, todos os caracteres para minuscula 
     * @returns string contendo o texto formatado
     */
    public ConverterMinuscula(): string {
        // Usa as regras locais de minúsculas
        this._textoModificado = this._texto.toLocaleLowerCase(this._lang);
        return this._textoModificado;
    }
    /**
 * Converte todas as letras após pontuação OU após quebra de linha para maiúsculas,
 * dando espaço caso estejam imediatamente próximas à pontuação (mantendo quebras de linha).
 * @returns string contendo o texto formatado
 */
    public PrimeiraLetraMaiuscula(): string {
        if (!this._texto) return '';

        // Corrigido para usar toLocaleUpperCase no primeiro caractere
        let resultado = this._texto.charAt(0).toLocaleUpperCase(this._lang) + this._texto.slice(1);

        // A Regex está boa, mas lembre-se que em alguns idiomas a pontuação varia.
        // Para um MVP, essa regex atende bem.
        const regexParagrafo = /(((\.|\?|!|;|\.\.\.)[\s\r\n]*)|([\r\n]+[\s]*))(\p{L})/gu;

        resultado = resultado.replace(regexParagrafo, (match, separatorGroup, puncGroup, punctuation, newlineGroup, nextChar) => {
            return separatorGroup + nextChar.toLocaleUpperCase(this._lang);
        });

        return resultado;
    }
    /**
     * Alterna os caracteres entre maiusculas e minusculas
    * (Ex: 'Eu gosto' -> 'Eu GoStO')
    * @returns string contendo o texto formatado
    */
    public TextoDeTroll(): string {
        return Array.from(this._texto)
            .map((char, index) => {
                return index % 2 === 0 
                    ? char.toLocaleUpperCase(this._lang) 
                    : char.toLocaleLowerCase(this._lang);
            })
            .join('');
    }
    //#endregion

    //#region Setters e Getters
    public SetTexto(texto: string): void
    {
        this._texto = texto;
    }
    public GetTexto(): string
    {
        return this._texto;
    }
    //#endregion
}