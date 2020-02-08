import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { timingSafeEqual } from 'crypto';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'other-settings-tab',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  companyForm: FormGroup
  socialForm: FormGroup

  headerImages: any[]=[]
  aboutIcon: any
  aboutHeader: any
  shopHeader: any
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForms()
    this.dataService.getBackendData("companyInfo").valueChanges().subscribe(resp => {
      this.companyForm = this.formBuilder.group({
        name: resp['name'],
        email: resp['email'],
        phone: resp['phoneNum']
      })
      this.socialForm = this.formBuilder.group({
        insta: resp['instagram'],
        fb: resp['facebook'],
        youtube: resp['youtube'],
        twitter: resp['twitter']
      })
    })
  }

  onFileSelected(event, itemIndex: number) {
    let files = event.target.files as FileList
    for (let i = 0; i < files.length; i++) {
      //Add temp loading image
      this.headerImages.push([] as any)

    //   //Upload Image to backend
    //   this.dataService.uploadItemImage(
    //     new Upload(files.item(i)),
    //     this.inventory[itemIndex]
    //   )
    }
  }

  setSelectedImage(i: number, n: number) {
    // if (this.selectedPicture.itemNum == i && this.selectedPicture.picNum == n)
    //   this.selectedPicture = { itemNum: -1, picNum: -1 }
    // else
    //   this.selectedPicture = { itemNum: i, picNum: n }
  }

  onRotatePictureLeft() {
    // this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation -= 90
  }

  onRotatePictureRight() {
    // this.inventory[this.selectedPicture.itemNum].image[this.selectedPicture.picNum].rotation += 90
  }

  onDeleteSelectedPicture() {
    if (confirm("Are you sure you want to remove this picture from your item?")) {
      // let removedItem = this.inventory[this.selectedPicture.itemNum]
      // removedItem.image.splice(this.selectedPicture.picNum, 1)
      // this.selectedPicture = { itemNum: -1, picNum: -1 }
      // this.onUpdateItem(removedItem)
    }
  }

  dropPicture(event: CdkDragDrop<any>) {
    // this.selectedPicture = { itemNum: event.item.data, picNum: event.currentIndex }
    // moveItemInArray(this.inventory[event.item.data].image, event.previousIndex, event.currentIndex);
  }

  initializeForms() {
    this.companyForm = this.formBuilder.group({
      name: "",
      email: "",
      phone: ""
    })
    this.socialForm = this.formBuilder.group({
      insta: "",
      fb: "",
      youtube: "",
      twitter: ""
    })
  }

  onSaveData() {
    let data = {...this.companyForm.value, ...this.socialForm.value}
    this.dataService.saveToBackend('companyInfo', data)
  }
}
