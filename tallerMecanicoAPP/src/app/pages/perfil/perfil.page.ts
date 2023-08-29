import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario : string = "";

  constructor(private rutaActiva : ActivatedRoute) { 

    this.rutaActiva.queryParams.subscribe(params => {

      if(params['usuario'])
      {
        this.usuario = params['usuario'];
      }
    });


  }

  ngOnInit() {
  }

}
