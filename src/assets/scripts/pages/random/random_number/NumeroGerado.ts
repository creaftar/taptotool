export class NumeroGerado {
    //#region variaveis
    private _x: number;
    private _y: number;
    //#endregion

    //#region construtores
    constructor();
    constructor(x?: number, y?: number) {
        if (x === undefined || y === undefined) {
            this._x = 0;
            this._y = 0;
        } else {
            this._x = x;
            this._y = y;
            this.ValidarMaior();
        }
    }
    //#endregion

    private get _locale(): string {
        return document.documentElement.lang || 'pt-BR';
    }

    //#region Métodos Geradores
    /**
     * Gera um número inteiro e o retorna formatado como string.
     * - Formato: '09' para x < 10 && x > -10.
     * - Formato localizado para números grandes (ex: 1.000 ou 1,000).
     */
    public GerarNumeroInteiro(): string {
        this.ValidarMaior();
        const numeroInteiro = Math.floor(Math.random() * (this._y - this._x + 1)) + this._x;

        // Regra de negócio: preenchimento com zero para números de um dígito
        if (Math.abs(numeroInteiro) < 10) {
            const sinal = numeroInteiro < 0 ? "-" : "";
            return sinal + String(Math.abs(numeroInteiro)).padStart(2, '0');
        }

        return numeroInteiro.toLocaleString(this._locale);
    }

    /**
     * Gera um número fracionário localizado com duas casas decimais.
     * Garante o preenchimento de zero na parte inteira se for menor que 10.
     */
    public GerarNumeroFracionario(): string {
        this.ValidarMaior();
        const fracao = Math.random() * (this._y - this._x) + this._x;

        // Formatação inicial localizada
        let stringLocalizada = fracao.toLocaleString(this._locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Lógica para garantir o "0" na parte inteira (ex: 7,50 -> 07,50)
        // Usamos Intl.NumberFormat para descobrir qual é o separador decimal do país atual
        const separadorDecimal = new Intl.NumberFormat(this._locale).formatToParts(1.1)
            .find(part => part.type === 'decimal')?.value || ',';

        const partes = stringLocalizada.split(separadorDecimal);
        let parteInteira = partes[0];
        const parteDecimal = partes[1];

        const ehNegativo = parteInteira.startsWith('-');
        // Remove sinal e separadores de milhar para contar apenas os dígitos
        const apenasDigitosInteiros = parteInteira.replace(/[^\d]/g, '');

        if (apenasDigitosInteiros.length === 1) {
            const parteFormatada = apenasDigitosInteiros.padStart(2, '0');
            const sinal = ehNegativo ? '-' : '';
            return `${sinal}${parteFormatada}${separadorDecimal}${parteDecimal}`;
        }

        return stringLocalizada;
    }
    //#endregion

    //#region Métodos verificadores
    /**
     * Altera o valor de X para que seja sempre menor que o Y usando destructuring
     */
    private ValidarMaior(): void {
        if (this._x > this._y) {
            [this._x, this._y] = [this._y, this._x];
        }
    }
    //#endregion

    //#region Getters e Setters
    public SetX(x: number): void { this._x = x; }
    public SetY(y: number): void { this._y = y; }
    public GetX(): number { return this._x; }
    public GetY(): number { return this._y; }
    //#endregion
}