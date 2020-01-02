import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'carosel',
  templateUrl: './carosel.component.html',
  styleUrls: ['./carosel.component.scss']
})
export class CaroselComponent implements OnInit {
  slides=[
    "../../assets/img/carosel1.jpg",
    "../../assets/img/carosel2.jpg",
    "../../assets/img/carosel3.jpg",
  ]
  constructor() { }

  ngOnInit() {
  }

}
