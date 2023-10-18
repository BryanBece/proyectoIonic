import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  //storage = inject(AngularFireStorage);

  // ============ Autenticar usuario ============
  
  getAuth() {
    return getAuth();
  }

  // Acceso
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registro
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Recuperar contraseña
  sendpasswordResetEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Cerrar sesión
  signOut() {
    return getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/login');
  }


  // ============ Base de datos ============

  // Set document
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Get document
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Add document
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  // ============ Storage ============

  // Upload image
  async uploadImage(path: string, data: any) {
    return uploadString(ref(getStorage(), path), data, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

}

