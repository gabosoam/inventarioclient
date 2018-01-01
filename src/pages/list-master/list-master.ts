import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

import { AlertController } from 'ionic-angular';
import { MainPage } from '../pages';

import { Printer, PrintOptions } from '@ionic-native/printer';


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  factura: any;

  cliente: any;

  cbxProducto: any;

  detalles: any;
  total: any;

  isReadyToSave: boolean;

  form: FormGroup;

  constructor(
    public navCtrl: NavController, 
    formBuilder: FormBuilder, 
    public items: Items, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    private printer: Printer) {
    this.factura = { id: 0 };

    this.items.crearFactura().subscribe((res) => {
      this.factura = this.items.factura;

    });
    this.currentItems = this.items.query();

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.obtenerDetalles();

    //this.print()
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }
  iniciar(){
    //this.printer.isAvailable().then(this.onSuccess, this.onError);
    console.log(this.printer.isAvailable());
    // let options: PrintOptions = {
    //      name: 'MyDocument',
    //      duplex: true,
    //      landscape: true,
    //      grayscale: true
    //    };
    
    // this.printer.print('<h1>hello world</h1>', options).then(this.onSuccess, this.onError);
    
  }

  onSuccess(){
    console.log('bien');
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

  onError(){
    console.log('mal');
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  crearFactura(factura) {
    this.factura = factura;


  }

  cambiarCliente() {
    console.log(this.cliente)

    this.items.modificarCliente(this.cliente, this.factura.id)
  }

  obtenerDetalles() {
    this.items.obtenerDetalles(this.factura.id).subscribe(res => {
      console.log(res)
      this.detalles = res;
      this.calcularTotal();
    });

  }

  calcularTotal() {

    var detalle = this.detalles;
    var aux = 0.00;
    for (let index = 0; index < detalle.length; index++) {
      aux += parseFloat(detalle[index].total);

    }
    this.total = 0.00;
    this.total = aux.toFixed(2);
  }

  saludar() {



    if (!this.form.valid) { return; }

    let seq = this.items.obtenerProducto(this.form.value);

    seq.subscribe((res: any) => {
      if (res.length == 1) {
        switch (res[0].tipo) {
          case 'unidad':
            if (res[0].stock >= 1) {
              this.items.generarIngreso(this.factura.id, 1, res[0].id, res[0].precio).subscribe(resp => {
                this.obtenerDetalles();
                this.cbxProducto = '';


              });


            } else {
              let alert = this.alertCtrl.create({
                title: 'Error!',
                subTitle: JSON.stringify('No hay papa : ' + this.form.value.name),
                buttons: ['OK']
              });
              alert.present();
            }
            break;

          case 'granel':

            let prompt = this.alertCtrl.create({
              title: 'Venta en granel',
              message: "Ingrese la cantidad igual o inferior a: " + res[0].stock,
              inputs: [
                {
                  name: 'producto',
                  placeholder: 'Producto',
                  type: 'hidden',
                  value: res[0].id,
                  disabled: true,



                },
                {
                  name: 'cantidad',
                  placeholder: 'Cantidad',
                  type: 'number',
                  min: 0.1,
                  max: res[0].stock,


                },
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Vender',
                  handler: data => {
                    console.log(data);
                  }
                }
              ]
            });
            prompt.present();

            break;
        }

      } else {


        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: JSON.stringify('No existe el producto con el código: ' + this.form.value.name),
          buttons: ['OK']
        });
        alert.present();

      }
    }, err => {
      console.error('ERROR', err);
    });




  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
  comprobante() {
    this.print()
   }

  sincomprobante() {
    this.navCtrl.push(MainPage);
   }

  cancelar() { }

  cobrar() {
    let addModal = this.modalCtrl.create('FacturaCobrarPage', { total: this.total });
    addModal.onDidDismiss(accion => {
      if (accion) {
        switch (accion) {
          case 'comprobante':
            this.comprobante();
            break;

          case 'sincomprobante':
            this.sincomprobante();
            break;

          case 'cancelar':
            this.cancelar();
            break;
        }
      }
    })
    addModal.present();
  }
}
