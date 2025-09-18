import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chapter } from './chapter-editor';

describe('Chapter', () => {
  let component: Chapter;
  let fixture: ComponentFixture<Chapter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chapter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chapter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
