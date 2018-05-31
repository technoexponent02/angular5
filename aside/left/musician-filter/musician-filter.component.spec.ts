import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicianFilterComponent } from './musician-filter.component';

describe('MusicianFilterComponent', () => {
  let component: MusicianFilterComponent;
  let fixture: ComponentFixture<MusicianFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicianFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicianFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
