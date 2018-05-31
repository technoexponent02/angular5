import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAndIntegrationComponent } from './api-and-integration.component';

describe('ApiAndIntegrationComponent', () => {
  let component: ApiAndIntegrationComponent;
  let fixture: ComponentFixture<ApiAndIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiAndIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiAndIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
