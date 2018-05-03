Followed instructions from this [video](https://www.youtube.com/watch?v=3tlSUMsEqAA).

### 1. Install AngularFire, Firebase and Firebase Cordova Plugin

```bash
npm install angularfire2 firebase --save
ionic cordova plugin add cordova-plugin-firebase --save
```

Now that you have a new project setup, install AngularFire and Firebase from npm.

### 2. Add Firebase config to environments variable

Open `/src/environments/environment.ts` and add your Firebase configuration. You can find your project configuration in [the Firebase Console](https://console.firebase.google.com). From the project overview page, click **Add Firebase to your web app**.

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
  }
};
```

### 3. Setup @NgModule for the AngularFireModule

Open `/src/app/app.module.ts`, inject the Firebase providers, and specify your Firebase configuration.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

#### Custom FirebaseApp Names
You can optionally provide a custom FirebaseApp name with `initializeApp`.

```ts
@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'my-app-name')
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

### 4. Add Android Permissions and Sms Receiver plugin for automatically reading SMS OTP
```bash
ionic cordova plugin add cordova-plugin-sms-receiver --save
ionic cordova plugin add cordova-plugin-android-permissions
```

### 5. Create SmsReceiverProvider
```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var SmsReceiver: any;
declare var cordova: any;

interface SmsMessage {
  messageBody: string;
  originatingAddress: string;
}

@Injectable()
export class SmsReceiverProvider {
  supported: boolean = false;
  listener: Observable<SmsMessage>;
  constructor(
  ) { }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const permissions = typeof cordova !== 'undefined' ? cordova.plugins.permissions : undefined;
      if (!permissions) {
        resolve(false);
        return;
      }
      const onError = (error) => {
        console.log(error);
        reject(error);
      };
      const onPermission = () => {
        SmsReceiver.isSupported((supported) => {
          this.supported = supported;
          resolve(supported);
        }, onError);
      };
      permissions.checkPermission(permissions.RECEIVE_SMS, (status) => {
        if (status.hasPermission) {
          onPermission();
        }
        else {
          permissions.requestPermission(permissions.RECEIVE_SMS,
            onPermission,
            onError);
        }
      }, onError);

    });
  }

  isSupported(): boolean {
    return this.supported;
  }

  listenForSMS(): Observable<SmsMessage> {
    if (!this.listener) {
      this.listener = new Observable(observer => {
        if (!this.supported) {
          observer.error('Not Supported!');
          observer.complete();
          return;
        }
        SmsReceiver.startReception(({ messageBody, originatingAddress }) => {
          observer.next({messageBody, originatingAddress });
        }, (error) => {
          console.log(error);
          observer.error('Error while receiving messages');
        });
        return;
      });
    }
    return this.listener;
  }

  stopListining(): Promise<void> {
    return new Promise((resolve, reject) => {
      SmsReceiver.stopReception(() => {
        resolve();
      }, (error) => {
        console.log(error);
        reject('Error while stopping the SMS receiver');
      });
      this.listener = null;
      return;
    });
  }
}
```
### 5. Add SmsReceiverProvider to you app module
```ts
import { SmsReceiverProvider } from '../providers/sms-receiver/sms-receiver';
...

@NgModule({
  ...
  providers: [
    AuthProvider,
    SmsReceiverProvider,
    SplashScreen,
    StatusBar,
    ...
  ]
```

