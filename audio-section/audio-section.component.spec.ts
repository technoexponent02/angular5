import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSectionComponent } from './audio-section.component';

describe('AudioSectionComponent', () => {
  let component: AudioSectionComponent;
  let fixture: ComponentFixture<AudioSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
