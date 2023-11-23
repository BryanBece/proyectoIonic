export interface User {
    uid: string;
    email: string;
    password: string;
    name: string;
    telefono: string;
    perfil: 'cliente' | 'mecanico' | 'admin' | 'administrativo';
    active: boolean;
}

export interface Pedido {
    id: string;
    proveedor: string;
    producto: string;
    fecha: string;
  }

  export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
  }

  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    // Otros atributos que puedas tener en tu modelo
  }
