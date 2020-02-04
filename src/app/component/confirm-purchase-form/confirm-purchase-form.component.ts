import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PaymentsService } from 'src/app/payments.service';

@Component({
  selector: 'app-confirm-purchase-form',
  templateUrl: './confirm-purchase-form.component.html',
  styleUrls: ['./confirm-purchase-form.component.scss']
})
export class ConfirmPurchaseFormComponent implements OnInit {

  constructor(
    private fns: AngularFireFunctions,
    private paymentService: PaymentsService,
    public dialogRef: MatDialogRef<ConfirmPurchaseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    let user = this.data.user
    let card = this.data.card
    const createStripeCustomer = this.fns.httpsCallable("addStripeCustomer")
    createStripeCustomer(user).toPromise()
      .then(stripeId => {
        console.log(stripeId)
        this.paymentService.stripe.createToken(card)
          .then(result => {
            console.log(result.token)
            let createCard = this.fns.httpsCallable('createSource')
            createCard({ stripeId: stripeId, token: result.token }).toPromise()
              .then(cardResp => {
                console.log(cardResp)
                return user['stripeId'] = stripeId
              })
              .catch(err => console.log("Unable to save card"))
          })
          .catch(err => console.log("Stripe token unable to be made"))
      })
      .catch(err => console.log("Unable to create stripe Id"))
  }


  makePayment() {
    let stripeId = this.data.user['stripeId']
    let createCharge = this.fns.httpsCallable('createCharge')
    createCharge({
      customer: stripeId,
      amount: this.data.total * 100,
    })
      .toPromise()
      .then(paymentReponse => {
        console.log(paymentReponse.status)
        if (paymentReponse.status == "succeeded") {
          this.paymentService.saveOrder(this.data.user, this.data.cart, this.data.total)
          this.dialogRef.close(true)
        }
      })
      .catch(err => console.log("Unable to make the payment"))
  }
}
