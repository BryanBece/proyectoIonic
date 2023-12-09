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
import { Attentions, Emergency } from 'src/app/models/user.models';
import { User } from 'firebase/auth';

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
  nombre: string = '';
  telefono: string = '';
  email: string = '';
  myCoords: string = '';
  mostrarHoras: boolean = false;


  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
      }
    });
  }

  ngOnInit() {
    this.getAttentions();
    this.getEmergency();

  }

  showHours() {
    if (this.rol === 'cliente') {
      this.mostrarHoras = !this.mostrarHoras;
    }
  }

  /**
   * Función que permite navegar entre componentes
   * mediante la URL
   * @param $event
   */
  segmentChanged($event) {
    console.log($event.detail.value);
    let direction = $event.detail.value;
    this.router.navigate(['perfil/' + direction]);
  }

  //   <!-- =========== ADMIN / MECANICO / ADMINISTRATIVO =========== -->
  // Servicios
  viewServices() {
    this.utilsSvc.presentModal({
      component: ServiciosComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  // Personal
  viewPersonal() {
    this.utilsSvc.presentModal({
      component: PersonalComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  // Productos
  viewProducts() {
    this.utilsSvc.presentModal({
      component: ProductosComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  // Atenciones
  viewAttentions() {
    this.utilsSvc.presentModal({
      component: AttentionsComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  // Agendar Hora
  scheduleAppointment(attention?: Attentions) {
    this.utilsSvc.presentModal({
      component: TakeHoursComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        attention
      }
    });
  }
  // Pedidos
  viewOrders() {
    this.utilsSvc.presentModal({
      component: PedidosComponent,
      cssClass: 'modal-fullscreen',
    });
  }
  emergencies: Emergency[] = [];
  getEmergency() {
    this.firebaseSvc.getEmergencies().subscribe((emergencies) => {
      this.emergencies = emergencies;
    });
  }

  async confirmCancelEmergency(emergency: Emergency) {
    await this.utilsSvc.presentAlert({
      header: 'Anular Emergencia',
      message: '¿Quieres cancelar esta emergencia?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, anular',
          handler: () => {
            this.cancelEmergency(emergency);
          },
        },
      ],
    });
  }

  async cancelEmergency(emergency: Emergency) {
    const path = `emergency/${emergency.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Cancelada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Emergencia cancelada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al cancelar la emergencia. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  async confirmFinishEmergency(emergency: Emergency) {
    await this.utilsSvc.presentAlert({
      header: 'Finalizar Emergencia',
      message: '¿Quieres finalizar esta emergencia?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, finalizar',
          handler: () => {
            this.finishEmergency(emergency);
          },
        },
      ],
    });
  }

  async finishEmergency(emergency: Emergency) {
    const path = `emergency/${emergency.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Finalizada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Emergencia finalizada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al finalizar la emergencia. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
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
          },
        },
      ],
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
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al cancelar la atención. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  // Ubicacion
  async emergency() {
    const lastRequestDate = localStorage.getItem('lastEmergencyRequestDate');
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
    if (lastRequestDate === currentDate) {
      this.utilsSvc.presentToast({
        message: 'Ya ha realizado una solicitud de emergencia hoy. Si aun no tiene respuesta, llámenos al 987654321.',
        duration: 3500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }
    const hasLocationPermission = await this.utilsSvc.hasLocationPermission();
    if (!hasLocationPermission) {
      this.utilsSvc.requestLocationPermission();
      return;
    }
    const coords = await this.utilsSvc.getLocation();
    const myCoords = `${coords.latitude},${coords.longitude}`;
    this.utilsSvc.presentToast({
      message: 'Se ha enviado la solicitud, espere contacto o llámenos al 987654321.',
      duration: 3500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
    try {
      await this.firebaseSvc.addDocument('emergency', { ubicacion: myCoords, nombre: this.nombre, telefono: this.telefono, email: this.email, status: 'Pendiente' });
      localStorage.setItem('lastEmergencyRequestDate', currentDate); // Store the current date as the last request date
    } catch (error) {
      console.error('Error al guardar la ubicación en Firebase:', error);
    }
  }
  // Cerrar sesión
  signOut() {
    this.firebaseSvc.signOut();
  }
  
  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firestore
      .collection(path)
      .doc(id)
      .valueChanges()
      .subscribe((res) => {
        const data = res as { perfil: string; uid: string; name: string; telefono: string; email: string } | undefined;
        if (data) {
          this.rol = data.perfil;
          this.uid = data.uid;
          this.nombre = data.name;
          this.telefono = data.telefono;
          this.email = data.email;
        }
      });
  }
}
