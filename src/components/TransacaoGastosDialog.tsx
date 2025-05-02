import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useAppDispatch } from "../redux/hooks";
import { Transacao } from "../Domain/Transacao";
import { criaTransacaoMes, editarTransacaoMes } from "../pages/Home/Mes/mesSlice";
import api from "../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { parseISO } from "date-fns";
import { Banco } from "../Domain/Banco";
import { FormaPagamento } from "../Domain/FormaPagamento";
import { Responsavel } from "../Domain/Responsavel";
import { TipoTransacao } from "../Domain/TipoTransacao";
import { SelectButton } from "primereact/selectbutton";
import { TipoStatus } from "../enums/TipoStatus";
import { AuthState } from "../pages/Home/Login/authSlice";

declare interface IPropsTransacaoGanhosDialog {
    transacao: Transacao
    dialogState: boolean
    setDialogState: Function
}

export declare interface IDropdown {
    code: number,
    name: string
}

const TransacaoGastosDialog = (props: IPropsTransacaoGanhosDialog) => {

    const dispatch = useAppDispatch();
    const usuario: AuthState = useSelector((state: RootState) => state.auth);
    const mesId: (number | null) = useSelector((state: RootState) => state.mes.id);

    const [transacaoData, setTransacaoData] = useState<Transacao>({ ...props.transacao });
    const [bancos, setBancos] = useState<IDropdown[]>([]);
    const [responsaveis, setResponsaveis] = useState<IDropdown[]>([]);
    const [tipoTransacao, setTipoTransacao] = useState<IDropdown[]>([])
    const [formaPagamento, setFormaPagamento] = useState<IDropdown[]>([])

    const options = [
        { name: 'Pago', value: TipoStatus.PAGO },
        { name: 'Não Pago', value: TipoStatus.NAO_PAGO },
    ];

    const [status, setStatus] = useState<any>(options[1]);

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

        api.get("responsaveis")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setResponsaveis(data))

        api.get("tipo-transacao")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setTipoTransacao(data))


        api.get("forma-pagamento")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }
            ))
            .then(data => setFormaPagamento(data))

    }, [props.transacao])


    const hideDialog = () => {
        props.setDialogState(false);
    };

    const transactionDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={() => {

                let addTransacao = {
                    id: transacaoData?.id,
                    data: transacaoData.data ?? parseISO(new Date().toISOString()),
                    descricao: transacaoData.descricao,
                    valor: transacaoData.valor,
                    quantasVezes: transacaoData.quantasVezes,
                    banco: transacaoData.banco,
                    formaPagamento: transacaoData.formaPagamento,
                    status: status.value,
                    responsavel: transacaoData.responsavel ?? { id: usuario.idUsuario, nome: usuario.nome },
                    tipoTransacao: transacaoData.tipoTransacao,
                    receita: false
                } as Transacao


                transacaoData.id
                    ? dispatch(editarTransacaoMes(transacaoData))
                    : dispatch(criaTransacaoMes({ transacao: addTransacao, idMes: Number(mesId) }))
                props.setDialogState(false);
            }} />
        </React.Fragment>
    );

    const handlerDropdown = (
        lista: IDropdown[],
        dado: Responsavel | Banco | FormaPagamento | TipoTransacao,
    ): IDropdown | undefined => {
        return lista.find(item => item.code === dado?.id);
    };

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
                <Calendar value={transacaoData.data ? parseISO(transacaoData.data) : parseISO(new Date().toISOString())}
                    dateFormat="dd/mm/yy"
                    onChange={(e) => {
                        if (e.target.value) {
                            setTransacaoData({ ...transacaoData, data: e.target.value.toISOString() })
                        }
                    }} />
            </div>
            <div className="formgrid grid">
                <div className="field col-6">
                    <label htmlFor="valor" className="font-bold">
                        Valor
                    </label>
                    <InputNumber id="valor"
                        value={transacaoData?.valor}
                        onChange={(e) => setTransacaoData({ ...transacaoData, valor: Number(e.value) })}
                        mode="currency"
                        currency="BRL"
                        locale="pt-BR" />
                </div>
                <div className="field col-6">
                    <label htmlFor="parcelas" className="font-bold mb-2">Parcelas</label>
                    <InputNumber inputId="parcelas"
                        value={transacaoData.quantasVezes}
                        onValueChange={(e: InputNumberValueChangeEvent) => setTransacaoData({ ...transacaoData, quantasVezes: Number(e.value) })}
                        showButtons min={0} />

                </div>
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
            <div className="field align-items-center">
                <SelectButton value={transacaoData.status}
                    onChange={(e) => setTransacaoData({ ...transacaoData, status: e.value })}
                    optionLabel="name"
                    options={options} />
            </div>
            <div className="formgrid grid">
                <div className="field col-6">
                    <label htmlFor="responsavel" className="font-bold">
                        Responsável
                    </label>
                    <Dropdown
                        id="responsavel"
                        value={handlerDropdown(responsaveis, transacaoData.responsavel)}
                        onChange={(e) => setTransacaoData({
                            ...transacaoData, responsavel: {
                                id: e.target.value.code,
                                nome: e.target.value.name
                            } as Responsavel
                        })}
                        options={responsaveis}
                        optionLabel="name"
                        placeholder="Selecione"
                        className="w-full md:w-14rem" />
                </div>
                <div className="field col-6">
                    <label htmlFor="tipoGasto" className="font-bold">
                        Tipo
                    </label>
                    <Dropdown
                        id="tipoGasto"
                        value={handlerDropdown(tipoTransacao, transacaoData.tipoTransacao)}
                        onChange={(e) => {
                            setTransacaoData({
                                ...transacaoData, tipoTransacao: {
                                    id: e.target.value.code,
                                    nome: e.target.name
                                } as TipoTransacao
                            })
                        }}
                        options={tipoTransacao}
                        optionLabel="name"
                        placeholder="Selecione"
                        className="w-full md:w-14rem" />
                </div>
            </div>
            <div className="formgrid grid">
                <div className="field col-6">
                    <label htmlFor="bancos" className="font-bold">
                        Bancos
                    </label>
                    <Dropdown
                        id="bancos"
                        value={handlerDropdown(bancos, transacaoData.banco)}
                        onChange={(e) => setTransacaoData({
                            ...transacaoData, banco: {
                                id: e.target.value.code,
                                nome: e.target.value.name
                            } as Banco
                        })}
                        options={bancos}
                        optionLabel="name"
                        placeholder="Selecione"
                        className="w-full md:w-14rem" />
                </div>
                <div className="field col-6">
                    <label htmlFor="forma-pagamento" className="font-bold">
                        Forma Pagamento
                    </label>
                    <Dropdown
                        id="forma-pagamento"
                        value={handlerDropdown(formaPagamento, transacaoData.formaPagamento)}
                        onChange={(e) => setTransacaoData({
                            ...transacaoData, formaPagamento: {
                                id: e.target.value.code,
                                descricao: e.target.value.name
                            } as FormaPagamento
                        })}
                        options={formaPagamento}
                        optionLabel="name"
                        placeholder="Selecione"
                        className="w-full md:w-14rem" />
                </div>
            </div>

        </Dialog>
    );
}

export default TransacaoGastosDialog;