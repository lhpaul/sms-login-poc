import { Component } from '@angular/core';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(private auth: AuthProvider) {

  }

  logout() {
    this.auth.signOut();
  }

}
