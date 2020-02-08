import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  companyInfo: Observable<any>
  cartCount: number = 0
  constructor(private dataService: DataService) {

    this.dataService.onChangeCart.subscribe(count => {
      this.cartCount = count
    })
  }

  ngOnInit() {
    this.companyInfo = this.dataService.getCompanyInfo()
    this.dataService.getShoppingCart()
  }
  
  ngAfterViewInit() {

  }
}
