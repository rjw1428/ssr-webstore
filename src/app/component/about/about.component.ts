import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  sectionTitle="about us"
  image: Observable<any>
  constructor(
    private router: Router,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.image=this.dataService.getBackendData('siteImages').valueChanges()
  }

  navigate() {
    this.router.navigate(['/','about'])
  }
}
