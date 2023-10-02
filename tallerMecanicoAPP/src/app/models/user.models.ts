export interface User {
    uid: string;
    email: string;
    password: string;
    name: string;
    telefono: string;
    perfil: 'cliente' | 'mecanico' | 'admin' | 'administrativo'
}