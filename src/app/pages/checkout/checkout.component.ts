import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseFormComponent } from 'src/app/component/purchase-form/purchase-form.component';
import { map } from 'rxjs/operators';

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
    this.dataService.getShoppingCart().pipe(
      map(items => {
        items.map(item => {
          this.dataService.getThumbnail(item.image[0].name)
            .then(url => item['thumbnail'] = url)
          return item
        })
        return items
      })).subscribe(items => {
        this.cart = items

        this.totalPrice = items.length == 0
          ? 0
          : this.cart
            .map(item => item.price)
            .reduce((acc: number, curr) => acc += curr)
      })
  }

  removeItem(index: number) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      this.dataService.removeShoppingCartItem(index)
      this.dataService.getShoppingCart().subscribe(items => {
        this.cart = items
      })
    }
  }

  onCheckout() {
    this.checkoutMode = true
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
