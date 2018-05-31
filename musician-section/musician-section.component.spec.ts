import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicianSectionComponent } from './musician-section.component';

describe('MusicianSectionComponent', () => {
  let component: MusicianSectionComponent;
  let fixture: ComponentFixture<MusicianSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicianSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicianSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
