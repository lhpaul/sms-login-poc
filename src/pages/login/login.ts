import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { ValidationPage } from '../validation/validation';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public form: FormGroup;

  public error: any;
  constructor(private auth: AuthProvider, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private navCtrl: NavController) {
    this.form = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]]
    });
  }

  sendOtp() {
    const loading = this.loadingCtrl.create({ content: 'Enviando SMS...' });
    loading.present();
    this.auth.sendOtp(this.form.value.phoneNumber)
    .then((credential: any) => {
      this.navCtrl.push(ValidationPage, { verificationId: credential.verificationId });
      loading.dismiss();
    }).catch((error) => {
      this.error = error;
      loading.dismiss();
    });
  }
}
