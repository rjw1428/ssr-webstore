import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year: string
  companyInfo: Observable<any>
  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.year = new Date().getFullYear().toString()

  }

  ngOnInit() {
    this.companyInfo = this.dataService.getCompanyInfo()
  }
}
