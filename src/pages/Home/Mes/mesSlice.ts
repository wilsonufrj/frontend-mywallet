import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MesState {
    nome: string
    ano: number
    transacoes: any[]
}

const initialState: MesState = {
    nome: '',
    ano: new Date().getFullYear(),
    transacoes: [],
};

const mesSlice = createSlice({
    name: 'mes',
    initialState,
    reducers: {
        setMesAtual(state, action: PayloadAction<string>) {

        },
        resetMesAtual(state) {

        },
    },
});

export const { setMesAtual, resetMesAtual } = mesSlice.actions;

export default mesSlice.reducer;