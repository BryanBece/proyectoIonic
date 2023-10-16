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

  user = {} as User;


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

  ngOnInit() { 
    this.user = this.utilsSvc.getFromLocalStorage('user');

  }

  // Tomar/Seleccionar foto
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);

  }



  async Submit() {

    let path = 'users/' + this.user.uid + '/products';

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Subir imagen y obtener url

      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
      
      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {      

        this.utilsSvc.dismissModal( { success : true });

        await this.utilsSvc.presentToast({
          message: 'Producto creado correctamente',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });

        this.utilsSvc.routerLink('/perfil');
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
