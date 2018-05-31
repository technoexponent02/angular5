import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminClientSettingComponent } from './client-admin-client-setting.component';

describe('ClientAdminClientSettingComponent', () => {
  let component: ClientAdminClientSettingComponent;
  let fixture: ComponentFixture<ClientAdminClientSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdminClientSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminClientSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
