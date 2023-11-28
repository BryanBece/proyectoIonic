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
import { AttentionsComponent } from 'src/app/shared/component/attentions/attentions.component';
import { TakeHoursComponent } from 'src/app/shared/component/take-hours/take-hours.component';
import { Attentions } from 'src/app/models/user.models';

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
  uid: string = '';
  myCoords: string = '';
  mostrarHoras: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
      }
    });
    
  }
  
  ngOnInit() {
    this.getAttentions();
  }
  
  showHours() { 
    this.mostrarHoras = !this.mostrarHoras;
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


    //   <!-- =========== ADMIN / MECANICO / ADMINISTRATIVO =========== -->
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

  // Atenciones
  viewAtteentions(){
    this.utilsSvc.presentModal({
      component: AttentionsComponent,
      cssClass: 'modal-fullscreen'
    })
  }

  // Agendar Hora
  scheduleAppointment(){
    this.utilsSvc.presentModal({
      component: TakeHoursComponent,
      cssClass: 'modal-fullscreen',
    });
  }
  // Pedidos
  viewOrders(){
    this.utilsSvc.presentModal({
      component: PedidosComponent,
      cssClass: 'modal-fullscreen'
    })
  }

  //   <!-- =========== USUARIO =========== -->
  
  attentions: Attentions[] = [];
  getAttentions() {
    this.firebaseSvc.getAttentions().subscribe((attentions) => {
      this.attentions = attentions;
    });
  }
  async confirmCancelAttention(attention: Attentions) {
    await this.utilsSvc.presentAlert({
      header: 'Anular Atención',
      message: '¿Quieres cancelar esta hora?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, anular',
          handler: () => {
            this.cancelAttention(attention);
          }
        }
      ]
    });
  }

  async cancelAttention(attention: Attentions) {
    const path = `appointments/${attention.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Cancelada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Atención cancelada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al cancelar la atención. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }


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
      
      
      const data = res as { perfil: string, uid: string} | undefined;
      if (data) {
        this.rol = data.perfil
        this.uid =  data.uid
      }
    })
    
  }


}
