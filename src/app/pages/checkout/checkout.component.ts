import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Item[]=[]
  totalPrice: number
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.cart=this.dataService.getShoppingCart()
    this.totalPrice=this.cart.length>0?this.cart
      .map(item=>item.price)
      .reduce((acc:number, curr)=>acc+=curr):0
  }

  removeItem(index: number) {
    if (confirm("Are you sure you want to remove this item from your cart?"))
      this.cart.splice(index, 1)
  }

  onCheckout() {
    alert("Currently Checkout is unavailable. Items will be stored in your cart for later.")
  }

  onClearCart() {
    this.cart=[]
    this.dataService.clearShoppingCart()
  }
}
