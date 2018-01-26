import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

import { AlertController } from 'ionic-angular';
import { Tab1Root } from '../pages';

import { Printer, PrintOptions } from '@ionic-native/printer';


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  cantidad: any;

  factura: any;
  fecha: any;

  cliente: any;

  cbxProducto: any;

  detalles: any;
  total: any;

  recibido: any;
  vuelto: any;

  isReadyToSave: boolean;

  form: FormGroup;
  form2: FormGroup;

  constructor(
    public navCtrl: NavController,
    formBuilder: FormBuilder,
    public items: Items,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private printer: Printer) {
    this.factura = { id: 0 };


    this.currentItems = this.items.query();

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.refrescar();





    //this.print()
  }

  refrescar() {
    var data = [];

    this.detalles = data;
    this.items.crearFactura().subscribe((res) => {
      this.factura = this.items.factura;
      this.items.obtenerDetalles(this.factura.id).subscribe(res => {

        this.detalles = res;
        this.calcularTotal();
      });

      var fecha = new Date(this.factura.createdAt);
      this.fecha = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();

      console.log(this.fecha)


    });



  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }
  iniciar() {
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

  borrarDetalle(detalle) {
    this.items.borrarProductoDetalle(detalle).subscribe(data => {
      this.obtenerDetalles();
    });
  }

  onSuccess() {
    // console.log('bien');
  }

  openOther() {
    //I called Api using service
    let scope = this;
    setTimeout(function () { scope.print(); }, 1000);
  }

  calcular() {

    this.vuelto = (this.recibido - this.total).toFixed(2);

  }

 

  public print() {
    var contenido= document.getElementById('boleta').innerHTML;
     var contenidoOriginal= document.body.innerHTML;

     document.body.innerHTML = contenido;

     window.print();
     window.close();

     document.body.innerHTML = contenidoOriginal;
  }

  onError() {
    // console.log('mal');
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
    //console.log(this.cliente)

    this.items.modificarCliente(this.cliente, this.factura.id)
  }

  obtenerDetalles() {
    this.items.obtenerDetalles(this.factura.id).subscribe(res => {

      this.detalles = res;
      this.calcularTotal();
    });


  }

  calcularTotal() {



    var detalle = this.detalles;

    var aux = 0.00;
    for (let index = 0; index < detalle.length; index++) {
      aux += parseFloat(detalle[index].rawtotal);

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
                subTitle: JSON.stringify('No hay stock : ' + this.form.value.name),
                buttons: ['OK']
              });
              alert.present();
            }
            break;

          case 'granel':

            let prompt = this.alertCtrl.create({
              title: 'Venta en granel - ' + res[0].nombre,
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
                    // console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Vender',
                  handler: data => {
                    var precio = data.cantidad * res[0].precio;

                    this.items.generarIngreso(this.factura.id, data.cantidad, res[0].id, res[0].precio).subscribe(resp => {
                      this.obtenerDetalles();
                      this.cbxProducto = '';


                    });
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
    if (this.total == 0) {
      let alert = this.alertCtrl.create({
        title: 'Alerta!',
        subTitle: JSON.stringify('No se puede imprimir un comprobante sin detalle '),
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.print();
      this.refrescar();
      // this.navCtrl.push(Tab1Root);
      // this.navCtrl.remove



    }

  }

  sincomprobante() {
    if (this.total == 0) {
      let alert = this.alertCtrl.create({
        title: 'Alerta!',
        subTitle: JSON.stringify('No se puede imprimir un comprobante sin detalle '),
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.refrescar();
    }


  }

  cancelar() { }

  updateList(ev) {
    console.log(ev.target.value);
  }

  buscar() {
    //  let addModal = this.modalCtrl.create('ItemCreatePage');
    let addModal = this.modalCtrl.create('BuscarproductoPage');
    addModal.onDidDismiss(producto => {
      if (producto) {
        switch (producto.tipo) {
          case 'unidad':
          let prompt2 = this.alertCtrl.create({
            title: producto.nombre,
            message: "Ingrese la cantidad igual o inferior a: " + producto.stock,
            inputs: [
              {
                name: 'producto',
                placeholder: 'Producto',
                type: 'hidden',
                value: producto.id,
                disabled: true,
              },
              {
                name: 'cantidad',
                placeholder: 'Cantidad',
                type: 'number',
                min: 0.1,
                max: producto.stock,


              },
            ],
            buttons: [
              {
                text: 'Cancelar',
                handler: data => {
                  // console.log('Cancel clicked');
                }
              },
              {
                text: 'Vender',
                handler: data => {
                  alert(JSON.stringify(data))
                  var precio = data.cantidad * producto.precio;

                  this.items.generarIngreso(this.factura.id, data.cantidad, producto.id, producto.precio).subscribe(resp => {
                    this.obtenerDetalles();
                    this.cbxProducto = '';


                  });
                }
              }
            ]
          });
          prompt2.present();
            break;

          case 'granel':

            let prompt = this.alertCtrl.create({
              title: 'Venta en granel - ' + producto.nombre,
              message: "Ingrese la cantidad igual o inferior a: " + producto.stock,
              inputs: [
                {
                  name: 'producto',
                  placeholder: 'Producto',
                  type: 'hidden',
                  value: producto.id,
                  disabled: true,
                },
                {
                  name: 'cantidad',
                  placeholder: 'Cantidad',
                  type: 'number',
                  min: 0.1,
                  max: producto.stock,


                },
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => {
                    // console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Vender',
                  handler: data => {
                    var precio = data.cantidad * producto.precio;

                    this.items.generarIngreso(this.factura.id, data.cantidad, producto.id, producto.precio).subscribe(resp => {
                      this.obtenerDetalles();
                      this.cbxProducto = '';


                    });
                  }
                }
              ]
            });
            prompt.present();

            break;
        }

      
      }
    })
    addModal.present();
  }

  cobrar() {

    let confirm = this.alertCtrl.create({
      title: 'Imprimir comprobante?',
      buttons: [
        {
          text: 'Imprimir comprobante',
          handler: () => {
            this.comprobante();
          }
        },
        {
          text: 'Sin comprobante',
          handler: () => {
            this.sincomprobante();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
