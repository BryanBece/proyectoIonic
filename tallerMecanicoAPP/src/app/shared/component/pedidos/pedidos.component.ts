import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePedidoComponent } from '../add-update-pedido/add-update-pedido.component';
import { Pedido } from 'src/app/models/user.models';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  constructor() {}

  ngOnInit() {
    this.getPedidos();
  }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Agregar o actualizar servicio
  addUpdatePedidos(order?: Pedido) {
    this.utilsSvc.presentModal({
      component: AddUpdatePedidoComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        order,
      },
    });
  }

  // Obtener servicios
  getPedidos() {
    this.firebaseSvc.getOrders().subscribe((pedidos) => {
      this.pedidos = pedidos;
    });
  }

  async confirmDeleteOrder(order: Pedido) {
    await this.utilsSvc.presentAlert({
      header: 'Eliminar Pedido',
      message: '¿Quieres eliminar este pedido?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteOrder(order);
          },
        },
      ],
    });
  }

  async deleteOrder(order: Pedido) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    const path = `orders/${order.id}`;
    this.firebaseSvc
      .deleteDocument(path)
      .then(async () => {
        await this.utilsSvc.presentToast({
          message: 'Pedido eliminado correctamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al eliminar el pedido. ' + error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async confirmFinishOrder(order: Pedido) {
    await this.utilsSvc.presentAlert({
      header: 'Finalizar Pedido',
      message: '¿Quieres finalizar este pedido?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, finalizar',
          handler: () => {
            this.finishOrder(order);
          }
        }
      ]
    });
  }

  async finishOrder(order: Pedido) {
    const path = `orders/${order.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      await this.firebaseSvc.updateDocument(path, { status: 'Finalizada' });
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Pedido finalizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al finalizar el pedido. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }
}
