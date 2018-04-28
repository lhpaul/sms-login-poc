import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ValidationPage } from '../validation/validation';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }
}
