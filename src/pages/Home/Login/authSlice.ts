import {
    createSlice,
    PayloadAction,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import { Usuario } from "../../../Domain/Usuario";
import api from "../../../config/api";


export interface AuthState {
    isAuthenticated: boolean;
    idUsuario: number;
    nome: string;
    error: string | undefined;
}

const initialState: AuthState = {
    isAuthenticated: false,
    idUsuario: 0,
    error: "",
    nome: "",

};


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ nome, senha }: { nome: string; senha: string }, { rejectWithValue }) => {
        try {
            const responseToken = await api.post<Usuario>('usuario/login', { nome, senha });
            return responseToken.data.id;
        } catch (error: any) {
            const errorMessage = error.response?.data || 'Sistema fora do ar';
            return rejectWithValue(errorMessage);
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<number>) => {
                state.isAuthenticated = true;
                state.idUsuario = action.payload;
                state.error = "";
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload
                state.isAuthenticated = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
