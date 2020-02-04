import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'orders-list',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Observable<any>
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.orders = this.dataService.getOrders()
  }

  onCancelOrder(order) {
    if (confirm("Are you sure you want to cancel this order?")) {
      this.dataService.deleteOrder(order.id)
    }
  }
}
