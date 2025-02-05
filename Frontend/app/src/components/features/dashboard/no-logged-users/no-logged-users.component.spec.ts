import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoLoggedUsersComponent } from './no-logged-users.component';

describe('NoLoggedUsersComponent', () => {
  let component: NoLoggedUsersComponent;
  let fixture: ComponentFixture<NoLoggedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoLoggedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoLoggedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
