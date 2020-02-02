import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Quote } from 'src/app/models/quote';
import { Observable } from 'rxjs';

@Component({
  selector: 'quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  pageContent: Observable<any>
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.pageContent = this.dataService.getBackendData('quotes').valueChanges()
    // .subscribe(resp=>{
    //   this.sectionTitle=resp['sectionTitle']
    //   this.quotes=resp['quotes']
    // })
  }

}
