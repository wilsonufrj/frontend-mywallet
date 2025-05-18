import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAppDispatch } from '../../../redux/hooks';
import { AuthState, login, loginCadastro, LoginCredentials } from './authSlice';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import './login.css';
import { Messages } from 'primereact/messages';
import { Divider } from 'primereact/divider';
import { Usuario } from '../../../Domain/Usuario';
import { Calendar } from 'primereact/calendar';

const Login: React.FC = () => {

    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const msgs = useRef<Messages>(null);

    const [isCadastro, setIsCadastro] = useState(false);

    const [formCadastro, setFormCadastro] = useState<Usuario>({} as Usuario)

    const authState: AuthState = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (authState.error !== null) {
            msgs.current?.clear();
            msgs.current?.show([{ sticky: true, severity: 'error', summary: 'Error', detail: authState.error, closable: false }]);
        }
    }, [authState.error]);

    if (authState.isAuthenticated) {
        return <Navigate to="/carteiras" replace />;
    }

    const handleLogin = () => {
        let credentials: LoginCredentials = {
            nome: name,
            senha: password
        };
        dispatch(login(credentials));
    };

    const footer = () => {
        return (
            <Button className='w-full justify-content-center' onClick={handleLogin}>Entrar</Button>
        );
    };

    const footerCadastro = () => {
        return (
            <Button className='w-full justify-content-center' onClick={() => dispatch(loginCadastro(formCadastro))}>Cadastro</Button>
        );
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Imagem de fundo */}
            <div
                style={{
                    backgroundImage: `url('/background.jpg')`, // Coloque sua imagem em public/bg.jpg
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: 0.3
                }}
            />

            {/* Conteúdo principal por cima */}
            <div style={{ position: 'relative', zIndex: 1 }} className='flex justify-content-center align-items-center h-screen'>
                <div className='flex'>
                    {
                        isCadastro
                            ? <Card title="Cadastrar" footer={footerCadastro} className='mr-5'>
                                <div>
                                    <FloatLabel className='mb-4'>
                                        <InputText
                                            id="username"
                                            value={formCadastro.nome}
                                            onChange={(e) => setFormCadastro({
                                                ...formCadastro,
                                                nome: e.target.value
                                            })}
                                            className='w-full'
                                        />
                                        <label htmlFor="username">Username</label>
                                    </FloatLabel>
                                    <FloatLabel className='mb-5'>
                                        <Password
                                            value={formCadastro.senha}
                                            onChange={(e) => setFormCadastro({
                                                ...formCadastro,
                                                senha: e.target.value
                                            })}
                                            feedback={false}
                                            toggleMask
                                        />
                                        <label htmlFor="password">Password</label>
                                    </FloatLabel>
                                    <FloatLabel className='mt-4 mb-4'>
                                        <Calendar
                                            id="dataNascimento"
                                            value={new Date(formCadastro.dataNascimento ?? Date.now())}
                                            onChange={e => {
                                                if (e.target.value instanceof Date) {
                                                    setFormCadastro({
                                                        ...formCadastro,
                                                        dataNascimento: new Date(e.target.value).toISOString()
                                                    })
                                                }
                                            }}
                                            className='w-full'
                                            dateFormat='dd/mm/yy'
                                        />
                                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                                    </FloatLabel>
                                    <Messages id='message-id' className='message' ref={msgs} />
                                </div>
                                <FloatLabel className=''>
                                    <InputText
                                        id="username"
                                        value={formCadastro.email}
                                        onChange={(e) => setFormCadastro({
                                            ...formCadastro,
                                            email: e.target.value
                                        })}
                                        className='w-full'
                                    />
                                    <label htmlFor="username">Email</label>
                                </FloatLabel>
                            </Card>
                            : <Card title="Login Carteira" footer={footer} >
                                <div>
                                    <FloatLabel className='mb-4'>
                                        <InputText
                                            id="username"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='w-full'
                                        />
                                        <label htmlFor="username">Username</label>
                                    </FloatLabel>
                                    <FloatLabel className='mb-3'>
                                        <Password
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            feedback={false}
                                            toggleMask
                                        />
                                        <label htmlFor="password">Password</label>
                                    </FloatLabel>
                                    <Messages id='message-id' className='message' ref={msgs} />
                                </div>
                                <Button
                                    className='w-full justify-content-center mt-3'
                                    onClick={() => setIsCadastro(true)}
                                    label="Cadastrar"
                                    icon="pi pi-user-plus"
                                    iconPos="right"
                                    severity="secondary"
                                    outlined />
                            </Card>
                    }

                </div>
            </div>
        </div>
    );
};

export default Login;
