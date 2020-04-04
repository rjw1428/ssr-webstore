import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quote } from 'src/app/models/quote';

@Component({
  selector: 'quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  @Input() position: number
  @Input() animate: boolean = false
  pageContent: Observable<any>
  // maxQuotes = 4
  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.pageContent = this.dataService.getBackendData('quotes').valueChanges()
    // .pipe(
    //   map((resp: any) => ({...resp, quotes: resp['quotes'].splice(0,this.maxQuotes)}))
    // )
  }  
  
  ngOnChanges() {
  }
}
