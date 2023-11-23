import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { Pedido, Service, User, Product } from '../models/user.models';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private servicesCollection: AngularFirestoreCollection<Service>;
  services: Observable<Service[]>;
  private productsCollection: AngularFirestoreCollection<Product>;
  products: Observable<Product[]>;
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  private ordersCollection: AngularFirestoreCollection<Pedido>;
  orders: Observable<Pedido[]>;
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // ============ Autenticar usuario ============

  /**
   * Obtener la instancia de autenticación de Firebase.
   * @returns La instancia de autenticación de Firebase.
   */
  getAuth() {
    return getAuth();
  }

  /**
   * Iniciar sesión del usuario con el correo electrónico y la contraseña proporcionados.
   * @param user - El objeto de usuario que contiene el correo electrónico y la contraseña.
   * @returns Una promesa que se resuelve cuando el inicio de sesión es exitoso.
   */
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /**
   * Crear una nueva cuenta de usuario con el correo electrónico y la contraseña proporcionados.
   * @param user - El objeto de usuario que contiene el correo electrónico y la contraseña.
   * @returns Una promesa que se resuelve cuando la cuenta de usuario se crea correctamente.
   */
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /**
   * Actualizar el nombre de visualización del usuario actual.
   * @param displayName - El nuevo nombre de visualización.
   * @returns Una promesa que se resuelve cuando el nombre de visualización se actualiza correctamente.
   */
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  /**
   * Enviar un correo electrónico de restablecimiento de contraseña a la dirección de correo electrónico proporcionada.
   * @param email - La dirección de correo electrónico a la que se enviará el correo electrónico de restablecimiento de contraseña.
   * @returns Una promesa que se resuelve cuando el correo electrónico de restablecimiento de contraseña se envía correctamente.
   */
  sendpasswordResetEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  /**
   * Cerrar sesión del usuario actual.
   * @returns Una promesa que se resuelve cuando la sesión se cierra correctamente.
   */
  signOut() {
    return getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/login');
  }

  /**
   * Agregar un nuevo pedido a la colección 'pedidos' en Firestore.
   * @param pedido - El objeto de pedido a agregar.
   * @returns Una promesa que se resuelve cuando el pedido se agrega correctamente.
   */
  addPedido(pedido: Pedido): Promise<any> {
    return this.firestore.collection('pedidos').add(pedido);
  }

  /**
   * Actualizar un pedido existente en la colección 'pedidos' en Firestore.
   * @param pedido - El objeto de pedido a actualizar.
   * @returns Una promesa que se resuelve cuando el pedido se actualiza correctamente.
   */
  updatePedido(pedido: Pedido): Promise<void> {
    const pedidoId = pedido.id;
    delete pedido.id;
    return this.firestore.doc(`pedidos/${pedidoId}`).update(pedido);
  }

  /**
   * Agregar un nuevo servicio a la colección 'services' en Firestore.
   * @param service - El objeto de servicio a agregar.
   * @returns Una promesa que se resuelve cuando el servicio se agrega correctamente.
   */
  addService(service: Service): Promise<any> {
    return this.firestore.collection('services').add(service);
  }

  /**
   * Obtener los servicios de la colección 'services' en Firestore.
   * @returns Un observable que emite un array de servicios.
   */
  getServices(): Observable<Service[]> {
    this.servicesCollection = this.firestore.collection<Service>('services');
    this.services = this.servicesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Service;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.services;
  }

  getOrders(): Observable<Pedido[]> {
    this.ordersCollection = this.firestore.collection<Pedido>('orders');
    this.orders = this.ordersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Pedido;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.orders;
  }

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.where('perfil', 'in', ['administrativo', 'mecanico']).where('active', '==', true)).valueChanges();
  }
  getProducts(): Observable<Product[]> {
    this.productsCollection = this.firestore.collection<Product>('products');
    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.products;
  }

  // ============ Base de datos ============

  /**
   * Obtener una colección de Firestore.
   * @param path - La ruta de la colección.
   * @param collectionQuery - Consulta opcional para aplicar a la colección.
   * @returns Una promesa que se resuelve con los datos de la colección.
   */
  async getCollection(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery))
  }

  /**
   * Establecer un documento en Firestore.
   * @param path - La ruta del documento.
   * @param data - Los datos a establecer en el documento.
   * @returns Una promesa que se resuelve cuando el documento se establece correctamente.
   */
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }


  /**
   * Obtener un documento de Firestore.
   * @param path - La ruta del documento.
   * @returns Una promesa que se resuelve con los datos del documento.
   */
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  /**
   * Agregar un documento a Firestore.
   * @param path - La ruta de la colección donde se agregará el documento.
   * @param data - Los datos a agregar en el documento.
   * @returns Una promesa que se resuelve cuando el documento se agrega correctamente.
   */
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

// ============ Storage ============

/**
 * Subir una imagen a Firebase Storage.
 * @param path - La ruta de la imagen en Firebase Storage.
 * @param data - Los datos de la imagen a cargar.
 * @returns Una promesa que se resuelve con la URL de la imagen después de cargarla.
 */
async uploadImage(path: string, data: any) {
  return uploadString(ref(getStorage(), path), data, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(), path));
  });
}

async getFilePath(url: string) {
  return ref(getStorage(), url).fullPath;
}

deleteImage(path: string) {
  return deleteObject(ref(getStorage(), path));
}


}