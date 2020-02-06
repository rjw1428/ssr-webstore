import { Component, OnInit, Inject, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentsService } from 'src/app/payments.service';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Item } from 'src/app/models/item';
import { ConfirmPurchaseFormComponent } from '../confirm-purchase-form/confirm-purchase-form.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ok } from 'assert';

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  @Input() cart: Item[]
  @Output() cancel = new EventEmitter()
  elements: any;
  checkoutForm: FormGroup
  cardForm: any
  user: Observable<any>
  elementStyles = {
    base: {
      fontSize: '14px'
    },
  };
  totalPrice: number
  popupWidth: string = "500px"
  @ViewChild('card', { static: true }) card: ElementRef
  onResize(event?) {
    this.popupWidth = (window.innerWidth < 992) ? "100vw" : "500px"
  }
  constructor(
    public dialog: MatDialog,
    private fns: AngularFireFunctions,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private paymentService: PaymentsService,
  ) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
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

  openDialog(user): void {
    const dialogRef = this.dialog.open(ConfirmPurchaseFormComponent, {
      width: this.popupWidth,
      data: { cart: this.cart, user: user, card: this.cardForm, total: this.totalPrice }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.dataService.setOrderId(result)
        this.router.navigate(['success'], { queryParams: { order: result}})
        // this.snackBar.open("Item was added to your cart", "OK", {
        //   duration: 2500,
        // });
      }
    });
  }

  triggerPayment() {
    let cardValidation = this.card.nativeElement.classList as DOMTokenList
    if (this.checkoutForm.valid && !cardValidation.contains("StripeElement--empty")) {
      // CREATE ANONYMOUS USER
      if (!cardValidation.contains("StripeElement--invalid")) {
        this.paymentService.signInAnonymous(this.checkoutForm.value)
          .then(user => {
            this.openDialog(user)
          })
          .catch(err => console.log("Unable to create user"))
      } else {
        this.snackBar.open("The card information you've provided seems to be invalid.", "OK")
      }
    } else {
      this.snackBar.open("Please check form values, some information is missing.", "OK")
    }
  }

  onCancel() {
    this.cancel.emit()
  }
}
