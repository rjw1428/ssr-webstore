import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  @Input() position: number
  @Input() animate: boolean = false
  pageContent: Observable<any>
  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.pageContent = this.dataService.getBackendData('quotes').valueChanges()
  }  
  
  ngOnChanges() {
  }
}
