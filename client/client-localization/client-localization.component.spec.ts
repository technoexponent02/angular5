import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocalizationComponent } from './client-localization.component';

describe('ClientLocalizationComponent', () => {
  let component: ClientLocalizationComponent;
  let fixture: ComponentFixture<ClientLocalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLocalizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLocalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
