import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';

import { AuthenticatedPage } from '../pages/authenticated/authenticated';
import { LoginPage } from '../pages/login/login';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  templateUrl: 'app.html'
})
export class  MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = AuthenticatedPage;

  constructor(afs: AngularFirestore, auth: AuthProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    afs.firestore.settings({ timestampsInSnapshots: true });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      auth.user.subscribe((user) => {
        console.log(user);
        if (!user) {
          this.rootPage = LoginPage;
          this.nav.setRoot(LoginPage);
        }
      })
    });
  }
}
