import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePersonalComponent } from '../add-update-personal/add-update-personal.component';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  users: User[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firebaseSvc.getUsers().subscribe(
      (users) => {
        this.users = users;
        loading.dismiss();
      },
      (error) => {
        console.log(error);
        loading.dismiss();
      }
    );
  }

  async addUpdatePersonal(user?: User) {
    const modal = await this.modalController.create({
      component: AddUpdatePersonalComponent,
      cssClass: 'add-update-modal',
      componentProps: { user },
    });
    await modal.present();
  }

  async confirmDeactivatePersonal(personal: User) {
    await this.utilsSvc.presentAlert({
      header: 'Desactivar Personal',
      message: '¿Quieres desactivar a este personal?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, desactivar',
          handler: () => {
            this.deactivatePersonal(personal);
          },
        },
      ],
    });
  }

  async deactivatePersonal(personal: User) {
    const loading = await this.loadingController.create();
    await loading.present();

    const path = `users/${personal.uid}`;
    const updatedPersonal = {
      ...personal,
      active: false,
    };

    this.firebaseSvc
      .updateDocument(path, updatedPersonal)
      .then(async () => {
        await this.utilsSvc.presentToast({
          message: 'Personal desactivado correctamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al desactivar el personal. ' + error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
        loading.dismiss();
      });
  }
}