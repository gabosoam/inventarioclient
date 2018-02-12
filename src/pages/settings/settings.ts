import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Items } from '../../providers/providers';

import { Settings } from '../../providers/providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  marcas: any;
  // Our local settings object
  options: any;
  cbxProducto: any;
  cbxCodigo: any;
  settingsReady = false;
  categorias: any;
  filtro: any
  filtroCategoria: any
  filtroMarca: any
  resultado: any

  form: FormGroup;
  formCodigo: FormGroup;
  codigo: any;
  productos: any;

  buscador: String;


  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public alertCtrl: AlertController,

    public modalCtrl: ModalController,
    public items: Items) {

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

    this.formCodigo = formBuilder.group({
      name: ['', Validators.required]
    });
    this.filtro = '';
    this.filtroCategoria = '';
    this.filtroMarca = '';
    this.resultado='Realice una búsqueda'

    this.cargarCategorias();
    this.cargarMarcas();

  }


  filtrar() {

    switch (this.filtro) {
      case '':

        break;

      case "1":


        this.cargarCero();
        break;

      case "2":
        alert('caso 2');
        break;

      case "3":
        this.todosProductos();
        break;

      case "4":
        this.productosSinPrecio();
        break;

      default:
        break;
    }
  }

  cargarCategorias() {
    let seq = this.items.obtenerCategorias();
    seq.subscribe(res => {
      this.categorias = res;
    })
  }

  cargarMarcas() {
    let seq = this.items.obtenerMarcas();
    seq.subscribe(res => {
      this.marcas = res;
    })
  }


  crearProducto() {
    //  let addModal = this.modalCtrl.create('ItemCreatePage');
    let addModal = this.modalCtrl.create('SearchPage');
    addModal.onDidDismiss(producto => {
      if (producto) {

        this.codigo = producto.codigo
        this.buscarCodigo2(producto.codigo);

      }
    })
    addModal.present();
  }

  cargarCero() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();


    let seq = this.items.obtenerProductosEnCero();

    seq.subscribe((res: any) => {


      this.productos = res;
      this.resultado= res.length+" resultado(s)"
      loader.dismiss();
    })
  }

  cargarPorCategoria() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();


    let seq = this.items.obtenerPorCategoria(this.filtroCategoria);

    seq.subscribe((res: any) => {

      this.resultado= res.length+" resultado(s)"
      this.productos = res;
      loader.dismiss();
    })
  }

  cargarPorMarca() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();


    let seq = this.items.obtenerPorMarca(this.filtroMarca);

    seq.subscribe((res: any) => {

      this.resultado= res.length+" resultado(s)"
      this.productos = res;
      loader.dismiss();
    })
  }

  
  saludar() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();

    this.buscador = "nombre";
    let seq = this.items.buscarProductoNombre(this.form.value.name);
    seq.subscribe((res: any) => {

      this.resultado= res.length+" resultado(s)"
      this.productos = res;
      loader.dismiss();
    }, err => {
      loader.dismiss();
      console.error('ERROR', err);
    });

  }

  todosProductos() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();

    let seq = this.items.todosProductos();

    seq.subscribe((res: any) => {
      this.resultado= res.length+" resultado(s)"
      this.productos = res;
      loader.dismiss();
    })
  }

  productosSinPrecio() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();

    let seq = this.items.precioCero();

    seq.subscribe((res:any) => {
      this.resultado= res.length+" resultado(s)"
      this.productos = res;
      loader.dismiss();
    })
  }

  buscarCodigo() {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor.",
    });
    loader.present();
    this.buscador = "codigo";
    let seq = this.items.buscarProductoCodigo(this.formCodigo.value.name);
    seq.subscribe((res: any) => {
      this.resultado= res.length+" resultado(s)"
      loader.dismiss();
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
      loader.dismiss();
    });

  }


  buscarNombre(nombre) {
    this.buscador = "nombre";
    let seq = this.items.buscarProductoNombre(nombre);
    seq.subscribe((res: any) => {

      this.resultado= res.length+" resultado(s)"
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
    });

  }


  buscarCodigo2(codigo) {
    this.buscador = "codigo";
    let seq = this.items.buscarProductoCodigo(codigo);
    seq.subscribe((res: any) => {

      this.resultado= res.length+" resultado(s)"
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
    });

  }

  modificarItem(producto) {


    //  let addModal = this.modalCtrl.create('ItemCreatePage');
    let addModal = this.modalCtrl.create('ItemCreatePage', { producto: producto });
    addModal.onDidDismiss(producto => {
      if (producto) {
        let seq = this.items.modificarProducto(producto.id, producto);

        seq.subscribe((res: any) => {
       

          if (res) {
            this.buscarCodigo2(res.codigo);
          }




        })
      }
    })
    addModal.present();
  }



  listarPrecios(producto) {
    //  let addModal = this.modalCtrl.create('ItemCreatePage');
    let addModal = this.modalCtrl.create('PrecioPage', { producto: producto });
    addModal.onDidDismiss(producto => {
      if (producto) {
        let seq = this.items.modificarProducto(producto.id, producto);

        seq.subscribe(res => {


        })
      }
    })
    addModal.present();
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

  agregarStock(producto) {
    //  let addModal = this.modalCtrl.create('ItemCreatePage');
    let addModal = this.modalCtrl.create('StockPage', { producto: producto });
    addModal.onDidDismiss(data => {

      if (data) {

        let seq = this.items.modificarStock(data.id, data.stock);

        seq.subscribe(res => {
          if (this.buscador == "nombre") {
            this.saludar();
          } else if (this.buscador == "codigo") {
            this.buscarCodigo();
          }
        })

      }
    })
    addModal.present();


  }

  desactivarItem(producto) {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar este producto?',
      message: 'Está seguro que desea continuar?',
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
            if (producto) {
              let seq = this.items.modificarProducto(producto.id, { estado: 0 });

              seq.subscribe(res => {


                if (this.buscador == "nombre") {
                  this.saludar();
                } else if (this.buscador == "codigo") {
                  this.buscarCodigo();

                }



              })
            }

          }
        }
      ]
    });
    confirm.present();




  }







}
