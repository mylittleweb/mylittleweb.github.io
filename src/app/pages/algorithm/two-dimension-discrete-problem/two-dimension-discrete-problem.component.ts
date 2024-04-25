import { Component, OnInit, OnDestroy, signal, WritableSignal } from '@angular/core';
import { Subscription, tap, concatMap, of, delay } from 'rxjs';
import { NodeState } from './problem';
import { TwoDimensionDiscreteProblemService } from './two-dimension-discrete-problem.service';

@Component({
  selector: 'app-two-dimension-discrete-problem',
  templateUrl: './two-dimension-discrete-problem.component.html',
  styleUrl: './two-dimension-discrete-problem.component.scss',
  standalone: false,
})
export class TwoDimensionDiscreteProblemComponent implements OnInit, OnDestroy {
  nodesState: WritableSignal<NodeState[][]>;

  private subscription: Subscription = new Subscription();

  constructor(
    private readonly store: TwoDimensionDiscreteProblemService,
  ) {
    this.nodesState = signal<NodeState[][]>([[]])
  }

  ngOnInit(): void {
    this.subscription.add(this.store.nodesObservable.pipe(
      concatMap(p => of(p).pipe(
        delay(5),
        tap(p => {
          this.nodesState.set(p)
        })
      ))
    ).subscribe())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.reset();
  }

  cellClass(column: number, row: number) {
    switch (this.nodesState()[row][column]) {
      case NodeState.Init:
        return {"init": true};
      case NodeState.Goal:
        return {"goal": true};
      case NodeState.Solution:
        return {"solution": true};
      case NodeState.Blocked:
        return {"blocked": true};
      case NodeState.Visited:
        return {"visited": true};
      case NodeState.Pending:
        return {"pending": true};
      default:
        return {}
    }
  }
}
