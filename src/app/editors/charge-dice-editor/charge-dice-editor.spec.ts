import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeDiceEditor } from './charge-dice-editor';

describe('ChargeDiceEditor', () => {
  let component: ChargeDiceEditor;
  let fixture: ComponentFixture<ChargeDiceEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeDiceEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeDiceEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
