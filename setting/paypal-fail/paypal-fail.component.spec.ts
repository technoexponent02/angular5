import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalFailComponent } from './paypal-fail.component';

describe('PaypalFailComponent', () => {
  let component: PaypalFailComponent;
  let fixture: ComponentFixture<PaypalFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
