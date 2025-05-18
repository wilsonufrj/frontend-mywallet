import {
    createSlice,
    PayloadAction,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../../../config/api";
import { AxiosError } from "axios";
import { Usuario } from "../../../Domain/Usuario";


export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    idUsuario: number | undefined,
    nome: string | null,
}

export interface LoginResponse {
    token: string;
    id: number;
    nome: string;
}

export interface LoginCredentials {
    nome: string;
    senha: string;
}

export interface ApiError {
    message: string;
}

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    idUsuario: undefined,
    nome: null,
};

export const loginCadastro = createAsyncThunk(
    'auth/login/cadastro',
    async (usuario: Usuario, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/criar-usuario",
                usuario
            )
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            return rejectWithValue(error.response?.data.message ?? 'Falha no Login');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            return rejectWithValue(error.response?.data.message ?? 'Falha no Login');
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem('token');
            state.idUsuario = undefined;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.token = action.payload.token;
                state.idUsuario = action.payload.id;
                state.nome = action.payload.nome;
                state.isAuthenticated = true;
                state.loading = false;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(loginCadastro.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.token = action.payload.token;
                state.idUsuario = action.payload.id;
                state.nome = action.payload.nome;
                state.isAuthenticated = true;
                state.loading = false;
                localStorage.setItem('token', action.payload.token);
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
