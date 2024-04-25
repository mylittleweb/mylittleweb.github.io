import {Component, model, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Subscription, startWith, filter, tap} from "rxjs";
import {RandomSampleAlgorithms} from "../../../../lib/algo/random-sample/random-sample";

@Component({
  selector: "app-exponential-sample-config",
  standalone: false,
  templateUrl: "./exponential-sample-config.component.html",
  styleUrl: "./exponential-sample-config.component.scss"
})
export class ExponentialSampleConfigComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  defaultLambda = 0.1;

  lambda = new FormControl(
    this.defaultLambda,
    [Validators.required, Validators.min(0)]
  );

  configuredAlgorithm = model<(() => number) | undefined>(undefined);

  ngOnInit() {
    this.subscription.add(this.lambda.valueChanges.pipe(
      startWith(this.defaultLambda),
      filter(lambda => {
        return lambda !== null && this.lambda.valid;
      }),
      tap((lambda) => {
        if (lambda !== null) {
          this.configuredAlgorithm.set(RandomSampleAlgorithms["Exponential"](lambda));
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
