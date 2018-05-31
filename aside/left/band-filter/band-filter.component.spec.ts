import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandFilterComponent } from './band-filter.component';

describe('BandFilterComponent', () => {
  let component: BandFilterComponent;
  let fixture: ComponentFixture<BandFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
