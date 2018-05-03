import { Component } from '@angular/core';

import { AuthProvider } from '../../providers/auth/auth';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'authenticated.html'
})
export class AuthenticatedPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = SettingsPage;

  constructor(private auth: AuthProvider) {

  }

  ionViewCanEnter() {
    return this.auth.isAuthenticated();
  }

}
