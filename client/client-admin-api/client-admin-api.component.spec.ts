import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminApiComponent } from './client-admin-api.component';

describe('ClientAdminApiComponent', () => {
  let component: ClientAdminApiComponent;
  let fixture: ComponentFixture<ClientAdminApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAdminApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
