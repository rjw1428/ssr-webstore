import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Component({
  selector: 'about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit, AfterViewInit{
  @Input() editable = false
  pageContent: Observable<any>
  companyInfo: Observable<any>
  animateSlats: boolean = false
  animateQuotes: boolean = false
  viewLoaded: boolean = false;
  @ViewChild("slants", { static: false }) slants: ElementRef
  @ViewChild("quotes", { static: false }) quotes: ElementRef
  @HostListener('window:scroll', ['$event'])
  triggerImageAnimation(event) {
    if (this.viewLoaded) {
      const scrollPosition = window.pageYOffset+window.innerHeight
      
      //SLANTS ANIMATION
      const slantPosition = this.slants.nativeElement.offsetTop
      this.animateSlats = !(scrollPosition < slantPosition) 

      //QUOTES FADE IN
      const quotesPosition = this.quotes.nativeElement.offsetTop
      this.animateQuotes = !(scrollPosition < quotesPosition)
    }
  }
  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.companyInfo = this.dataService.getCompanyInfo()
    this.pageContent = this.dataService.getBackendData('about').valueChanges().pipe(
      map((resp: any) => {
        resp.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoUrl']) as string
        return resp
      })
    )
  }
  ngAfterViewInit() {
    this.viewLoaded = true
  }
}
