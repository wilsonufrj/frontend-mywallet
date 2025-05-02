import React, { useEffect } from "react";
import { TabPanel, TabView } from "primereact/tabview";

import Planilhas from "./Features/Planilhas";
import Rateio from "./Features/Rateio";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Balanco from "./Features/Balanco";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Carteira } from "../../../Domain/Carteira";
import { useAppDispatch } from "../../../redux/hooks";
import { fetchBalanco, MesState } from "./mesSlice";

const Mes = () => {
    const dispatch = useAppDispatch();

    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const mes: MesState = useSelector((state: RootState) => state.mes);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBalanco(mes.id ?? 0));
    }, [dispatch, mes.id])

    return (
        <div className="p-4">
            <div id="Title">
                <div className="flex justify-content-center font-bold text-5xl m-3">
                    <span>{mes.nome}</span>
                </div>
                <div className='flex'>

                    <Button
                        label="Voltar para Carteira"
                        icon="pi pi-wallet"
                        onClick={() => navigate(`/carteira/${carteira.id}`)}
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
                        <Balanco />
                    </TabPanel>
                    <TabPanel header="Planilhas" leftIcon="pi pi-money-bill m-2">
                        <Planilhas />
                    </TabPanel>
                    <TabPanel header="Rateio" leftIcon="pi pi-percentage m-2">
                        <Rateio />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    )
}

export default Mes;