import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";
import { Button } from "primereact/button";
import TransacaoGastosDialog from "./TransacaoGastosDialog";
import { useAppDispatch } from "../redux/hooks";
import { InputText } from "primereact/inputtext";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { ITransacao, ITransacaoGastos } from "../pages/Home/Mes/Features/Rateio";
import { Transacao } from "../Domain/Transacao";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { dataTemplate } from "../utils/dataProcessor";
import { removeTransacoesMes } from "../pages/Home/Mes/mesSlice";


declare interface IPropsDataTableGanhos {
    titulo: string
}

export declare interface DataTableTransacaoGastos {
    id: number | null
    descricao: string
    data: string
    valor: number
    banco: string,
    responsavel: string,
    tipoTransacao: string
}

const DataTableGastos: React.FC<IPropsDataTableGanhos> = (props) => {

    const dispatch = useAppDispatch();

    const transacaoGastos: Transacao[] = useSelector((state: RootState) => state.mes.transacoes)
        .filter((transacao) => !transacao.receita);

    const [transacaoDialog, setTransacaoDialog] = useState<boolean>(false);

    const [selectedTransacao, setSelectedTransacao] = useState<Transacao>({} as Transacao);
    const [selectedTransacoes, setSelectedTransacoes] = useState<any[]>([]);

    const somaValor = (lista: Transacao[]) => {
        return lista.reduce((total, transacao) => total + (transacao.valor ?? 0), 0);
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const footerGroupGanhos = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={6} footerStyle={{ textAlign: 'left' }} />
                <Column footer={formatCurrency(somaValor(transacaoGastos))} colSpan={1} footerStyle={{ textAlign: 'left' }} />
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
                        setSelectedTransacao({} as Transacao)
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

                    <DataTable value={transacaoGastos}
                        paginator
                        rows={10}
                        selection={selectedTransacoes}
                        onSelectionChange={(e) => setSelectedTransacoes(e.value)}
                        selectionMode="checkbox"
                        onRowDoubleClick={(e) => {
                            setTransacaoDialog(true);
                            setSelectedTransacao(e.data as Transacao)
                        }}
                        footerColumnGroup={footerGroupGanhos}>

                        <Column selectionMode="multiple"
                            exportable={false} />

                        <Column field="responsavel"
                            header="Responsável"
                            body={(item: Transacao) => item.responsavel.nome}
                            style={{ maxWidth: '15rem' }}
                        />

                        <Column field="tipoGasto"
                            header="Tipo Gasto"
                            body={(item: Transacao) => item.tipoTransacao.nome}
                        />

                        <Column field="data"
                            header="Data"
                            sortable
                            body={dataTemplate}
                            style={{ maxWidth: '10rem' }} />

                        <Column field="descricao"
                            header="Descrição" />

                        <Column field="banco"
                            header="Banco"
                            body={(item: Transacao) => item.banco.nome}
                        />

                        <Column field="valor"
                            header="Valor"
                            body={priceBodyTemplate} />
                    </DataTable>
                </div>
            </div>
            {
                transacaoDialog
                    ? <TransacaoGastosDialog dialogState={transacaoDialog}
                        setDialogState={setTransacaoDialog}
                        transacao={selectedTransacao}
                    />
                    : <></>
            }


        </div>)
}

export default DataTableGastos;