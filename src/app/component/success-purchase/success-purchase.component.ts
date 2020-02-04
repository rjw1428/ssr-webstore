import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-purchase',
  templateUrl: './success-purchase.component.html',
  styleUrls: ['./success-purchase.component.scss']
})
export class SuccessPurchaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

}
