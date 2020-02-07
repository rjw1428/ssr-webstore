import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'other-settings-tab',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  companyForm: FormGroup
  socialForm: FormGroup
  imageForm: FormGroup
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
    this.imageForm = this.formBuilder.group({
      homePage: this.formBuilder.array([""]),
      aboutUsHomeIcon: "",
      aboutUsHeader: "",
      shopHeader: "",
    })
  }
}
