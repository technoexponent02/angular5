import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminMyProfileComponent } from './client-admin-my-profile.component';

describe('ClientAdminMyProfileComponent', () => {
  let component: ClientAdminMyProfileComponent;
  let fixture: ComponentFixture<ClientAdminMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdminMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
