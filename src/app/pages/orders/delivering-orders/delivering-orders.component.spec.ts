import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveringOrdersComponent } from './delivering-orders.component';

describe('DeliveringOrdersComponent', () => {
  let component: DeliveringOrdersComponent;
  let fixture: ComponentFixture<DeliveringOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveringOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveringOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
