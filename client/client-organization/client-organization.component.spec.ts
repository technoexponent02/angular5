import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrganizationComponent } from './client-organization.component';

describe('ClientOrganizationComponent', () => {
  let component: ClientOrganizationComponent;
  let fixture: ComponentFixture<ClientOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
