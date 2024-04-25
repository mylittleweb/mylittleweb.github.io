import {Component, effect, input, OnDestroy, OnInit, signal} from "@angular/core";
import {BehaviorSubject, concatMap, delay, from, of, Subscription, switchMap, tap} from "rxjs";
import {RandomSampleAlgorithms} from "../random-sample/random-sample";
import {Cell, CellState, Grid} from "./map";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MapService} from "./map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
  standalone: false
})
export class MapComponent implements OnInit, OnDestroy {
  grids = input.required<Grid[]>();

  map = signal<Grid>([[]]);

  mapConfigForm: FormGroup;

  mapObservable = new BehaviorSubject<Grid[] | undefined>(undefined);

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly svc: MapService
  ) {
    this.mapConfigForm = this.formBuilder.group({
      columns: [50, [Validators.required, Validators.min(5)]],
      rows: [50, [Validators.required, Validators.min(5)]],
      weightDistribution: ["Bernoulli", [Validators.required]],
      destinations: [2, [Validators.required]]
    });

    effect(() => {
      const grids = this.grids();
      if (grids.length > 0) {
        this.mapObservable.next(this.grids());
      }
    });
  }

  ngOnInit(): void {
    this.subscription.add(this.subscribeToMapChanges());
    this.subscription.add(this.subscribeToMap());
  }

  ngOnDestroy() {
    this.mapObservable.complete();
    this.subscription.unsubscribe();
  }

  newProblem() {
    if (this.mapConfigForm.valid) {
      this.svc.newMap(this.mapConfigForm.value);
    }
  }

  subscribeToMap() {
    return this.svc.mapObservable.pipe(
      tap(p => {
        if (p !== undefined) {
          this.mapConfigForm.setValue(p.getConfig());
          this.mapObservable.next([p.cloneGrid()]);
        }
      })
    ).subscribe();
  }

  subscribeToMapChanges() {
    return this.mapObservable.pipe(
      switchMap(steps => {
        return from(steps || []).pipe(
          concatMap((step) => {
            return of(step).pipe(
              delay(1),
              tap(s => this.map.set(s))
            );
          })
        );
      })
    ).subscribe();
  }

  cellStyle(cell: Cell) {
    return [
      this.cellColor(cell),
      this.cellBorder(cell)
    ].join("; ");
  }

  private cellColor(node: Cell) {
    switch (node.state) {
      case CellState.Blocker:
        return "background-color: black";
      case CellState.Destination:
        return "background-color: red";
      default:
      {   const color = Math.min(255, Math.abs(255 - node.cost));
        return `background-color: rgb(${color}, ${color}, ${color})`;
      }
    }
  }

  private cellBorder(node: Cell) {
    switch (node.state) {
      case CellState.Destination:
        return "border: 2px solid red";
      case CellState.Solution:
        return "border: 2px solid darkorange";
      case CellState.Exploring:
        return "border: 2px solid darkorange";
      case CellState.Expanded:
        return "border: 2px solid white";
      case CellState.Pending:
        return "border: 2px solid darkcyan";
      case CellState.Blocker:
        return "border: 2px solid black";
      default:
        return "border: 2px solid silver";
    }
  }

  weightDistributionAlgorithm() {
    return Object.keys(RandomSampleAlgorithms);
  }
}
