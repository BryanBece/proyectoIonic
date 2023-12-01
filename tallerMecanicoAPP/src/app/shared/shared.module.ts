import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { ProductosComponent } from './component/productos/productos.component';
import { AddUpdateProductsComponent } from './component/add-update-products/add-update-products.component';
import { PedidosComponent } from './component/pedidos/pedidos.component';
import { AddUpdatePedidoComponent } from './component/add-update-pedido/add-update-pedido.component';
import { AttentionsComponent } from './component/attentions/attentions.component';
import { TakeHoursComponent } from './component/take-hours/take-hours.component';
import { ScannerComponent } from './component/scanner/scanner.component';
import { ClientsProductsComponent } from './component/clients-products/clients-products.component';

@NgModule({
  declarations: [
    CustomInputComponent,
    FooterComponent,
    ServiciosComponent,
    HeaderComponent,
    AddUpdateServicesComponent,
    PersonalComponent,
    AddUpdatePersonalComponent,
    ProductosComponent,
    AddUpdateProductsComponent,
    PedidosComponent,
    AddUpdatePedidoComponent,
    AttentionsComponent,
    TakeHoursComponent,
    ScannerComponent,
    ClientsProductsComponent
  ],
  exports: [
    CustomInputComponent,
    FooterComponent,
    ServiciosComponent,
    HeaderComponent,
    AddUpdateServicesComponent,
    PersonalComponent,
    AddUpdatePersonalComponent,
    ProductosComponent,
    AddUpdateProductsComponent,
    PedidosComponent,
    AddUpdatePedidoComponent,
    AttentionsComponent,
    TakeHoursComponent,
    ScannerComponent,
    ClientsProductsComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }