import { Knob } from 'primereact/knob';
import { Message } from 'primereact/message';
import React, { useState } from 'react';
import { atualizaPorcentagemInvestimento, MesState } from '../mesSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux/hooks';

declare interface InvestimentoConjuntoProps {
    mes: MesState
}

const InvestimentoConjunto: React.FC<InvestimentoConjuntoProps> = ({ mes }) => {

    const dispatch = useAppDispatch();
    const percentageInvestment = useSelector((state: any) => state.mes.porcentagemInvestimento);

    return (
        <div className="">
            <div className="flex justify-content-center align-items-center font-medium">
                <div className='flex align-items-center flex-column'>
                    <label htmlFor="pnum">Porcentagem de investimento</label>
                    <Knob value={percentageInvestment} onChange={(e) => dispatch(atualizaPorcentagemInvestimento(e.value))} valueTemplate={'{value}%'} />
                    {
                        percentageInvestment > 30
                            ? <Message
                                severity="warn"
                                text="Mais que 30% de investimento pode comprometer a saúde financeira do mês." />
                            : <></>
                    }
                </div>

            </div>

        </div>
    );
};

export default InvestimentoConjunto;