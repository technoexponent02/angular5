import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizationComponent } from './admin-organization.component';

describe('AdminOrganizationComponent', () => {
  let component: AdminOrganizationComponent;
  let fixture: ComponentFixture<AdminOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
