import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Items } from '../../providers/providers';

/**
 * Generated class for the StockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {

  formCodigo: FormGroup;
  prod: any;
  items: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public service: Items,
    public viewCtrl: ViewController) {
    this.prod = navParams.get('producto');

    this.formCodigo = formBuilder.group({
   
      unidad: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.obtenerPrecios();
  }

  gestionar(){
    var total = this.formCodigo.value.cantidad/this.formCodigo.value.unidad;


    if (this.formCodigo.valid) {
      this.viewCtrl.dismiss({id: this.prod.id, stock: total});
    } else {
      
    }
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StockPage');
  }

  obtenerPrecios() {


    let seq = this.service.obtenerPrecios(this.prod.id);
    seq.subscribe((res) => {
      this.items = res;
    })
  }

}
