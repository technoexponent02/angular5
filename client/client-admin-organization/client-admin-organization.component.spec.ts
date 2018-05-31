import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminOrganizationComponent } from './client-admin-organization.component';

describe('ClientAdminOrganizationComponent', () => {
  let component: ClientAdminOrganizationComponent;
  let fixture: ComponentFixture<ClientAdminOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdminOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
