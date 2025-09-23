import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditor } from './character-editor';

describe('CharacterEditor', () => {
  let component: CharacterEditor;
  let fixture: ComponentFixture<CharacterEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
