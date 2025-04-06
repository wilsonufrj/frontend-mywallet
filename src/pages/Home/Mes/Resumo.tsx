import React from "react";
import { useSelector } from "react-redux";
import { TabPanel, TabView } from "primereact/tabview";
import { RootState } from "../../../redux/store";
import Balanco from "./Balanco";
import Planilhas from "./Planilhas";
import Rateio, { ITransacaoGastos } from "./Rateio";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";




const Resumo = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { dados } = location.state ?? { dados: undefined };

    return (
        <div className="p-4">
            <div id="Title">
                <div className="flex justify-content-center font-bold text-5xl m-3">
                    <span>{dados.nome}</span>
                </div>
                <div className='flex'>

                    <Button
                        label="Voltar para Carteira"
                        icon="pi pi-wallet"
                        onClick={() => navigate('/carteira')}
                    />
                    <Button
                        className='ml-2'
                        label="Logout"
                        icon="pi pi-sign-out"
                        onClick={() => navigate('/')}
                    />
                </div>
                <TabView>
                    <TabPanel header="Balanço" leftIcon="pi pi-calculator m-2">
                        <Balanco
                            ganhosMes={10000}
                            gasto={1000}
                            saldoAtual={4700}
                            saldoInvestimentoMes={1000}
                            saldoMesSeguinte={3700}
                            dadosGastos={[
                                { id: 1, descricao: "Transporte", valor: 300 } as ITransacaoGastos,
                                { id: 2, descricao: "Lazer", valor: 200 } as ITransacaoGastos
                            ]}
                        />
                    </TabPanel>
                    <TabPanel header="Planilhas" leftIcon="pi pi-money-bill m-2">
                        <Planilhas dadosGanhos={[]}
                            dadosGastos={[]}
                        />
                    </TabPanel>
                    <TabPanel header="Rateio" leftIcon="pi pi-percentage m-2">
                        <Rateio gastos={[]} />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    )
}

export default Resumo;