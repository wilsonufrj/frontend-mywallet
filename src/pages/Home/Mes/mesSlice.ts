import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';
import { Mes } from '../../../Domain/Mes';
import { Transacao } from '../../../Domain/Transacao';
import { Banco } from '../../../Domain/Banco';

export interface MesState {
    id: number | null
    nome: string
    ano: number
    transacoes: Transacao[]
    balanco: BalancoData
}

export interface BalancoData {
    totalGanhoMes: number;
    totalGastosMes: number;
    saldoAtual: number;
    investimentoMes: number;
    gastosNaoPagosCredito: number;
    saldoMesSeguinte: number;
}

const initialState: MesState = {
    id: null,
    nome: '',
    ano: new Date().getFullYear(),
    transacoes: [],
    balanco: {} as BalancoData
};

export const fetchMesData = createAsyncThunk(
    'mes/fetchMesData',
    async (mesId: string, { rejectWithValue }) => {
        try {
            const response = await api.get<Mes>(`mes/${mesId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar os dados do mês');
        }
    }
);

export const fetchBalanco = createAsyncThunk(
    'mes/fetchBalanco',
    async (mesId: number, { rejectWithValue }) => {
        try {
            const response = await api.get<BalancoData>(`mes/balanco/${mesId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar os dados do mês');
        }
    }
)

export const adicionaBanco = createAsyncThunk(
    'mes/banco/adicionaBanco',
    async (banco: Banco, { rejectWithValue }) => {
        try {
            const response = await api.post("/banco", banco);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar os dados do mês');
        }
    }
)

export const removeTransacoesMes = createAsyncThunk(
    'mes/removeTransacoes',
    async (idTransacoes: number[]) => {
        idTransacoes.forEach(id => api.delete(`transacao/${id}`));
        return idTransacoes;
    });

export const editarTransacaoMes = createAsyncThunk(
    'mes/editarTransacao',

    async (transacao: Transacao) => {
        const response = await api.put<Transacao>(`transacao/${transacao.id}`, transacao)
        return { ...response.data } as Transacao;
    }
)

export const criaTransacaoMes = createAsyncThunk(
    'mes/criarTransacao',
    async ({ transacao, idMes }: { transacao: Transacao; idMes: number }, thunkAPI) => {
        const response = await api.post<Transacao>(`transacao/${idMes}`, transacao);
        return response.data;
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
            .addCase(fetchMesData.fulfilled, (state, action: PayloadAction<Mes>) => {
                state.id = action.payload.id;
                state.nome = action.payload.nome;
                state.ano = action.payload.ano;
                state.transacoes = action.payload.transacoes;
            })
            .addCase(fetchMesData.rejected, (state, action) => {
                console.error('Erro ao buscar os dados do mês:', action.payload);
            })
            .addCase(fetchMesData.pending, (state) => {
                console.log('Buscando dados do mês...');
            });
        builder
            .addCase(fetchBalanco.fulfilled, (state, action: PayloadAction<BalancoData>) => {
                state.balanco = action.payload;
            })
        builder
            .addCase(criaTransacaoMes.fulfilled, (state, action: PayloadAction<Transacao>) => {
                state.transacoes.push(action.payload)
            })
        builder
            .addCase(editarTransacaoMes.fulfilled, (state, action: PayloadAction<Transacao>) => {
                state.transacoes = state.transacoes.map(transacao =>
                    transacao.id === action.payload.id ? action.payload : transacao
                );
            })
        builder
            .addCase(removeTransacoesMes.fulfilled, (state, action: PayloadAction<number[]>) => {
                state.transacoes = state.transacoes.filter(transacao => {
                    return transacao.id && !action.payload.includes(transacao.id)
                });
            })

    }
});

export const { setMesAtual, resetMesAtual } = mesSlice.actions;

export default mesSlice.reducer;