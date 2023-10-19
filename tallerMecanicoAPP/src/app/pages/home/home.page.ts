import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  login: boolean = false;
  listaComentarios: any[] = [];

  constructor(private menu: MenuController, private auth: AngularFireAuth, private api: ApiService) {
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
}
