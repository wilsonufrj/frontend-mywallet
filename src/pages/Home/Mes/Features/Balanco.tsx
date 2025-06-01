import { Card } from "primereact/card";

import BarChart from "../../../../components/BarChart";
import PieChart from "../../../../components/PieChart";
import { BalancoData, fetchBalanco } from "../mesSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useEffect } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { formatCurrency } from "../../../../utils/numberProcessor";


const Balanco = () => {

    const dispatch = useAppDispatch();
    const mesId: number | null = useSelector((state: RootState) => state.mes.id);
    const balanco: BalancoData = useSelector((state: RootState) => state.mes.balanco);

    useEffect(() => {
        if (mesId) {
            dispatch(fetchBalanco(mesId))
        }
    }, [dispatch, mesId]);

    return (
        <div>
            <div className="grid justify-content-around">
                <Card title="Ganhos do mês" className="ml-2 col-2">
                    <span className="flex  text-4xl font-bold">
                        {formatCurrency(balanco?.totalGanhoMes ?? 0)}
                    </span>
                </Card>
                <Card title="Próximo mês" className="ml-2 col-2">
                    <span className="flex text-4xl font-bold">
                        {formatCurrency(balanco.saldoMesSeguinte)}
                    </span>
                </Card>
                <Card title="Investimentos" className="ml-2 col-2">
                    <span className="flex  text-4xl font-bold">
                        {formatCurrency(balanco.investimentoMes)}
                    </span>
                </Card>
                <Card title="Gastos" className="ml-2 col-2">
                    <span className="flex  text-4xl font-bold">
                        {formatCurrency(balanco.totalGastosMes)}
                    </span>
                </Card>
                <Card title="Sobrou para o mês" className="ml-2 col-2">
                    <span className="flex  text-4xl font-bold">
                        {formatCurrency(balanco.saldoAtual)}
                    </span>
                </Card>
            </div>
            <div className="flex mt-5">
                <div style={{ height: "50vh" }} className="w-full flex justify-content-center">
                    <BarChart />
                </div>
            </div>

        </div>
    );
}

export default Balanco;