import { Component, OnInit } from '@angular/core';
import { DataService, Upload } from 'src/app/data.service';
import { Quote } from 'src/app/models/quote';
import { MatDialog } from '@angular/material/dialog';
import { AddQuoteComponent } from 'src/app/component/quotes/add-quote/add-quote.component';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Item } from 'src/app/models/item';
import { Option } from 'src/app/models/option';
import { AddItemPopupComponent } from 'src/app/component/item/add-item-popup/add-item-popup.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  quotesForm: FormGroup[] = []
  aboutFormTitle: FormGroup
  aboutFormTop: FormGroup[] = []
  aboutFormBottomHeader: FormGroup
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
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.dataService.getBackendData('quotes').valueChanges().subscribe(resp => {
      this.quotesForm = resp['quotes']
        .filter((q: Quote) => q.active)
        .map(q => this.formBuilder.group(q))
    })
    this.dataService.getBackendData('about').valueChanges().subscribe(resp => {
      this.aboutFormTitle = this.formBuilder.group({ header: resp['header'] })
      this.aboutFormVideo = this.formBuilder.group({ videoUrl: resp['videoUrl'] })
      this.aboutFormBottomHeader = this.formBuilder.group({ bottomSectionTitle: resp['bottomSectionTitle'] })
      this.aboutFormTop = resp['topSection'].map(sect => this.formBuilder.group({ paragraph: sect }))
      this.aboutFormBottom = resp['bottomSection'].map(sect => this.formBuilder.group(({ paragraph: sect })))
    })
    this.dataService.getBackendData('shop').valueChanges().subscribe(resp => {
      this.inventory = resp['inventory']
        .filter((item: Item) => item.active)
        .sort((a, b) => b.dateAdded.seconds - a.dateAdded.seconds)
      this.inventoryForms = JSON.parse(JSON.stringify(this.inventory))
        .map((item: any) => {
          item.description = this.formBuilder.array(item.description)
          item.tags = this.initializeFormGroup(item.tags)
          item.dateAdded = new Date(item.dateAdded.seconds * 1000)
          item.price = [(+item.price), [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]]
          return this.formBuilder.group(item)
        })
      this.tagList = resp['filter'].filter(tag => tag.id !== 'price' && tag.id !== 'availability')
      this.featuredTitle = this.formBuilder.group({ featuredTitle: resp['featuredListTitle'] })
    })
  }

  //--------------------INVENTORY STUFF---------------
  onSaveInventory() {
    if (this.inventoryForms.map(form => form.valid).reduce((acc, cur) => cur && cur == acc)) {
      let fullInventoryItems = this.inventoryForms.map((form, i) => {
        let fullItem = form.value
        fullItem.image = this.inventory[i].image ? [...this.inventory[i].image] : []
        return fullItem
      })
      this.dataService.saveToBackend('shop', { inventory: fullInventoryItems })
    }
    else {
      alert("There is an error with information on this form. Either a value is missing or it is incorrect. Scroll through to find the issue.")
    }
  }

  onDeleteItem(index: number) {
    if (confirm("Are you sure you want to remove this item from your inventory?")) {
      let item = this.inventoryForms[index].value as Item
      item.active = false
      this.onSaveInventory()
    }
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
        this.onSaveInventory()
      }
    });
  }

  onFileSelected(event, itemIndex: number) {
    let files = event.target.files as FileList
    for (let i = 0; i < files.length; i++) {
      this.inventory[itemIndex].image.push([] as any)
      this.dataService.uploadItemImage(
        new Upload(files.item(i)),
        this.inventory,
        itemIndex
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
    this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation-=90
  }

  onRotatePictureRight() {
    this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation+=90
  }

  onDeleteSelectedPicture() {
    if (confirm("Are you sure you want to remove this picture from your item?")) {
      this.inventory[this.selectedPicture.itemNum].image.splice(this.selectedPicture.picNum, 1)
      this.selectedPicture = { itemNum: -1, picNum: -1 }
      this.onSaveInventory()
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
}
