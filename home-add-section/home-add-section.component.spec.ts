import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddSectionComponent } from './home-add-section.component';

describe('HomeAddSectionComponent', () => {
  let component: HomeAddSectionComponent;
  let fixture: ComponentFixture<HomeAddSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAddSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
