import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateServicesComponent } from '../add-update-services/add-update-services.component';
import { Service } from 'src/app/models/user.models';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  services: Service[] = [];

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngOnInit() {
    this.getServices();
  }

  addUpdateService(service?: Service) {
    this.utilsSvc.presentModal({
      component: AddUpdateServicesComponent,
      cssClass: 'add-update-modal',
      componentProps: { service }
    });
  }

  getServices() {
    this.firebaseSvc.getServices().subscribe((services) => {
      this.services = services;
    });
  }

  async confirmDeleteService(service: Service) {
    await this.utilsSvc.presentAlert({
      header: 'Eliminar Servicio',
      message: '¿Quieres eliminar este servicio?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteService(service);
          }
        }
      ]
    });
  }

  async deleteService(service: Service) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    const path = `services/${service.id}`;
    this.firebaseSvc.deleteDocument(path).then(async () => {
      await this.utilsSvc.presentToast({
        message: 'Servicio eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch((error) => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al eliminar el servicio. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}