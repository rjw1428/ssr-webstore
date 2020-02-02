import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnterItemPopupComponent } from '../item/enter-item-popup/enter-item-popup.component';
import { PaymentsService } from 'src/app/payments.service';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  elements: any;
  checkoutForm: FormGroup
  cardForm: any
  user: Observable<any>
  elementStyles = {
    base: {
      fontSize: '18px'
    },
  };
  totalPrice: number
  @ViewChild('card', { static: true }) card: ElementRef
  constructor(
    private fns: AngularFireFunctions,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private paymentService: PaymentsService,
    public dialogRef: MatDialogRef<EnterItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public cart
  ) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    })
    this.elements = this.paymentService.stripe.elements()
    this.totalPrice = this.cart.length > 0 ? this.cart
      .map(item => item.price)
      .reduce((acc: number, curr) => acc += curr) : 0

    // const x=this.fns.httpsCallable('test')
    // let doc=x({uid:"k9IGk8IoIUYDvCHJX7Lg82ztGx73"})
    // doc.toPromise().then(doc=>
    //   console.log(doc)
    // )
  }

  ngAfterViewInit() {
    //CREAT THE CARD FORM
    this.cardForm = this.elements.create('card', {
      style: this.elementStyles
    })
    this.cardForm.mount(this.card.nativeElement)
  }

  triggerPayment() {
    // CREATE ANONYMOUS USER
    this.paymentService.signInAnonymous(this.checkoutForm.value)
      .then(user => {
        console.log(user)
        const createStripeCustomer = this.fns.httpsCallable("addStripeCustomer")
        createStripeCustomer(user).toPromise()
          .then(stripeId => {
            console.log(stripeId)
            this.paymentService.stripe.createToken(this.cardForm)
              .then(result => {
                console.log(result.token)
                let createCard = this.fns.httpsCallable('createSource')
                createCard({ stripeId: stripeId, token: result.token }).toPromise()
                  .then(cardResp => {
                    console.log(cardResp)
                    let createCharge = this.fns.httpsCallable('createCharge')
                    createCharge({
                      customer: stripeId,
                      amount: this.totalPrice * 100,
                    }).toPromise()
                      .then(paymentReponse => {
                        console.log(paymentReponse.status)
                        if (paymentReponse.status == "succeeded") {
                          this.paymentService.saveOrder(user.uid, this.cart, this.totalPrice)
                          this.dialogRef.close(true)
                        }
                      })
                      .catch(err => console.log("Unable to make the payment"))
                  })
                  .catch(err => console.log("Unable to save card"))
              })
              .catch(err => console.log("Stripe token unable to be made"))
          })
          .catch(err => console.log("Unable to create stripe Id"))
      })
      .catch(err => console.log("Unable to create user"))
  }
}
