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
