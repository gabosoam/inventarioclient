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
      cantidad: ['', Validators.required]
    });

    this.obtenerPrecios();
  }

  cambiar(producto) {
    alert(JSON.stringify(producto));
  }

  gestionar() {
    this.service.obtenerPrecio(this.formCodigo.value.unidad).subscribe((res: any) => {
      if (this.formCodigo.valid) {
        if (this.formCodigo.value.cantidad<=0) {
          alert("No se puede ingresar cantidades igual o menor a cero")
        } else {
          this.viewCtrl.dismiss({ cantidad: this.formCodigo.value.cantidad, precio: res });
        }
        
      } else {
        alert("Completa todos los campos")
      }
    })





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
