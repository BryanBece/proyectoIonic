import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-clients-products',
  templateUrl: './clients-products.component.html',
  styleUrls: ['./clients-products.component.scss'],
})
export class ClientsProductsComponent  implements OnInit {

  products: any[] = []; // Variable para almacenar los productos
  loading: boolean = false; // Variable para mostrar el loading
  rol: string = '';
  firestore = inject(AngularFirestore);

  constructor(private firebaseSvc: FirebaseService) {
    
  }

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
}