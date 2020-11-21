import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentsService } from 'src/app/payments.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-success-purchase',
  templateUrl: './success-purchase.component.html',
  styleUrls: ['./success-purchase.component.scss']
})
export class SuccessPurchaseComponent implements OnInit {
  items$: Observable<Item[]>
  total$: Observable<number>
  companyInfo: Observable<any>
  orderId: string
  constructor(
    private dataService: DataService,
    private paymentService: PaymentsService
  ) {

  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.paymentService.signOut()
    this.companyInfo = this.dataService.getCompanyInfo()
    this.orderId = this.dataService.orderId
    const orderRef = this.dataService.getOrderById(this.orderId)
    this.total$ = orderRef.pipe(map(resp => resp['amount']))
    this.items$ =  orderRef.pipe(map(resp => resp['items']))
  }
}
