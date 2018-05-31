import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeftUtilComponent } from './profile-left-util.component';

describe('ProfileLeftUtilComponent', () => {
  let component: ProfileLeftUtilComponent;
  let fixture: ComponentFixture<ProfileLeftUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLeftUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLeftUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
