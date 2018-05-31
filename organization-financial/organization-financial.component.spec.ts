import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFinancialComponent } from './organization-financial.component';

describe('OrganizationFinancialComponent', () => {
  let component: OrganizationFinancialComponent;
  let fixture: ComponentFixture<OrganizationFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
