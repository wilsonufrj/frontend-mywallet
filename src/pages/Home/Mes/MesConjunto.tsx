import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import { useNavigate } from 'react-router-dom';
import { MesState } from './mesSlice';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';

import Balanco from './Features/Balanco';
import { logout } from '../Login/authSlice';
import api from '../../../config/api';
import PlanilhaConjunto from './Features/PlanilhaConjunto';
import BalancoConjunto from './Features/BalancoConjunto';

export declare interface IDropdown {
    code: string,
    name: string
}

function MesConjunto() {

    const dispatch = useAppDispatch();

    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const mes: MesState = useSelector((state: RootState) => state.mes);

    const navigate = useNavigate();


    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Imagem de fundo */}
            <div
                style={{
                    backgroundImage: `url('/background.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0.3,
                }}
            />

            {/* Conteúdo acima do fundo */}
            <div style={{ position: 'relative', zIndex: 1 }} className="p-4">
                <div id="Title">
                    <div className="flex justify-content-center font-bold text-5xl m-3">
                        <span>{mes.nome}</span>
                        <span>Mes Conjunto</span>
                    </div>

                    <div className="flex mb-3">
                        <Button
                            label="Voltar para Carteira"
                            icon="pi pi-wallet"
                            onClick={() => navigate(`/carteira/${carteira.id}`)}
                        />
                        <Button
                            className="ml-2"
                            label="Logout"
                            icon="pi pi-sign-out"
                            onClick={() => dispatch(logout())}

                        />
                    </div>

                    <TabView>
                        <TabPanel header="Balanço" leftIcon="pi pi-calculator m-2">
                            <BalancoConjunto />
                        </TabPanel>
                        <TabPanel header="Configuração Mes" leftIcon="pi pi-cog m-2">
                            <PlanilhaConjunto />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default MesConjunto;