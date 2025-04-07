import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import api from '../../../config/api';
import { Mes } from '../../../Domain/Mes';


export interface CarteirasUsuarioState {
    carteiras: Carteira[]
    carteiraSelected: Carteira
}

const initialState: CarteirasUsuarioState = {
    carteiras: [],
    carteiraSelected: {} as Carteira

};


export const fetchCarteiras = createAsyncThunk(
    'carteira/fetchCarteiras',
    async (_, { getState }) => {

        const state = getState() as RootState;
        const idUsuario: number = state.auth.idUsuario;

        const response = await api.get(`carteira/usuario/${idUsuario}`);
        return response.data;
    }
);

export const selecionaCarteira = createAsyncThunk(
    'carteira/fetchCarteiraDetail',
    async (idCarteira: number) => {
        const response = await api.get(`carteira/${idCarteira}`);
        return response.data;
    }
);

export const criarCarteira = createAsyncThunk(
    'carteira/criarCarteira',
    async (carteira: Carteira, { getState }) => {

        const state = getState() as RootState;
        const idUsuario: number = state.auth.idUsuario;

        const response = await api.post(`carteira/${idUsuario}`,
            carteira,
        );

        return response.data;
    }
);

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

const carteiraSlice = createSlice({
    name: 'carteira',
    initialState,
    reducers: {
        deletarCarteira: (state, action: PayloadAction<number>) => {
            state.carteiras = state.carteiras.filter(carteira => carteira.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCarteiras.fulfilled, (state, action: PayloadAction<Carteira[]>) => {
            state.carteiras = action.payload;
        });
        builder.addCase(criarCarteira.fulfilled, (state, action: PayloadAction<Carteira>) => {
            state.carteiras.push(action.payload);
        });
        builder.addCase(selecionaCarteira.fulfilled, (state, action: PayloadAction<Carteira>) => {
            state.carteiraSelected = action.payload;
        });
        builder
            .addCase(criarNovoMes.pending, (state) => {
                // Handle pending state if needed
            })
            .addCase(criarNovoMes.fulfilled, (state, action: PayloadAction<Mes>) => {
                let carteira = state.carteiraSelected;
                if (carteira) {
                    carteira.meses.push(action.payload);
                    state.carteiraSelected = { ...carteira };
                }

            })
            .addCase(criarNovoMes.rejected, (state, action) => {
                // Handle error state if needed
            });
    }
});

export const { deletarCarteira } = carteiraSlice.actions;
export default carteiraSlice.reducer;