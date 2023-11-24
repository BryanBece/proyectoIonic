import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-products',
  templateUrl: './add-update-products.component.html',
  styleUrls: ['./add-update-products.component.scss'],
})


export class AddUpdateProductsComponent implements OnInit {
  @Input() product: Product;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    image: new FormControl('', [Validators.required]),
    // Añadir mas campos
  });

  ngOnInit() {
    this.utilsSvc.getFromLocalStorage('user');
    if (this.product) {
      this.form.setValue(this.product);
    }
  }

  user = this.utilsSvc.getFromLocalStorage('user');

  // Tomar/Seleccionar foto
  async takePicture() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  Submit() {
    if (this.form.valid) {
      if (this.product) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    }
  }

  async createProduct() {
    const path = 'products'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    // Subir imagen y obtener url
    const dataUrl = this.form.value.image;
    const imagePath = `${Date.now()}`;
    const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;
    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Producto creado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al crear el producto. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // Actualizar producto
  async updateProduct() {
    const path = `products/${this.product.id}`; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    // Subir imagen y obtener url
    if (this.form.value.image !== this.product.image) {
      const dataUrl = this.form.value.image;
      const imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
    delete this.form.value.id;
    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Producto actualizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al actualizar el producto. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}