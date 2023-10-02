import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  login: boolean = false;

  constructor(private menu: MenuController, private auth: AngularFireAuth) {
    
    
    this.auth.authState.subscribe(user => {
      if (user) {
        this.login = true;
      } else {
        this.login = false;
      }
    });
  }
}