import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MenuController } from '@ionic/angular';
import { getFirestore, setDoc, doc, FirestoreInstances } from '@angular/fire/firestore';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  login: boolean = false;
  firestore = inject(AngularFirestore);
  rol: string = '';
  nombre: string = '';
  firebaseSvc = inject(FirebaseService);

  constructor(private menu: MenuController, private auth: AngularFireAuth) {
    
    
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log('Usuario logueado');
        this.login = true;
        this.getDatosUser(user.uid);


      } else {
        console.log('Usuario no logueado');
        this.login = false;
      }
    });
  }

  getDatosUser( uid: string ){
    const path = 'users'
    const id = uid;
    this.firestore.collection(path).doc(id).valueChanges().subscribe( res => {
      
      const data = res as { perfil: string } | undefined;
      if (data) {
        this.rol = data.perfil
      }
    })
    
  }

  public closeMenu(): void {
    this.menu.close();
  }

  signOut() {
    this.firebaseSvc.signOut()
  }
}