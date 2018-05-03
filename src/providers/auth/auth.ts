import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

interface User {
  uid: string;
  phoneNumber: string;
}


@Injectable()
export class AuthProvider {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {

      this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })

  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
    }

    return userRef.set(data, { merge: true });

  }

  isAuthenticated(): Promise<boolean> {
    return this.user
           .take(1)
           .map(user => !!user)
           .toPromise();
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  sendOtp(phoneNumber: string) {
    return new Promise((resolve, reject) => {
      window['FirebasePlugin'].verifyPhoneNumber(phoneNumber, 120, resolve, reject);
    });
  }

  validateOtp(verificationId: string, code: string) {
    let sigInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    return firebase.auth().signInWithCredential(sigInCredential)
    .then((credentials) => {
      console.log(credentials);
      return this.updateUserData(credentials);
    });
  }
}