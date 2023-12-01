import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MenuController } from '@ionic/angular';
import { getFirestore, setDoc, doc, FirestoreInstances } from '@angular/fire/firestore';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';
import { ProductosComponent } from './shared/component/productos/productos.component';
import { UtilsService } from './services/utils.service';
import { ScannerComponent } from './shared/component/scanner/scanner.component';
import { ClientsProductsComponent } from './shared/component/clients-products/clients-products.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  utilsSvc = inject(UtilsService);
  login: boolean = false;
  firestore = inject(AngularFirestore);
  rol: string = '';
  nombre: string = '';
  firebaseSvc = inject(FirebaseService);

  constructor(private menu: MenuController, private auth: AngularFireAuth, private router: Router) {
    
    
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

  viewProductsADM() {
    this.utilsSvc.presentModal({
      component: ProductosComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  viewProductsCLI() {
    this.utilsSvc.presentModal({
      component: ClientsProductsComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  scanQRCode(){
    this.utilsSvc.presentModal({
      component: ScannerComponent,
      cssClass: 'modal-fullscreen',
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