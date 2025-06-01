import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import { useNavigate } from 'react-router-dom';
import { atualizaPorcentagemInvestimento, MesState, salvaPorcentagemInvestimento } from './mesSlice';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import Balanco from './Features/Balanco';
import { logout } from '../Login/authSlice';
import api from '../../../config/api';
import GanhoConjunto from './Features/GanhoConjunto';
import GastoConjunto from './Features/GastoConjunto';
import InvestimentoConjunto from './Features/InvestimentoConjunto';

export declare interface IDropdown {
    code: string,
    name: string
}

function MesConjunto() {

    const dispatch = useAppDispatch();

    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const mes: MesState = useSelector((state: RootState) => state.mes);
    const [bancos, setBancos] = useState<IDropdown[]>([]);


    const [responsaveis, setResponsaveis] = useState<any[]>([]);
    const navigate = useNavigate();

    const stepperRef = useRef<any>(null);


    useEffect(() => {
        api.get("banco")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setBancos(data));

        api.get("responsaveis")
            .then(response => {
                setResponsaveis(response.data);
            });

    }, [])

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
                            <Balanco />
                        </TabPanel>
                        <TabPanel header="Configuração Mes" leftIcon="pi pi-cog m-2">
                            <Stepper ref={stepperRef}>
                                <StepperPanel header="Ganhos Conjuntos">
                                    <GanhoConjunto bancos={bancos} responsaveis={responsaveis} />
                                    <div className="flex pt-4 justify-content-end">
                                        <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" onClick={() => {
                                            stepperRef.current && stepperRef.current.nextCallback()
                                        }} />
                                    </div>
                                </StepperPanel>
                                <StepperPanel header="Gastos Conjuntos">
                                    <GastoConjunto bancos={bancos} responsaveis={responsaveis} />
                                    <div className="flex pt-4 justify-content-between">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current && stepperRef.current.prevCallback()} />
                                        <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" onClick={() => {
                                            stepperRef.current && stepperRef.current.nextCallback()
                                        }} />
                                    </div>
                                </StepperPanel>
                                <StepperPanel header="Porcentagem de Investimento Conjunto">
                                    <InvestimentoConjunto mes={mes} />
                                    <div className="flex pt-4 justify-content-between">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                        <Button label='Salvar'
                                            className='ml-3 justify-content-end'
                                            icon="pi pi-save"
                                            iconPos="right" onClick={() => {
                                                dispatch(salvaPorcentagemInvestimento(Number(mes.id)));
                                            }} />
                                    </div>
                                </StepperPanel>
                            </Stepper>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default MesConjunto;