import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';
import { Mes } from '../../../Domain/Mes';

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

export const criarNovoMes = createAsyncThunk(
    'mes/criarNovoMes',
    async (novoMes: Mes, { rejectWithValue }) => {
        try {
            const response = await api.post('mes', novoMes);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao criar novo mês');
        }
    }
);


const mesSlice = createSlice({
    name: 'mes',
    initialState,
    reducers: {
        setMesAtual(state, action: PayloadAction<string>) {

        },
        resetMesAtual(state) {

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(criarNovoMes.pending, (state) => {
                // Handle pending state if needed
            })
            .addCase(criarNovoMes.fulfilled, (state, action: PayloadAction<Mes>) => {
                state.nome = action.payload.nome;
                state.ano = action.payload.ano;
                state.transacoes = action.payload.transacoes;
            })
            .addCase(criarNovoMes.rejected, (state, action) => {
                // Handle error state if needed
            });
    }
});

export const { setMesAtual, resetMesAtual } = mesSlice.actions;

export default mesSlice.reducer;