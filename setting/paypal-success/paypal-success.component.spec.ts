import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalSuccessComponent } from './paypal-success.component';

describe('PaypalSuccessComponent', () => {
  let component: PaypalSuccessComponent;
  let fixture: ComponentFixture<PaypalSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
