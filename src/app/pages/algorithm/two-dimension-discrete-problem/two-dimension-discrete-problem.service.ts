import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeState } from './problem';

@Injectable()
export class TwoDimensionDiscreteProblemService {
  nodesObservable = new BehaviorSubject<NodeState[][]>([[]])

  constructor() { }

  reset() {
    this.nodesObservable.complete();
    this.nodesObservable = new BehaviorSubject<NodeState[][]>([[]])
  }
}
