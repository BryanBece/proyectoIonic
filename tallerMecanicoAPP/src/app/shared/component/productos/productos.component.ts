import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductsComponent } from '../add-update-products/add-update-products.component';
import { Product } from 'src/app/models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  products: any[] = []; // Variable para almacenar los productos
  loading: boolean = false; // Variable para mostrar el loading
  rol: string = '';
  firestore = inject(AngularFirestore);

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngOnInit() {
    this.getProducts(); // Obtener los productos al inicializar el componente
  }

  getProducts() {
    this.loading = true; // Mostrar el loading

    this.firebaseSvc.getProducts().subscribe((products) => {
      this.products = products;
      this.loading = false; // Ocultar el loading
    });
  }
  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firestore
      .collection(path)
      .doc(id)
      .valueChanges()
      .subscribe((res) => {
        const data = res as { perfil: string } | undefined;
        if (data) {
          this.rol = data.perfil;
        }
      });
  }
  // Abrir modal para crear o actualizar producto
  addUpdateProducts(product?: Product) {
    this.utilsSvc.presentModal({
      component: AddUpdateProductsComponent,
      cssClass: 'add-update-modal',
      componentProps: { product } 
    });
  }

async confirmDeleteProduct(product: Product) {
  this.utilsSvc.presentAlert({
    header: 'Eliminar Producto!',
    message: '¿Quieres eliminar este producto?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      }, {
        text: 'Si, eliminar',
        handler: () => {
          this.deleteProduct(product);
        }
      }
    ]
  });
}


    // Eliminar producto

    async deleteProduct(product: Product) {
      let path = `products/${product.id}`; // Update the path to the main path
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let imagePath = await this.firebaseSvc.getFilePath(product.image);
      await this.firebaseSvc.deleteImage(imagePath);
  
      this.firebaseSvc.deleteDocument(path).then(async res => {

        this.utilsSvc.presentToast({
          message: 'Producto eliminado correctamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al crear el producto. ' + error.message,
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