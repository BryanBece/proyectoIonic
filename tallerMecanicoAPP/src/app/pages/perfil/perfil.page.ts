import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  firestore = inject(AngularFirestore);
  rol: string = '';

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
      }
    });
  }
  
  ngOnInit() {

  }

  // Cerrar sesión
  signOut() {
    this.firebaseSvc.signOut()
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


}
