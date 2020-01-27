import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnterItemPopupComponent } from '../item/enter-item-popup/enter-item-popup.component';
import { PaymentsService } from 'src/app/payments.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  elements: any;
  cardForm: any
  user: Observable<any>
  elementStyles = {
    base: {
      lineHeight: '1.5',
      fontSize: '18px'
      //   color: '#32325D',
      //   fontWeight: 500,
      //   fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
      //   fontSize: '16px',
      //   fontSmoothing: 'antialiased',

      //   '::placeholder': {
      //     color: '#CFD7DF',
      //   },
      //   ':-webkit-autofill': {
      //     color: '#e39f48',
      //   },
      // },
      // invalid: {
      //   color: '#E25950',

      //   '::placeholder': {
      //     color: '#FFCCA5',
      //   },
    },
  };
  @ViewChild('card', { static: true }) card: ElementRef
  constructor(
    private paymentService: PaymentsService,
    public dialogRef: MatDialogRef<EnterItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public amount
  ) { }

  ngOnInit() {
    this.paymentService.signIn()
    this.elements = this.paymentService.stripe.elements()
    this.user = this.paymentService.user
    if (this.user) {
      this.user.subscribe(u => console.log(u.uid))
    }
  }

  ngAfterViewInit() {
    //CREAT THE CARD FORM
    this.cardForm = this.elements.create('card', {
      style: this.elementStyles
    })
    this.cardForm.mount(this.card.nativeElement)
  }

  triggerPayment() {
    if (this.user) {
      this.user.subscribe(user => {
        this.paymentService.stripe.createToken(this.cardForm).then(result => {
          if (result.error) {
            console.log(result.error.message)
          } else {
            this.paymentService.stripeTokenHandler(user.stripeCustomerId, result.token, this.amount)
              .then(resp => {
                console.log(resp.data.status)
              })
          }
        })
      })
    }
  }
}
