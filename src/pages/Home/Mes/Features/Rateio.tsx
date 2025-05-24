import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Tag } from "primereact/tag";
import { useAppDispatch } from "../../../../redux/hooks";
import api from "../../../../config/api";
import { Responsavel } from "../../../../Domain/Responsavel";
import { Banco } from "../../../../Domain/Banco";
import { IDropdownGastos } from "../../../../components/TransacaoGastosDialog";
import { TipoStatus } from "../../../../enums/TipoStatus";
import { Transacao } from "../../../../Domain/Transacao";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { editarTransacaoMes } from "../mesSlice";


const Rateio: React.FC = (props) => {

    const dispatch = useAppDispatch();
    const transacoes: Transacao[] = useSelector((state: RootState) => state.mes.transacoes)

    const [responsaveis, setResponsaveis] = useState<IDropdownGastos[]>([]);
    const [transacoesFiltered, setTransacoesFiltered] = useState<Transacao[]>([])
    const [responsavel, setResponsavel] = useState<Responsavel>({} as Responsavel);

    useEffect(() => {

        api.get("responsaveis")
            .then(response => response.data.map((item: any) => {
                return {
                    name: item.nome,
                    code: item.id
                }
            }))
            .then(data => setResponsaveis(data))

    }, []);

    useEffect(() => {
        setTransacoesFiltered(
            transacoes
                .filter((transacao) => !transacao.receita)
                .filter(transacao => transacao.responsavel.nome === responsavel.nome)
        )
    }, [responsavel, transacoes]);

    const optionsAux: IDropdownGastos[] = [
        { name: 'Pago', code: TipoStatus.PAGO },
        { name: 'Não Pago', code: TipoStatus.NAO_PAGO },
    ];

    const dataTemplate = (item: Transacao) => {
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
        lista: IDropdownGastos[],
        dado: Responsavel | Banco
    ): IDropdownGastos | undefined => {
        return lista.find(item => item.code === dado?.id);
    };

    const handlerDropdownStatus = (
        lista: IDropdownGastos[],
        dado: string,
    ): IDropdownGastos | undefined => {
        return lista.find(item => item.code === dado);
    };

    const somaValor = (lista: Transacao[]) => {
        return lista
            .filter(item => item.status === TipoStatus.NAO_PAGO)
            .reduce((total, transacao) => total + (transacao.valor ?? 0), 0);
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const footerGroupRateio = (
        <ColumnGroup>
            <Row>
                <Column footer="Falta Pagar" colSpan={6} footerStyle={{ textAlign: 'left' }} />
                <Column footer={formatCurrency(somaValor(transacoesFiltered))} footerStyle={{ textAlign: 'left' }} />
            </Row>
        </ColumnGroup>
    );

    const statusTemplate = (item: Transacao) => {
        return item.status === TipoStatus.PAGO
            ? <Tag value="Pago" severity="success" />
            : <Tag value="Não Pago" severity="danger" />
    }

    const onCellEditComplete = (e: any) => {
        const { newValue, field, rowData } = e;
        const updatedTransacao = { ...rowData, [field]: newValue };
        dispatch(editarTransacaoMes(updatedTransacao));
    };

    const cellEditor = (options: any) => {
        return (
            <Dropdown
                options={optionsAux}
                value={handlerDropdownStatus(optionsAux, options.rowData.status)}
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
                        value={handlerDropdown(responsaveis, responsavel)}
                        onChange={(e) => setResponsavel({
                            id: e.target.value.code,
                            nome: e.target.value.name
                        } as Responsavel
                        )}
                        options={responsaveis}
                        optionLabel="name"
                        placeholder="Selecione o Responsável"
                        className="w-full md:w-14rem"
                        style={{ minWidth: "17rem" }} />
                </div>
            </div>

            <div id="tabela">
                <DataTable value={transacoesFiltered}
                    footerColumnGroup={footerGroupRateio}
                    editMode="cell">


                    <Column field="responsavel"
                        header="Responsável"
                        body={(item: Transacao) => item.responsavel.nome}
                        style={{ maxWidth: '15rem' }}
                    />

                    <Column field="tipoGasto"
                        header="Tipo Gasto"
                        body={(item: Transacao) => item.tipoTransacao} />

                    <Column field="data"
                        header="Data"
                        sortable
                        body={dataTemplate}
                        style={{ maxWidth: '10rem' }} />

                    <Column field="descricao"
                        header="Descrição" />

                    <Column field="banco"
                        header="Banco"
                        body={(item: Transacao) => item.banco.nome} />

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