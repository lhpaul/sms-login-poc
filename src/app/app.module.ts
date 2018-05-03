import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { environment } from '../environments/environment';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AboutPage } from '../pages/about/about';
import { AuthenticatedPage } from '../pages/authenticated/authenticated';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { ValidationPage } from '../pages/validation/validation';

import { AuthProvider } from '../providers/auth/auth';
import { SmsReceiverProvider } from '../providers/sms-receiver/sms-receiver';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AuthenticatedPage,
    HomePage,
    LoginPage,
    SettingsPage,
    ValidationPage
  ],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AuthenticatedPage,
    HomePage,
    LoginPage,
    SettingsPage,
    ValidationPage
  ],
  providers: [
    AuthProvider,
    SmsReceiverProvider,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
