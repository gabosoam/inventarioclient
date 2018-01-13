import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
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
  // Our local settings object
  options: any;
  cbxProducto: any;
  cbxCodigo: any;
  settingsReady = false;

  form: FormGroup;
  formCodigo: FormGroup;

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

  }

  saludar() {
    this.buscador = "nombre";
    let seq = this.items.buscarProductoNombre(this.form.value.name);
    seq.subscribe((res: any) => {

      console.log(res);
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
    });

  }

  buscarNombre(nombre) {
    this.buscador = "nombre";
    let seq = this.items.buscarProductoNombre(nombre);
    seq.subscribe((res: any) => {

      console.log(res);
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
    });

  }

  buscarCodigo() {
    this.buscador = "codigo";
    let seq = this.items.buscarProductoCodigo(this.formCodigo.value.name);
    seq.subscribe((res: any) => {
      console.log('asdasdsa')
      console.log(res);
      this.productos = res;
    }, err => {
      console.error('ERROR', err);
    });

  }

  buscarCodigo2(codigo) {
    let seq = this.items.buscarProductoCodigo(codigo);
    seq.subscribe((res: any) => {
      console.log('asdasdsa')
      console.log(res);
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

  agregarStock(producto) {
    let prompt = this.alertCtrl.create({
      title: producto.nombre,
      message: "Ingresa la cantidad ",
      inputs: [
        {
          name: 'stock',
          placeholder: 'Stock',
          type: 'number',
          min: 0
        },
        {
          name: 'id',
          value: producto.id,
          type: 'hidden',
          
          min: 0
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
           
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            let seq = this.items.modificarStock(data.id, data.stock);

            seq.subscribe(res=>{
              if (this.buscador == "nombre") {
                this.saludar();
              } else if (this.buscador == "codigo") {
                this.buscarCodigo();
              }
            })
          }
        }
      ]
    });
    prompt.present();

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
