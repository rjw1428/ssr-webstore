import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  title="Title"
  galleryLink=""
  constructor(private dataService: DataService) { 
    this.title=this.dataService.company.name
    this.galleryLink=this.dataService.igLink
  }

  ngOnInit() {
  }

}
