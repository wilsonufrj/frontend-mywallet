import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../../redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { fetchBalancoConjunto } from '../mesSlice';
import { Card } from 'primereact/card';
import { formatCurrency } from '../../../../utils/numberProcessor';
import { capitalizeFirstLetter, roundToTwo } from '../../../../utils/stringProcessor';

const BalancoConjunto: React.FC = () => {

    const dispatch = useAppDispatch();
    const mesId: number | null = useSelector((state: RootState) => state.mes.id);
    const balancoConjunto = useSelector((state: RootState) => state.mes.balancoConjunto);

    useEffect(() => {
        if (mesId) {
            dispatch(fetchBalancoConjunto(mesId))
        }
    }, [dispatch, mesId]);



    return (
        <div>
            {
                balancoConjunto.map((balanco) => {
                    return (
                        <div>
                            <div>
                                <h1>{capitalizeFirstLetter(balanco.responsavelDTO.nome)}</h1>
                            </div>
                            <div className='grid w-full justify-content-between'>
                                <Card title="Porcentagem Custo" className="ml-2 col-2">
                                    <span className="flex  text-4xl font-bold">
                                        {roundToTwo(balanco.porcentagemDosCustos * 100)} %
                                    </span>
                                </Card>
                                <Card title="Gasto Conjunto" className="ml-2 col-2">
                                    <span className="flex text-4xl font-bold">
                                        {formatCurrency(balanco.gastosConjunto ?? 0)}
                                    </span>
                                </Card>
                                <Card title="Investimento" className="ml-2 col-2">
                                    <div>
                                        <span className=" text-4xl font-bold">
                                            {formatCurrency(balanco.investimentoConjunto ?? 0)}
                                        </span>
                                    </div>
                                </Card>
                                <Card title="Total Gasto" className="ml-2 col-2">
                                    <span className="flex text-4xl font-bold">
                                        {formatCurrency(balanco.totalGasto ?? 0)}
                                    </span>
                                </Card>
                                <Card title="Saldo Final" className="ml-2 col-2 col-offset-1">
                                    <span className="flex text-4xl font-bold">
                                        {formatCurrency(balanco.saldoFinal ?? 0)}
                                    </span>
                                </Card>
                            </div>
                        </div>
                    )
                })
            }

        </div >
    );
};

export default BalancoConjunto;