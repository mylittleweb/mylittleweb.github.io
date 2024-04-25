import { Component, OnInit, OnDestroy, signal, WritableSignal } from '@angular/core';
import {Subscription, tap, delay, switchMap, from, concatMap, of} from 'rxjs';
import { NodeState } from './problem';
import { DiscreteProblemService } from './discrete-problem.service';

@Component({
  selector: 'app-discrete-problem',
  templateUrl: './discrete-problem.component.html',
  styleUrl: './discrete-problem.component.scss',
  standalone: false,
})
export class DiscreteProblemComponent implements OnInit, OnDestroy {
  nodesState: WritableSignal<NodeState[][]>;

  private subscription: Subscription = new Subscription();

  constructor(
    private readonly store: DiscreteProblemService,
  ) {
    this.nodesState = signal<NodeState[][]>([[]])
  }

  ngOnInit(): void {
    this.subscription.add(this._observeNodeStates())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  _observeNodeStates(): Subscription {
    return this.store.nodesObservable.pipe(
      switchMap(states => {
        return from(states).pipe(
          concatMap((state) => {
            return of(state).pipe(
              delay(1),
              tap(s => this.nodesState.set(s))
            )
          })
        )
      })
    ).subscribe()
  }
}
