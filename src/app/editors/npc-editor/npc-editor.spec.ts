import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcEditor } from './npc-editor';

describe('NpcEditor', () => {
  let component: NpcEditor;
  let fixture: ComponentFixture<NpcEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
