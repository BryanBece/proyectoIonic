import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pedido } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-pedido',
  templateUrl: './add-update-pedidos.component.html',
  styleUrls: ['./add-update-pedidos.component.scss'],
})
export class AddUpdatePedidoComponent implements OnInit {
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  form = new FormGroup({
    id: new FormControl(''),
    proveedor: new FormControl('', [Validators.required, Validators.minLength(3)]),
    producto: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
    precio: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  ngOnInit() {}

  async Submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.addPedido(this.form.value as unknown as Pedido).then(async (res) => {
        let id = res.id;
        this.form.controls.id.setValue(id);
        this.setPedidoInfo(id);
      }).catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al crear el pedido. ' + error.message,
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

  async setPedidoInfo(id: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.updatePedido(this.form.value as unknown as Pedido).then(async (res) => {
        this.utilsSvc.presentToast({
          message: 'Pedido actualizado con éxito.',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      }).catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al actualizar el pedido. ' + error.message,
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
}