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
  topInventory: Observable<Item[]>
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.sectionProperties = this.dataService.getBackendData('shop').valueChanges()
    this.topInventory = this.dataService.getInventory('knives').valueChanges()
      .pipe(
        map(resp => {
          return resp.filter((item: Item) => item.isFeatured && item.active) as Item[]
        }),
        map((items: Item[]) => {
          return items = items.map(item => {
            this.dataService.getThumbnail(item.image[0].name)
              .then(url => item['thumbnail'] = url)
            return item
          })
        })
      )
  }
}
