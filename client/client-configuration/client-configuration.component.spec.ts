import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientConfigurationComponent } from './client-configuration.component';

describe('ClientConfigurationComponent', () => {
  let component: ClientConfigurationComponent;
  let fixture: ComponentFixture<ClientConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
