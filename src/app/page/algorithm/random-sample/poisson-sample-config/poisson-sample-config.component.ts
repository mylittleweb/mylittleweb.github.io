import {Component, model} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Subscription, startWith, filter, tap} from "rxjs";
import {RandomSampleAlgorithms} from "../../../../lib/algo/random-sample/random-sample";

@Component({
  selector: "app-poisson-sample-config",
  standalone: false,
  templateUrl: "./poisson-sample-config.component.html",
  styleUrl: "./poisson-sample-config.component.scss"
})
export class PoissonSampleConfigComponent {
  subscription = new Subscription();

  defaultLambda = 5;

  lambda = new FormControl(
    this.defaultLambda,
    [Validators.required, Validators.min(0)]
  );

  configuredAlgorithm = model<(() => number) | undefined>(undefined);

  ngOnInit() {
    this.subscription.add(this.lambda.valueChanges.pipe(
      startWith(this.defaultLambda),
      filter(x => {
        return x !== null && this.lambda.valid;
      }),
      tap((lambda) => {
        if (lambda !== null) {
          this.configuredAlgorithm.set(RandomSampleAlgorithms["Poisson"](lambda));
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
