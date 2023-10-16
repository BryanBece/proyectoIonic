import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'; 

@Component({
  selector: 'app-add-update-personal',
  templateUrl: './add-update-personal.component.html',
  styleUrls: ['./add-update-personal.component.scss'],
})
export class AddUpdatePersonalComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
    perfil: new FormControl('', [Validators.required, Validators.minLength(3)])
    // Añadir mas campos
  })

  ngOnInit() { }


  async Submit() {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.name)
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Problema al crear el usuario. ' + error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async setUserInfo(uid: string) {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = 'users/' + uid; // Ruta de la coleccion
      delete this.form.value.password;


      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routerLink('/home');
        this.firebaseSvc.signOut();
        this.utilsSvc.presentToast({
          message: 'Usuario creado con exito',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
        this.form.reset();

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Problema al crear el usuario',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}

