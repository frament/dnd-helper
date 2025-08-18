import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactEditor } from './artifact-editor';

describe('ArtifactEditor', () => {
  let component: ArtifactEditor;
  let fixture: ComponentFixture<ArtifactEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtifactEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
