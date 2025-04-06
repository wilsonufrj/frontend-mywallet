import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

declare interface XHost {
    id: number
    hostName: string
    porta: number
    diretorioTrabalho: string
    proprietario: string
    checked: boolean
    modelo: string
}

declare interface XModelo {
    name: string,
    code: string
}

const hosts: XHost[] = [
    {
        id: 1,
        hostName: "Host 1",
        porta: 22,
        diretorioTrabalho: "/nffshere/deck/julia",
        proprietario: "Julia",
        modelo: "PLDPro5.1.0",
        checked: true
    },
    {
        id: 2,
        hostName: "Host 2",
        porta: 22,
        diretorioTrabalho: "/nffshere/deck/wilson",
        proprietario: "Wilson",
        modelo: "PLDPro5.1.0",
        checked: false
    },
    {
        id: 3,
        hostName: "Host 3",
        porta: 8080,
        diretorioTrabalho: "/nffshere/deck/mike",
        proprietario: "Mike",
        modelo: "PLDPro5.1.0",
        checked: true
    },
    {
        id: 4,
        hostName: "Host 4",
        porta: 3306,
        diretorioTrabalho: "/nffshere/deck/anna",
        proprietario: "Anna",
        modelo: "PLDPro5.1.0",
        checked: false
    }
];

const modelos: XModelo[] = [
    {
        name: "PLDPro5.1.0",
        code: "PLDPro5.1.0"
    },
    {
        name: "PLDPro6.1.1",
        code: "PLDPro6.1.1"
    },
    {
        name: "PLDPro6.2.0",
        code: "PLDPro6.2.0"
    },
    {
        name: "PLDPro7.0.0",
        code: "PLDPro7.0.0"
    }
]

export default function XLibs() {

    const [selectedProducts, setSelectedProducts] = useState<XHost[]>([]);
    const [stateHosts, setStateHosts] = useState<XHost[]>(hosts)
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);


    const findModelo = (modelo: string) => {
        return modelos.find(item => item.name === modelo);
    }

    const modeloBodyTemplate = (host: XHost) => {
        return (<Dropdown
            options={modelos}
            value={findModelo(host.modelo)}
            onChange={(e) => {
                let auxState = [...stateHosts]

                let auxHost = auxState.find(item => item.id === host.id);
                if (auxHost) {
                    auxHost.modelo = e.value.name;
                }

                setStateHosts(auxState);

            }}
            optionLabel="name"
        />)
    }

    const rowExpansionTemplate = (data: XHost) => {
        return (
            <div>
                <h4>Configuração Host de execução Mensal</h4>
                <div className="flex justify-content-initial ">
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="hosts">Select a Host</label>
                        <Dropdown
                            id="hosts"
                            options={modelos}
                            value={findModelo(data.modelo)}
                            onChange={(e) => {
                                let auxState = [...stateHosts]

                                let auxHost = auxState.find(item => item.id === data.id);
                                if (auxHost) {
                                    auxHost.modelo = e.value.name;
                                }

                                setStateHosts(auxState);

                            }}
                            optionLabel="name"
                        />
                    </div>
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="grupo">Grupo</label>
                        <InputText id="grupo" value={"Grupo"} />
                    </div>
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="grupo">Numero Processadores Newave</label>
                        <InputNumber value={30} onValueChange={(e) => console.log()} useGrouping={false} />
                    </div>
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="grupo">Configuração dos nós do Decomp</label>
                        <InputText id="grupo" value={"Configuração dos nós do Newave"} />
                    </div>
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="grupo">Numero Processadores Newave</label>
                        <InputNumber value={30} onValueChange={(e) => console.log()} useGrouping={false} />
                    </div>
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="grupo">Configuração dos nós do Decomp</label>
                        <InputText id="grupo" value={"Configuração dos nós do Newave"} />
                    </div>
                </div>
                <h4>Configuração Host de execução Dessem</h4>
                <div className="flex justify-content-initial">
                    <div className="flex flex-column gap-2 mr-3">
                        <label htmlFor="hosts">Select a Host</label>
                        <Dropdown
                            id="hosts"
                            options={modelos}
                            value={findModelo(data.modelo)}
                            onChange={(e) => {
                                let auxState = [...stateHosts]

                                let auxHost = auxState.find(item => item.id === data.id);
                                if (auxHost) {
                                    auxHost.modelo = e.value.name;
                                }

                                setStateHosts(auxState);

                            }}
                            optionLabel="name"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="grupo">Grupo</label>
                        <InputText id="grupo" value={"Grupo"} />
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div>
            <DataTable
                value={hosts}
                selectionMode={'checkbox'}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                selection={selectedProducts}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
            >

                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }} />

                <Column
                    expander={true}
                    style={{ width: '5rem' }} />

                <Column
                    field="hostName"
                    header="Hostname" />

                <Column
                    field="porta"
                    header="Porta" />

                <Column
                    field="diretorioTrabalho"
                    header="Diretorio de Trabalho" />

                <Column
                    field="proprietario"
                    header="Proprietário" />

                <Column
                    field="modelo"
                    header="Modelo"
                    body={modeloBodyTemplate} />
            </DataTable>
        </div>
    )
}