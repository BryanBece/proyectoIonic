import { Component, OnInit } from '@angular/core';
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

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    // Add more fields
  });

  ngOnInit() {}

  async Submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      const service: Service = {
        id: this.generateUniqueId(),
        name: this.form.value.name,
        description: this.form.value.description,
        price: Number(this.form.value.price),
        // Add more fields
      };
      this.firebaseSvc.addService(service).then(async () => {
        this.utilsSvc.presentToast({
          message: 'Servicio agregado con éxito.',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Problema al agregar el servicio. ' + error.message,
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
  
  generateUniqueId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString();
    return timestamp + random;
  }
}