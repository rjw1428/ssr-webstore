import { Component, OnInit, Input } from '@angular/core';
import { Quote } from 'src/app/models/quote';

@Component({
  selector: 'quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  @Input() quote: Quote
  @Input() editable = false
  
  constructor() { }

  ngOnInit() {
  }

}
