import { TestBed } from '@angular/core/testing';

import { DiscreteProblemService } from './discrete-problem.service';

describe('DiscreteProblemService', () => {
  let service: DiscreteProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscreteProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
