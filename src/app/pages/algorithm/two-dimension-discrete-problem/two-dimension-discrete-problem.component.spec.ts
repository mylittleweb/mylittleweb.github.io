import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoDimensionDiscreteProblemComponent } from './two-dimension-discrete-problem.component';

describe('TwoDimensionDiscreteProblemSpaceComponent', () => {
  let component: TwoDimensionDiscreteProblemComponent;
  let fixture: ComponentFixture<TwoDimensionDiscreteProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoDimensionDiscreteProblemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoDimensionDiscreteProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
