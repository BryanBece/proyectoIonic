import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'; 

@Component({
  selector: 'app-add-update-products',
  templateUrl: './add-update-products.component.html',
  styleUrls: ['./add-update-products.component.scss'],
})
export class AddUpdateProductsComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    image: new FormControl('', [Validators.required]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
    // Añadir mas campos
  })

  ngOnInit() { }

  // Tomar/Seleccionar foto

  async takePicture() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
    
  }


  async Submit() {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.name)
        let uid = res.user.uid;


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

}