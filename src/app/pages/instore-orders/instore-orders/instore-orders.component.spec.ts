import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstoreOrdersComponent } from './instore-orders.component';

describe('InstoreOrdersComponent', () => {
  let component: InstoreOrdersComponent;
  let fixture: ComponentFixture<InstoreOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstoreOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstoreOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
