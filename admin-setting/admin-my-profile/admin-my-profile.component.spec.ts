import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMyProfileComponent } from './admin-my-profile.component';

describe('AdminMyProfileComponent', () => {
  let component: AdminMyProfileComponent;
  let fixture: ComponentFixture<AdminMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
