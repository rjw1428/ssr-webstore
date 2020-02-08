import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { EnterItemPopupComponent } from './enter-item-popup/enter-item-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item
  @Input() showCart: boolean = true
  @Input() enablePopup: boolean = true
  @Output() itemSelected = new EventEmitter<string>()
  popupWidth = '900px';
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.popupWidth = (window.innerWidth < 992) ? "100vw" : "900px"
  }
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  openDialog(): void {
    this.itemSelected.emit(this.item.id)
    if (this.enablePopup) {
      const dialogRef = this.dialog.open(EnterItemPopupComponent, {
        width: this.popupWidth,
        data: { item: this.item, showCartButton: this.showCart }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.snackBar.open("Item was added to your cart", "OK", {
            duration: 2500,
          });
        }
      });
    }
  }
}

