import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { criarCarteira, deletarCarteira, fetchCarteiras, selecionaCarteira } from './carteiraSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Carteira } from '../../../Domain/Carteira';
import { Usuario } from '../../../Domain/Usuario';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/api';

const Carteiras: React.FC = () => {
    const dispatch = useAppDispatch();
    const carteiras = useSelector((state: RootState) => state.carteira.carteiras);
    const idUsuario: number = useSelector((state: RootState) => state.auth.idUsuario);

    const [dialog, setDialog] = useState<boolean>(false);
    const [nomeCarteira, setNomeCarteira] = useState<string>('');
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCarteiras());
    }, [dispatch]);

    const footer = (carteira: Carteira) => (
        <div>
            <Button
                label="Acessar"
                severity="success"
                icon="pi pi-check"
                onClick={() => {
                    if (carteira.id === undefined) return;
                    dispatch(selecionaCarteira(carteira.id));
                    navigate(`/carteira/${carteira.id}`);
                }}
            />
            <Button
                icon="pi pi-trash"
                severity="danger"
                className="p-button-rounded p-button-secondary p-button-icon-only ml-2"
                onClick={() => {
                    api.delete(`carteira/${carteira.id}`);
                    dispatch(deletarCarteira(carteira.id ?? 0));
                }}
            />
        </div>
    );

    const carteiraComponent = (carteira: any) => (
        <div className="col-3" key={carteira.id}>
            <Card title={carteira.nome} footer={() => footer(carteira)}>
                <div className="flex align-items-center" />
            </Card>
        </div>
    );

    const hideDialog = () => setDialog(false);

    const generateCarteira = (): Carteira => {
        const usuariosSelecionados: Usuario[] = selectedUsuarios.map((usuario: any) => ({
            id: usuario.code,
            nome: usuario.name,
        }));
        return {
            id: undefined,
            nome: nomeCarteira,
            usuarios: usuariosSelecionados,
            meses: [],
        };
    };

    const resetaDadosDialog = () => {
        setNomeCarteira('');
        setSelectedUsuarios([]);
        setUsuarios([]);
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={() => {
                    dispatch(criarCarteira(generateCarteira()));
                    resetaDadosDialog();
                    setDialog(false);
                }}
            />
        </React.Fragment>
    );

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Plano de fundo */}
            <div
                style={{
                    backgroundImage: `url('/background.png')`, // Certifique-se de que a imagem está em public/bg.jpg
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0.3,
                }}
            />

            {/* Conteúdo visível sobre o fundo */}
            <div style={{ position: 'relative', zIndex: 1 }} className="m-5">
                <div>
                    <h1>{`Carteiras Pessoais`}</h1>
                    <div className="flex mb-3">
                        <Button
                            className="ml-2"
                            label="Logout"
                            icon="pi pi-sign-out"
                            onClick={() => navigate('/')}
                        />
                    </div>
                </div>

                <div className="grid">
                    {carteiras.map((carteira: any) => carteiraComponent(carteira))}
                    <div className="col-3 align-content-center">
                        <div className="flex justify-content-center">
                            <Button
                                icon="pi pi-plus"
                                className="p-button-rounded p-button-secondary p-button-icon-only"
                                onClick={async () => {
                                    setDialog(true);
                                    const response = await api.get('usuario');
                                    setUsuarios(
                                        response.data
                                            .filter((usuario: any) => usuario.id !== idUsuario)
                                            .map((usuario: any) => ({
                                                name: usuario.nome,
                                                code: usuario.id,
                                            }))
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                <Divider />

                <div>
                    <h1>Carteiras Compartilhadas</h1>
                    <div className="grid">{/* ... */}</div>
                </div>

                {dialog && (
                    <Dialog
                        visible={dialog}
                        style={{ width: '32rem' }}
                        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                        header="Adicionar Carteira"
                        modal
                        className="p-fluid"
                        footer={dialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="grid mt-5">
                            <FloatLabel className="col-12">
                                <InputText
                                    id="username"
                                    value={nomeCarteira}
                                    onChange={(e) => setNomeCarteira(e.target.value)}
                                />
                                <label htmlFor="username">Nome Carteira</label>
                            </FloatLabel>

                            <FloatLabel className="mt-4 col-12">
                                <MultiSelect
                                    value={selectedUsuarios}
                                    onChange={(e) => setSelectedUsuarios(e.value)}
                                    options={usuarios}
                                    optionLabel="name"
                                    display="chip"
                                    placeholder="Selecionar Usuários"
                                    className="w-full"
                                />
                                <label htmlFor="ms-usuarios">Selecionar Usuários</label>
                            </FloatLabel>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default Carteiras;
