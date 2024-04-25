import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeState } from './problem';

@Injectable()
export class DiscreteProblemService {
  nodesObservable = new BehaviorSubject<NodeState[][][]>([[[]]])

  constructor() { }
}
