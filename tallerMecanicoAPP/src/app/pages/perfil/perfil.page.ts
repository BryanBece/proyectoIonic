import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PersonalComponent } from 'src/app/shared/component/personal/personal.component';
import { ProductosComponent } from 'src/app/shared/component/productos/productos.component';
import { ServiciosComponent } from 'src/app/shared/component/servicios/servicios.component';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { PedidosComponent } from 'src/app/shared/component/pedidos/pedidos.component';

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
  myCoords: string = '';

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
      }
    });
  }
  
  ngOnInit() {

  }

    /**
   * Función que permite navegar entre componentes
   * mediante la URL
   * @param $event 
   */
    segmentChanged($event){
      console.log($event.detail.value);
      let direction=$event.detail.value;
      this.router.navigate(['perfil/'+direction]);
    }


    //   <!-- =========== ADMIN =========== -->
  // Servicios
  viewServices(){
    this.utilsSvc.presentModal({
      component: ServiciosComponent,
      cssClass: 'modal-fullscreen',
    })
  }

  // Personal
  viewPersonal(){
    this.utilsSvc.presentModal({
      component: PersonalComponent,
      cssClass: 'modal-fullscreen'
    })
  }

  // Productos
  viewProducts(){
    this.utilsSvc.presentModal({
      component: ProductosComponent,
      cssClass: 'modal-fullscreen'
    })
  }

  // Pedidos
  viewOrders(){
    this.utilsSvc.presentModal({
      component: PedidosComponent,
      cssClass: 'modal-fullscreen'
    })
  }

  //   <!-- =========== USUARIO =========== -->
  
  // Ubicacion
  async obtUbicacion(){
    const coords = await this.utilsSvc.getLocation();
    const myCoords = `Ubicación: ${coords.latitude},${coords.longitude}`;
    this.utilsSvc.presentToast({
      message: myCoords,
      duration: 3500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    })
    
    return myCoords;
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
