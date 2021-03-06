import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

import { Api } from '../../providers/api/api';
import {User  } from '../../providers/user/user';

@Injectable()
export class Items {
  items: Item[] = [];

  factura: any;

  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };


  constructor(public api: Api, public usuario: User) {
    let items = [
      {
        "name": "Burt Bear",
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "Burt is a Bear."
      },
      {
        "name": "Charlie Cheetah",
        "profilePic": "assets/img/speakers/cheetah.jpg",
        "about": "Charlie is a Cheetah."
      },
      {
        "name": "Donald Duck",
        "profilePic": "assets/img/speakers/duck.jpg",
        "about": "Donald is a Duck."
      },
      {
        "name": "Eva Eagle",
        "profilePic": "assets/img/speakers/eagle.jpg",
        "about": "Eva is an Eagle."
      },
      {
        "name": "Ellie Elephant",
        "profilePic": "assets/img/speakers/elephant.jpg",
        "about": "Ellie is an Elephant."
      },
      {
        "name": "Molly Mouse",
        "profilePic": "assets/img/speakers/mouse.jpg",
        "about": "Molly is a Mouse."
      },
      {
        "name": "Paul Puppy",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "about": "Paul is a Puppy."
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }


  borrarProductoDetalle(detalle) {
    let seq = this.api.delete('detalle/' + detalle).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        console.log(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  buscarProductoNombre(nombre) {
    let seq = this.api.get('producto?where={"nombre":{"contains":"'+nombre+'"},"estado":{"contains":"1"}}').share();
    

    return seq;

  }

  cargarEnCero(){
    let seq = this.api.get('producto/acabados').share();
    

    return seq;
    
  }

  buscarProductoCodigo(codigo) {
    let seq = this.api.get('producto?codigo='+codigo+'&estado=1').share();
    

    return seq;

  }

  todosProductos(){
    let seq = this.api.get('producto').share();
    
    return seq;
  }

  obtenerMarcas() {
    let seq = this.api.get('marca?sort=nombre asc').share();
    
    return seq;
  }

  obtenerFacturas() {
    let seq = this.api.get('factura/todas').share();
    
    return seq;
  }

  obtenerFacturasHoy() {
    let seq = this.api.get('factura/deldia').share();
    
    return seq;
  }

  obtenerFacturasSemana() {
    let seq = this.api.get('factura/delasemana').share();
    
    return seq;
  }

  obtenerFacturasMes() {
    let seq = this.api.get('factura/delmes').share();
    
    return seq;
  }

  

obtenerProductosEnCero(){
  let seq = this.api.get('producto?stock=0 ').share();
    
    return seq;
}

obtenerPorCategoria(categoria){
  let seq = this.api.get('producto?categoria= '+categoria).share();
    
    return seq;
}

obtenerPorMarca(marca){
  let seq = this.api.get('producto?marca= '+marca).share();
    
    return seq;
}

precioCero(){
  let seq = this.api.get('producto?precio=0 ').share();
    
    return seq;
}

  obtenerPrecio(precio){
    let seq = this.api.get('precio/'+precio).share();
    return seq;
  }


  obtenerGranel() {


    let seq = this.api.get('marca?sort=nombre&limit=300').share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        console.log(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  obtenerCategorias() {

    let seq = this.api.get('categoria?sort=nombre asc').share();

  
    return seq;

  }

  obtenerUnidades() {

    let seq = this.api.get('unidad?sort=nombre').share();

  
    return seq;

  }

  obtenerProducto(codigo) {

    let seq = this.api.get('producto?codigo=' + codigo.name).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        console.log(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  

  obtenerDetalles(factura) {

    let seq = this.api.get('detalle/obtenerdetalle?factura=' + factura).share();

    seq.subscribe((res: any) => {
      console.log('yes yes');
      console.log(res)
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        console.log(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  crearFactura() {


    let seq = this.api.post('factura', {usuario: this.usuario._user.id.nombre}).share();

    seq.subscribe((res: any) => {
      this.ingfactura(res);
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {


      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  crearProducto(producto) {
    let seq = this.api.post('producto', producto).share();
    return seq;
  }
  

  modificarProducto(id,body) {
    let seq = this.api.put('producto/'+id, body).share();
    return seq;
  }

  modificarStock(id,stock) {
    let seq = this.api.get('producto/modificarstock?id='+id+'&stock='+stock).share();
    return seq;
  }

  buscarProducto(codigo) {
    let seq = this.api.get('lista?codigo='+codigo).share();

   

    return seq;
  }

  modificarCliente(cliente, factura) {
    let seq = this.api.put('factura/' + factura, { cliente: cliente }).share();

    seq.subscribe((res: any) => {
      this.ingfactura(res);
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {


      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  modificarPrecio(precio) {
    let seq = this.api.put('precio/'+precio.id,precio).share();


    return seq;
  }

  agregarPrecio(precio) {
    let seq = this.api.post('precio',precio).share();


    return seq;
  }

  eliminarPrecio(precio) {
    let seq = this.api.delete('precio/'+precio,).share();


    return seq;
  }

  obtenerPrecios(producto) {
    let seq = this.api.get('precio?producto='+producto).share();

    

    return seq;
  }

  generarIngreso(detalle) {
    let seq = this.api.post('detalle/', detalle).share();

    seq.subscribe((res: any) => {
      this.ingfactura(res);
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {


      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ingfactura(factura) {

    this.factura = factura;

  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
