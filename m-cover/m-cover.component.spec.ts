import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCoverComponent } from './m-cover.component';

describe('MCoverComponent', () => {
  let component: MCoverComponent;
  let fixture: ComponentFixture<MCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
