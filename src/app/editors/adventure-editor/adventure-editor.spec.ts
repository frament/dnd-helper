import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureEditor } from './adventure-editor';

describe('AdventureEditor', () => {
  let component: AdventureEditor;
  let fixture: ComponentFixture<AdventureEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
