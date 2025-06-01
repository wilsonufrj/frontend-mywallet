import { Carteira } from "./Carteira";
import { Transacao } from "./Transacao";

export interface Mes {
    id: number | null;
    nome: string;
    ano: number;
    carteira: Carteira
    transacoes: Transacao[];
    porcentagemInvestimento: number;
}