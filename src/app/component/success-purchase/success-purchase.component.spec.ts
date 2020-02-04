import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPurchaseComponent } from './success-purchase.component';

describe('SuccessPurchaseComponent', () => {
  let component: SuccessPurchaseComponent;
  let fixture: ComponentFixture<SuccessPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
