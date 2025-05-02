import { parseISO } from "date-fns";
import { ITransacao } from "../pages/Home/Mes/Features/Rateio";

export const dataTemplate = (item: ITransacao) => {
    return parseISO(item.data).toLocaleDateString('pt-BR');
}