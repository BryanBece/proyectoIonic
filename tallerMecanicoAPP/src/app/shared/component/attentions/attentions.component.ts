import { Component, OnInit } from '@angular/core';
import { Attentions } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TakeHoursComponent } from '../take-hours/take-hours.component';



@Component({
  selector: 'app-attentions',
  templateUrl: './attentions.component.html',
  styleUrls: ['./attentions.component.scss'],
})
export class AttentionsComponent  implements OnInit {
  attentions: Attentions[] = [];

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.getAttentions();
  }

  

  getAttentions() {
    this.firebaseSvc.getAttentions().subscribe((attentions) => {
      this.attentions = attentions;
    });
  }

  async confirmCancelAttention(attention: Attentions) {
    await this.utilsSvc.presentAlert({
      header: 'Rechazar Atención',
      message: '¿Quieres rechazar esta atención?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, rechazar',
          handler: () => {
            this.cancelAttention(attention);
          }
        }
      ]
    });
  }

  async confirmAcceptAttention(attention: Attentions) {
    await this.utilsSvc.presentAlert({
      header: 'Aceptar Atención',
      message: '¿Quieres aceptar esta atención?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, aceptar',
          handler: () => {
            this.acceptAttention(attention);
          }
        }
      ]
    });
  }

  async confirmFinishtAttention(attention: Attentions) {
    await this.utilsSvc.presentAlert({
      header: 'Finalizar Atención',
      message: '¿Quieres finalizar esta atención?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, finalizar',
          handler: () => {
            this.finishAttention(attention);
          }
        }
      ]
    });
  }
  
  addUpdateAttention(attention?: Attentions) {
    this.utilsSvc.presentModal({
      component: TakeHoursComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        attention
      }
    });
  }

  async acceptAttention(attention: Attentions){
    const path = `appointments/${attention.id}`; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Aceptada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Atención aceptada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al aceptar la atención. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
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

  async finishAttention(attention: Attentions) {
    const path = `appointments/${attention.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Finalizada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Atención finalizada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al finalizar la atención. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  


}


