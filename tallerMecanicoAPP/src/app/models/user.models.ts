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
    status: 'Pendiente' | 'Finalizada'
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

export interface Attentions{
  id: string;
  cliente_id: string;
  date: string;
  description: string;
  service?: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: 'Pendiente' | 'Aceptada' | 'Finalizada' | 'Cancelada';

}

export interface Emergency{
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: 'Pendiente'| 'Finalizada' ;
}