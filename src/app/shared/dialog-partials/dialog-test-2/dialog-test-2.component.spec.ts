import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTest2Component } from './dialog-test-2.component';

describe('DialogTest2Component', () => {
  let component: DialogTest2Component;
  let fixture: ComponentFixture<DialogTest2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTest2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
