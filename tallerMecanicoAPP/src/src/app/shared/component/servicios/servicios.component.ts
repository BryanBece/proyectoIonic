import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateServicesComponent } from '../add-update-services/add-update-services.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}


  // Agregar o actualizar servicio
  addUpdateService() {
    this.utilsSvc.presentModal({
      component: AddUpdateServicesComponent,
      cssClass: 'add-update-modal'
    })
  }


}
