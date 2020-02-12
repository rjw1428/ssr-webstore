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
      this.dataService.deleteOrder(order.id).then(resp=>{
        this.snackBar.open("Order ID "+order.id+" was successfully removed.", "OK", {duration: 2500})
      })
    }
  }

  onSaveNote(order) {
    this.dataService.updateOrder(order, {notes: order.notes})
  }

  onConfirm(order) {
    this.dataService.updateOrder(order, {status: "Confirmed"})
    let email=`Hi ${order.user.firstName}, <br><br>Thank you for purchase. We are writing to inform you that we have received your order and it is currently being worked on by one of our skilled blacksmiths.<br>We will notify you once your product has shipped.If you have any questions in the mean time, please feel free to <a href=mailto:test@test.com>contact us</a><br><br>Cheers,<br>Alpine Custom Knives<br>Richmond Va`
    this.dataService.sendEmail(order, email)
  }

  onShipped(order) {
    this.dataService.updateOrder(order, {status: "Shipped"})
  }

  onFinish(order) {
    this.dataService.updateOrder(order, {status: "Finished", active: false})
  }

  sendEmail(email) {
    window.location.href='mailto:'+email
  }
}
