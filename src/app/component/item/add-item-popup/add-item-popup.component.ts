import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { Option } from 'src/app/models/option';
import { DataService } from 'src/app/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Upload } from 'src/app/models/upload';

@Component({
  selector: 'app-add-item-popup',
  templateUrl: './add-item-popup.component.html',
  styleUrls: ['./add-item-popup.component.scss']
})
export class AddItemPopupComponent implements OnInit {
  dataForm: FormGroup
  filterForm: FormGroup
  selectedPicture: number;
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Item, filters: Option[] }) {
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      ...this.data.item,
      description: this.formBuilder.array(this.data.item.description),
      price: [+this.data.item.price, [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]]
    })
    this.filterForm = this.initializeFilterFormGroup(this.data.filters)
  }

  onFileSelected(event) {
    let files = event.target.files as FileList
    for (let i = 0; i < files.length; i++) {
      this.data.item.image.push([] as any)
      this.dataService.uploadItemImage(
        new Upload(files.item(i)),
        this.data.item
      )
    }
  }

  setSelectedImage(n: number) {
    if (this.selectedPicture == n)
      this.selectedPicture = -1
    else
      this.selectedPicture = n
  }

  onDeleteSelectedPicture() {
    if (confirm("Are you sure you want to remove this picture from your item?")) {
      this.data.item.image.splice(this.selectedPicture, 1)
      this.updateTempStorage()
      this.selectedPicture = -1
    }
  }

  onRotatePictureLeft() {
    this.data.item.image[this.selectedPicture].rotation -= 90
  }

  onRotatePictureRight() {
    this.data.item.image[this.selectedPicture].rotation += 90
  }

  onFlipImage() {
    if (this.data.item.image[this.selectedPicture].scale != -1)
      this.data.item.image[this.selectedPicture].scale = -1
    else this.data.item.image[this.selectedPicture].scale = 1
  }

  dropPicture(event: CdkDragDrop<any>) {
    this.selectedPicture = event.currentIndex
    moveItemInArray(this.data.item.image, event.previousIndex, event.currentIndex);
  }

  onAddDescriptionParagraph() {
    let descFormArray = this.dataForm.get('description') as FormArray
    descFormArray.push(new FormControl(''))
  }

  onDeleteDescriptionParagraph(descIndex: number) {
    let descFormArray = this.dataForm.get('description') as FormArray
    descFormArray.removeAt(descIndex)
  }

  initializeFilterFormGroup(filters) {
    let formsList = {}
    filters.forEach(filter => formsList[filter.id] = ['', Validators.required])
    return this.formBuilder.group(formsList)
  }

  updateTempStorage() {
    this.dataService.getBackendData('temp').update({
      inventory: [{ image: this.data.item.image }]
    })
  }

  clearTempStorage() {
    this.dataService.getBackendData('temp').update({
      inventory: []
    })
  }

  onClose() {
    this.dataForm.value.tags = this.filterForm.value
    return { ...this.dataForm.value, image: this.data.item.image }
  }

  onSubmit() {
    this.clearTempStorage()
  }
}