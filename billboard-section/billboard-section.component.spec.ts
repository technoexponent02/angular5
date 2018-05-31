import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillboardSectionComponent } from './billboard-section.component';

describe('BillboardSectionComponent', () => {
  let component: BillboardSectionComponent;
  let fixture: ComponentFixture<BillboardSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillboardSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillboardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
