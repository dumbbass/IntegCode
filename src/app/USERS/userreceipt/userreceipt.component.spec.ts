import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserreceiptComponent } from './userreceipt.component';

describe('UserreceiptComponent', () => {
  let component: UserreceiptComponent;
  let fixture: ComponentFixture<UserreceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserreceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
