import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useAppDispatch } from '../../../redux/hooks';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { Mes } from '../../../Domain/Mes';
import api from '../../../config/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import { criarNovoMes } from './carteiraSlice';
import { fetchMesData } from '../Mes/mesSlice';

const CarteiraDetail: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const carteiraDetail: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);

    const [nomeMes, setNomeMes] = useState<string>('');
    const [dialog, setDialog] = useState<boolean>(false);


    const footer = (mes: any) => {
        return (<div>
            <Button
                label="Acessar"
                severity="success"
                icon="pi pi-check"
                onClick={async () => {
                    await dispatch(fetchMesData(mes.id));
                    navigate(`/mes/${mes.id}`);
                }} />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-secondary p-button-icon-only ml-2"
                onClick={() => {
                    api.delete(`mes/${mes.id}`)
                        .then(() => {
                            //Dispatch para remover o mes do estado
                        })
                }}
            />
        </div>)
    };


    const mesComponent = (mes: Mes) => {
        return (
            <div key={mes.id} className='col-3'>
                <Card title={mes.nome}
                    subTitle={mes.ano} footer={() => footer(mes)}>
                    <div className='flex align-items-center'>
                    </div>
                </Card>
            </div>
        )
    }

    const hideDialog = () => {
        setDialog(false);
    };

    const generateMes = (nomeMes: string): Mes => {
        const currentYear = new Date().getFullYear();
        return {
            id: null,
            nome: nomeMes,
            ano: currentYear,
            carteira: { id: carteiraDetail.id } as Carteira,
            transacoes: [],
        }
    }

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => {
                dispatch(criarNovoMes(generateMes(nomeMes)));
                setDialog(false);
            }} />
        </React.Fragment>
    );

    return (
        <div className='m-5'>
            <div className='mb-3'>
                <h1>{`Meses da Carteira: ${carteiraDetail.nome}`}</h1>
                <div className='flex'>

                    <Button
                        label="Voltar para Carteiras"
                        icon="pi pi-wallet"
                        onClick={() => navigate('/carteiras')}
                    />
                    <Button
                        className='ml-2'
                        label="Logout"
                        icon="pi pi-sign-out"
                        onClick={() => navigate('/')}
                    />
                </div>

            </div>
            <div className='grid'>
                {carteiraDetail?.meses?.map((mes: any) => mesComponent(mes))}
                <div className='col-3 align-content-center'>

                    <div className='flex justify-content-center '>
                        <Button
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-secondary p-button-icon-only"
                            onClick={() => {
                                setDialog(true);
                            }}
                        />
                    </div>

                </div>
            </div>
            {
                dialog
                    ?
                    <Dialog visible={dialog}
                        style={{ width: '32rem' }}
                        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                        header="Adicionar Mês"
                        modal
                        className="p-fluid"
                        footer={dialogFooter}
                        onHide={hideDialog}>
                        <div>
                            <div className='grid mt-5'>
                                <FloatLabel className='col-12 '>
                                    <InputText id="username" value={nomeMes} onChange={(e) => setNomeMes(e.target.value)} />
                                    <label htmlFor="username">Nome Mês</label>
                                </FloatLabel>
                            </div>
                        </div>

                    </Dialog>
                    : <></>
            }
        </div>
    );
};

export default CarteiraDetail;