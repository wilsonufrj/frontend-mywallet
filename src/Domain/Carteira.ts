import { Usuario } from "./Usuario"

export interface Carteira {
    id: number | null
    nome: string
    usuarios: Usuario[]
    meses: []
}