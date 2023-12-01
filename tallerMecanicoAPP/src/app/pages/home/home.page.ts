import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Service } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ScannerComponent } from 'src/app/shared/component/scanner/scanner.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  login: boolean = false;
  listaComentarios: any[] = [];
  services: Service[] = [];
  utilsSvc = inject(UtilsService);


  constructor(private menu: MenuController, private auth: AngularFireAuth, private api: ApiService, private firebaseSvc: FirebaseService) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.login = true;
      } else {
        this.login = false;
      }
    });
  }

  ngOnInit() {
    this.getComentarios();
    this.getServices();
  }

  scanQRCode(){
    this.utilsSvc.presentModal({
      component: ScannerComponent,
      cssClass: 'modal-fullscreen',
    });
  }

  getComentarios() {
    this.api.getComments().subscribe(
      response => {
        this.listaComentarios = Object.values(response.comentarios);
      },
      error => {
        console.log(error);
      }
    );
  }

  getServices() {
    this.firebaseSvc.getServices().subscribe((services) => {
      this.services = services;
    });
  }

}
