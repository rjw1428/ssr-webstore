import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgGalleryComponent } from './ig-gallery.component';

describe('IgGalleryComponent', () => {
  let component: IgGalleryComponent;
  let fixture: ComponentFixture<IgGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
