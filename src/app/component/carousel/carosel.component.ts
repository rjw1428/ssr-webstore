import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'carosel',
  templateUrl: './carosel.component.html',
  styleUrls: ['./carosel.component.scss']
})
export class CaroselComponent implements OnInit {
  slides=[
    "../../assets/img/carosel1.jpg",
    "../../assets/img/carosel2.jpg",
    "../../assets/img/carosel3.jpg",
  ]
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getBackendData('siteImages').valueChanges().subscribe(vals=>{
      this.slides=vals['homepageBanner']
    })
  }

}
