import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import { useNavigate } from 'react-router-dom';
import { MesState } from './mesSlice';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

import Balanco from './Features/Balanco';
import Planilhas from './Features/Planilhas';
import { logout } from '../Login/authSlice';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import api from '../../../config/api';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { parseISO } from 'date-fns';
import { DataTableTransacao } from '../../../components/DataTableGanhos';
import { InputText } from 'primereact/inputtext';
import { Usuario } from '../../../Domain/Usuario';
import { capitalizeFirstLetter } from '../../../utils/stringProcessor';
import { Transacao } from '../../../Domain/Transacao';
import { Banco } from '../../../Domain/Banco';
import { TipoStatus } from '../../../enums/TipoStatus';
import { FormaPagamento } from '../../../enums/FormaPagamento';
import { TipoTransacao } from '../../../enums/TipoTransacao';

declare interface IDropdown {
    code: string,
    name: string
}

function MesConjunto() {

    const dispatch = useAppDispatch();

    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const mes: MesState = useSelector((state: RootState) => state.mes);
    const [bancos, setBancos] = useState<IDropdown[]>([]);
    const [transacoesPorUsuario, setTransacoesPorUsuario] = useState<{ [usuarioId: string]: Transacao[] }>({});
    const [gastos, setGastos] = useState<Transacao[]>([]);

    const navigate = useNavigate();

    const stepperRef = useRef<any>(null);


    const handleAdicionarGanhos = (usuarioId: number) => {

        setTransacoesPorUsuario(prev => ({
            ...prev,
            [usuarioId]: [...(prev[usuarioId] || []), {
                //TODO:Configurar a transacao de ganho
                //TODO:Terminar a porcentagem de investimento conjunto
            } as Transacao]
        }));
    };

    const handleRemoverTransacao = (usuarioId: number, idx: number) => {
        setTransacoesPorUsuario(prev => {
            const updatedTransacoes = [...(prev[usuarioId] || [])];
            updatedTransacoes.splice(idx, 1);
            return {
                ...prev,
                [usuarioId]: updatedTransacoes
            };
        });
    };

    useEffect(() => {
        //setTransacaoData({ ...props.transacao })

        api.get("banco")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setBancos(data));
    }, [])

    const handlerSelecionarBanco = (usuarioId: number, idx: number) => {
        let usuario = transacoesPorUsuario[usuarioId]?.[idx];

        if (usuario.banco) {
            let bancoSelecionado = bancos.find(item => item.name === usuario.banco.nome);
            return bancoSelecionado;
        }
    }

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
                                    <div className="flex flex-column">
                                        <div className="font-medium">
                                            {
                                                carteira.usuarios.map((usuario: Usuario) => (
                                                    <div key={usuario.id}>
                                                        <div className="mb-3 flex justify-content-between align-items-center">
                                                            <span className="text-2xl font-bold ">{capitalizeFirstLetter(usuario.nome)}</span>
                                                            <Button
                                                                className='ml-3'
                                                                label='Adicionar Ganhos'
                                                                icon="pi pi-plus"
                                                                onClick={() => {
                                                                    if (usuario.id) {
                                                                        handleAdicionarGanhos(usuario.id)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="grid">
                                                            {(transacoesPorUsuario[usuario.id ?? 0] || []).map((transacao, idx) => (
                                                                <div className='grid p-3'>
                                                                    <div className="col field flex flex-column">
                                                                        <label htmlFor="data" className="font-bold">
                                                                            Data
                                                                        </label>
                                                                        <Calendar
                                                                            value={
                                                                                (transacoesPorUsuario[usuario.id ?? 0]?.[idx]?.data
                                                                                    ? parseISO(transacoesPorUsuario[usuario.id ?? 0][idx].data)
                                                                                    : null)
                                                                            }
                                                                            dateFormat="dd/mm/yy"
                                                                            onChange={(e) => {
                                                                                if (e.target.value && usuario.id) {
                                                                                    const updatedTransacoes = [...(transacoesPorUsuario[usuario.id] || [])];
                                                                                    updatedTransacoes[idx] = { ...updatedTransacoes[idx], data: e.target.value.toISOString() };
                                                                                    setTransacoesPorUsuario({
                                                                                        ...transacoesPorUsuario,
                                                                                        [usuario.id]: updatedTransacoes
                                                                                    });
                                                                                }
                                                                            }} />
                                                                    </div>
                                                                    <div className="col field flex flex-column">
                                                                        <label htmlFor="description" className="font-bold">
                                                                            Description
                                                                        </label>
                                                                        <InputText id="description"
                                                                            value={
                                                                                transacoesPorUsuario[usuario.id ?? 0]?.[idx]?.descricao || ''
                                                                            }
                                                                            onChange={(e) => {
                                                                                if (usuario.id) {
                                                                                    const updatedTransacoes = [...(transacoesPorUsuario[usuario.id] || [])];
                                                                                    updatedTransacoes[idx] = { ...updatedTransacoes[idx], descricao: e.target.value };
                                                                                    setTransacoesPorUsuario({
                                                                                        ...transacoesPorUsuario,
                                                                                        [usuario.id]: updatedTransacoes
                                                                                    });
                                                                                }
                                                                            }}
                                                                            required />
                                                                    </div>
                                                                    <div className="col field flex flex-column">
                                                                        <label htmlFor="bancos" className="font-bold">
                                                                            Bancos
                                                                        </label>
                                                                        <Dropdown
                                                                            id="bancos"
                                                                            value={
                                                                                handlerSelecionarBanco(usuario.id ?? 0, idx)}
                                                                            onChange={(e) => {
                                                                                if (usuario.id) {
                                                                                    const updatedTransacoes = [...(transacoesPorUsuario[usuario.id] || [])];
                                                                                    updatedTransacoes[idx] = {
                                                                                        ...updatedTransacoes[idx], banco: {
                                                                                            id: e.value.code,
                                                                                            nome: e.value.name
                                                                                        } as Banco
                                                                                    };
                                                                                    setTransacoesPorUsuario({
                                                                                        ...transacoesPorUsuario,
                                                                                        [usuario.id]: updatedTransacoes
                                                                                    });
                                                                                }
                                                                            }}
                                                                            options={bancos}
                                                                            optionLabel="name"
                                                                            placeholder="Selecione o Banco"
                                                                            className="w-full"
                                                                        />
                                                                    </div>
                                                                    <div className="col field flex flex-column">
                                                                        <label htmlFor="valor" className="font-bold">
                                                                            Valor
                                                                        </label>
                                                                        <InputNumber id="valor"
                                                                            value={
                                                                                transacoesPorUsuario[usuario.id ?? 0]?.[idx]?.valor || 0
                                                                            }
                                                                            onValueChange={(e) => {
                                                                                if (usuario.id) {
                                                                                    const updatedTransacoes = [...(transacoesPorUsuario[usuario.id] || [])];
                                                                                    updatedTransacoes[idx] = { ...updatedTransacoes[idx], valor: Number(e.value) };
                                                                                    setTransacoesPorUsuario({
                                                                                        ...transacoesPorUsuario,
                                                                                        [usuario.id]: updatedTransacoes
                                                                                    });
                                                                                }
                                                                            }}
                                                                            mode="currency"
                                                                            currency="BRL"
                                                                            locale="pt-BR" />

                                                                    </div>
                                                                    <div className='col field flex align-items-center'>
                                                                        <Button
                                                                            icon="pi pi-trash"
                                                                            className="mt-4 p-button-danger p-button-rounded p-button-sm"
                                                                            onClick={() => {
                                                                                if (usuario.id) {
                                                                                    handleRemoverTransacao(usuario.id, idx)
                                                                                }
                                                                            }}
                                                                            tooltip="Remover"
                                                                        />

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex pt-4 justify-content-end">
                                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current && stepperRef.current.nextCallback()} />
                                    </div>
                                </StepperPanel>
                                <StepperPanel header="Gastos Conjuntos">
                                    <div className="flex flex-column">
                                        <div className="font-medium">
                                            <Button
                                                className='ml-3'
                                                label='Adicionar Gastos'
                                                icon="pi pi-plus"
                                                onClick={() =>
                                                    setGastos(prev => [...prev, {
                                                        quantasVezes: 0,
                                                        formaPagamento: FormaPagamento.PIX,
                                                        status: TipoStatus.NAO_PAGO,
                                                        responsavel: carteira.usuarios[0],
                                                        tipoTransacao: TipoTransacao.DEBITO,
                                                        receita: false
                                                    } as Transacao
                                                    ])
                                                }
                                            />
                                            <div>
                                                {
                                                    gastos.map((gasto, idx) => {
                                                        return (
                                                            <div className='grid p-3'>
                                                                <div className="col field flex flex-column">
                                                                    <label htmlFor="data" className="font-bold">
                                                                        Data
                                                                    </label>
                                                                    <Calendar
                                                                        value={
                                                                            gasto.data
                                                                                ? parseISO(gasto.data)
                                                                                : null
                                                                        }
                                                                        dateFormat="dd/mm/yy"
                                                                        onChange={(e) => {
                                                                            if (e.target.value) {
                                                                                const updatedGastos = [...gastos];
                                                                                updatedGastos[idx] = { ...updatedGastos[idx], data: e.target.value.toISOString() };
                                                                                setGastos(updatedGastos);
                                                                            }
                                                                        }} />
                                                                </div>
                                                                <div className="col field flex flex-column">
                                                                    <label htmlFor="description" className="font-bold">
                                                                        Description
                                                                    </label>
                                                                    <InputText id="description"
                                                                        value={gasto.descricao}
                                                                        onChange={(e) => {
                                                                            const updatedGastos = [...gastos];
                                                                            updatedGastos[idx] = { ...updatedGastos[idx], descricao: e.target.value };
                                                                            setGastos(updatedGastos);
                                                                        }}
                                                                        required />
                                                                </div>
                                                                <div className="col field flex flex-column">
                                                                    <label htmlFor="bancos" className="font-bold">
                                                                        Bancos
                                                                    </label>
                                                                    <Dropdown
                                                                        id="bancos"
                                                                        value={
                                                                            gasto.banco
                                                                                ? bancos.find(item => item.name === gasto.banco.nome)
                                                                                : null
                                                                        }
                                                                        onChange={(e) => {
                                                                            const updatedGastos = [...gastos];
                                                                            updatedGastos[idx] = {
                                                                                ...updatedGastos[idx],
                                                                                banco: {
                                                                                    id: e.value.code,
                                                                                    nome: e.value.name
                                                                                } as Banco
                                                                            };
                                                                            setGastos(updatedGastos);
                                                                        }}
                                                                        options={bancos}
                                                                        optionLabel="name"
                                                                        placeholder="Selecione o Banco"
                                                                        className="w-full"
                                                                    />
                                                                </div>
                                                                <div className="col field flex flex-column">
                                                                    <label htmlFor="valor" className="font-bold">
                                                                        Valor
                                                                    </label>
                                                                    <InputNumber id="valor"
                                                                        value={gasto.valor}
                                                                        onValueChange={(e) => {
                                                                            const updatedGastos = [...gastos];
                                                                            updatedGastos[idx] = { ...updatedGastos[idx], valor: Number(e.target.value) };
                                                                            setGastos(updatedGastos);
                                                                        }}
                                                                        mode="currency"
                                                                        currency="BRL"
                                                                        locale="pt-BR" />

                                                                </div>
                                                                <div className='col field flex align-items-center'>
                                                                    <Button
                                                                        icon="pi pi-trash"
                                                                        className="mt-4 p-button-danger p-button-rounded p-button-sm"
                                                                        onClick={() => {
                                                                            const updatedGastos = [...gastos];
                                                                            updatedGastos.splice(idx, 1);
                                                                            setGastos(updatedGastos);
                                                                        }}
                                                                        tooltip="Remover"
                                                                    />

                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex pt-4 justify-content-between">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current && stepperRef.current.prevCallback()} />
                                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current && stepperRef.current.nextCallback()} />
                                    </div>
                                </StepperPanel>
                                <StepperPanel header="Porcentagem de Investimento Conjunto">
                                    <div className="flex flex-column h-12rem">
                                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Cadastrar a porcentagem de investimento</div>
                                    </div>
                                    <div className="flex pt-4 justify-content-start">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
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