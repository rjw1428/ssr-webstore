import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'orders-list',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Observable<any>
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.orders = this.dataService.getOrders()
  }

  onCancelOrder(order) {
    if (confirm("Are you sure you want to cancel this order?")) {
      this.dataService.deleteOrder(order.id).then(resp => {
        this.snackBar.open("Order ID " + order.id + " was successfully removed.", "OK", { duration: 2500 })
      })
    }
  }

  onSaveNote(order) {
    this.dataService.updateOrder(order, { notes: order.notes })
  }

  onConfirm(order) {
    this.dataService.sendEmail(order, "confirm")
  }

  onShipped(order) {
    let trackingNumber = prompt("Please enter shipping tracking number")
    order['trackingNumber'] = trackingNumber
    this.dataService.sendEmail(order, "shipped")
  }

  onFinish(order) {
    this.dataService.updateOrder(order, { status: "Finished", active: false })
  }

  setEmailShortcut(email) {
    window.location.href = 'mailto:' + email
  }
}
