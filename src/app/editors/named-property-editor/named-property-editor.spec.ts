import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedPropertyEditor } from './named-property-editor';

describe('NamedPropertyEditor', () => {
  let component: NamedPropertyEditor;
  let fixture: ComponentFixture<NamedPropertyEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamedPropertyEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NamedPropertyEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
