import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstoreOrderDetailsComponent } from './instore-order-details.component';

describe('InstoreOrderDetailsComponent', () => {
  let component: InstoreOrderDetailsComponent;
  let fixture: ComponentFixture<InstoreOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstoreOrderDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstoreOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
