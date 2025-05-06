import { parseISO } from "date-fns";
import { Transacao } from "../Domain/Transacao";

export const dataTemplate = (item: Transacao) => {
    return parseISO(item.data).toLocaleDateString('pt-BR');
}