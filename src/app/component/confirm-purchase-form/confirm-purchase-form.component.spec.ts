import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPurchaseFormComponent } from './confirm-purchase-form.component';

describe('ConfirmPurchaseFormComponent', () => {
  let component: ConfirmPurchaseFormComponent;
  let fixture: ComponentFixture<ConfirmPurchaseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPurchaseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
