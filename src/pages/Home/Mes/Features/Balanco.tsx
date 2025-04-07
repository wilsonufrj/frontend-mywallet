import { Card } from "primereact/card";

import BarChart from "../../../../components/BarChart";
import PieChart from "../../../../components/PieChart";
import { ITransacaoGastos } from "./Rateio";
import { Transacao } from "../../../../Domain/Transacao";
import { BalancoData } from "../mesSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";


const Balanco = () => {

    const balanco: BalancoData = useSelector((state: RootState) => state.mes.balanco);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    return (
        <div className="card">
            <div className="flex mb-5">
                <div className="w-6">
                    <BarChart />
                </div>
                <div className="w-6 flex justify-content-center">
                    <PieChart />
                </div>
            </div>
            <div className="flex justify-content-around">
                <Card title="Ganhos do mês" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco.totalGanhoMes)}
                    </span>
                </Card>
                <Card title="Passar o mês seguinte" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco.saldoMesSeguinte)}
                    </span>
                </Card>
                <Card title="Investimentos" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco.investimentoMes)}
                    </span>
                </Card>
                <Card title="Gastos" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco.totalGastosMes)}
                    </span>
                </Card>
                <Card title="Sobrou para o mês" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco.saldoAtual)}
                    </span>
                </Card>
            </div>
        </div>
    );
}

export default Balanco;