import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SortOption } from 'src/app/models/sort-option';
import { Option } from 'src/app/models/option';
import { map, take, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EnterItemPopupComponent } from 'src/app/component/item/enter-item-popup/enter-item-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Image } from 'src/app/models/image';
import { Observable } from 'rxjs';

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
  selectedFilters: { id: string, label: string, options: string, options_raw: any }[] = []
  popupWidth = '900px';
  initialLoad = true;
  headerImage: Observable<any>
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.popupWidth = (window.innerWidth < 992) ? "100vw" : "900px"
  }
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtersForm = this.formBuilder.group({})
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.headerImage = this.dataService.getBackendData('siteImages').valueChanges()

    this.dataService.getInventory('knives').valueChanges().pipe(
      map((items: Item[]) => {
        //GET ALL ITEM THUNBMAILS
        this.items = items.map(item => {
          this.dataService.getThumbnail(item.image[0].name)
            .then(url => item['thumbnail'] = url)
          return item
        })
        return this.items
      }),
      switchMap(items => {
        //GET FILTER OPTION (APPLY DEFAULT SORT TO FILTERED ITEMS LIST)
        return this.dataService.getBackendData('shop').valueChanges().pipe(
          map(resp => {
            this.sorts = resp['sort'] as SortOption[]
            this.selectedSort = this.sorts[0]
            this.filters = resp['filter']
            this.filteredItems = items.sort((a: Item, b: Item) => this.sortItems(a, b, this.sorts[0]))
            this.filtersForm = this.initializeFilterFormGroup(this.filters)
            return this.filteredItems
          }))
      }),
      switchMap(items => {
        //GET & SET PARAMETERS FROM URL (HAS TO GO AFTER ITEMS ARE CREATED)
        return this.route.queryParamMap.pipe(
          map((map: Params) => {
            let itemId = map.params['id']
            let appliedFilters = Object.keys(map.params).filter(key => key != 'id').map(key => this.filters.find(filter => filter.id == key))
            if (appliedFilters.length) {
              this.selectedFilters= appliedFilters.map(filter => {
                let matchingFilter = this.filters.find(f => f.id == filter.id)
                let optionValue = matchingFilter.options.find(option => option.id == map.params[filter.id])
                this.filteredItems = this.items.filter(item =>  item.tags[filter.id] == optionValue.id)
                this.filtersForm.get(filter.id).setValue(optionValue)
                return this.createFilterChip(filter.id, optionValue)
              })
            }
            if (itemId) {
              this.openDialog(itemId)
            }
            return this.filteredItems
          })
        )
      }),
      switchMap(items => {
        // FILTER ON VALUE CHANGES
        return this.filtersForm.valueChanges.pipe(
          map(vals => {
            Object.keys(vals).filter(key => vals[key])
              .forEach((newFilter: string, i: number) => {
                this.selectedFilters[i] = this.createFilterChip(newFilter, vals[newFilter])
              })
            if (this.selectedFilters.length > 0) {
              items = this.items.filter(item => {
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
            }
            else {
              items = this.items
            }
            this.setUrl()
            return items
          }))
      })).subscribe(items => {
        this.initialLoad = false
        this.filteredItems = items
      })
  }

  clearFilterValue(filterId) {
    this.filtersForm.get(filterId).setValue('')
  }

  clearChip(filter: { id: string, label: string, options: string }) {
    this.selectedFilters.splice(this.selectedFilters.findIndex(chips => chips.id == filter.id), 1)
    this.clearFilterValue(filter.id)
    this.setUrl()
  }

  displayFilter(filter?: { id: string, label: string, options: any[] }) {
    return filter ? filter.label : undefined
  }

  onItemSelected(itemId: string) {
    this.router.navigate(["/shop"], { queryParams: { id: itemId } })
  }

  setUrl() {
    let paramsObj = this.selectedFilters.length > 0 ? this.selectedFilters
      .map(val => ({ [val.id]: val['options_raw']['id'] }))
      .reduce((obj, val) => ({ ...obj, [Object.keys(val).pop()]: Object.values(val).pop() })) : {}
    this.router.navigate(["/shop"], { queryParams: paramsObj })
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

  openDialog(itemId): void {
    let selectedItem = this.items.find(item => item.id == itemId)
    const dialogRef = this.dialog.open(EnterItemPopupComponent, {
      width: this.popupWidth,
      data: { item: selectedItem, showCartButton: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open("Item was added to your cart", "View Cart", {
          duration: 3000,
        }).onAction().subscribe(() => this.router.navigate(['/checkout']));
      }
      this.setUrl()
    });
  }

  createFilterChip(filterId, options) {
    return {
      id:  filterId,
      label:  filterId.substr(0, 1).toUpperCase() +  filterId.substr(1),
      options_raw: options,
      options: options.label
    }
  }
}
