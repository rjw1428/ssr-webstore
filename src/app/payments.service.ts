import { Injectable, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { auth, User } from 'firebase/app';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Item } from './models/item';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  stripe = Stripe(environment.stripe.apiKey)
  elements: any
  api = "https://us-central1-ssr-shopping.cloudfunctions.net/date"
  constructor(
    private fns: AngularFireFunctions,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,
  ) {
    this.elements = this.stripe.elements()
  }

  // stripePaymentHandler(user, token, cart, amount) {
  //   console.log(user)
  //     let createCard = this.fns.httpsCallable('createSource')
  //     createCard({ stripeId: user.stripeCustomerId, token: token })
  //     .toPromise()
  //     .then((cardResp: any) => {
  //       console.log(cardResp)
  //       let createCharge = this.fns.httpsCallable('createCharge')
  //       let charge = createCharge({
  //         customer: user.stripeCustomerId,
  //         amount: amount * 100,
  //       })
  //       return charge.toPromise()
  //       .then(resp => {
  //         this.afs.collection('alpineKnives').doc('orders').collection('orders').add({
  //           account: user.uid,
  //           amount: amount,
  //         })
  //         return resp.data.status
  //       })
  //     })
  // }

  saveOrder(userId: string, cart: Item[], amount: number) {
    this.afs.collection('alpineKnives').doc("orders").collection("orders").add({
      user: userId,
      amount: amount,
      items: cart.map(item=>item.id),
      status: "New",
      dateCreated: new Date()
    })
  }

  async signInWithGoogle() {
    await this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => {
        this.updateUserData(credential.user)
      })
  }

  async signInAnonymous(userData) {
    return await this.auth.auth.signInAnonymously()
      .then(credential => {
        userData['uid'] = credential.user.uid
        this.updateUserData(userData)
        return userData
      })
  }

  async signOut() {
    await this.auth.auth.signOut()
    return this.router.navigate(['/checkout'])
  }

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.collection('alpineKnives').doc('customerInfo').collection('accounts').doc(user.uid)
    const data = {
      uid: user.uid,
      email: user.email,
      name: {
        firstName: user.firstName,
        lastName: user.lastName
      },
      address: {
        street: user.street,
        city: user.city,
        state: user.state,
        zip: user.zip
      },
      lastLogin: new Date()
    }
    return userRef.set(data, { merge: true })
  }
}
