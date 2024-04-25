import {Component, model, OnDestroy, OnInit} from "@angular/core";
import {Form} from "../../../../component/form/form";
import {FormFields} from "../../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import {TSPSolver} from "../../../../lib/algo/tsp/tsp";
import {filter, startWith, Subscription} from "rxjs";
import {ACOParameters, AntColonyOptimization} from "../../../../lib/algo/tsp/ant-colony-optimization";

@Component({
  selector: "app-ant-colony-optimization",
  templateUrl: "./ant-colony-optimization.component.html",
  styleUrl: "./ant-colony-optimization.component.scss",
  standalone: false
})
export class AntColonyOptimizationComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  defaultParam = {
    ants: 100,
    evaporationRate: 0.5,
    alpha: 1, // pheromone weight
    beta: 2,   // heuristic weight
    iteration: 100
  };

  confForm = new Form([
    FormFields.number("ants", "Ants", new FormControl(
      this.defaultParam.ants, [Validators.required, Validators.min(1), Validators.max(10000)]
    )),
    FormFields.number("evaporationRate", "Evaporation Rate", new FormControl(
      this.defaultParam.evaporationRate, [Validators.required, Validators.min(0), Validators.max(1)]
    )),
    FormFields.number("alpha", "Alpha", new FormControl(
      this.defaultParam.alpha, [Validators.required, Validators.min(0)]
    )),
    FormFields.number("beta", "Beta", new FormControl(
      this.defaultParam.beta, [Validators.required, Validators.min(0)]
    )),
    FormFields.number("iteration", "Iteration", new FormControl(
      this.defaultParam.iteration, [Validators.required, Validators.min(1)]
    ))
  ]);

  algo = model.required<TSPSolver | undefined>();

  ngOnInit(): void {
    this.sub.add(this.confForm.valueChanges().pipe(
      startWith(this.defaultParam),
      filter(() => this.confForm.group().valid)
    ).subscribe({
      next: (conf) => {
        this.algo.set(new AntColonyOptimization(conf as ACOParameters));
      }
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
