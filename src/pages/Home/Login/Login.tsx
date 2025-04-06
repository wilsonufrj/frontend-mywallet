import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAppDispatch } from '../../../redux/hooks';
import { AuthState, loginUser } from './authSlice';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import './login.css';
import { Messages } from 'primereact/messages';


const Login: React.FC = () => {

    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const msgs = useRef<Messages>(null);

    const authState: AuthState = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (authState.error !== "") {
            msgs.current?.clear();
            msgs.current?.show([{ sticky: true, severity: 'error', summary: 'Error', detail: authState.error, closable: false }]);
        }
    }, [authState.error]);


    if (authState.isAuthenticated) {
        return <Navigate to="/carteira" replace />;
    }

    const handleLogin = () => {
        dispatch(loginUser({ nome: name, senha: password }));
    };

    const footer = () => {
        return (
            <Button className='w-full justify-content-center' onClick={handleLogin}>Entrar</Button>
        )
    }

    return (
        <div className='flex justify-content-center align-items-center h-screen '>
            <div className='flex'>
                <Card title="Login Carteira" footer={footer} className='mr-5 '>
                    <div className=''>
                        <FloatLabel className='mb-4'>
                            <InputText id="username"
                                value={name} onChange={(e) => setName(e.target.value)}
                                className='w-full' />
                            <label htmlFor="username">Username</label>
                        </FloatLabel>
                        <FloatLabel className='mb-3'>
                            <Password value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                feedback={false}
                                toggleMask
                            />
                            <label htmlFor="password">Password</label>
                        </FloatLabel>
                        <Messages id='message-id' className='message' ref={msgs} />
                    </div>

                </Card>
            </div>



        </div>
    );
};

export default Login;