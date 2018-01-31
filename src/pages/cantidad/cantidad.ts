import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Items } from '../../providers/providers';

/**
 * Generated class for the CantidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cantidad',
  templateUrl: 'cantidad.html',
})
export class CantidadPage {
  formCodigo: FormGroup;
  prod: any;
  items: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public service: Items,
    public viewCtrl: ViewController) {

    this.prod = navParams.get('producto');

    this.formCodigo = formBuilder.group({

      unidad: ['', Validators.required],
      cantidad: ['', Validators.required],
      tamano: ['', Validators.required]
    });

    this.obtenerPrecios();
  }

  cambiar(producto){
    alert(JSON.stringify(producto));
  }

  gestionar(producto){
    alert(JSON.stringify(this.formCodigo.value))
    // var total = this.formCodigo.value.cantidad*this.formCodigo.value.unidad;
    // var data ={
    //   cantidad: this.formCodigo.value.cantidad,
    //   precio: this.formCodigo.value.unidad
    // }

    // if (this.formCodigo.valid) {
    //   this.viewCtrl.dismiss(data);
    // } else {
      
    // }
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StockPage');
  }

  obtenerPrecios() {


    let seq = this.service.obtenerPrecios(this.prod.id);
    seq.subscribe((res) => {
      console.log(res)
      this.items = res;
    })
  }
}
