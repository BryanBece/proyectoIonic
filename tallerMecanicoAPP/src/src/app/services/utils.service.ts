import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  firestore = inject(AngularFirestore);

  // Camara
  

async takePicture(promptLabelHeader: string){
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Seleccionar foto',
    promptLabelPicture: 'Tomar foto',
  });
};


  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // Modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }


  // Navegacion
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Guardar en LocalStorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener desde LocalStorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}

