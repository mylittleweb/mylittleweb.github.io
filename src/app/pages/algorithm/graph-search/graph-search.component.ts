import { Component, input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {AlgorithmBuilder} from '../algorithm.component';
import { Problem, NodeState } from '../discrete-problem/problem';
import {
  DiscreteProblemService
} from '../discrete-problem/discrete-problem.service';

@Component({
  selector: 'app-breadth-first-search',
  templateUrl: './graph-search.component.html',
  styleUrl: './graph-search.component.scss',
  providers: [
    DiscreteProblemService
  ],
  standalone: false
})
export class GraphSearchComponent {
  problem: Problem;
  problemConfig: FormGroup;
  algorithm = input.required<AlgorithmBuilder<Problem, NodeState[][]>>();

  constructor(
    private svc: DiscreteProblemService,
    private formBuilder: FormBuilder,
  ) {
    this.problemConfig = this.formBuilder.group({
      x: [100, Validators.min(1)],
      y: [50, Validators.min(1)],
      blockers: [300]
    });

    this.newProblem();
  }

  newProblem() {
    const {x, y, blockers} = this.problemConfig.value;
    this.problem = new Problem(x, y, blockers);
    this.svc.nodesObservable.next([this.problem.getNodesStatus()])
  }

  run() {
    let algo = this.algorithm().getInstance();
    const states = algo.run(this.problem);
    this.svc.nodesObservable.next(states)
  }
}
