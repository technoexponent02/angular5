import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiIntegrationComponent } from './api-integration.component';

describe('ApiIntegrationComponent', () => {
  let component: ApiIntegrationComponent;
  let fixture: ComponentFixture<ApiIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
