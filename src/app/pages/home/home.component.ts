import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  viewLoaded = false
  animateQuotes = false
  @ViewChild("quotes", { static: false }) quotes: ElementRef
  constructor(private dataService: DataService) { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

  ngAfterViewInit() {
    this.viewLoaded = true
  }
  
  @HostListener('window:scroll', ['$event'])
  triggerImageAnimation() {
    if (this.viewLoaded) {
      const scrollPosition = window.pageYOffset+window.innerHeight

      //QUOTES FADE IN
      const quotesPosition = this.quotes.nativeElement.offsetTop
      this.animateQuotes = !(scrollPosition < quotesPosition)
    }
  }
}
