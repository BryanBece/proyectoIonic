import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  firestore = inject(AngularFirestore);


  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
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

