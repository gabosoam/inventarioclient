import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  settingsReady = false;

  form: FormGroup;

  productos: any;


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
    public items: Items) {

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

  }

  saludar() {
    let seq = this.items.buscarProductoNombre(this.form.value.name);
    seq.subscribe((res: any) => {
      this.productos=res;
    }, err => {
      console.error('ERROR', err);
    });

  }








}
