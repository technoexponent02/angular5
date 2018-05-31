import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandSectionComponent } from './band-section.component';

describe('BandSectionComponent', () => {
  let component: BandSectionComponent;
  let fixture: ComponentFixture<BandSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
