import React, { useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import TransacaoGanhosDialog from "./TransacaoGanhosDialog";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { removeTransacoesMes } from "../pages/Home/Mes/mesSlice";
import { dataTemplate } from "../utils/dataProcessor";

declare interface IPropsDataTableGanhos {
    titulo: string
}

export declare interface DataTableTransacao {
    id: number | null
    descricao: string
    data: string
    valor: number
    banco: string
}
const DataTableGanhos = (props: IPropsDataTableGanhos) => {

    const dispatch = useAppDispatch();

    const transacaoGanhos: DataTableTransacao[] = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => transacao.receita)
        .map(({ id, descricao, data, valor, banco }) => ({
            id,
            descricao,
            data,
            valor,
            banco: banco.nome
        } as DataTableTransacao));


    const [transacaoDialog, setTransacaoDialog] = useState<boolean>(false);

    const [selectedTransacao, setSelectedTransacao] = useState<any>(null);
    const [selectedTransacoes, setSelectedTransacoes] = useState<any[]>([]);

    const somaValor = (lista: DataTableTransacao[]) => {
        let valorTotal: number = 0;
        lista.forEach(transacao => {
            if (transacao?.valor)
                valorTotal += transacao.valor
        });
        return valorTotal;
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const footerGroupGanhos = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={4} footerStyle={{ textAlign: 'left' }} />
                <Column footer={formatCurrency(somaValor(transacaoGanhos))} colSpan={4} footerStyle={{ textAlign: 'left' }} />
            </Row>
        </ColumnGroup>
    );


    const priceBodyTemplate = (item: any) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Novo"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={() => {
                        setTransacaoDialog(true);
                        setSelectedTransacao(null)
                    }} />
                <Button label="Delete"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={deletarTransacoes}
                    disabled={!selectedTransacoes?.length} />

            </div>
        );
    };

    const deletarTransacoes = () => {
        let transacoesSelecionadas = selectedTransacoes.map(transacao => transacao.id)
        dispatch(removeTransacoesMes(transacoesSelecionadas))
        setSelectedTransacoes([])
    }

    return (
        <div id="tabela">
            <div>
                <h1>{props.titulo}</h1>
            </div>
            <div className=''>
                <div className="">
                    <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>

                    <DataTable value={transacaoGanhos}
                        dataKey="id"
                        paginator
                        rows={10}
                        footerColumnGroup={footerGroupGanhos}
                        selection={selectedTransacoes}
                        onSelectionChange={(e) => setSelectedTransacoes(e.value)}
                        selectionMode="checkbox"
                        onRowDoubleClick={(e) => {
                            setTransacaoDialog(true);
                            setSelectedTransacao(e.data)
                        }}>
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="data" header="Data" sortable body={dataTemplate}></Column>
                        <Column field="descricao" header="Descrição"></Column>
                        <Column field="banco" header="Banco" ></Column>
                        <Column field="valor" header="Valor" body={priceBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            {
                transacaoDialog
                    ? <TransacaoGanhosDialog dialogState={transacaoDialog}
                        setDialogState={setTransacaoDialog}
                        transacao={selectedTransacao}
                    />
                    : <></>
            }

        </div>)
}

export default DataTableGanhos;