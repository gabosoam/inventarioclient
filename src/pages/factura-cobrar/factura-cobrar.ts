import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FacturaCobrarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-factura-cobrar',
  templateUrl: 'factura-cobrar.html',
})
export class FacturaCobrarPage {

  total: any;
  recibido: any;
  vuelto: any;

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams) {
   this.total = navParams.get('total');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacturaCobrarPage');
  }
  calcular(){
    console.log(this.recibido)
    this.vuelto = (this.recibido-this.total).toFixed(2);
    
  }

  cobrar(accion) {
   
    this.viewCtrl.dismiss(accion);
  }

}
