import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CantidadPage } from './cantidad';

@NgModule({
  declarations: [
    CantidadPage,
  ],
  imports: [
    IonicPageModule.forChild(CantidadPage),
  ],
})
export class CantidadPageModule {}
