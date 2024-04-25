import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteProblemComponent } from './discrete-problem.component';

describe('TwoDimensionDiscreteProblemSpaceComponent', () => {
  let component: DiscreteProblemComponent;
  let fixture: ComponentFixture<DiscreteProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscreteProblemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscreteProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
