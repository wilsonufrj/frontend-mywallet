import { Card } from "primereact/card";

import BarChart from "../../../../components/BarChart";
import PieChart from "../../../../components/PieChart";
import { ITransacaoGastos } from "./Rateio";

declare interface IProspBalanco {
    ganhosMes: number,
    saldoMesSeguinte: number,
    saldoInvestimentoMes: number,
    saldoAtual: number,
    gasto: number,
    dadosGastos: ITransacaoGastos[]
}

const Balanco = (props: IProspBalanco) => {

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="card">
            <div className="flex mb-5">
                <div className="w-6">
                    <BarChart gastos={props.dadosGastos} />
                </div>
                <div className="w-6 flex justify-content-center">
                    <PieChart />
                </div>
            </div>
            <div className="flex justify-content-around">
                <Card title="Ganhos do mês" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(props.ganhosMes)}
                    </span>
                </Card>
                <Card title="Passar o mês seguinte" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(props.saldoMesSeguinte)}
                    </span>
                </Card>
                <Card title="Investimentos" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(props.saldoInvestimentoMes)}
                    </span>
                </Card>
                <Card title="Gastos" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(props.gasto)}
                    </span>
                </Card>
                <Card title="Sobrou para o mês" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(props.saldoAtual)}
                    </span>
                </Card>
            </div>
        </div>
    );
}

export default Balanco;