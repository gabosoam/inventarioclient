import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrecioPage } from './precio';

@NgModule({
  declarations: [
    PrecioPage,
  ],
  imports: [
    IonicPageModule.forChild(PrecioPage),
  ],
})
export class PrecioPageModule {}
