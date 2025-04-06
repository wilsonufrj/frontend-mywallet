import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';
import { Carteira } from '../../../Domain/Carteira';
import api from '../../../config/api';


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
    }
});

export const { deletarCarteira } = carteiraSlice.actions;
export default carteiraSlice.reducer;