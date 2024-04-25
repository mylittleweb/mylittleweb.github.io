import { TestBed } from '@angular/core/testing';

import { TwoDimensionDiscreteProblemService } from './two-dimension-discrete-problem.service';

describe('TwoDimensionDiscreteProblemSpaceService', () => {
  let service: TwoDimensionDiscreteProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoDimensionDiscreteProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
