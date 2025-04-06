import { Usuario } from "./Usuario"

export interface Carteira {
    id: number | undefined
    nome: string
    usuarios: Usuario[]
    meses: []
}