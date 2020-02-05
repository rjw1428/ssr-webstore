import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-purchase',
  templateUrl: './success-purchase.component.html',
  styleUrls: ['./success-purchase.component.scss']
})
export class SuccessPurchaseComponent implements OnInit, AfterViewInit {
  items: Item[] = []
  total: number
  companyInfo: Observable<any>
  orderId: string//Observable<any>
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
    ) {

  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.companyInfo=this.dataService.getCompanyInfo()

    this.items = this.dataService.getShoppingCart()
    this.dataService.clearShoppingCart()

    this.total = this.items.length > 0 ? this.items
      .map(item => item.price)
      .reduce((acc: number, curr) => acc += curr) : 0

    this.orderId=this.dataService.orderId//this.route.queryParams
  }

  ngAfterViewInit() {
  }

}
