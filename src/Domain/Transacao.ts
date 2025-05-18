import { TipoStatus } from "../enums/TipoStatus";
import { Banco } from "./Banco";
import { FormaPagamento } from "../enums/FormaPagamento";
import { Responsavel } from "./Responsavel";
import { TipoTransacao } from "../enums/TipoTransacao";

export interface Transacao {
    id: number | null;
    data: string;
    descricao: string;
    valor: number;
    quantasVezes: number;
    banco: Banco;
    formaPagamento: FormaPagamento;
    status: TipoStatus;
    responsavel: Responsavel;
    tipoTransacao: TipoTransacao;
    receita: boolean;
}