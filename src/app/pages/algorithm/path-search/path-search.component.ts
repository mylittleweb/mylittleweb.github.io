import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Problem, ProblemNode} from '../discrete-problem/problem';
import {Subscription, tap} from 'rxjs';
import {DiscreteProblemService} from '../discrete-problem/discrete-problem.service';
import { Result, PathSearchAlgorithms } from './path-search';

@Component({
  selector: 'app-breadth-first-search',
  templateUrl: './path-search.component.html',
  styleUrl: './path-search.component.scss',
  standalone: false,
  providers: [
    DiscreteProblemService
  ]
})
export class PathSearchComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  problem = signal<Problem | undefined>(undefined);
  selectedAlgorithm = signal<string>("")
  result = signal<Result>({solution: undefined, steps: [], name: ""});
  solving = signal<boolean>(false);

  constructor(private readonly problemSvc: DiscreteProblemService) {}

  ngOnInit(): void {
    this.subscription.add(this.observeProblem())
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  observeProblem() {
    return this.problemSvc.problemObservable.pipe(
      tap(p => {
        this.problem.set(p)
        this.result.set({solution: undefined, steps: [], name: ""});
      })
    ).subscribe();
  }

  solve() {
    this.solving.set(true)
    // using setTimeout to not block main thread
    setTimeout(() => {
      const algo = PathSearchAlgorithms[this.selectedAlgorithm()];
      const p = this.problem();
      if (algo && p) {
        p.reset();
        this.result.set(algo().run(p))
      }
      this.solving.set(false);
    }, 2);
  }

  solutionSize(solution: ProblemNode | undefined): number {
    let size = 0;
    while (solution !== undefined) {
      size += 1;
      solution = solution.parent;
    }
    return size;
  }

  algorithmNames(): string[] {
    return Object.keys(PathSearchAlgorithms);
  }
}
