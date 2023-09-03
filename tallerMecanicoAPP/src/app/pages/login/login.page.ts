import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {
  usuario = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  iniciarSesion() {
    console.log('Usuario: ' + this.usuario);

    const usuario: NavigationExtras = {
      queryParams: {
        usuario: this.usuario,
      },
    };
    this.router.navigate(['/perfil'], usuario);
  }
}


