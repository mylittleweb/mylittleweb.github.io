import {Component, ElementRef, OnDestroy, OnInit, viewChild} from "@angular/core";
import {Form} from "../../../component/form/form";
import {FormFields} from "../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import _ from "lodash";
import {KMeanClustering} from "../../../lib/algo/k-mean-clustering";
import {BehaviorSubject, concatMap, delay, filter, from, of, Subscription, switchMap, tap} from "rxjs";
import {KMeanScatterChart} from "./k-mean-scatter-chart";

type FormData = {
  k: number;
  points: number;
  maxIter: number;
  tolerance: number;
};

@Component({
  selector: "app-k-mean-cluster",
  templateUrl: "./k-mean-cluster.component.html",
  styleUrl: "./k-mean-cluster.component.scss",
  standalone: false
})
export class KMeanClusterComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  view = viewChild.required<ElementRef>("chart");
  // _chart: Chart;

  form = new Form([
    FormFields.number("k", "K", new FormControl(10, [Validators.required, Validators.min(1), Validators.max(10)])),
    FormFields.number("maxIter", "Max Iteration", new FormControl(100, [Validators.required, Validators.min(1)])),
    FormFields.number("tolerance", "Tolerance", new FormControl(0.01, [Validators.required, Validators.min(0.01)]))
  ]);

  dataForm = new Form([
    FormFields.number("points", "Points", new FormControl(200, [Validators.required, Validators.min(1)]))
  ]);
  data: {x: number; y: number}[] = [];

  formSubmission = new BehaviorSubject<FormData | undefined>(undefined);

  chart: KMeanScatterChart;

  ngOnInit() {
    this.chart = new KMeanScatterChart(this.view());
    this.obFormSubmission();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateData() {
    this.data = this.generateRandomPoints(this.dataForm.control("points")?.value);
    this.chart.setSource(this.data);
  }

  run() {
    if (this.form.group().invalid) {
      return;
    }
    this.formSubmission.next(this.form.group().value as FormData);
  }

  private obFormSubmission() {
    return this.formSubmission.pipe(
      filter(d => d !== undefined),
      switchMap(form => {
        this.chart.setSource(this.data);

        return of(new KMeanClustering(form.k, form.maxIter, form.tolerance, this.data)).pipe(
          concatMap((algo) => {
            return from(algo.run());
          }),
          concatMap(step => {
            return of(step).pipe(
              delay(500),
              tap(step => {
                this.chart.renderStep(step);
              })
            );
          })
        );
      })
    ).subscribe();
  }

  generateRandomPoints(n: number) {
    const points = [];
    for (let i = 0; i < n; i++) {
      points.push({
        x: _.random(0, 100),
        y: _.random(0, 100)
      });
    }
    return points;
  }
}
