import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { DataService } from 'src/app/data.service';
import { InfoItem } from 'src/app/models/info-item';

@Component({
  selector: 'info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
  page: string = "terms"
  company = "The Company"
  contentList: InfoItem[] = []
  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) {
    this.dataService.getCompanyInfo().subscribe(comapnyInfo => {
      this.company = comapnyInfo['name']
    })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.page = params.page
      this.contentList = []
      this.dataService.getBackendData('legal').valueChanges().subscribe(resp => {
        resp[this.page].forEach(el => {
          this.contentList.push(Object.values(el).pop() as InfoItem)
        })
      })
    })
    window.scrollTo(0, 0)
  }
}
