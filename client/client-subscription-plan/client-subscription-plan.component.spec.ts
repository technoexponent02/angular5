import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSubscriptionPlanComponent } from './client-subscription-plan.component';

describe('ClientSubscriptionPlanComponent', () => {
  let component: ClientSubscriptionPlanComponent;
  let fixture: ComponentFixture<ClientSubscriptionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSubscriptionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
