import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBrandingComponent } from './client-branding.component';

describe('ClientBrandingComponent', () => {
  let component: ClientBrandingComponent;
  let fixture: ComponentFixture<ClientBrandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBrandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
