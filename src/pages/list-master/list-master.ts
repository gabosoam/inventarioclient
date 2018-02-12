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

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(document.getElementById('boleta').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;

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



    this.items.buscarProductoCodigo(this.form.value.name).subscribe((resultado: any) => {
      if (resultado.length > 0) {

        //  let addModal = this.modalCtrl.create('ItemCreatePage');
        let addModal = this.modalCtrl.create('CantidadPage', { producto: { id: resultado[0].id } });
        addModal.onDidDismiss(data => {
          if (data) {
            var detalle = {
              factura: this.factura.id,
              cantidad: data.cantidad,
              producto: resultado[0].id,
              precio: data.precio.precio,
              unidad: data.precio.unidad.nombre,
              reducir: data.cantidad/data.precio.tamano
            }
            

            if (data.cantidad/data.precio.tamano>resultado[0].stock) {
      
              let confirm = this.alertCtrl.create({
                title: 'Atención!',
                message: 'Tienes menos stock del solicitado. Deseas continuar?',
                buttons: [
                  {
                    text: 'Cancelar',
                    handler: () => {
                      console.log('Disagree clicked');
                    }
                  },
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.items.generarIngreso(detalle).subscribe((res: any) => {

                        this.obtenerDetalles()
                      })
                    }
                  }
                ]
              });
              confirm.present();
            } else {
              this.items.generarIngreso(detalle).subscribe((res: any) => {

                this.obtenerDetalles()
              })
            }


           
          }


        })
        addModal.present();
      } else {
        alert('No existe el código ingresado')
      }
    })




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
        let addModal = this.modalCtrl.create('CantidadPage', { producto: { id: producto.id } });
        addModal.onDidDismiss(data => {
          if (data) {
            var detalle = {
              factura: this.factura.id,
              cantidad: data.cantidad,
              producto: producto.id,
              precio: data.precio.precio,
              unidad: data.precio.unidad.nombre,
              reducir: data.cantidad/data.precio.tamano
            }

            this.items.generarIngreso(detalle).subscribe((res: any) => {

              this.obtenerDetalles()
            })
          }


        })
        addModal.present();

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
