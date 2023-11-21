import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductsComponent } from '../add-update-products/add-update-products.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  products: any[] = []; // Variable para almacenar los productos

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngOnInit() {
    this.getProducts(); // Obtener los productos al inicializar el componente
  }

  getProducts() {
    this.firebaseSvc.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  addUpdateProducts() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductsComponent,
      cssClass: 'add-update-modal'
    });
  }
}