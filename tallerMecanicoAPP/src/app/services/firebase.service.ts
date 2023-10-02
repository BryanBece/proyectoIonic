import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  
  // ============ Autenticar usuario ============ 

  // Acceso
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registro
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar usuario
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName});
  }



  // ============ Base de datos ============

  // Set document
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  // Get document
  getDocument<tipo>(path: string, id: string){
    return this.firestore.collection(path).doc<tipo>(id).valueChanges();
  }
}

