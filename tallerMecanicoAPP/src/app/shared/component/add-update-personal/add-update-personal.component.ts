import { Component, Input, OnInit, inject } from '@angular/core';
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
  @Input() user: User;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
    perfil: new FormControl(''),
    active: new FormControl(true),
    // Añadir mas campos
  })
  ngOnInit() {
    if(this.user){
      this.form.patchValue(this.user);
    }
   }
  Submit(){
    if (this.form.valid) {
      if(this.user){
        this.updateUserInfo(this.user.uid);
      }else{
        this.newUser();
      }
    }
  }
  async newUser() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name)
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);
        this.firebaseSvc.signOut();
        this.utilsSvc.dismissModal();
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
        await this.firebaseSvc.updateUser(this.form.value.name);
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

  async updateUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      try {
        const path = `users/${uid}`; // Ruta de la colección
        delete this.form.value.password;
        await this.firebaseSvc.updateDocument(path, this.form.value);
        this.utilsSvc.presentToast({
          message: 'Usuario actualizado con éxito',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
        this.form.reset();
      } catch (error) {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al actualizar el usuario',
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
}