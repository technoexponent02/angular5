import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminUsersComponent } from './client-admin-users.component';

describe('ClientAdminUsersComponent', () => {
  let component: ClientAdminUsersComponent;
  let fixture: ComponentFixture<ClientAdminUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdminUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
