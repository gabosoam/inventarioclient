import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchPage2 } from '../pages';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];

  cbxProducto: any;

  marcas: any;
  categorias: any;
  form: FormGroup;
  form2: FormGroup;
  validador: boolean;
  idProducto: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    formBuilder: FormBuilder,
    public alertCtrl: AlertController) {

    this.form2 = formBuilder.group({
      name: ['', Validators.required]
    });

    this.validador = false;


    this.form = formBuilder.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      minimo: ['', Validators.required],
      unidad: ['', Validators.required],
      estado: ['', Validators.required],

    });

    this.obtenerMarcas();
    this.obtenerCategorias();


  }

  saludar() {

    var seq = this.items.buscarProducto(this.form2.value.name).share();

    seq.subscribe((res: any) => {

      if (res.length == 1) {
        this.validador = true;

        this.idProducto = res[0].id;


        this.form.setValue({
          codigo: res[0].codigo,
          nombre: res[0].nombre,
          tipo: res[0].tipo,
          marca: res[0].marca.id,
          categoria: res[0].categoria.id,
          precio: res[0].precio,
          stock: res[0].stock,
          minimo: res[0].minimo,
          unidad: res[0].unidad,
          estado: res[0].estado,
        })

      } else {
        this.form.reset();
        this.validador = false;
      }
    }, err => {
      this.validador == false;
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Existió un error ',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  registrar() {


    if (this.validador) {
     

      let seq = this.items.modificarProducto(this.idProducto, this.form.value);
      seq.subscribe((res: any) => {

       
          let alert = this.alertCtrl.create({
            title: 'Éxito!',
            subTitle: 'Se modificó el producto satisfactoriamente',
            buttons: ['OK']
          });
          alert.present();

          this.navCtrl.push(SearchPage);

       
      }, err => {
        console.error('ERROR', err);
      });
    } else {

      if (!this.form.valid) { return; }
      var seq = this.items.crearProducto(this.form.value).share();

      seq.subscribe((res: any) => {
        let alert = this.alertCtrl.create({
          title: 'Éxito!',
          subTitle: 'Se guardo el producto satisfactoriamente',
          buttons: ['OK']
        });
        alert.present();

        this.navCtrl.push(SearchPage);

      }, err => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Existió un error ',
          buttons: ['OK']
        });
        alert.present();
      });

    }

  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }

  buscar(cosa) {
    console.log(cosa)
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'error',
      buttons: ['OK']
    });
    alert.present();
  }

  obtenerMarcas() {
    this.items.obtenerMarcas().subscribe(marcas => {
      this.marcas = marcas;
    })
  }

  obtenerCategorias() {
    this.items.obtenerCategorias().subscribe(categorias => {


      this.categorias = categorias;
    })
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

}
