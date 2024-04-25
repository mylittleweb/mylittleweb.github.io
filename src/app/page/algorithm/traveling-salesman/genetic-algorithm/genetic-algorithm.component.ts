import {Component, model, OnDestroy, OnInit} from "@angular/core";
import {Form} from "../../../../component/form/form";
import {FormFields} from "../../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import {filter, startWith, Subscription} from "rxjs";
import {TSPSolver} from "../../../../lib/algo/tsp/tsp";
import {GAParameters, GeneticAlgorithm} from "../../../../lib/algo/tsp/genetic-algorithm";

@Component({
  selector: "app-genetic-algorithm",
  standalone: false,
  templateUrl: "./genetic-algorithm.component.html",
  styleUrl: "./genetic-algorithm.component.scss"
})
export class GeneticAlgorithmComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  defaultParam: GAParameters = {
    population: 300,
    mutationRate: 0.1,
    crossOverRate: 0.8,
    generations: 2000
  };

  confForm = new Form([
    FormFields.number("population", "Population", new FormControl(
      this.defaultParam.population, [Validators.required, Validators.min(1), Validators.max(10000)]
    )),
    FormFields.number("mutationRate", "Mutation Rate", new FormControl(
      this.defaultParam.mutationRate, [Validators.required, Validators.min(0), Validators.max(1)]
    )),
    FormFields.number("crossOverRate", "Crossover Rate", new FormControl(
      this.defaultParam.crossOverRate, [Validators.required, Validators.min(0), Validators.max(1)]
    )),
    FormFields.number("generations", "Generations", new FormControl(
      this.defaultParam.generations, [Validators.required, Validators.min(1)]
    ))
  ]);

  algo = model.required<TSPSolver | undefined>();

  ngOnInit(): void {
    this.sub.add(this.confForm.valueChanges().pipe(
      startWith(this.defaultParam),
      filter(() => this.confForm.group().valid)
    ).subscribe({
      next: (conf) => {
        this.algo.set(new GeneticAlgorithm(conf as GAParameters));
      }
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
