import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Service } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  login: boolean = false;
  listaComentarios: any[] = [];
  services: Service[] = [];


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
