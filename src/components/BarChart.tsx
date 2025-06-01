// src/components/BarChart.tsx
import React from "react";
import { Chart } from "primereact/chart";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Transacao } from "../Domain/Transacao";


const BarChart: React.FC = () => {

    const transacaoGastos: Transacao[] = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => !transacao.receita);

    const transacaoGanhos: Transacao[] = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => transacao.receita);

    function getValoresPorDia(transacoes: Transacao[]): number[] {
        const valoresPorDia = Array(31).fill(0);
        transacoes.forEach((transacao) => {
            const dia = new Date(transacao.data).getUTCDate();
            valoresPorDia[dia - 1] = transacao.valor;

        });
        return valoresPorDia;
    }

    const data = {
        labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Ganhos',
                data: getValoresPorDia(transacaoGanhos),
                backgroundColor: '#42A5F5',
            },
            {
                label: 'Gastos',
                data: getValoresPorDia(transacaoGastos),
                backgroundColor: '#B71C1C',
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Gráfico de Ganhos e Gastos',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: number) => `$${value.toLocaleString()}`,
                },
            },
        },
    };

    return (
        <Chart
            type="bar"
            data={data}
            options={options}
            className="w-full h-full"
        />
    );
};

export default BarChart;
