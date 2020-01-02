import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quote } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.scss']
})
export class AddQuoteComponent implements OnInit {
  dataForm: FormGroup
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddQuoteComponent>,
    @Inject(MAT_DIALOG_DATA) public quote: Quote
    ) {
    this.dataForm = this.initializeFilterFormGroup(quote)
  }

  ngOnInit() {
  }

  initializeFilterFormGroup(filters) {
    let formsList = {}
    Object.keys(filters).forEach(key => formsList[key] = [filters[key], Validators.required])
    return this.formBuilder.group(formsList)
  }
}
