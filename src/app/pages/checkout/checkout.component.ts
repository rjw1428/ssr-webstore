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
  checkoutMode: boolean = false
  elements: any;
  paymentRequest: any;
  paymentRequestButton: any

  popupWidth = '900px';
  @ViewChild('payElement', { static: false }) payElement: ElementRef
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.popupWidth = (window.innerWidth < 992) ? "100vw" : "900px"
  }
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.cart = this.dataService.getShoppingCart().map(item => {
      this.dataService.getThumbnail(item.image[0].name)
        .then(url => item['thumbnail'] = url)
      return item
    })
    this.totalPrice = this.cart.length > 0 ? this.cart
      .map(item => item.price)
      .reduce((acc: number, curr) => acc += curr) : 0
  }

  removeItem(index: number) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      this.dataService.removeShoppingCartItem(index)
      this.cart = this.dataService.getShoppingCart()
    }
  }

  onCheckout() {
    this.checkoutMode = true
    // const dialogRef = this.dialog.open(PurchaseFormComponent, {
    //   data: this.cart,
    //   width: this.popupWidth
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.cart = this.dataService.clearShoppingCart()
    //     this.snackBar.open("Thank you for your purchase!", "OK", {
    //       duration: 2500
    //     });
    //   }
    // });
  }

  onClearCart() {
    if (confirm("Are you sure you want to remove all items from your cart?")) {
      this.cart = this.dataService.clearShoppingCart()
    }
  }

  onPurchaseCancel() {
    this.checkoutMode = false;
  }

}
