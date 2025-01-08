import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbillingComponent } from './userbilling.component';

describe('UserbillingComponent', () => {
  let component: UserbillingComponent;
  let fixture: ComponentFixture<UserbillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserbillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
