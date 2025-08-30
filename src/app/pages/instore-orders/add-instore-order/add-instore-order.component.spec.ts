import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstoreOrderComponent } from './add-instore-order.component';

describe('AddInstoreOrderComponent', () => {
  let component: AddInstoreOrderComponent;
  let fixture: ComponentFixture<AddInstoreOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInstoreOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInstoreOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
