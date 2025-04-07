import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import api from "../config/api";
import { Transacao } from "../Domain/Transacao";
import { Banco } from "../Domain/Banco";
import { FormaPagamento } from "../Domain/FormaPagamento";
import { Status } from "../Domain/Status";
import { Responsavel } from "../Domain/Responsavel";
import { TipoTransacao } from "../Domain/TipoTransacao";
import { RootState } from "../redux/store";
import { criaTransacaoMes } from "../pages/Home/Mes/mesSlice";

declare interface PropsTransacaoGanhosDialog {
    transacao: Transacao
    dialogState: boolean
    setDialogState: Function
}

declare interface IDropdown {
    code: string,
    name: string
}

const TransacaoGanhosDialog = (props: PropsTransacaoGanhosDialog) => {

    const dispatch = useAppDispatch();

    const idUsuario: number = useSelector((state: RootState) => state.auth.idUsuario);
    const mesId: (number | null) = useSelector((state: RootState) => state.mes.id);

    const [transacaoData, setTransacaoData] = useState<Transacao>({} as Transacao);
    const [bancos, setBancos] = useState<IDropdown[]>([]);

    useEffect(() => {
        setTransacaoData({ ...props.transacao })

        api.get("banco")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setBancos(data));
    }, [])

    const hideDialog = () => {
        props.setDialogState(false);
    };

    const transactionDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => {

                let addTransacao = {
                    id: null,
                    data: transacaoData.data,
                    descricao: transacaoData.descricao,
                    valor: transacaoData.valor,
                    quantasVezes: 0,
                    banco: transacaoData.banco,
                    formaPagamento: { id: 1 } as FormaPagamento,
                    status: { id: 1 } as Status,
                    responsavel: { id: idUsuario } as Responsavel,
                    tipoTransacao: { id: 1 } as TipoTransacao,
                    receita: true
                } as Transacao

                dispatch(criaTransacaoMes({ transacao: addTransacao, idMes: Number(mesId) }))

                setTransacaoData({} as Transacao);
                props.setDialogState(false);
            }} />
        </React.Fragment>
    );

    const handlerSelecionarBanco = () => {
        if (transacaoData.banco) {
            let bancoSelecionado = bancos.find(item => Number(item.code) === transacaoData.banco.id)
            return bancoSelecionado;
        }
    }

    return (

        <Dialog visible={props.dialogState}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Detalhes da Transação"
            modal
            className="p-fluid"
            footer={transactionDialogFooter}
            onHide={hideDialog}>

            <div className="field">
                <label htmlFor="data" className="font-bold">
                    Data
                </label>
                <Calendar value={new Date(transacaoData.data)}
                    dateFormat="dd/mm/yy"
                    onChange={(e) => {
                        if (e.target.value) {
                            setTransacaoData({ ...transacaoData, data: e.target.value.toISOString() })
                        }
                    }} />
            </div>

            <div className="field">
                <label htmlFor="description" className="font-bold">
                    Description
                </label>
                <InputTextarea id="description"
                    value={transacaoData?.descricao}
                    onChange={(e) => setTransacaoData({ ...transacaoData, descricao: e.target.value })}
                    required
                    rows={3}
                    cols={20} />
            </div>
            <div className="field">
                <label htmlFor="bancos" className="font-bold">
                    Bancos
                </label>
                <Dropdown
                    id="bancos"
                    value={handlerSelecionarBanco()}
                    onChange={(e) => setTransacaoData({ ...transacaoData, banco: { id: e.target.value.code } as Banco })}
                    options={bancos}
                    optionLabel="name"
                    placeholder="Selecione o Banco"
                    className="w-full md:w-14rem" />
            </div>
            <div className="formgrid grid">
                <div className="field col-6">
                    <label htmlFor="valor" className="font-bold">
                        Valor
                    </label>
                    <InputNumber id="valor"
                        value={transacaoData?.valor}
                        onValueChange={(e) => setTransacaoData({ ...transacaoData, valor: Number(e.value) })}
                        mode="currency"
                        currency="BRL"
                        locale="pt-BR" />
                </div>
            </div>
        </Dialog>
    );
}

export default TransacaoGanhosDialog;