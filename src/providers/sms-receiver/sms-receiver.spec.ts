import 'jasmine';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { SmsReceiverService } from './';

describe('SmsReceiverService', () => {

  let smsReceiverService: SmsReceiverService = null;
  let SmsReceiver: any;
  let cordova: any;

  beforeEach(() => {
    smsReceiverService = new SmsReceiverService();
    SmsReceiver = {
      isSupported: (succes, error) => {},
      startReception: (succes, error) => {},
      stopReception: (succes, error) => {}
    };
    cordova = {
      plugins: {
        permissions: {
          hasPermission: (succes, error) => {}
        }
      }
    };
  });

  it('initialises', () => {
    expect(smsReceiverService).not.toBeNull();
  });

  it('init and isSupported', () => {

    beforeEach(() => {
      SmsReceiver = {
        isSupported: (succes, error) => {},
        startReception: (succes, error) => {},
        stopReception: (succes, error) => {}
      };
      cordova = {
        plugins: {
          permissions: {
            hasPermission: (succes, error) => {}
          }
        }
      };
    });

    it('should return that is not supported when doing init and cordova is not defined', () => {
      cordova = undefined;
      smsReceiverService.init();
      expect(smsReceiverService.isSupported()).toBe(false);
    });

    it('should return that is not supported when there is no permission for reading SMS and the user refuses to grant permission', () => {
      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((succes, error) => {
        hasPermissionFunction = succes;
      });

      let requestPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'requestPermission')
      .and.callFake((succes, error) => {
        requestPermissionFunction = succes;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: false});
      requestPermissionFunction(false);

      expect(smsReceiverService.isSupported()).toBe(false);

    });

    it('should return that is supported when there is no permission for reading SMS and the user grants permission', () => {

      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((succes, error) => {
        hasPermissionFunction = succes;
      });

      let requestPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'requestPermission')
      .and.callFake((succes, error) => {
        requestPermissionFunction = succes;
      });

      let isSupportedFunction = null;
      spyOn(SmsReceiver, 'isSupported')
      .and.callFake((succes, error) => {
        isSupportedFunction = succes;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: false});
      requestPermissionFunction(true);
      isSupportedFunction(true);

      expect(smsReceiverService.isSupported()).toBe(true);

    });

    it('should return that is supported when there is permission for reading SMS', () => {

      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((succes, error) => {
        hasPermissionFunction = succes;
      });

      let isSupportedFunction = null;
      spyOn(SmsReceiver, 'isSupported')
      .and.callFake((succes, error) => {
        isSupportedFunction = succes;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: true});
      isSupportedFunction(true);

      expect(smsReceiverService.isSupported()).toBe(true);

    });
  });

  it('listenForAuthorizationSMS', () => {

    it('should throw error when not supported', () => {

      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((succes, error) => {
        hasPermissionFunction = succes;
      });

      let requestPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'requestPermission')
      .and.callFake((succes, error) => {
        requestPermissionFunction = succes;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: false});
      requestPermissionFunction(false);

      const successFunction = () => {};
      const errorFunction = () => {};
      smsReceiverService.listenForAuthorizationSMS().subscribe(successFunction, errorFunction, () => {
        expect(successFunction).not.toHaveBeenCalled();
        expect(errorFunction).toHaveBeenCalled();
      });

    });

    it('should return authorization code when SMS is received', () => {
      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((succes, error) => {
        hasPermissionFunction = succes;
      });

      let isSupportedFunction = null;
      spyOn(SmsReceiver, 'isSupported')
      .and.callFake((succes, error) => {
        isSupportedFunction = succes;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: true});
      isSupportedFunction(true);

      let startReceptionFunction = null;
      spyOn(SmsReceiver, 'startReception')
      .and.callFake((succes, error) => {
        startReceptionFunction = succes;
      });

      const errorFunction = () => {};
      SmsReceiver.startReception((code) => {
        expect(code).toBe('525549');
      },errorFunction,
      () => {
        expect(errorFunction).not.toHaveBeenCalled();
      });

      startReceptionFunction('Estimado Cliente, Su Tercera Clave es 525549, ingresela para finalizar su operacion. Recuerde que nunca lo llamaremos para pedirle una clave.', null);

    });

    it('should not do anything when SMS is received but is not the one we are specting', () => {

      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((success, error) => {
        hasPermissionFunction = success;
      });

      let isSupportedFunction = null;
      spyOn(SmsReceiver, 'isSupported')
      .and.callFake((success, error) => {
        isSupportedFunction = success;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: true});
      isSupportedFunction(true);

      let startReceptionFunction = null;
      spyOn(SmsReceiver, 'startReception')
      .and.callFake((success, error) => {
        startReceptionFunction = success;
      });

      const errorFunction = () => {};
      const succesFunction = () => {};
      SmsReceiver.startReception(succesFunction,errorFunction,
      () => {
        expect(succesFunction).not.toHaveBeenCalled();
        expect(errorFunction).not.toHaveBeenCalled();
      });

      startReceptionFunction('Something else', null);

    });

    it('should throw error when there is a problem with listening to SMS entrance', () => {

      let hasPermissionFunction = null;
      spyOn(cordova.plugins.permissions, 'hasPermission')
      .and.callFake((success, error) => {
        hasPermissionFunction = success;
      });

      let isSupportedFunction = null;
      spyOn(SmsReceiver, 'isSupported')
      .and.callFake((success, error) => {
        isSupportedFunction = success;
      });

      smsReceiverService.init();

      hasPermissionFunction({hasPermission: true});
      isSupportedFunction(true);

      let startReceptionFunction = null;
      spyOn(SmsReceiver, 'startReception')
      .and.callFake((success, error) => {
        startReceptionFunction = error;
      });

      const errorFunction = () => {};
      const succesFunction = () => {};
      SmsReceiver.startReception(succesFunction,errorFunction,
      () => {
        expect(succesFunction).not.toHaveBeenCalled();
        expect(errorFunction).toHaveBeenCalled();
      });

      startReceptionFunction();

    });

  });

  it('stopListiningForAuthorization', () => {

    it('should throw error when there is a problem with stoping the listener', () => {

      let stopReceptionFunction = null;
      spyOn(SmsReceiver, 'startReception')
      .and.callFake((success, error) => {
        stopReceptionFunction = error;
      });

      const errorFunction = () => {};
      const succesFunction = () => {};
      SmsReceiver.stopReception(succesFunction,errorFunction,
      () => {
        expect(succesFunction).not.toHaveBeenCalled();
        expect(errorFunction).toHaveBeenCalled();
      });

      stopReceptionFunction();

    });

    it('should call success when the listener is stopped correctly', () => {

      let stopReceptionFunction = null;
      spyOn(SmsReceiver, 'startReception')
      .and.callFake((success, error) => {
        stopReceptionFunction = success;
      });

      const errorFunction = () => {};
      const succesFunction = () => {};
      SmsReceiver.stopReception(succesFunction,errorFunction,
      () => {
        expect(succesFunction).toHaveBeenCalled();
        expect(errorFunction).not.toHaveBeenCalled();
      });

      stopReceptionFunction();

    });

  });

});