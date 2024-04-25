import {Component, OnInit, OnDestroy, model} from "@angular/core";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Subscription, startWith, filter, tap} from "rxjs";
import {RandomSampleAlgorithms} from "../../../../lib/algo/random-sample/random-sample";

interface NormalConfig {
  average: number;
  stdDeviation: number;
}

@Component({
  selector: "app-normal-sample-config",
  standalone: false,
  templateUrl: "./normal-sample-config.component.html",
  styleUrl: "./normal-sample-config.component.scss"
})
export class NormalSampleConfigComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  configForm: FormGroup;

  config: NormalConfig = {
    average: 50,
    stdDeviation: 20
  };

  configuredAlgorithm = model<(() => number) | undefined>(undefined);

  constructor(private readonly formBuilder: FormBuilder) {
    this.configForm = formBuilder.group({
      average: [
        this.config.average,
        [Validators.required, Validators.min(1)]
      ],
      stdDeviation: [
        this.config.stdDeviation,
        [Validators.required, Validators.min(0)]
      ]
    });
  }

  ngOnInit() {
    this.subscription.add(this.configForm.valueChanges.pipe(
      startWith(this.config),
      filter((x: NormalConfig ) => {
        return x !== null && this.configForm.valid;
      }),
      tap((v) => {
        if (v !== null) {
          this.configuredAlgorithm.set(RandomSampleAlgorithms["Normal"](v.average, v.stdDeviation));
        }
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
