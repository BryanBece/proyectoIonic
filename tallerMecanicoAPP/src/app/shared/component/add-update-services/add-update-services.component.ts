import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-services',
  templateUrl: './add-update-services.component.html',
  styleUrls: ['./add-update-services.component.scss'],
})
export class AddUpdateServicesComponent implements OnInit {
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  @Input() service: Service;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    // Add more fields
  });

  ngOnInit() {

    if (this.service) {
      this.form.setValue(this.service);
    }
  }

  Submit(){
    if (this.form.valid) {
      if (this.service) {
        this.updateService();
      } else {
        this.createService();
      }
    }
  }

  async createService() {
    const path = 'services'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      delete this.form.value.id;
  
      await this.firebaseSvc.addDocument(path, this.form.value);
  
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Servicio creado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al crear el servicio. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  async updateService() {
    const path = `services/${this.service.id}`; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      delete this.form.value.id;
  
      await this.firebaseSvc.updateDocument(path, this.form.value);
  
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Servicio actualizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al actualizar el servicio. ' + error.message,
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