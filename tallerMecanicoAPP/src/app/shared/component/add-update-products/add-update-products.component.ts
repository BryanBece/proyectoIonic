import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    image: new FormControl('', [Validators.required]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
    // Añadir mas campos
  })

  

  ngOnInit() { 
    this.utilsSvc.getFromLocalStorage('user');
  }

  user = this.utilsSvc.getFromLocalStorage('user');
  // Tomar/Seleccionar foto

  async takePicture() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
    
  }


  async Submit() {
    if (this.form.valid) {
      let path = 'products'; // Update the path to the main path
      const loading = await this.utilsSvc.loading();
      await loading.present();
      // Subir imagen y obtener url
      let dataUrl = this.form.value.image;
      let imagePath = `${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
      delete this.form.value.id;
      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
        this.utilsSvc.dismissModal( { success: true });
        console.log(path);
        console.log(imageUrl);
        console.log(this.user);
        console.log(`${this.user.uid}`);
        this.utilsSvc.presentToast({
          message: 'Producto creado correctamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
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