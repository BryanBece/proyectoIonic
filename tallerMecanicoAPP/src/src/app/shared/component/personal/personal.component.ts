import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePersonalComponent } from '../add-update-personal/add-update-personal.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}


  // Agregar o actualizar servicio
  addUpdatePersonal() {
    this.utilsSvc.presentModal({
      component: AddUpdatePersonalComponent,
      cssClass: 'add-update-modal'
    })
  }
}
