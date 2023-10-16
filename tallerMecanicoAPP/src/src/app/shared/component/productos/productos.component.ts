import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductsComponent } from '../add-update-products/add-update-products.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}


  // Agregar o actualizar productos
  addUpdateProducts() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductsComponent,
      cssClass: 'add-update-modal'
    })
  }


}