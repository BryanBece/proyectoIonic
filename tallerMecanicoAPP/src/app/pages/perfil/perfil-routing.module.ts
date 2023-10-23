import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPage } from './perfil.page';
import { ServiciosComponent } from 'src/app/shared/component/servicios/servicios.component';
import { ProductosComponent } from 'src/app/shared/component/productos/productos.component';
import { PersonalComponent } from 'src/app/shared/component/personal/personal.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage,
    children:[
      {
        path:'servicios',
        component: ServiciosComponent
      },
      {
        path:'productos',
        component: ProductosComponent
      },
      {
        path:'personal',
        component: PersonalComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
