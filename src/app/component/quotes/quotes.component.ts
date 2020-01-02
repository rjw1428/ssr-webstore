import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Quote } from 'src/app/models/quote';

@Component({
  selector: 'quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  sectionTitle="Title"
  quotes: Quote[]=[]
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getBackendData('quotes').valueChanges().subscribe(resp=>{
      this.sectionTitle=resp['sectionTitle']
      this.quotes=resp['quotes'].filter((q: Quote) => q.active)
    })
  }

}
