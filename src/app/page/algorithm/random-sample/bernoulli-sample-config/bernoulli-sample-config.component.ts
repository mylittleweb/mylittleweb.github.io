import {Component, model, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {startWith, filter, tap, Subscription} from "rxjs";
import {RandomSampleAlgorithms} from "../../../../lib/algo/random-sample/random-sample";

@Component({
  selector: "app-bernoulli-sample-config",
  templateUrl: "./bernoulli-sample-config.component.html",
  styleUrl: "./bernoulli-sample-config.component.scss",
  standalone: false
})
export class BernoulliSampleConfigComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  defaultProbability = 0.5;

  probability = new FormControl(
    this.defaultProbability,
    [Validators.required, Validators.min(0), Validators.max(1)]
  );

  configuredAlgorithm = model<(() => number) | undefined>(undefined);

  ngOnInit() {
    this.subscription.add(this.probability.valueChanges.pipe(
      startWith(this.defaultProbability),
      filter(x => {
        return x !== null && this.probability.valid;
      }),
      tap((v) => {
        if (v !== null) {
          this.configuredAlgorithm.set(RandomSampleAlgorithms["Bernoulli"](v));
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
