import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentsService } from 'src/app/payments.service';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Item } from 'src/app/models/item';
import { ConfirmPurchaseFormComponent } from '../confirm-purchase-form/confirm-purchase-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  @Input() cart: Item[]
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
  popupWidth: string = "900px"
  @ViewChild('card', { static: true }) card: ElementRef
  onResize(event?) {
    this.popupWidth = (window.innerWidth < 992) ? "100vw" : "900px"
  }
  constructor(
    public dialog: MatDialog,
    private fns: AngularFireFunctions,
    private dataService: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private paymentService: PaymentsService,
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

  openDialog(user): void {
    const dialogRef = this.dialog.open(ConfirmPurchaseFormComponent, {
      width: this.popupWidth,
      data: {cart: this.cart, user: user, card: this.cardForm, total: this.totalPrice}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("DONE")
        this.router.navigate(['success'])
        // this.snackBar.open("Item was added to your cart", "OK", {
        //   duration: 2500,
        // });
      }
    });
  }

  triggerPayment() {
    // CREATE ANONYMOUS USER
    this.paymentService.signInAnonymous(this.checkoutForm.value)
      .then(user => {
        console.log(user)
        this.openDialog(user)
      })
      .catch(err => console.log("Unable to create user"))
  }
}
