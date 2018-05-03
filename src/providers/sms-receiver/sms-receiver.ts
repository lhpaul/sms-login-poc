import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var SmsReceiver: any;
declare var cordova: any;

@Injectable()
export class SmsReceiverService {
  supported: boolean = false;
  listener: Observable<string>;
  constructor(
  ) {}

  init(): void {
    const permissions = typeof cordova !== 'undefined' ? cordova.plugins.permissions : undefined;
    if (permissions) {
      const onPermission = () => {
        SmsReceiver.isSupported((supported) => {
          this.supported = supported;
        });
      };
      permissions.checkPermission(permissions.RECEIVE_SMS, ( status ) => {
        if (status.hasPermission ) {
          onPermission();
        }
        else {
          permissions.requestPermission(permissions.RECEIVE_SMS,
            onPermission,
            (error) => {
              console.log(error);
            });
        }
      });
    }
  }

  isSupported(): boolean {
    return this.supported;
  }

  listenForAuthorizationSMS(): Observable<string> {
    return new Observable(observer => {
      if (!this.supported) {
        observer.error('Not Supported!');
        return;
      }
      SmsReceiver.startReception(({messageBody, originatingAddress}) => {
        const startIndex = messageBody.indexOf('Clave es ');
        if (startIndex > 1) {
          observer.next(messageBody.substr(startIndex + 9 , 6));
        }
      }, () => {
        observer.error('Error while receiving messages');
      });
      return;
    });
  }

  stopListiningForAuthorization(): Observable<string> {
    return new Observable(observer => {
      SmsReceiver.stopReception(() => {
        observer.next();
      }, () => {
        observer.error('Error while stopping the SMS receiver');
      });
      return;
    });
  }
}
