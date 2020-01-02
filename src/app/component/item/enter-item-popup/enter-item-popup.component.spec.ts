import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterItemPopupComponent } from './enter-item-popup.component';

describe('EnterItemPopupComponent', () => {
  let component: EnterItemPopupComponent;
  let fixture: ComponentFixture<EnterItemPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterItemPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
