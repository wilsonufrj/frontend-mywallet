import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Mes as MesDomain } from '../../../Domain/Mes';
import api from '../../../config/api';

const Mes: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { id } = useParams<{ id: string }>();
    const [meses, setMeses] = useState<MesDomain[]>(location.state?.dados?.meses);

    const [nomeMes, setNomeMes] = useState<string>('');
    const [dialog, setDialog] = useState<boolean>(false);


    const footer = (mes: any) => {
        return (<div>
            <Button
                label="Acessar"
                severity="success"
                icon="pi pi-check"
                onClick={() => {
                    navigate(`/resumo/${mes.id}`, {
                        state: { dados: mes }
                    });
                }} />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-secondary p-button-icon-only ml-2"
                onClick={() => {
                    api.delete(`mes/${mes.id}`)
                        .then(() => setMeses(meses.filter(m => m.id !== mes.id)))
                }}
            />
        </div>)
    };


    const mesComponent = (mes: MesDomain) => {
        return (
            <div className='col-3'>
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

    const generateMes = (nomeMes: string): MesDomain => {
        const currentYear = new Date().getFullYear();
        return {
            id: null,
            nome: nomeMes,
            ano: currentYear,
            transacoes: [],
        }
    }

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => {
                api.post('mes', generateMes(nomeMes))
                    .then(res => setMeses([...meses, res.data]))
                setDialog(false);
            }} />
        </React.Fragment>
    );

    return (
        <div className='m-5'>
            <div className='mb-3'>
                <h1>{`Meses`}</h1>
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

            </div>
            <div className='grid'>
                {meses.map((mes: any) => mesComponent(mes))}
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

export default Mes;