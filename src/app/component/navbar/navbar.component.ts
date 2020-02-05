import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  title: String
  galleryLink = ""
  cartCount: number = 0
  constructor(private dataService: DataService) {
    this.dataService.getCompanyInfo().subscribe(companyInfo => {
      this.title = companyInfo['name']
      this.galleryLink = companyInfo['instagram']
    })
    this.dataService.onChangeCart.subscribe(count => {
      this.cartCount = count
    })
  }

  ngOnInit() {
    this.dataService.getShoppingCart()
  }
  
  ngAfterViewInit() {

  }
}
