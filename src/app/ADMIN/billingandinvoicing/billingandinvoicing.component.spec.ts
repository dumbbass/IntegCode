import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingandinvoicingComponent } from './billingandinvoicing.component';

describe('BillingandinvoicingComponent', () => {
  let component: BillingandinvoicingComponent;
  let fixture: ComponentFixture<BillingandinvoicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingandinvoicingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingandinvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
