import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseFormComponent } from 'src/app/component/purchase-form/purchase-form.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Item[] = []
  totalPrice: number

  elements: any;
  paymentRequest: any;
  paymentRequestButton: any

  popupWidth='900px';
  @ViewChild('payElement', { static: false }) payElement: ElementRef
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.popupWidth=(window.innerWidth<992)?"100vw":"900px"
  }
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.cart = this.dataService.getShoppingCart()
    this.totalPrice = this.cart.length > 0 ? this.cart
      .map(item => item.price)
      .reduce((acc: number, curr) => acc += curr) : 0
  }

  removeItem(index: number) {
    if (confirm("Are you sure you want to remove this item from your cart?"))
      this.cart.splice(index, 1)
  }

  onCheckout() {
    console.log(this.popupWidth)
    const dialogRef = this.dialog.open(PurchaseFormComponent, {
      data: this.totalPrice,
      width: this.popupWidth
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.snackBar.open("Checkout Happened", "OK", {
          duration: 2500,
        });
      } else {
        // this.paymentService.signOut()
      }
    });
  }

  onClearCart() {
    if (confirm("Are you sure you want to remove all items from your cart?")) {
      this.cart = []
      this.dataService.clearShoppingCart()
    }
  }

}
