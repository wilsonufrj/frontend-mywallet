import { Banco } from "./Banco";
import { FormaPagamento } from "./FormaPagamento";
import { Responsavel } from "./Responsavel";
import { Status } from "./Status";
import { TipoTransacao } from "./TipoTransacao";

export interface Transacao {
    id: number;
    data: Date;
    descricao: string;
    valor: number;
    quantasVezes: number;
    banco: Banco;
    formaPagamento: FormaPagamento;
    status: Status;
    responsavel: Responsavel;
    tipoTransacao: TipoTransacao;
}