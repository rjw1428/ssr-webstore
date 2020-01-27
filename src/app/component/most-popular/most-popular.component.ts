import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss']
})
export class MostPopularComponent implements OnInit {
  sectionProperties: Observable<any>
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.sectionProperties = this.dataService.getBackendData('shop').valueChanges().pipe(
    map((resp: {featuredListTitle: string, inventory: Item[]}) => {
      resp.inventory=resp.inventory.filter((item: Item)=>item.isFeatured)
      return resp
    }))
  }
}
