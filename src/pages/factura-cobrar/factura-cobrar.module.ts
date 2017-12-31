import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturaCobrarPage } from './factura-cobrar';

@NgModule({
  declarations: [
    FacturaCobrarPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturaCobrarPage),
  ],
})
export class FacturaCobrarPageModule {}
