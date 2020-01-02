import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss']
})
export class MostPopularComponent implements OnInit {
  sectionTitle="most popular knives"
  items: Item[]=[]
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getBackendData('shop').valueChanges().subscribe((resp:{})=>{
      this.items=resp['inventory'].filter((item: Item)=>item.isFeatured)
      this.sectionTitle=resp['featuredListTitle']
    })
  }
}
