import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {
  @Input() sectionTitle: string
  constructor() { }

  ngOnInit() {
  }

}
