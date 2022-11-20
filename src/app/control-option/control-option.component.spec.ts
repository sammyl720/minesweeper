import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlOptionComponent } from './control-option.component';

describe('ControlOptionComponent', () => {
  let component: ControlOptionComponent;
  let fixture: ComponentFixture<ControlOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
