import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pedido } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-update-pedido',
  templateUrl: './add-update-pedido.component.html',
  styleUrls: ['./add-update-pedido.component.scss'],
})
export class AddUpdatePedidoComponent implements OnInit {
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  @Input() order: Pedido;
  
  form = new FormGroup({
    id: new FormControl(''),
    proveedor: new FormControl('', [Validators.required, Validators.minLength(3)]),
    producto: new FormControl(''),
    fecha: new FormControl(formatDate(new Date(), 'dd/MM/yyyy', 'en-US')),
    status: new FormControl('Pendiente'),
  });

  ngOnInit() {
    if (this.order) {
      this.form.setValue(this.order);
    }

  }

  Submit(){
    if (this.form.valid) {
      this.updateOrder();
    }else{
      this.createOrder();
    }
  }

  async createOrder() {
    const path = 'orders'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      delete this.form.value.id;
      await this.firebaseSvc.addDocument(path, this.form.value);

      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Pedido creado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al crear el pedido. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  async updateOrder() {
    const path = `orders/${this.order.id}`; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      delete this.form.value.id;
  
      await this.firebaseSvc.updateDocument(path, this.form.value);
  
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Pedido actualizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al actualizar el pedido. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
}