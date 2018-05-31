import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationValidationComponent } from './organization-validation.component';

describe('OrganizationValidationComponent', () => {
  let component: OrganizationValidationComponent;
  let fixture: ComponentFixture<OrganizationValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
