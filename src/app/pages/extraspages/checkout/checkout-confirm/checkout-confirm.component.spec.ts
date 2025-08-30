import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfirmComponent } from './checkout-confirm.component';

describe('CheckoutConfirmComponent', () => {
  let component: CheckoutConfirmComponent;
  let fixture: ComponentFixture<CheckoutConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
