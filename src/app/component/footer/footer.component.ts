import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year="2020"
  company="Company"
  constructor(private dataService: DataService) { 
    this.year=new Date().getFullYear().toString()
    this.company=this.dataService.company.name
  }

  ngOnInit() {
  }

}
