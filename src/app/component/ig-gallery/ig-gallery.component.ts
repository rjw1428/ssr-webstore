import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'ig-gallery',
  templateUrl: './ig-gallery.component.html',
  styleUrls: ['./ig-gallery.component.scss']
})
export class IgGalleryComponent implements OnInit {
  sectionTitle="instagram gallery"
  pics=[
    "../../../assets/img/ig1.jpg",
    "../../../assets/img/ig2.jpg",
    "../../../assets/img/ig3.jpg",
    "../../../assets/img/ig4.jpg",
    "../../../assets/img/ig5.jpg",
    "../../../assets/img/ig6.jpg"
  ]
  igLink=""
  constructor(private dataService: DataService) { 
    this.dataService.getCompanyInfo().subscribe(companyInfo=>{
      this.igLink=companyInfo['instagram']
    })
  }

  ngOnInit() {
  }

}
