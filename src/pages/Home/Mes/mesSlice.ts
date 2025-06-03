import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';
import { Mes } from '../../../Domain/Mes';
import { Transacao } from '../../../Domain/Transacao';
import { Banco } from '../../../Domain/Banco';
import { RootState } from '../../../redux/store';
import { Responsavel } from '../../../Domain/Responsavel';

export interface MesState {
    id: number | null
    nome: string
    ano: number
    transacoes: Transacao[]
    balanco: BalancoData,
    balancoConjunto: BalancoConjuntoData[],
    porcentagemInvestimento: number
}

export interface BalancoData {
    totalGanhoMes: number;
    totalGastosMes: number;
    saldoAtual: number;
    investimentoMes: number;
    gastosNaoPagosCredito: number;
    saldoMesSeguinte: number;
}

export interface BalancoConjuntoData {
    responsavelDTO: Responsavel;
    porcentagemDosCustos: number;
    gastosConjunto: number;
    investimentoConjunto: number;
    totalGasto: number;
    saldoFinal: number;
}

const initialState: MesState = {
    id: null,
    nome: '',
    ano: new Date().getFullYear(),
    transacoes: [],
    balanco: {} as BalancoData,
    balancoConjunto: [] as BalancoConjuntoData[],
    porcentagemInvestimento: 0
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

export const fetchBalancoConjunto = createAsyncThunk(
    'mes/fetchBalancoConjunto',
    async (mesId: number, { rejectWithValue }) => {
        try {
            const response = await api.get<BalancoConjuntoData[]>(`mes/balanco-conjunto/${mesId}`);
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
    async ({ transacao, idMes }: { transacao: Transacao; idMes: number }) => {
        const response = await api.post<Transacao>(`transacao/${idMes}`, transacao);
        return response.data;
    }
);

export const editaTransacoesMes = createAsyncThunk(
    'mes/editarTransacoes',
    async ({ transacoes, idMes }: { transacoes: Transacao[]; idMes: number }) => {
        const response = await api.put<Transacao[]>(`transacao/${idMes}/batch`, transacoes);
        return response.data;
    }
);

export const salvaPorcentagemInvestimento = createAsyncThunk(
    'mes/atualizaPorcentagemInvestimento',
    async (idMes: number, { getState }) => {
        const state = getState() as RootState;
        const porcentagemInvestimento: number = state.mes.porcentagemInvestimento;
        await api.put(`mes/investimento/${idMes}`, porcentagemInvestimento);
    }
);

const mesSlice = createSlice({
    name: 'mes',
    initialState,
    reducers: {
        atualizaTransacao(state, action: PayloadAction<Transacao>) {
            let indexTransacao = state.transacoes.findIndex(transacao => transacao.id === action.payload.id);
            if (indexTransacao !== -1) {
                state.transacoes[indexTransacao] = action.payload;
            }

        },
        atualizaPorcentagemInvestimento(state, action: PayloadAction<number>) {
            state.porcentagemInvestimento = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMesData.fulfilled, (state, action: PayloadAction<Mes>) => {
                state.id = action.payload.id;
                state.nome = action.payload.nome;
                state.ano = action.payload.ano;
                state.porcentagemInvestimento = action.payload.porcentagemInvestimento || 0;
                state.transacoes = action.payload.transacoes
                    .slice()
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());;
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
            });
        builder
            .addCase(fetchBalancoConjunto.fulfilled, (state, action: PayloadAction<BalancoConjuntoData[]>) => {
                state.balancoConjunto = action.payload.sort((a, b) =>
                    a.responsavelDTO.nome.localeCompare(b.responsavelDTO.nome)
                );
            }
            )
    }
});

export const { atualizaTransacao, atualizaPorcentagemInvestimento } = mesSlice.actions;

export default mesSlice.reducer;