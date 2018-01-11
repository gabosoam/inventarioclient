import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  producto: any;
  marcas: any;
  categorias: any;

  form: FormGroup;

  constructor(public navCtrl: NavController,
    navParams: NavParams,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    public items: Items,
  ) {

    this.obtenerMarcas();
    this.obtenerCategorias();

    this.producto = navParams.get('producto');
    this.form = formBuilder.group({
      id: [this.producto.id, Validators.required],
      codigo: [this.producto.codigo, Validators.required],
      nombre: [this.producto.nombre, Validators.required],
      precio: [this.producto.precio, Validators.required],
      estado: [this.producto.estado, Validators.required],
      tipo: [this.producto.tipo, Validators.required],
      marca: [this.producto.marca.id, Validators.required],
      categoria: [this.producto.categoria.id, Validators.required],
      minimo: [this.producto.minimo, Validators.required],
      unidad: [this.producto.unidad, Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

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

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}
