import {Component, ElementRef, OnDestroy, OnInit, signal, viewChild} from "@angular/core";
import {Form} from "../../../component/form/form";
import {FormFields} from "../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import {BehaviorSubject, concatMap, interval, of, Subscription, switchMap, takeWhile, tap} from "rxjs";
import {TspGraph} from "./tsp-graph";
import {ChartDef} from "../../../component/graph/line-chart/line-chart";
import {TSP, TSPSolver} from "../../../lib/algo/tsp/tsp";

@Component({
  selector: "app-traveling-salesman",
  templateUrl: "./traveling-salesman.component.html",
  styleUrl: "./traveling-salesman.component.scss",
  standalone: false
})
export class TravelingSalesmanComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  tspGraphElem = viewChild.required<ElementRef>("graph");
  tspGraph: TspGraph;
  cityForm = new Form([
    FormFields.number("city", "City", new FormControl(30, [Validators.required, Validators.min(1), Validators.max(500)]))
  ]);

  tspIterationChartDef: ChartDef;
  tspCostChartDef: ChartDef;
  tsp = new TSP();

  run$ = new BehaviorSubject<TSPSolver | undefined>(undefined);

  selectedAlgorithm = signal<string>("sa");
  tspSolver = signal<TSPSolver | undefined>(undefined);

  ngOnInit() {
    this.tspGraph = new TspGraph(this.tspGraphElem());
    this.tspCostChartDef = new ChartDef("Path Cost");
    this.tspIterationChartDef = new ChartDef("Iteration");
    this.sub.add(this.obRun());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  run() {
    const algo = this.tspSolver();
    if (algo) {
      algo.setProblem(this.tsp);
      this.run$.next(algo);
    }
  }

  generateCities() {
    this.tspGraph.setCities(this.tsp.generateCities(this.cityForm.control("city")?.value));
    this.tspCostChartDef.setData([]);
    this.tspIterationChartDef.setData([]);
    this.run$.next(undefined);
  }

  obRun() {
    return this.run$.pipe(
      switchMap(algo => {
        if (algo === undefined) {
          return of(algo);
        } else {
          this.tspCostChartDef.setData([]);
          this.tspIterationChartDef.setData([]);

          return interval(2).pipe(
            concatMap(() => {
              return of(algo.run());
            }),
            tap((step) => {
              if (step.done) {
                console.log(step);
              }
            }),
            takeWhile((step): boolean => !step.done)
          );
        }
      })
    ).subscribe({
      next: step => {
        if (step) {
          this.tspGraph.setPath(step.path);
          this.tspCostChartDef.addData([{x: step.i, y: step.cost}]);
          this.tspIterationChartDef.addData([{x: step.i, y: step.iY}]);
        }
      }
    });
  }
}
