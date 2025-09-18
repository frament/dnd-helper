import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEditor } from './timeline-editor';

describe('TimelineEditor', () => {
  let component: TimelineEditor;
  let fixture: ComponentFixture<TimelineEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
