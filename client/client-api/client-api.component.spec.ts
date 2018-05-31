import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientApiComponent } from './client-api.component';

describe('ClientApiComponent', () => {
  let component: ClientApiComponent;
  let fixture: ComponentFixture<ClientApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
