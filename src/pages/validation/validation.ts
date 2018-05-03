import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { AuthenticatedPage } from '../authenticated/authenticated';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-validation',
  templateUrl: 'validation.html'
})
export class ValidationPage {

  private verificationId: string;

  public form: FormGroup;
  public error: any;

  constructor(private auth: AuthProvider, private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams) {
    this.verificationId = this.navParams.get('verificationId');
    if (!this.verificationId) {
      this.navCtrl.setRoot(LoginPage);
    }
    this.form = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  validate() {
    const loading = this.loadingCtrl.create({ content: 'Validating...' });
    loading.present();
    this.auth.validateOtp(this.verificationId, this.form.value.code)
    .then(() => {
      this.navCtrl.setRoot(AuthenticatedPage);
      loading.dismiss();
    })
    .catch((error) => {
      this.error = error;
      loading.dismiss();
    });
  }
}
