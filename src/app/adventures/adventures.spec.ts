import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adventures } from './adventures';

describe('Adventures', () => {
  let component: Adventures;
  let fixture: ComponentFixture<Adventures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adventures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adventures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
