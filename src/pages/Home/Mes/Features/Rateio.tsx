import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IDropdown } from "../../../../components/TransacaoGastosDialog";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Tag } from "primereact/tag";
import { useAppDispatch } from "../../../../redux/hooks";

declare interface IPropsRateio {
    gastos: ITransacaoGastos[]
}
export interface ITransacao {
    id: number;
    data: string;
    descricao: string;
    valor: number;
    tipoGasto: string;
    banco: string;
    status: string;
}

export interface ITransacaoGastos extends ITransacao {
    responsavel: string;
}
const Rateio: React.FC<IPropsRateio> = (props) => {

    const dispatch = useAppDispatch();

    const [selectTransacoes, setSelectTransacoes] = useState<ITransacaoGastos[]>([])
    const [transacaoData, setTransacaoData] = useState<ITransacaoGastos>({} as ITransacaoGastos);

    useEffect(() => {
        let gastosPorResposavel = props.gastos.filter(item => item.responsavel === transacaoData.responsavel)
        setSelectTransacoes(gastosPorResposavel);
    }, [transacaoData, props.gastos])

    const responsaveis: IDropdown[] = [
        { name: 'Wilson', code: 'Wilson' },
        { name: 'Gabrielle', code: 'Gabrielle' },
        { name: 'Terezinha', code: 'Terezinha' },
        { name: 'Jocimar', code: 'Jocimar' },
        { name: 'Caio', code: 'Caio' },
    ];

    const status: IDropdown[] = [
        { name: 'Pago', code: 'Pago' },
        { name: 'Não Pago', code: 'Nao_Pago' }
    ];

    const dataTemplate = (item: ITransacao) => {
        return new Date(item.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    const priceBodyTemplate = (item: any) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor);
    };

    const handlerDropdown = (
        transacao: any,
        lista: IDropdown[],
        alvo: keyof typeof transacao
    ): IDropdown | undefined => {
        if (transacao && alvo in transacao) {
            return lista.find((item: IDropdown) => item.code === transacao[alvo]);
        }
        return undefined;
    };

    const somaValor = (lista: ITransacaoGastos[]) => {
        return lista
            .filter(item => item.status === 'Nao_Pago')
            .reduce((total, transacao) => total + (transacao.valor ?? 0), 0);
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const footerGroupRateio = (
        <ColumnGroup>
            <Row>
                <Column footer="Falta Pagar" colSpan={6} footerStyle={{ textAlign: 'left' }} />
                <Column footer={formatCurrency(somaValor(selectTransacoes))} footerStyle={{ textAlign: 'left' }} />
            </Row>
        </ColumnGroup>
    );

    const statusTemplate = (item: ITransacaoGastos) => {
        return item.status === "Pago"
            ? <Tag value="Pago" severity="success" />
            : <Tag value="Não Pago" severity="danger" />
    }

    const onCellEditComplete = (e: any) => {
        const { newValue, field, rowData } = e;
        const updatedTransacao = { ...rowData, [field]: newValue.status || newValue };
        //dispatch(adicionarEditarGastos(updatedTransacao));
    };

    const cellEditor = (options: any) => {
        return (
            <Dropdown
                options={status}
                value={handlerDropdown(options.rowData, status, "status")}
                optionLabel="name"
                onChange={(e) => {
                    options.editorCallback(e.target.value.code);
                }}
                onKeyDown={(e) => e.stopPropagation()}
            />
        );
    };

    return (
        <div>

            <div className="">
                <div className="field">
                    <label htmlFor="responsavel" className="font-bold block">
                        Responsável
                    </label>
                    <Dropdown
                        id="responsavel"
                        value={handlerDropdown(transacaoData, responsaveis, "responsavel")}
                        onChange={(e) => setTransacaoData({ ...transacaoData, responsavel: e.target.value.code })}
                        options={responsaveis}
                        optionLabel="name"
                        placeholder="Selecione o Responsável"
                        className="w-full md:w-14rem"
                        style={{ minWidth: "17rem" }} />
                </div>
            </div>

            <div id="tabela">
                <DataTable value={selectTransacoes}
                    footerColumnGroup={footerGroupRateio}
                    editMode="cell">


                    <Column field="responsavel"
                        header="Responsável"
                        style={{ maxWidth: '15rem' }}
                    />

                    <Column field="tipoGasto"
                        header="Tipo Gasto" />

                    <Column field="data"
                        header="Data"
                        sortable
                        body={dataTemplate}
                        style={{ maxWidth: '10rem' }} />

                    <Column field="descricao"
                        header="Descrição" />

                    <Column field="banco"
                        header="Banco" />

                    <Column field="status"
                        header="Status"
                        editor={(options) => cellEditor(options)}
                        onCellEditComplete={onCellEditComplete}
                        body={statusTemplate} />

                    <Column field="valor"
                        header="Valor"
                        body={priceBodyTemplate} />


                </DataTable>
            </div>
        </div>
    );
}

export default Rateio;