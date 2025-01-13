import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatereceiptComponent } from './createreceipt.component';

describe('CreatereceiptComponent', () => {
  let component: CreatereceiptComponent;
  let fixture: ComponentFixture<CreatereceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatereceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatereceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
