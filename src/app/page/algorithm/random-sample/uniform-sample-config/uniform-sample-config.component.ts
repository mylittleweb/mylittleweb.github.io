import {Component, model, OnInit, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Subscription, tap, filter, startWith} from "rxjs";
import {RandomSampleAlgorithms} from "../../../../lib/algo/random-sample/random-sample";

@Component({
  selector: "app-uniform-sample-config",
  templateUrl: "./uniform-sample-config.component.html",
  styleUrl: "./uniform-sample-config.component.scss",
  standalone: false
})
export class UniformSampleConfigComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  defaultBuckets = 10;

  buckets = new FormControl(
    this.defaultBuckets,
    [Validators.min(1)]
  );

  configuredAlgorithm = model<(() => number) | undefined>(undefined);

  ngOnInit() {
    this.subscription.add(this.buckets.valueChanges.pipe(
      startWith(this.defaultBuckets),
      filter(x => {
        return x !== null && this.buckets.valid;
      }),
      tap((v) => {
        if (v !== null) {
          this.configuredAlgorithm.set(RandomSampleAlgorithms["Uniform"](v));
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
