import React from 'react';
import { Responsavel } from '../../../../Domain/Responsavel';
import { IDropdown } from '../MesConjunto';
import { Button } from 'primereact/button';
import { useAppDispatch } from '../../../../redux/hooks';
import { atualizaTransacao, criaTransacaoMes, editaTransacoesMes, MesState, removeTransacoesMes } from '../mesSlice';
import { Carteira } from '../../../../Domain/Carteira';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { FormaPagamento } from '../../../../enums/FormaPagamento';
import { Banco } from '../../../../Domain/Banco';
import { TipoStatus } from '../../../../enums/TipoStatus';
import { TipoTransacao } from '../../../../enums/TipoTransacao';
import { Transacao } from '../../../../Domain/Transacao';
import { Calendar } from 'primereact/calendar';
import { parseISO } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

declare interface GanhoConjuntoProps {
    responsaveis: Responsavel[],
    bancos: IDropdown[]
}
const GastoConjunto: React.FC<GanhoConjuntoProps> = ({ responsaveis, bancos }) => {

    const dispatch = useAppDispatch();

    const mes: MesState = useSelector((state: RootState) => state.mes);
    const carteira: Carteira = useSelector((state: RootState) => state.carteira.carteiraSelected);
    const gastos = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => !transacao.receita);

    const handlerAdicionarGastos = () => {
        let addGastos = {
            data: new Date().toISOString(),
            descricao: '',
            banco: { id: 1 } as Banco,
            valor: 0,
            quantasVezes: 0,
            formaPagamento: FormaPagamento.PIX,
            status: TipoStatus.NAO_PAGO,
            responsavel: carteira.usuarios[0],
            tipoTransacao: TipoTransacao.DEBITO,
            receita: false
        } as Transacao
        dispatch(criaTransacaoMes({ transacao: addGastos, idMes: Number(mes.id) }));
    };

    return (
        <div className="flex flex-column">
            <div className="font-medium">
                <Button
                    className='ml-3'
                    label='Adicionar Gastos'
                    icon="pi pi-plus"
                    onClick={() =>
                        handlerAdicionarGastos()
                    }
                />
                <Button
                    label='Salvar'
                    icon="pi pi-save"
                    iconPos="right"
                    className='ml-3'
                    onClick={() => {
                        dispatch(editaTransacoesMes({
                            transacoes: gastos,
                            idMes: Number(mes.id)
                        }));
                    }} />
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
                                                    dispatch(atualizaTransacao({ ...gasto, data: e.target.value.toISOString() }));
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
                                                dispatch(atualizaTransacao({ ...gasto, descricao: e.target.value }));
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
                                                dispatch(atualizaTransacao({
                                                    ...gasto, banco: {
                                                        id: e.value.code,
                                                        nome: e.value.name
                                                    } as Banco
                                                }));

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
                                                dispatch(atualizaTransacao({ ...gasto, valor: Number(e.target.value) }));
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
                                                dispatch(removeTransacoesMes([gasto.id as number]));
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
    );
};

export default GastoConjunto;