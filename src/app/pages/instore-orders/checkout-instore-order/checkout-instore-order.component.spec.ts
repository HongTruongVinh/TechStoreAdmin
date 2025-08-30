import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutInstoreOrderComponent } from './checkout-instore-order.component';

describe('CheckoutInstoreOrderComponent', () => {
  let component: CheckoutInstoreOrderComponent;
  let fixture: ComponentFixture<CheckoutInstoreOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutInstoreOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutInstoreOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
