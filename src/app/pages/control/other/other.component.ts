import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { timingSafeEqual } from 'crypto';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Upload } from 'src/app/models/upload';

@Component({
  selector: 'other-settings-tab',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  companyForm: FormGroup
  socialForm: FormGroup

  headerImages: Upload[] = []
  aboutIcon: any
  aboutHeader: any
  shopHeader: any

  selectedImageKey = ""
  selectedHeaderImg: number = -1
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
    this.dataService.getBackendData('siteImages').valueChanges().subscribe(images => {
      Object.keys(images)
      .filter(key => key != "homepageBanner")
      .forEach(imgKey => {
        this.dataService.getSiteImagesIcons(images[imgKey]['name'])
          .then(thumbnailUrl => {
            images[imgKey]['id'] = imgKey
            images[imgKey]['selected'] = this.selectedImageKey == imgKey
            images[imgKey]['thumbnail'] = thumbnailUrl
            if (imgKey == "aboutHeader")
              this.aboutHeader = images[imgKey]
            else if (imgKey == "aboutIcon")
              this.aboutIcon = images[imgKey]
            else if (imgKey == "shopHeader")
              this.shopHeader = images[imgKey]
          })
      })
      this.headerImages=images['homepageBanner']
      
      this.headerImages.map(img => {
        this.dataService.getSiteImagesIcons(img.name)
          .then(url => img['thumbnail'] = url)
      })
    })
  }

  onFileSelected(event, id) {
    let files = event.target.files as FileList
    for (let i = 0; i < files.length; i++) {
      if (id == 'homepageBanner') {
        this.headerImages.push([] as any)
        this.dataService.uploadSiteImage(new Upload(files.item(i)), id, this.headerImages)
      }
      else
        this.dataService.uploadSiteImage(new Upload(files.item(i)), id)
    }
  }

  selectHeaderImage(index: number) {
    if (this.selectedHeaderImg == index)
      this.selectedHeaderImg =-1
    else 
      this.selectedHeaderImg = index

    this.aboutHeader['selected'] = false
    this.aboutIcon['selected'] = false
    this.shopHeader['selected'] = false
  }

  setSelectedImage(imgObj) {
    let currentValue = imgObj['selected']
    this.selectedImageKey = imgObj['id']
    this.aboutHeader['selected'] = false
    this.aboutIcon['selected'] = false
    this.shopHeader['selected'] = false
    if (this.selectedImageKey == "aboutHeader")
      this.aboutHeader['selected'] = !currentValue
    else if (this.selectedImageKey == "aboutIcon")
      this.aboutIcon['selected'] = !currentValue
    else if (this.selectedImageKey == "shopHeader")
      this.shopHeader['selected'] = !currentValue
  }

  onRotatePictureLeft(imgObj) {
    imgObj.rotation -= 90 % 360
  }

  onRotatePictureRight(imgObj) {
    imgObj.rotation += 90 % 360
  }

  onDeleteSelectedPicture(index) {
    if (confirm("Are you sure you want to remove this picture from your item?")) {
      this.headerImages.splice(index, 1)
      this.selectedHeaderImg =-1
      this.onSaveData()
    }
  }

  dropPicture(event: CdkDragDrop<any>) {
    this.selectedHeaderImg =-1
    moveItemInArray(this.headerImages, event.previousIndex, event.currentIndex);
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
    let data = { ...this.companyForm.value, ...this.socialForm.value }
    this.dataService.saveToBackend('companyInfo', data)

    let siteImages = {
      aboutHeader: this.aboutHeader,
      aboutIcon: this.aboutIcon,
      shopHeader: this.shopHeader
    }

    Object.values(siteImages).forEach(siteImage => {
      delete siteImage['selected']
      delete siteImage['id']
    })

    siteImages['homepageBanner'] = this.headerImages.map(siteImage=>{
      return siteImage
    })
    
    this.dataService.saveToBackend('siteImages', JSON.parse(JSON.stringify(siteImages)), true)
  }
}
