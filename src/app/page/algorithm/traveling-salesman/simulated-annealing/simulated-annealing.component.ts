import {Component, model, OnDestroy, OnInit} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Form} from "../../../../component/form/form";
import {FormFields} from "../../../../component/form/form-field";
import {TSPSolver} from "../../../../lib/algo/tsp/tsp";
import {filter, startWith, Subscription} from "rxjs";
import {SAParameters, SimulatedAnnealing} from "../../../../lib/algo/tsp/simulated-annealing";

@Component({
  selector: "app-simulated-annealing",
  templateUrl: "./simulated-annealing.component.html",
  styleUrl: "./simulated-annealing.component.scss",
  standalone: false
})
export class SimulatedAnnealingComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  defaultParam: SAParameters = {
    initialTemp: 1000,
    coolingRate: 0.995,
    minTemp: 0.001
  };

  saForm = new Form([
    FormFields.number("initialTemp", "Initial Temp", new FormControl(this.defaultParam.initialTemp, [Validators.required, Validators.min(1), Validators.max(10000)])),
    FormFields.number("coolingRate", "Cooling Rate", new FormControl(this.defaultParam.coolingRate, [Validators.required, Validators.min(0.0000001), Validators.max(0.99999)])),
    FormFields.number("minTemp", "Minimum Temp", new FormControl(this.defaultParam.minTemp, [Validators.required, Validators.min(0.000001)]))
  ]);

  algo = model.required<TSPSolver | undefined>();

  ngOnInit(): void {
    this.sub.add(this.saForm.valueChanges().pipe(
      startWith(this.defaultParam),
      filter(() => this.saForm.group().valid)
    ).subscribe({
      next: (conf) => {
        this.algo.set(new SimulatedAnnealing(conf as SAParameters));
      }
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
