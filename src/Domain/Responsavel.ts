import { Usuario } from "./Usuario";

export interface Responsavel {
    id: number;
    nome: string;
    usuarioInfo: {
        id: number;
        nome: string;
        email: string;
        dataNascimento: string;
    };
}
