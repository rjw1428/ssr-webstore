import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Component({
  selector: 'about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  @Input() editable=false
  pageContent: Observable<any>
  constructor(private dataService: DataService, private sanitizer: DomSanitizer) { 
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.pageContent= this.dataService.getBackendData('about').valueChanges().pipe(
      map((resp: any)=>{
        resp.videoUrl=this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoUrl']) as string
        return resp
      })
    )
  }

}
