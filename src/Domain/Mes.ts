import { Transacao } from "./Transacao";

export interface Mes {
    id: number | null;
    nome: string;
    ano: number;
    transacoes: Transacao[];
}