import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  title = "Title"
  galleryLink = ""
  constructor(private dataService: DataService) {
    this.dataService.getCompanyInfo().subscribe(companyInfo => {
      this.title = companyInfo['name']
      this.galleryLink = companyInfo['instagram']
    })
  }

  ngOnInit() {
  }

}
