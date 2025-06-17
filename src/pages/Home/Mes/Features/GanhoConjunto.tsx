import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import React, { useRef } from 'react';
import { TipoStatus } from '../../../../enums/TipoStatus';
import { TipoTransacao } from '../../../../enums/TipoTransacao';
import { FormaPagamento } from '../../../../enums/FormaPagamento';
import { Transacao } from '../../../../Domain/Transacao';
import { Usuario } from '../../../../Domain/Usuario';
import { Responsavel } from '../../../../Domain/Responsavel';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { Banco } from '../../../../Domain/Banco';
import { capitalizeFirstLetter } from '../../../../utils/stringProcessor';
import { parseISO } from 'date-fns';
import { Carteira } from '../../../../Domain/Carteira';
import { IDropdown } from '../MesConjunto';
import {
    atualizaTransacao,
    criaTransacaoMes,
    editaTransacoesMes,
    MesState,
    removeTransacoesMes
} from '../mesSlice';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

declare interface GanhoConjuntoProps {
    responsaveis: Responsavel[],
    bancos: IDropdown[]
}

const GanhoConjunto: React.FC<GanhoConjuntoProps> = ({ responsaveis, bancos }) => {

    const dispatch = useAppDispatch();

    const mes: MesState = useSelector((state: RootState) => state.mes);
    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const ganhos = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => transacao.receita);
    const toast = useRef<Toast>(null);

    const handleAdicionarGanhos = (usuario: Usuario) => {
        let addTransacao = {
            data: new Date().toISOString(),
            descricao: '',
            banco: { id: 1 } as Banco,
            valor: 0,
            responsavel: findResponsavelAssociadoUsuario(usuario),
            quantasVezes: 0,
            formaPagamento: FormaPagamento.PIX,
            status: TipoStatus.PAGO,
            tipoTransacao: TipoTransacao.DEBITO,
            receita: true
        } as Transacao
        dispatch(criaTransacaoMes({ transacao: addTransacao, idMes: Number(mes.id) }));
    };

    const findResponsavelAssociadoUsuario = (usuario: Usuario): Responsavel | undefined => {
        return responsaveis
            .filter(responsavel => responsavel.usuarioInfo.id === usuario.id)
            .find(responsavel => responsavel.nome === usuario.nome);
    }

    const getTransacoesPorUsuario = (usuario: Usuario) => {
        let responsavel: Responsavel | undefined = findResponsavelAssociadoUsuario(usuario);
        if (responsavel) {
            return ganhos.filter(ganho => ganho.responsavel.id === responsavel?.id);
        }
        return [] as Transacao[];
    }

    const handlerSelecionarBanco = (transacao: Transacao) => {
        if (transacao?.banco) {
            let bancoSelecionado = bancos.find(item => item.name === transacao.banco.nome);
            return bancoSelecionado;
        }
    }

    return (
        <div className="flex flex-column">
            <Toast ref={toast} />
            <div className="font-medium">
                {
                    carteira.usuarios.map((usuario: Usuario) => (
                        <div key={usuario.id}>
                            <div className="mb-3 flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-2xl justify-content-start font-bold ">{capitalizeFirstLetter(usuario.nome)}</span>
                                </div>
                                <div>
                                    <Button
                                        className='ml-3 justify-content-end'
                                        label='Adicionar Ganhos'
                                        icon="pi pi-plus"
                                        onClick={() => handleAdicionarGanhos(usuario)}
                                    />
                                    <Button label='Salvar'
                                        className='ml-3 justify-content-end'
                                        icon="pi pi-save"
                                        iconPos="right" onClick={() => {
                                            dispatch(editaTransacoesMes({
                                                transacoes: ganhos,
                                                idMes: Number(mes.id)
                                            }))
                                                .then(() => {
                                                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Dados Salvos com sucesso', life: 3000 })
                                                })
                                        }} />
                                </div>
                            </div>
                            <div className="grid">
                                {getTransacoesPorUsuario(usuario).map((transacao) => (
                                    <div className='grid p-3' key={transacao.id}>
                                        <div className="col field flex flex-column">
                                            <label htmlFor="data" className="font-bold">
                                                Data
                                            </label>
                                            <Calendar
                                                value={
                                                    (transacao?.data
                                                        ? parseISO(transacao.data)
                                                        : null)
                                                }
                                                dateFormat="dd/mm/yy"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        dispatch(atualizaTransacao({ ...transacao, data: e.target.value.toISOString() }));

                                                    }
                                                }} />
                                        </div>
                                        <div className="col field flex flex-column">
                                            <label htmlFor="description" className="font-bold">
                                                Description
                                            </label>
                                            <InputText id="description"
                                                value={
                                                    transacao.descricao || ''
                                                }
                                                onChange={(e) => {
                                                    dispatch(atualizaTransacao({ ...transacao, descricao: e.target.value }));
                                                }}
                                                required />
                                        </div>
                                        <div className="col field flex flex-column">
                                            <label htmlFor="bancos" className="font-bold">
                                                Bancos
                                            </label>
                                            <Dropdown
                                                id="bancos"
                                                value={handlerSelecionarBanco(transacao)}
                                                onChange={(e) => {
                                                    dispatch(atualizaTransacao({
                                                        ...transacao,
                                                        banco: {
                                                            id: e.value.code,
                                                            nome: e.value.name
                                                        } as Banco
                                                    }));
                                                }}
                                                options={bancos}
                                                optionLabel="name"
                                                placeholder="Selecione o Banco"
                                                className="w-full"
                                                style={{ minWidth: '15rem' }}
                                            />
                                        </div>
                                        <div className="col field flex flex-column">
                                            <label htmlFor="valor" className="font-bold">
                                                Valor
                                            </label>
                                            <InputNumber id="valor"
                                                value={
                                                    transacao.valor || 0
                                                }
                                                onValueChange={(e) => {
                                                    dispatch(atualizaTransacao({ ...transacao, valor: Number(e.value) }));
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
                                                    dispatch(removeTransacoesMes([transacao.id as number]));
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
    );
};

export default GanhoConjunto;