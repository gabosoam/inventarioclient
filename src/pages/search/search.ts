import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchPage2 } from '../pages';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

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
  unidades: any;
  form: FormGroup;
  form2: FormGroup;
  validador: boolean;
  idProducto: any;
  selectOptions: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner) {

    this.form2 = formBuilder.group({
      name: ['', Validators.required]
    });

    this.validador = false;


    this.form = formBuilder.group({
      codigo: ['', Validators.required],
      nombre: [null, Validators.required],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['1', Validators.required],
      minimo: ['0', Validators.required],
      unidad: ['', Validators.required],
      estado: ['1', Validators.required],

    });

    this.obtenerMarcas();
    this.obtenerCategorias();
    this.obtenerUnidades();




  }

  escanear() {
    this.barcodeScanner.scan().then((barcodeData) => {
      var seq = this.items.buscarProducto(barcodeData.text).share();

      seq.subscribe((res: any) => {

        if (res.length == 1) {


          // this.validador = true;

          // this.idProducto = res[0].id;


          this.form.setValue({
            codigo: res[0].codigo,
            nombre: res[0].nombre,
            marca: '',
            categoria: '',
            precio: 0,
            stock: 0,
            minimo: 1,
            unidad: '',
            estado: 1,
          })

        } else {
          this.form.reset();
          this.form.setValue({
            codigo: barcodeData.text,
            nombre: '',
            marca: '',
            categoria: '',
            precio: 0,
            stock: 0,
            minimo: 1,
            unidad: '',
            estado: 1,
          })
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
    }, (err) => {
      // An error occurred
    });
  }

  saludar() {

    var seq = this.items.buscarProducto(this.form2.value.name).share();

    seq.subscribe((res: any) => {

      if (res.length == 1) {


        // this.validador = true;

        // this.idProducto = res[0].id;


        this.form.setValue({
          codigo: res[0].codigo,
          nombre: res[0].nombre,
          marca: '',
          categoria: '',
          precio: 0,
          stock: 0,
          minimo: 1,
          unidad: '',
          estado: 1,
        })

      } else {
        this.form.reset();
        this.form.setValue({
          codigo: this.form2.value.name,
          nombre: '',
          marca: '',
          categoria: '',
          precio: 0,
          stock: 0,
          minimo: 1,
          unidad: '',
          estado: 1,
        })
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

  cancelar(){
    this.viewCtrl.dismiss();
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

      if (!this.form.valid) {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Todos los campos son obligatorios',
          buttons: ['OK']
        });
        alert.present();
      } else {
        var seq = this.items.crearProducto(this.form.value).share();

        seq.subscribe((res: any) => {
          let alert = this.alertCtrl.create({
            title: 'Éxito!',
            subTitle: 'Se guardo el producto satisfactoriamente',
            buttons: ['OK']
          });
          alert.present();

          this.viewCtrl.dismiss(res);

        }, err => {
          console.log(err);

          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Comprueba que la información ingresada es correcta ',
            buttons: ['OK']
          });
          alert.present();
          // this.viewCtrl.dismiss(this.form.value);
        });

      }


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

  obtenerUnidades() {
    this.items.obtenerUnidades().subscribe(resultado => {

      console.log(resultado)
      this.unidades = resultado;
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
