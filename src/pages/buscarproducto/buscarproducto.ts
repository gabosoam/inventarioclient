import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Items } from '../../providers/providers';
/**
 * Generated class for the BuscarproductoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buscarproducto',
  templateUrl: 'buscarproducto.html',
})
export class BuscarproductoPage {

  searchQuery: string = '';
  items: any;
  cantidad: any;

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams, public service: Items, ) {
    //this.initializeItems();
  }

  initializeItems(nombre) {


    this.items = [
      { nombre: "gabriel" },
      { nombre: "alba" }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscarproductoPage');
  }

  agregar(producto) {

    this.viewCtrl.dismiss(producto);
  }

  getItems(ev: any) {
    // Reset items back to all of the items


    // set val to the value of the searchbar
    let val = ev.target.value;

    let seq = this.service.buscarProductoNombre(val).share();

    seq.subscribe((data) => {
      this.items = data;

      if (val && val.trim() != '') {
        this.items = this.items.filter((item) => {
          return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }


    })

    // if the value is an empty string don't filter the items

  }
}
