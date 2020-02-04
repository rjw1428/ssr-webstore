import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SortOption } from 'src/app/models/sort-option';
import { Option } from 'src/app/models/option';
import { map } from 'rxjs/operators';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  items: Item[] = []
  filters = []
  sorts: SortOption[] = []
  selectedSort: SortOption
  selectedFilterCategory: { id: string, label: string, options: Option[] }
  filteredItems: Item[] = []
  filtersForm: FormGroup
  selectedFilters: { id: string, label: string, options: string }[]
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.filtersForm = this.formBuilder.group({})
  }

  ngOnInit() {
    this.dataService.getInventory('knives').valueChanges()
      .subscribe((items: Item[]) => {
        this.items = items.map(item => {
          this.dataService.getThumbnail(item.image[0].name)
            .then(url => item['thumbnail'] = url)
          return item
        })
        this.dataService.getBackendData('shop').valueChanges().subscribe(resp => {
          this.sorts = resp['sort'] as SortOption[]
          this.selectedSort = this.sorts[0]
          this.filters = resp['filter']
          this.filteredItems = this.items.sort((a: Item, b: Item) => this.sortItems(a, b, this.sorts[0]))
          this.filtersForm = this.initializeFilterFormGroup(this.filters)

          //FILTER ON VALUE CHANGES
          this.filtersForm.valueChanges.subscribe(vals => {
            // GET SELECTED FILTES
            this.selectedFilters = Object.keys(vals).filter(key => vals[key]).map((filterObj: string) => {
              return {
                id: filterObj,
                label: filterObj.substr(0, 1).toUpperCase() + filterObj.substr(1),
                options_raw: vals[filterObj],
                options: vals[filterObj].label
              }
            })
            if (this.selectedFilters.length > 0)
              this.filteredItems = this.items.filter(item => {
                return this.selectedFilters.map(filter => {
                  if (filter.id == "availability")
                    return JSON.parse(filter['options_raw'].id) == !item.isSold
                  if (filter.id == "price") {
                    let range = filter['options_raw'].range
                    if (range.hi && range.low)
                      return item.price >= range.low && item.price < range.hi
                    if (range.low)
                      return item.price >= range.low
                    if (range.hi)
                      return item.price < range.hi
                  }
                  return filter['options_raw'].id == item.tags[filter.id]
                }).reduce((acc, cur) => cur && cur == acc)
              })
            else this.filteredItems = this.items
          })
        })
      })
    window.scrollTo(0, 0)
  }

  clearFilterValue(filterId) {
    this.filtersForm.get(filterId).setValue('')
  }

  clearChip(filter: { id: string, label: string, options: string }) {
    this.clearFilterValue(filter.id)
  }

  displayFilter(filter?: { id: string, label: string, options: any[] }) {
    return filter ? filter.label : undefined
  }

  setFilterListCategory(category: { value: any }) {
    this.selectedFilterCategory = category.value.id
  }

  initializeFilterFormGroup(filters) {
    let formsList = {}
    filters.forEach(filter => formsList[filter.id] = [''])
    return this.formBuilder.group(formsList)
  }

  sortList(sort: { value: SortOption }) {
    this.filteredItems.sort((a, b) => this.sortItems(a, b, sort.value))
  }

  sortItems(a: Item, b: Item, sort: SortOption) {
    sort.param.forEach(p => a = a[p])
    sort.param.forEach(p => b = b[p])
    if (sort.order == "desc")
      return +b - +a
    return +a - +b
  }

}
