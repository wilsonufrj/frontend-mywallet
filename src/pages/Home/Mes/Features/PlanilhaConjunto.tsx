import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import React, { useEffect, useRef, useState } from 'react';
import GanhoConjunto from './GanhoConjunto';
import { Button } from 'primereact/button';
import GastoConjunto from './GastoConjunto';
import InvestimentoConjunto from './InvestimentoConjunto';
import { MesState, salvaPorcentagemInvestimento } from '../mesSlice';
import api from '../../../../config/api';
import { IDropdown } from '../MesConjunto';
import { useAppDispatch } from '../../../../redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Toast } from 'primereact/toast';


const PlanilhaConjunto: React.FC = () => {

    const dispatch = useAppDispatch();
    const mes: MesState = useSelector((state: RootState) => state.mes);

    const [bancos, setBancos] = useState<IDropdown[]>([]);


    const [responsaveis, setResponsaveis] = useState<any[]>([]);

    const stepperRef = useRef<any>(null);
    const toast = useRef<Toast>(null);

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
                <Toast ref={toast} />
                <InvestimentoConjunto mes={mes} />
                <div className="flex pt-4 justify-content-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label='Salvar'
                        className='ml-3 justify-content-end'
                        icon="pi pi-save"
                        iconPos="right" onClick={() => {
                            dispatch(salvaPorcentagemInvestimento(Number(mes.id)))
                                .then(() => {
                                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Dados Salvos com sucesso', life: 3000 })
                                })
                        }} />
                </div>
            </StepperPanel>
        </Stepper>
    );
};

export default PlanilhaConjunto;