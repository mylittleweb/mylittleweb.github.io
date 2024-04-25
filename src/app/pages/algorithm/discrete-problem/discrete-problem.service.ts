import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Problem, ProblemConfig} from './problem';


@Injectable()
export class DiscreteProblemService {

  problemObservable = new BehaviorSubject<Problem>(new Problem({rows: 30, columns: 50, weightDistribution: "Bernoulli"}));

  constructor() { }

  newProblem(config: ProblemConfig) {
    const p = new Problem(config);
    this.problemObservable.next(p);
  }
}
