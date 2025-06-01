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

    // Dados para o gráfico de barras
    const barData = {
        labels: ['Ganhos', 'Gastos', 'Investimentos', 'Saldo Próximo Mês', 'Saldo Atual'],
        datasets: [
            {
                label: 'R$',
                backgroundColor: ['#42A5F5', '#EF5350', '#66BB6A', '#FFA726', '#AB47BC'],
                data: [
                    balanco?.totalGanhoMes ?? 0,
                    balanco?.totalGastosMes ?? 0,
                    balanco?.investimentoMes ?? 0,
                    balanco?.saldoMesSeguinte ?? 0,
                    balanco?.saldoAtual ?? 0
                ]
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Resumo do Mês'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="card">
            <div className="flex justify-content-around">
                <Card title="Ganhos do mês" className="ml-2">
                    <span className="flex align-items-center justify-content-center text-4xl font-bold">
                        {formatCurrency(balanco?.totalGanhoMes ?? 0)}
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
            <div className="flex mt-5">
                <div className="w-6">
                    <BarChart data={barData} options={barOptions} />
                </div>
                <div className="w-6 flex justify-content-center">
                    <PieChart />
                </div>
            </div>

        </div>
    );
}

export default Balanco;