import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './component/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './component/footer/footer.component';
import { ServiciosComponent } from './component/servicios/servicios.component';
import { HeaderComponent } from './component/header/header.component';
import { AddUpdateServicesComponent } from './component/add-update-services/add-update-services.component';
import { PersonalComponent } from './component/personal/personal.component';
import { AddUpdatePersonalComponent } from './component/add-update-personal/add-update-personal.component';
import { AddUpdateProductsComponent } from './component/add-update-products/add-update-products.component';
import { ProductosComponent } from './component/productos/productos.component';





@NgModule({
  declarations: [
    CustomInputComponent,
    FooterComponent,
    ServiciosComponent,
    HeaderComponent,
    AddUpdateServicesComponent,
    PersonalComponent,
    AddUpdatePersonalComponent,
    AddUpdateProductsComponent,
    ProductosComponent
  ],
  exports: [
    CustomInputComponent,
    FooterComponent,
    ServiciosComponent,
    HeaderComponent,
    AddUpdateServicesComponent,
    PersonalComponent,
    AddUpdatePersonalComponent,
    AddUpdateProductsComponent,
    ProductosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
