import {Component, input, OnDestroy, OnInit, signal, output, effect} from "@angular/core";
import {BehaviorSubject, delay, from, Subscription, switchMap, concatMap, of} from "rxjs";
import {FormFields} from "../../../component/form/form-field";
import {RandomSampleAlgorithms} from "../../../lib/algo/random-sample/random-sample";
import {Cell, CellState, Grid, MapConfig, Map} from "../../../lib/map/map";
import {Validators, FormControl} from "@angular/forms";
import {Form} from "../../../component/form/form";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
  standalone: false
})
export class MapComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  numDestinations = input.required<number>();

  grids = input.required<Grid[]>();
  grids$ = new BehaviorSubject<Grid[]>([[]]);
  grid = signal<Grid>([[]]);

  generatedMap = output<Map>();

  formData = new BehaviorSubject<MapConfig | undefined>(undefined);
  form = new Form([
    FormFields.number("columns", "Columns", new FormControl(50, [Validators.required])),
    FormFields.number("rows", "Rows", new FormControl(50, [Validators.required])),
    FormFields.select("weightDistribution", "Weight Distribution", new FormControl("Bernoulli", [Validators.required]),
      new BehaviorSubject(Object.keys(RandomSampleAlgorithms).map((name) => {
        return {label: name, value: name};
      }))
    )
  ]);

  constructor() {
    effect(() => {
      this.grids$.next(this.grids());
    });
  }

  ngOnInit(): void {
    this.sub.add(this.obGridChanges());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generate() {
    const data = this.form.group().value as MapConfig;
    data.destinations = this.numDestinations();

    const m = new Map(data);
    this.grids$.next([m.cloneGrid()]);
    this.generatedMap.emit(m);
  }

  obGridChanges() {
    return this.grids$.pipe(
      switchMap(grids => {
        return from(grids || []).pipe(
          concatMap(grid => {
            return of(grid).pipe(
              delay(10)
            );
          })
        );
      })
    ).subscribe({
      next: grid => {
        this.grid.set(grid);
      }
    });
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
}
