import {Component, effect, input, OnDestroy, OnInit, signal} from '@angular/core';
import {BehaviorSubject, concatMap, delay, from, of, Subscription, switchMap, tap} from 'rxjs';
import { RandomSampleAlgorithms } from '../random-sample/random-sample';
import {NodeState, ProblemNode} from './problem';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DiscreteProblemService} from './discrete-problem.service';

@Component({
  selector: 'app-discrete-problem',
  templateUrl: './discrete-problem.component.html',
  styleUrl: './discrete-problem.component.scss',
  standalone: false,
})
export class DiscreteProblemComponent implements OnInit, OnDestroy {
  solutionSteps = input.required<ProblemNode[][][]>()
  oneStep = signal<ProblemNode[][]>([[]])

  problemConfigForm: FormGroup;
  solutionStepObservable = new BehaviorSubject<ProblemNode[][][] | undefined>(undefined)

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly svc: DiscreteProblemService,
  ) {
    this.problemConfigForm = this.formBuilder.group({
      columns: [null, [Validators.required, Validators.min(5)]],
      rows: [null, [Validators.required, Validators.min(5)]],
      weightDistribution: ["", [Validators.required]],
    });

    effect(() => {
      const steps = this.solutionSteps();
      if (steps.length > 0) {
        this.solutionStepObservable.next(this.solutionSteps());
      }
    });
  }

  ngOnInit(): void {
    this.subscription.add(this.subscribeToStepChanges())
    this.subscription.add(this.subscribeToProblem())
  }

  ngOnDestroy() {
    this.solutionStepObservable.complete();
    this.subscription.unsubscribe();
  }

  newProblem() {
    if (this.problemConfigForm.valid) {
      this.svc.newProblem(this.problemConfigForm.value)
    }
  }

  subscribeToProblem() {
    return this.svc.problemObservable.pipe(
      tap(p => {
        this.problemConfigForm.setValue(p.getConfig())
        this.solutionStepObservable.next([p.getNodes()])
      })
    ).subscribe()
  }

  subscribeToStepChanges() {
    return this.solutionStepObservable.pipe(
      switchMap(steps => {
        return from(steps || []).pipe(
          concatMap((step) => {
            return of(step).pipe(
              delay(1),
              tap(s => this.oneStep.set(s))
            )
          })
        )
      })
    ).subscribe()
  }

  cellStyle(node: ProblemNode) {
    return [
      this.cellColor(node),
      this.cellBorder(node)
    ].join("; ");
  }

  private cellColor(node: ProblemNode) {
    switch (node.state) {
      case NodeState.Init:
        return "background-color: red"
      case NodeState.Goal:
        return "background-color: green"
      default:
        const color = Math.min(255, Math.abs(255 - node.cost));
        return `background-color: rgb(${color}, ${color}, ${color})`
    }
  }

  private cellBorder(node: ProblemNode) {
    switch (node.state) {
      case NodeState.Init:
        return "border: 2px solid red"
      case NodeState.Goal:
        return "border: 2px solid green"
      case NodeState.Solution:
        return "border: 2px solid darkorange"
      case NodeState.Visited:
        return "border: 2px solid white"
      case NodeState.Pending:
        return "border: 2px solid darkcyan"
      default:
        return "border: 2px solid lightgrey"
    }
  }

  weightDistributionAlgorithm() {
    return Object.keys(RandomSampleAlgorithms)
  }
}
