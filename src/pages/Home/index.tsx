import React, { useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';

import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

declare interface DataInterface {
    hostName: string,
    porta: number,
    modelo: string,
    dirtorioTrabalho: string,
    proprietario: string,
    checked: boolean
}

export default function Home() {

    const cities = [
        { name: 'PLDPro5.0', code: 'NY' },
        { name: 'PLDPro5.5', code: 'RM' },
        { name: 'PLDPro6.0', code: 'LDN' },
        { name: 'PLDPro8.0', code: 'IST' },
        { name: 'PLDPro10.0', code: 'PRS' }
    ];
    const [validaModelos, setValidaModelos] = useState(false);

    const msgs = useRef<Messages | null>(null);
    const [open, setOpen] = useState(false);
    const [mockData, setMockData] = useState([
        {
            hostName: "Corp 90",
            porta: 22,
            modelo: 'PLDPro6.0',
            dirtorioTrabalho: "/nffshere/deck/wilson",
            proprietario: "Wilson",
            checked: false
        },
        {
            hostName: "Host 2",
            porta: 22,
            dirtorioTrabalho: "/nffshere/deck/wilson",
            proprietario: "Wilson",
            checked: false
        },
        {
            hostName: "Host 3",
            porta: 22,
            dirtorioTrabalho: "/nffshere/deck/wilson",
            proprietario: "Wilson",
            checked: false
        },
        {
            hostName: "Host 4",
            porta: 22,
            dirtorioTrabalho: "/nffshere/deck/wilson",
            proprietario: "Wilson",
            checked: false
        }
    ]);

    let validacaoModelos = () => {
        return (
            <div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-spin pi-spinner " style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Validando Newave</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-spin pi-spinner " style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Validando Decomp</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-spin pi-spinner " style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Validando Gevazp</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-spin pi-spinner " style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Validando Dessem</p>
                    </div>
                </div>

            </div>

        )
    }



    const handleCheckboxChange = (item: DataInterface, isChecked: any) => {
        const updatedData = mockData.map((auxItem) =>
            auxItem.hostName === item.hostName
                ? { ...auxItem, checked: isChecked }
                : auxItem
        );
        setMockData(updatedData);
    };

    const selectTemplate = (item: DataInterface) => {
        return <Checkbox className='mt-1 mr-2' checked={item.checked}
            onChange={(e) => handleCheckboxChange(item, e.target.checked)}

        />
    }

    const handleDropdownChange = (item: DataInterface, modelo: any) => {
        const updatedData = mockData.map((auxItem) =>
            auxItem.hostName === item.hostName
                ? { ...auxItem, modelo: modelo }
                : auxItem
        );
        setMockData(updatedData);
    };

    const modeloTemplate = (item: DataInterface) => {
        return (
            <div className="card flex-initial justify-content-center ml-2">
                <Dropdown value={item.modelo}
                    onChange={(e) => handleDropdownChange(item, e.target.value)}
                    options={cities}
                    optionLabel="name"
                    placeholder="Select a modelo"
                    className="w-full md:w-14rem" />
            </div>
        )
    }

    const infoTemplate = () => {
        return (
            <div className='flex-initial flex'>
                <div className='flex align-items-start align-items-center justify-content-center'>
                    <label>Saiba mais</label>
                    <i className="pi pi-info-circle" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
            </div>
        )
    }

    const addMessages = () => {
        msgs.current?.show([
            { severity: 'error', summary: 'Error', detail: 'Erro na versão do Dessem', sticky: true, closable: false },
            { severity: 'error', summary: 'Error', detail: 'Erro ao carregar a pasta do Dessem', sticky: true, closable: false }

        ]);
    };

    const clearMessages = () => {
        msgs.current?.clear();
    };

    let modeloCarregado = () => {
        return (
            <div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-verified " style={{ fontSize: '1.5rem', color: 'green' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Newave Validado</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-verified " style={{ fontSize: '1.5rem', color: 'green' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Decomp Validado</p>
                    </div>
                </div>
                <div className='flex'>
                    <div className='flex-initial flex'>
                        <div className='flex align-items-start align-items-center justify-content-center'>
                            <i className="pi pi-verified " style={{ fontSize: '1.5rem', color: 'green' }}></i>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <p>Gevazp Validado</p>
                    </div>
                </div>
                <div>
                    <div className='flex'>
                        <div className='flex-initial flex'>
                            <div className='flex align-items-start align-items-center justify-content-center'>
                                <i className="pi pi-times " style={{ fontSize: '1.5rem', color: 'red' }}></i>
                            </div>
                        </div>
                        <div className='ml-2'>
                            <p>Erro na validação do Dessem</p>
                        </div>
                        <Button icon={open ? "pi pi-minus" : "pi pi-plus"} rounded text severity="info" onClick={() => {
                            if (open) {
                                setOpen(!open)
                                clearMessages()
                            } else {
                                addMessages()
                                setOpen(true)
                            }
                        }} />

                    </div>
                    <div>
                        <div>
                            <Messages ref={msgs} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: "#FFF" }}>
            <div>
                <div className='flex'>

                    <label>Validacao modelos</label>
                    <div className='ml-2'>
                        <Button label='Validar' onClick={() => {
                            setValidaModelos(!validaModelos)
                        }} />
                    </div>
                </div>
                {
                    validaModelos
                        ? validacaoModelos()
                        : modeloCarregado()
                }
            </div>
            <div className='flex'>
                <div className='field'>
                    <div className="card flex justify-content-center">
                        <DataTable value={mockData} tableStyle={{ minWidth: '50rem' }}>
                            <Column header="Selecionar" body={selectTemplate}></Column>
                            <Column field="hostName" header="Hostname"></Column>
                            <Column field='modelo' header="Modelo" body={modeloTemplate}></Column>
                            <Column header="Informação" body={infoTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}




