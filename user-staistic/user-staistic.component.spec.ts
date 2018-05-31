import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStaisticComponent } from './user-staistic.component';

describe('UserStaisticComponent', () => {
  let component: UserStaisticComponent;
  let fixture: ComponentFixture<UserStaisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStaisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStaisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
