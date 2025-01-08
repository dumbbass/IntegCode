import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermedicalrecordsComponent } from './usermedicalrecords.component';

describe('UsermedicalrecordsComponent', () => {
  let component: UsermedicalrecordsComponent;
  let fixture: ComponentFixture<UsermedicalrecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsermedicalrecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsermedicalrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
