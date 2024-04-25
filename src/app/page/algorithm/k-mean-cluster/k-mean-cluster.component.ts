import {Component, ElementRef, OnDestroy, OnInit, viewChild} from "@angular/core";
import {Form} from "../../../component/form/form";
import {FormFields} from "../../../component/form/form-field";
import {FormControl, Validators} from "@angular/forms";
import {Chart, LegendItem} from "chart.js/auto";
import _ from "lodash";
import {colors} from "../../../lib/color";
import {KMeanClustering, Step} from "../../../lib/algo/k-mean-clustering";
import {BehaviorSubject, concatMap, delay, filter, from, of, Subscription, switchMap, tap} from "rxjs";

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
  _chart: Chart;

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

  ngOnInit() {
    this.initChart();
    this.obFormSubmission();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateData() {
    this.data = this.generateRandomPoints(this.dataForm.control("points")?.value);
    this.setSource(this.data);
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
        this.setSource(this.data);

        return of(new KMeanClustering(form.k, form.maxIter, form.tolerance, this.data)).pipe(
          concatMap((algo) => {
            return from(algo.run());
          }),
          concatMap(step => {
            return of(step).pipe(
              delay(500),
              tap(step => {
                this.renderStep(step);
              })
            );
          })
        );
      })
    ).subscribe();
  }

  private renderStep(step: Step) {
    const datasets = [];
    for (let i = 0; i < step.centroids.length; i++) {
      datasets.push({
        label: `centroid ${i}`,
        data: [step.centroids[i]],
        backgroundColor: colors[i + 1],
        borderColor: colors[0],
        borderWidth: 3,
        pointRadius: 5
      });

      datasets.push({
        label: `cluster ${i}`,
        data: step.clusters[i],
        borderColor: colors[i + 1],
        backgroundColor: colors[i + 1]
      });
    }
    this._chart.data.datasets = datasets;
    this._chart.update();
  }

  private setSource(data: any) {
    this._chart.data = {
      datasets: [{
        label: "source",
        data: data,
        backgroundColor: colors[0]
      }]
    };
    this._chart.update();
  }

  initChart() {
    this._chart = new Chart(
      this.view().nativeElement,
      {
        type: "scatter",
        data: {
          datasets: [{
            label: "source", data: [], backgroundColor: colors[0]
          }]
        },
        options: {
          animation: false,
          plugins: {
            legend: {
              labels: {
                filter: (item: LegendItem): boolean => {
                  return !item.text.includes("centroid");
                }
              }
            }
          }
        }
      }
    );
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
