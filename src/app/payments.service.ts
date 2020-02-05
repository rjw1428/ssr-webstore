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

  saveOrder(user: any, cart: Item[], amount: number) {
    return this.afs.collection('alpineKnives').doc("orders").collection("orders").add({
      user: user,
      amount: amount,
      items: cart,
      status: "New",
      dateCreated: new Date(),
      active: true,
      notes: ""
    }).then(ref => {
      this.afs.collection('alpineKnives').doc("orders").collection("orders").doc(ref.id)
        .set({ id: ref.id }, { merge: true })
      return ref.id
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
