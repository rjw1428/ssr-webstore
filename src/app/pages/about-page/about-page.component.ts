import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  @Input() editable=false
  header=""
  topSection=[]
  bottomSectionTitle=""
  bottomSection=[]
  videoUrl=""
  constructor(private dataService: DataService, private sanitizer: DomSanitizer) { 
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.dataService.getBackendData('about').valueChanges().subscribe(resp=>{
      this.header=resp['header']
      this.topSection=resp['topSection']
      this.bottomSectionTitle=resp['bottomSectionTitle']
      this.bottomSection=resp['bottomSection']
      this.videoUrl=this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoUrl']) as string
      console.log(this.videoUrl)
    })
  }

}
