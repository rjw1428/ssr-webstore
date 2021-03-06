import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Quote } from 'src/app/models/quote';
import { MatDialog } from '@angular/material/dialog';
import { AddQuoteComponent } from 'src/app/component/quotes/add-quote/add-quote.component';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Item } from 'src/app/models/item';
import { Option } from 'src/app/models/option';
import { AddItemPopupComponent } from 'src/app/component/item/add-item-popup/add-item-popup.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Upload } from 'src/app/models/upload';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  selectedTab: number = 0
  quotesForm: FormGroup[] = []
  aboutFormTitle: FormGroup
  aboutFormTop: FormGroup[] = []
  aboutFormBottomHeader: FormGroup
  aboutFormClosing: FormGroup
  aboutFormBottom: FormGroup[] = []
  aboutFormVideo: FormGroup
  inventoryForms: FormGroup[] = []
  inventory: Item[] = []
  featuredTitle: FormGroup
  tagList: Option[] = []
  selectedPicture = {
    itemNum: -1,
    picNum: -1
  }
  showTitle = false;
  inventoryCategoryName = "knives"
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.dataService.getBackendData('quotes').valueChanges()
      .subscribe(resp => {
        this.quotesForm = resp['quotes']
          .filter((q: Quote) => q.active)
          .map(q => this.formBuilder.group(q))
      })

    this.dataService.getBackendData('about').valueChanges().subscribe(resp => {
      this.aboutFormTitle = this.formBuilder.group({ header: resp['header'] })
      this.aboutFormVideo = this.formBuilder.group({ videoUrl: resp['videoUrl'] })
      this.aboutFormBottomHeader = this.formBuilder.group({ bottomSectionTitle: resp['bottomSectionTitle'] })
      this.aboutFormClosing = this.formBuilder.group({ closing: resp['closing'] })
      this.aboutFormTop = resp['topSection'].map(sect => this.formBuilder.group({ paragraph: sect }))
      this.aboutFormBottom = resp['bottomSection'].map(sect => this.formBuilder.group(({ paragraph: sect })))
    })

    this.dataService.getInventory(this.inventoryCategoryName).valueChanges().subscribe((resp: Item[]) => {
      this.inventory = resp
        .sort((a, b) => b.dateAdded.seconds - a.dateAdded.seconds)

      this.inventoryForms = JSON.parse(JSON.stringify(this.inventory))
        .map((item: any) => {
          item.description = this.formBuilder.array(item.description)
          item.tags = this.initializeFormGroup(item.tags)
          item.dateAdded = new Date(item.dateAdded.seconds * 1000)
          item.price = [(+item.price), [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]]
          item.image.map(img => {
            this.dataService.getThumbnail(img.name)
              .then(url => img['thumbnail'] = url)
          })
          return this.formBuilder.group(item)
        })
    })
    this.dataService.getBackendData('shop').valueChanges().subscribe(resp => {
      this.tagList = resp['filter'].filter(tag => tag.id !== 'price' && tag.id !== 'availability')
      this.featuredTitle = this.formBuilder.group({ featuredTitle: resp['featuredListTitle'] })
    })

    this.route.queryParamMap.subscribe((paramsMap: Params)=>{
      this.selectedTab=paramsMap.params.page
    })
  }

  //--------------------INVENTORY STUFF---------------
  onSaveInventory(itemForm: FormGroup, index: number) {
    if (itemForm.valid) {
      let fullItem = itemForm.value as Item
      fullItem.image = this.inventory[index].image ? [...this.inventory[index].image] : []
      this.onUpdateItem(fullItem)
    }
    else {
      alert("There is an error with information on this form. Either a value is missing or it is incorrect. Scroll through to find the issue.")
    }
  }

  onDeleteItem(itemForm: FormGroup, index: number) {
    if (confirm("Are you sure you want to remove this item from your inventory?")) {
      let item = itemForm.value as Item
      this.dataService.deleteInventoryItem(this.inventoryCategoryName, item.id)
    }
  }

  onUpdateItem(item) {
    this.dataService.updateInventory(this.inventoryCategoryName, item)
  }

  onAddItem() {
    const dialogRef = this.dialog.open(AddItemPopupComponent, {
      data: { item: new Item(this.tagList), filters: this.tagList }
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        result.dateAdded = new Date()
        this.inventory.push(result)
        this.inventoryForms.push(this.formBuilder.group({
          ...result,
          description: this.formBuilder.array(result.description),
          tags: this.initializeFormGroup(result.tags),
        }))
        this.dataService.saveInventory(this.inventoryCategoryName, result)
      }
    });
  }

  onFileSelected(event, itemIndex: number) {
    let files = event.target.files as FileList
    for (let i = 0; i < files.length; i++) {
      //Add temp loading image
      this.inventory[itemIndex].image.push([] as any)

      //Upload Image to backend
      this.dataService.uploadItemImage(
        new Upload(files.item(i)),
        this.inventory[itemIndex]
      )
    }
  }

  setSelectedImage(i: number, n: number) {
    if (this.selectedPicture.itemNum == i && this.selectedPicture.picNum == n)
      this.selectedPicture = { itemNum: -1, picNum: -1 }
    else
      this.selectedPicture = { itemNum: i, picNum: n }
  }

  onRotatePictureLeft() {
    this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation -= 90
  }

  onRotatePictureRight() {
    this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation += 90
  }

  onFlipImage() {
    if (this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].scale != -1)
    this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].scale = -1
    else this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].scale = 1
  }

  onDeleteSelectedPicture() {
    if (confirm("Are you sure you want to remove this picture from your item?")) {
      let removedItem = this.inventory[this.selectedPicture.itemNum]
      removedItem.image.splice(this.selectedPicture.picNum, 1)
      this.selectedPicture = { itemNum: -1, picNum: -1 }
      this.onUpdateItem(removedItem)
    }
  }

  dropPicture(event: CdkDragDrop<any>) {
    this.selectedPicture = { itemNum: event.item.data, picNum: event.currentIndex }
    moveItemInArray(this.inventory[event.item.data].image, event.previousIndex, event.currentIndex);
  }

  onAddDescriptionParagraph(index: number) {
    let descFormArray = this.inventoryForms[index].get('description') as FormArray
    descFormArray.push(new FormControl(''))
  }

  onDeleteDescriptionParagraph(itemIndex: number, descIndex: number) {
    let descFormArray = this.inventoryForms[itemIndex].get('description') as FormArray
    descFormArray.removeAt(descIndex)
  }

  //----------------------ABOUT STUFF--------------
  onAddParagraph(form: FormGroup[]) {
    form.push(this.formBuilder.group({ paragraph: '' }))
  }

  onDeleteAbout(form: FormGroup[], index: number) {
    form.splice(index, 1)
  }

  onSaveAbout() {
    let data = {
      header: this.aboutFormTitle.value['header'],
      videoUrl: this.aboutFormVideo.value['videoUrl'],
      bottomSectionTitle: this.aboutFormBottomHeader.value['bottomSectionTitle'],
      closing: this.aboutFormClosing.value['closing'],
      topSection: this.aboutFormTop.map(form => form.value['paragraph']),
      bottomSection: this.aboutFormBottom.map(form => form.value['paragraph'])
    }
    this.dataService.saveToBackend('about', data)
  }
  //---------------------QUOTE STUFF---------------

  dropQuote(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.quotesForm, event.previousIndex, event.currentIndex);
  }

  onAddQuote() {
    const dialogRef = this.dialog.open(AddQuoteComponent, {
      data: new Quote()
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.quotesForm.push(result)
        this.onSaveQuotes()
      }
    });
  }

  onDeleteQuote(index) {
    if (confirm("Are you sure you want to remove this quote?")) {
      let quote = this.quotesForm[index].value as Quote
      quote.active = false
      this.onSaveQuotes()
    }
  }

  onSaveQuotes() {
    this.dataService.saveToBackend('quotes', { quotes: this.quotesForm.map(form => form.value) })
  }

  //---------------------UTIL FUNCTIONS-------------------

  initializeFormGroup(group): FormGroup {
    return this.formBuilder.group(group)
  }

  onTabChange(tabChange: MatTabChangeEvent) {
    this.router.navigate(['/admin'], {queryParams: {page: tabChange.index}})
  }
}
