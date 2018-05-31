import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCommunityComponent } from './join-community.component';

describe('JoinCommunityComponent', () => {
  let component: JoinCommunityComponent;
  let fixture: ComponentFixture<JoinCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
