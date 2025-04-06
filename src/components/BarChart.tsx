import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { ITransacaoGastos } from "../pages/Home/Mes/Features/Rateio";

declare interface IPropsBarChart {
    gastos: ITransacaoGastos[]
}

const BarChart = (props: IPropsBarChart) => {

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [dadosGastos, setDadosGastos] = useState(props.gastos)


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
            datasets: [
                {
                    label: 'Gastos Débito',
                    data: handleDataGrafico(dadosGastos, "Debito"),
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Gasto Crédito',
                    data: handleDataGrafico(dadosGastos, "Crédito"),
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                },
                {
                    label: 'Gasto Investimento',
                    data: handleDataGrafico(dadosGastos, "Investimento"),
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4
                }

            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [dadosGastos]);

    let handleDataGrafico = (dados: ITransacaoGastos[], filtro: string) => {
        let valores: any = []
        dados
            .filter(item => item.tipoGasto === filtro && item.responsavel === "Wilson")
            .forEach(item => {
                valores.push(item.valor)
            })

        return valores;
    }

    return (
        <Chart type="bar" data={chartData} options={chartOptions} className="w-full h-full" />
    )
}

export default BarChart;