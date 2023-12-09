import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController
  ) {}

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  async loading() {
    return await this.loadingCtrl.create({ spinner: 'crescent' });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

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

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates.coords;
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  }

  async hasLocationPermission() {
    // Check if location permission is granted
    const permission = await Geolocation.checkPermissions();
    if (permission.location === 'granted') {
      return true;
    } else {
      return false;
    }
  }

  async requestLocationPermission() {
    // Request location permission
    const permission = await Geolocation.requestPermissions();
    if (permission.location === 'granted') {
      this.presentToast({
        message: 'Permiso de ubicación concedido.',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } else {
      this.presentToast({
        message: 'Permiso de ubicación denegado.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'close-circle-outline',
      });
    }
  }
}
