import { Component } from '@angular/core';

/**
 * Generated class for the FacturaCobrarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'factura-cobrar',
  templateUrl: 'factura-cobrar.html'
})
export class FacturaCobrarComponent {

  text: string;

  constructor() {
    console.log('Hello FacturaCobrarComponent Component');
    this.text = 'Hello World';
  }

}
