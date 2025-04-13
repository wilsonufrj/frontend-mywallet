import DataTableGanhos from "../../../../components/DataTableGanhos";
import DataTableGastos from "../../../../components/DataTableGastos";
import { Transacao } from "../../../../Domain/Transacao";
import { ITransacao, ITransacaoGastos } from "./Rateio";
import { RootState } from "../../../../redux/store";



const Planilhas = () => {

    return (
        <div className="grid">
            <div className="col-12">
                <DataTableGanhos titulo="Ganhos" />
            </div>
            {/* <div className="col-12">
                <DataTableGastos titulo="Gastos" />
            </div> */}
        </div>
    )
}

export default Planilhas;