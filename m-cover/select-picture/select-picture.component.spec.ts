import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPictureComponent } from './select-picture.component';

describe('SelectPictureComponent', () => {
  let component: SelectPictureComponent;
  let fixture: ComponentFixture<SelectPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
