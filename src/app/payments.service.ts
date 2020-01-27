import { Injectable, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { auth, User } from 'firebase/app';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  stripe = Stripe(environment.stripe.apiKey)
  elements: any
  user: Observable<any>
  api = "https://us-central1-ssr-shopping.cloudfunctions.net/date"
  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient
  ) {
    this.elements = this.stripe.elements()
    this.user = this.auth.authState.pipe(
      switchMap((user: User) => {
        if (user) {
          return this.afs.collection('alpineKnives').doc('customerInfo').collection('accounts').doc(user.uid).valueChanges()
        }
        return of(null)
      })
    )
  }

  signIn() {
    // this.signInWithGoogle()
    this.signInAnonymous()
  }

  async stripeTokenHandler(customerId, token, amount): Promise<any> {
    let createCard = firebase.functions().httpsCallable('createSource')
    return createCard({ stripeId: customerId, token: token })
    .then((cardResp: any) => {
      console.log(cardResp)
      let createCharge = firebase.functions().httpsCallable('createCharge')
      return createCharge({ 
        customer: customerId,
        amount: amount*100,
      })
    })
  }

  async signInWithGoogle() {
    await this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => {
        this.updateUserData(credential.user)
      })
  }

  async signInAnonymous() {
    await this.auth.auth.signInAnonymously()
      .then(credential => {
        this.updateUserData(credential.user)
      })
  }

  async signOut() {
    await this.auth.auth.signOut()
    return this.router.navigate(['/checkout'])
  }



  updateUserData(user) {
    console.log("UPDATE USER")
    const userRef: AngularFirestoreDocument<any> = this.afs.collection('alpineKnives').doc('customerInfo').collection('accounts').doc(user.uid)
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      lastLogin: new Date()
    }
    return userRef.set(data, { merge: true })
  }
}
