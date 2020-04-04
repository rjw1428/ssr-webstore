import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PaymentsService } from 'src/app/payments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-purchase-form',
  templateUrl: './confirm-purchase-form.component.html',
  styleUrls: ['./confirm-purchase-form.component.scss']
})
export class ConfirmPurchaseFormComponent implements OnInit {
  loading = false
  constructor(
    private fns: AngularFireFunctions,
    private paymentService: PaymentsService,
    public dialogRef: MatDialogRef<ConfirmPurchaseFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  async makePayment() {
    this.loading = true
    try {
      //CREATE FIREBASE USER && GET CREDIT CARD TOKEN
      const user = this.paymentService.signInAnonymous(this.data.form)
      const stripeTokenResult = this.paymentService.stripe.createToken(this.data.card)
      const bulkPromise = await Promise.all([user, stripeTokenResult])
      if (!bulkPromise[0])
        throw "Unable to create user account"
      if (!bulkPromise[1])
        throw "Unable to create stripe token"
      // console.log(bulkPromise)

      //WITH FIREBASE USER ID, CREATE STRIPE ID
      const createStripeCustomer = this.fns.httpsCallable("addStripeCustomer")
      const stripeId = await createStripeCustomer(bulkPromise[0]).toPromise()
      if (!stripeId)
        throw "Unable to create stripe account"
      // console.log(stripeId)

      //WITH STRIPE ID AND TOKEN, CREATE THE PAYMENT SOURCE
      const createCard = this.fns.httpsCallable('createSource')
      const cardResponse = await createCard({ stripeId: stripeId, token: bulkPromise[1].token }).toPromise()
      if (!cardResponse)
        throw "Unable to create stripe payment source"
      // console.log(cardResponse)

      //ONCE SOURCE IS CREATED, CREATE A CHARGE
      const createCharge = this.fns.httpsCallable('createCharge')
      const paymentReponse = await createCharge({ customer: stripeId, amount: this.data.total * 100 }).toPromise()
      if (paymentReponse.status != "succeeded")
        throw "Payment Failed"
      // console.log(paymentReponse)

      //ONCE CHARGE IS SUCCESSFULL, SAVE TO FIREBASE
      const orderId = await this.paymentService.saveOrder(bulkPromise[0], this.data.cart, this.data.total)
      if (!orderId)
        throw "Payment Made, Failure to Save Order"
      this.dialogRef.close(orderId)
      // console.log(orderId)
    }
    catch (err) {
      console.log(err)
      this.loading = false;
      this.snackBar.open("Payment was unable to be processed. No Charge was processed. Please try again.", "OK")
      return err
    }
  }
}
