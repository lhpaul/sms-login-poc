import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class SmsReceiverServiceMock {
  init() {}

  isSupported() {
    return true;
  }

  listenForAuthorizationSMS() {
    return Observable.of('123456');
  }

  stopListiningForAuthorization() {
    return Observable.of();
  }

}