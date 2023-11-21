import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePedidoComponent } from '../add-update-pedidos/add-update-pedidos.component';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

    // Agregar o actualizar servicio
    addUpdatePedidos() {
      this.utilsSvc.presentModal({
        component: AddUpdatePedidoComponent,
        cssClass: 'add-update-modal'
      })
    }
  

}
