import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-enter-item-popup',
  templateUrl: './enter-item-popup.component.html',
  styleUrls: ['./enter-item-popup.component.scss']
})
export class EnterItemPopupComponent implements OnInit {
  screenHeight: number
  screenWidth: number

  constructor(
    public dialogRef: MatDialogRef<EnterItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item) { }

  ngOnInit() {
    console.log(this.item.image)
  }

  onNoClick(itemAdded?: Boolean): void {
    this.dialogRef.close(itemAdded);
  }
}
